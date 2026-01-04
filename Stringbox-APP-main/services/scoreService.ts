import { supabase } from './supabase';
import { Alert } from 'react-native';

/**
 * Database types for user_progress table
 */
interface ChapterScores {
    [key: string]: {
        [key: string]: number;
    };
}

/**
 * Calculate average score for a specific chapter
 */
export function calculateChapterAverage(chapterScores: ChapterScores, chapterNum: number): number {
    const babKey = `bab${chapterNum}`;
    const soalScores = chapterScores[babKey] || {};

    const scores: number[] = [];
    for (let i = 1; i <= 5; i++) {
        scores.push(soalScores[`soal${i}`] || 0);
    }

    const average = scores.reduce((sum, score) => sum + score, 0) / 5;
    return Math.round(average);
}

/**
 * Calculate total score across all chapters
 */
export function calculateTotalScore(chapterScores: ChapterScores): number {
    let total = 0;
    for (let bab = 1; bab <= 5; bab++) {
        total += calculateChapterAverage(chapterScores, bab);
    }
    return total;
}

/**
 * Save a chapter score to Supabase
 * Only updates if the new score is higher than the existing score
 */
export async function saveChapterScore(
    chapterNum: number,
    problemNum: number,
    score: number
): Promise<void> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.log('⚠️ No user logged in, skipping score save');
            return;
        }

        // Fetch existing progress
        let { data: progress, error: fetchError } = await supabase
            .from('user_progress')
            .select('chapter_scores')
            .eq('user_id', user.id)
            .maybeSingle();

        // If user_progress doesn't exist, create it
        if (!progress) {
            console.log('🆕 Creating new user_progress record...');
            const { error: insertError } = await supabase
                .from('user_progress')
                .insert([{
                    user_id: user.id,
                    completed_modules: [],
                    chapter_scores: {},
                    drag_drop_stats: { attempts: 0, correct: 0 }
                }]);

            if (insertError) {
                console.error('❌ Failed to create user_progress:', insertError);
                throw insertError;
            }

            progress = { chapter_scores: {} };
        }

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
        }

        let chapterScores: ChapterScores = progress?.chapter_scores || {};

        const babKey = `bab${chapterNum}`;
        const soalKey = `soal${problemNum}`;

        // Initialize chapter object if it doesn't exist
        if (!chapterScores[babKey] || typeof chapterScores[babKey] !== 'object') {
            chapterScores[babKey] = {};
        }

        const currentScore = chapterScores[babKey][soalKey] || 0;

        // Only update if new score is higher
        if (score > currentScore) {
            chapterScores[babKey][soalKey] = score;

            const { error: updateError } = await supabase
                .from('user_progress')
                .update({
                    chapter_scores: chapterScores,
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0], // Sync name
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id);

            if (updateError) throw updateError;

            console.log(`✅ Score saved: Bab ${chapterNum} Soal ${problemNum} = ${score}`);
        } else {
            console.log(`ℹ️ Score not updated (${score} ≤ ${currentScore})`);
        }
    } catch (error) {
        console.error('❌ Error saving score:', error);
    }
}

/**
 * Toggle chapter completion status (mark as complete / incomplete)
 */
export async function toggleChapterCompletion(chapterNum: number): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.log('⚠️ No user logged in, skipping chapter completion toggle');
            return false;
        }

        const { data: progress, error: fetchError } = await supabase
            .from('user_progress')
            .select('completed_modules')
            .eq('user_id', user.id)
            .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

        // Create if doesn't exist
        if (!progress) {
            await supabase
                .from('user_progress')
                .insert([{
                    user_id: user.id,
                    completed_modules: [chapterNum],
                    chapter_scores: {},
                    drag_drop_stats: { attempts: 0, correct: 0 },
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0]
                }]);
            return true;
        }

        let completedModules: number[] = progress?.completed_modules || [];
        let isCompleted = false;

        if (completedModules.includes(chapterNum)) {
            // Remove (Unmark)
            completedModules = completedModules.filter(id => id !== chapterNum);
            console.log(`ℹ️ Chapter ${chapterNum} unmarked as incomplete`);
        } else {
            // Add (Mark)
            completedModules.push(chapterNum);
            isCompleted = true;
            console.log(`✅ Chapter ${chapterNum} marked as complete! 🎉`);
        }

        await supabase
            .from('user_progress')
            .update({
                completed_modules: completedModules,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0], // Sync name
                updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);

        return isCompleted;
    } catch (error) {
        console.error('❌ Error toggling chapter completion:', error);
        return false;
    }
}

export interface LeaderboardEntry {
    id: string;
    name: string;
    totalScore: number;
    completedModules: number;
    rank: number;
}

/**
 * Get Leaderboard Data
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
        // 1. Ambil data Progress (Skor)
        const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('*');

        if (progressError) throw progressError;
        if (!progressData) return [];

        // 2. Ambil data Profiles (Nama) - Seperti versi Web
        const { data: profilesData, error: profilesError } = await supabase
            .from('user_profiles')
            .select('*');

        if (profilesError) console.log('Warning: Could not fetch profiles', profilesError);

        // 3. Gabungkan (Join) data secara manual
        const leaderboard = progressData.map((entry: any) => {
            const profile = profilesData?.find((p: any) => p.user_id === entry.user_id);
            const name = profile?.display_name || entry.full_name || `User ${entry.user_id.substring(0, 4)}`;

            const totalScore = calculateTotalScore(entry.chapter_scores || {});
            const completedModules = entry.completed_modules?.length || 0;

            return {
                id: entry.user_id,
                name, // Nama yang sudah diperbaiki
                totalScore,
                completedModules,
                rank: 0, 
            };
        });

        // 4. Urutkan berdasarkan Skor Tertinggi
        leaderboard.sort((a: any, b: any) => b.totalScore - a.totalScore);

        // 5. Berikan Ranking
        return leaderboard.map((entry: any, index: number) => ({
            ...entry,
            rank: index + 1
        }));

    } catch (error) {
        console.error('❌ Error fetching leaderboard:', error);
        return [];
    }
}

/**
 * Get user progress data
 */
export async function getUserProgress() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        const { data: progress, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return progress;
    } catch (error) {
        console.error('❌ Error fetching user progress:', error);
        return null;
    }
}

/**
 * Sync user profile data (name) to user_progress
 */
export async function syncUserProfile(): Promise<void> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0];

        // Update name in user_progress
        const { error, data } = await supabase
            .from('user_progress')
            .update({
                full_name: fullName,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .select();

        if (error) {
            console.error('Error syncing profile:', error);
            // Show clear instruction to user
            Alert.alert(
                'Masalah Database',
                `Gagal menyimpan nama "${fullName}".\n\nError: ${error.message} (${error.code})\n\nSolusi: Pastikan kolom "full_name" (Text) sudah dibuat di tabel "user_progress" di Supabase.`
            );

            // If row doesn't exist, create it
            if (error.code === 'PGRST116' || error.details?.includes('0 rows')) {
                await supabase
                    .from('user_progress')
                    .insert([{
                        user_id: user.id,
                        completed_modules: [],
                        chapter_scores: {},
                        drag_drop_stats: { attempts: 0, correct: 0 },
                        full_name: fullName
                    }]);
            }
        } else {
            if (data && data.length === 0) {
                // Try insert if update affected 0 rows (though usually handled above)
                // But strictly speaking, update 0 rows is NOT an error in SQL, it just means no match.
                // However, we expect a match if the user has data. If not, we should insert.
                // Let's rely on the PGRST116 check via maybeSingle usually, but here we just used update.
                // To be safe, let's insert if 0 rows.
                const { error: insertError } = await supabase
                    .from('user_progress')
                    .insert([{
                        user_id: user.id,
                        completed_modules: [],
                        chapter_scores: {},
                        drag_drop_stats: { attempts: 0, correct: 0 },
                        full_name: fullName
                    }]);

                if (insertError) {
                    console.error('Insert failed after 0 update:', insertError);
                } else {
                    console.log('✅ Created new profile on sync');
                }
            } else {
                console.log('✅ User profile synced to leaderboard');
            }
        }
    } catch (error) {
        console.error('❌ Error syncing user profile:', error);
    }
}
