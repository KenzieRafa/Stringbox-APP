import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProgress, calculateChapterAverage, calculateTotalScore, syncUserProfile } from '@/services/scoreService';

// Stringbox Brand Colors
const Colors = {
    primaryDark: '#1e122b',
    secondaryDark: '#2f1e40',
    accentPurple: '#8b5cf6',
    badgePurple: '#7c3aed',
    textPrimary: '#ffffff',
    textSecondary: '#a89abf',
    textMuted: '#6b7280',
    borderColor: '#2d2438',
    background: '#1a0b2e', // Matched with Visualization page
    success: '#22c55e',
    alert: '#ef4444',
};

interface ChapterScores {
    [key: string]: {
        [key: string]: number;
    };
}

interface DragDropStats {
    attempts: number;
    correct: number;
}

interface UserProgress {
    completed_modules: number[];
    chapter_scores: ChapterScores;
    drag_drop_stats: DragDropStats;
}

const CHAPTER_NAMES = [
    'Bab 1: Fondasi Pemrograman',
    'Bab 2: Kontrol Alur',
    'Bab 3: String & List',
    'Bab 4: Struktur Lanjutan',
    'Bab 5: Fungsi'
];

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState<UserProgress | null>(null);

    useFocusEffect(
        useCallback(() => {
            if (user) {
                loadUserData();
            }
        }, [user])
    );

    const loadUserData = async () => {
        setLoading(true);
        try {
            // Sync profile name to ensure leaderboard is up to date
            await syncUserProfile();

            const data = await getUserProgress();
            setProgress(data);
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            // Force navigation update if state change isn't enough
            router.replace('/');
        } catch (error) {
            console.error('Sign out error:', error);
            Alert.alert('Error', 'Gagal sign out. Silakan coba lagi.');
        }
    };

    // Calculate stats from progress data
    const completedModulesCount = progress?.completed_modules?.length || 0;
    const totalScore = progress?.chapter_scores ? calculateTotalScore(progress.chapter_scores) : 0;
    const dragDropStats = progress?.drag_drop_stats || { attempts: 0, correct: 0 };
    const accuracy = dragDropStats.attempts > 0
        ? Math.round((dragDropStats.correct / dragDropStats.attempts) * 100)
        : 0;

    // Generate chapter data
    const chapters = CHAPTER_NAMES.map((name, index) => {
        const chapterNum = index + 1;
        const babKey = `bab${chapterNum}`;
        const soalScores = progress?.chapter_scores?.[babKey] || {};

        const details = Array.from({ length: 5 }, (_, i) => ({
            id: `${chapterNum}.${i + 1}`,
            score: soalScores[`soal${i + 1}`] || 0
        }));

        const completedSoal = details.filter(d => d.score > 0).length;
        const avgScore = progress?.chapter_scores
            ? calculateChapterAverage(progress.chapter_scores, chapterNum)
            : 0;

        return {
            id: chapterNum,
            name,
            score: avgScore,
            completedSoal,
            totalSoal: 5,
            details
        };
    });

    // Loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={Colors.accentPurple} />
                    <ThemedText style={{ color: Colors.textSecondary, marginTop: 16 }}>
                        Loading profile...
                    </ThemedText>
                </View>
            </SafeAreaView>
        );
    }

    // Not logged in state
    if (!user) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                    <IconSymbol name="person.circle.fill" size={80} color={Colors.textMuted} />
                    <ThemedText style={{ color: Colors.textPrimary, fontSize: 20, fontWeight: 'bold', marginTop: 16 }}>
                        Silakan Sign In
                    </ThemedText>
                    <ThemedText style={{ color: Colors.textSecondary, textAlign: 'center', marginTop: 8 }}>
                        Login untuk melihat dan melacak progress pembelajaran Anda
                    </ThemedText>
                </View>
            </SafeAreaView>
        );
    }

    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    const userEmail = user.email || '';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Academic Progress Header */}
                    <ThemedView style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 24,
                        marginTop: 20,
                        justifyContent: 'center',
                        backgroundColor: 'transparent'
                    }}>
                        <IconSymbol name="graduationcap.fill" size={28} color={Colors.badgePurple} style={{ marginRight: 10 }} />
                        <ThemedText style={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            color: Colors.badgePurple
                        }}>Academic Progress</ThemedText>
                    </ThemedView>

                    {/* Header Profile */}
                    <ThemedView style={styles.profileHeader}>
                        <LinearGradient
                            colors={[Colors.badgePurple, '#C084FC']}
                            style={styles.avatar}
                        >
                            <ThemedText style={styles.avatarText}>{userInitial}</ThemedText>
                        </LinearGradient>
                        <View style={styles.profileInfo}>
                            <ThemedText style={styles.profileName}>{userName}</ThemedText>
                            <ThemedText style={styles.profileEmail}>{userEmail}</ThemedText>
                        </View>
                    </ThemedView>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        <ThemedView style={styles.statCard}>
                            <IconSymbol name="book.fill" size={24} color={Colors.accentPurple} />
                            <View style={styles.statContent}>
                                <ThemedText style={styles.statLabel}>Modul Selesai</ThemedText>
                                <ThemedText style={styles.statValue}>
                                    {completedModulesCount} / 5
                                </ThemedText>
                            </View>
                        </ThemedView>
                        <ThemedView style={styles.statCard}>
                            <IconSymbol name="trophy.fill" size={24} color={Colors.accentPurple} />
                            <View style={styles.statContent}>
                                <ThemedText style={styles.statLabel}>Total Skor</ThemedText>
                                <ThemedText style={styles.statValue}>
                                    {totalScore} / 500
                                </ThemedText>
                            </View>
                        </ThemedView>
                        <ThemedView style={[styles.statCard, { flexBasis: '100%' }]}>
                            <IconSymbol name="chart.xyaxis.line" size={24} color={Colors.accentPurple} />
                            <View style={styles.statContent}>
                                <ThemedText style={styles.statLabel}>Akurasi Drag & Drop</ThemedText>
                                <ThemedText style={styles.statValue}>{accuracy}%</ThemedText>
                            </View>
                        </ThemedView>
                    </View>



                    <View style={styles.chapterList}>
                        {chapters.map((chapter) => (
                            <ThemedView key={chapter.id} style={styles.chapterCard}>
                                <View style={styles.chapterHeader}>
                                    <View>
                                        <ThemedText style={styles.chapterName}>{chapter.name}</ThemedText>
                                        <ThemedText style={styles.chapterSubtext}>
                                            ({chapter.completedSoal}/{chapter.totalSoal} soal selesai)
                                        </ThemedText>
                                    </View>
                                    <View style={styles.scoreBadge}>
                                        <ThemedText style={styles.scoreBadgeText}>{chapter.score}</ThemedText>
                                    </View>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.problemList}>
                                    {chapter.details.map((soal) => (
                                        <View key={soal.id} style={styles.problemItem}>
                                            <View style={styles.problemLeft}>
                                                <ThemedText style={[
                                                    styles.statusIcon,
                                                    { color: soal.score === 100 ? Colors.success : Colors.textMuted }
                                                ]}>
                                                    {soal.score === 100 ? '✓' : '○'}
                                                </ThemedText>
                                                <ThemedText style={styles.problemName}>Soal {soal.id}</ThemedText>
                                            </View>
                                            <ThemedText style={[
                                                styles.problemScore,
                                                { color: soal.score === 100 ? Colors.success : Colors.textSecondary }
                                            ]}>
                                                {soal.score}
                                            </ThemedText>
                                        </View>
                                    ))}
                                </View>
                            </ThemedView>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
                    </TouchableOpacity>

                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: 20,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondaryDark,
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.borderColor,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondaryDark,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        gap: 12,
    },
    statContent: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.accentPurple,
    },
    sectionHeader: {
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    chapterList: {
        gap: 16,
        marginBottom: 24,
    },
    chapterCard: {
        backgroundColor: Colors.secondaryDark,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        overflow: 'hidden',
    },
    chapterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    chapterName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    chapterSubtext: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    scoreBadge: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    scoreBadgeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.accentPurple,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderColor,
    },
    problemList: {
        padding: 16,
        gap: 8,
    },
    problemItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    problemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusIcon: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    problemName: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    problemScore: {
        fontSize: 14,
        fontWeight: '600',
    },
    signOutButton: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.alert,
        alignItems: 'center',
        marginBottom: 20,
    },
    signOutText: {
        color: Colors.alert,
        fontWeight: '600',
        fontSize: 16,
    },
    bottomSpacer: {
        height: 60,
    },
});
