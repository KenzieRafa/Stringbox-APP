import { useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Ionicons } from '@expo/vector-icons';
import { getLeaderboard, LeaderboardEntry } from '@/services/scoreService';

// Stringbox Brand Colors (Consistent with Practice Page)
const Colors = {
    primaryDark: '#1e122b',
    secondaryDark: '#2f1e40',
    accentPurple: '#8b5cf6',
    badgePurple: '#7c3aed',
    textPrimary: '#ffffff',
    textSecondary: '#a89abf',
    borderColor: '#2d2438',
    background: '#130b1b',
    gold: '#fbbf24',
    silver: '#94a3b8',
    bronze: '#fb923c',
};

export default function LeaderboardScreen() {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchLeaderboard();
        }, [])
    );

    const fetchLeaderboard = async () => {
        setLoading(true);
        const data = await getLeaderboard();
        setLeaderboardData(data);
        setLoading(false);
    };

    const renderRankIcon = (rank: number) => {
        if (rank === 1) {
            return (
                <View style={styles.rankBadge}>
                    <Ionicons name="trophy" size={24} color={Colors.gold} />
                </View>
            );
        }
        if (rank === 2) {
            return (
                <View style={styles.rankBadge}>
                    <Ionicons name="trophy" size={24} color={Colors.silver} />
                </View>
            );
        }
        if (rank === 3) {
            return (
                <View style={styles.rankBadge}>
                    <Ionicons name="trophy" size={24} color={Colors.bronze} />
                </View>
            );
        }
        
        return <ThemedText style={styles.rankText}>#{rank}</ThemedText>;
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return Colors.gold;
        if (rank === 2) return Colors.silver;
        if (rank === 3) return Colors.bronze;
        return Colors.textSecondary;
    };

    const renderItem = ({ item }: { item: LeaderboardEntry }) => {
        const isTop3 = item.rank <= 3;

        return (
            <ThemedView style={[
                styles.card,
                isTop3 && { borderColor: getRankColor(item.rank), borderWidth: 1 }
            ]}>
                <View style={styles.rankContainer}>
                    {renderRankIcon(item.rank)}
                </View>

                <View style={styles.userInfo}>
                    <ThemedText style={styles.userName}>{item.name}</ThemedText>
                    <ThemedText style={styles.userProgress}>
                        {item.completedModules} / 5 Modul Selesai
                    </ThemedText>
                </View>

                <View style={styles.scoreContainer}>
                    <ThemedText style={[styles.scoreText, isTop3 && { color: getRankColor(item.rank) }]}>
                        {item.totalScore}
                    </ThemedText>
                    <ThemedText style={styles.scoreLabel}>PTS</ThemedText>
                </View>
            </ThemedView>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={Colors.accentPurple} />
                    <ThemedText style={{ color: Colors.textSecondary, marginTop: 16 }}>Loading Leaderboard...</ThemedText>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <ThemedView style={styles.header}>
                    <ThemedText style={styles.headerTitle}>Leaderboard</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>Siswa Terbaik Stringbox</ThemedText>
                </ThemedView>

                {/* List */}
                <FlatList
                    data={leaderboardData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => (
                        <View style={styles.introContainer}>
                            <ThemedText style={styles.introText}>
                                Total skor dihitung dari penyelesaian modul Latihan dan kuis.
                            </ThemedText>
                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <ThemedText style={{ color: Colors.textSecondary }}>Belum ada data peringkat.</ThemedText>
                        </View>
                    )}
                />
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
    header: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: 'transparent',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.accentPurple,
        marginBottom: 8,
        marginTop: 20
    },
    headerSubtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    introContainer: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: Colors.badgePurple,
        marginBottom: 24,
    },
    introText: {
        color: Colors.textSecondary,
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Space for footer
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondaryDark,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.borderColor,
    },
    rankContainer: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankBadge: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textSecondary,
    },
    userInfo: {
        flex: 1,
        paddingHorizontal: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    userProgress: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    scoreContainer: {
        alignItems: 'flex-end',
        minWidth: 80,
    },
    scoreText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.accentPurple,
    },
    scoreLabel: {
        fontSize: 10,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
});
