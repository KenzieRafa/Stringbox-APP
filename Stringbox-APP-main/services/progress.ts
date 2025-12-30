import { supabase } from './supabase';

export async function updateDragDropStats(isCorrect: boolean) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.log('No user logged in, skipping stats update');
            return;
        }

        const { data: progress, error: fetchError } = await supabase
            .from('user_progress')
            .select('drag_drop_stats')
            .eq('user_id', user.id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
            console.error('Error fetching progress:', fetchError);
            return;
        }

        let stats = progress?.drag_drop_stats || { attempts: 0, correct: 0 };

        // Initialize if it's null
        if (!stats) stats = { attempts: 0, correct: 0 };

        stats.attempts += 1;
        if (isCorrect) stats.correct += 1;

        // If row didn't exist, we might need to insert, but usually user_progress is created on signup.
        // If it doesn't exist, we should probably insert it.
        if (fetchError && fetchError.code === 'PGRST116') {
            await supabase
                .from('user_progress')
                .insert([{
                    user_id: user.id,
                    drag_drop_stats: stats
                }]);
        } else {
            await supabase
                .from('user_progress')
                .update({
                    drag_drop_stats: stats,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id);
        }

    } catch (error) {
        console.error('Error updating drag&drop stats:', error);
    }
}
