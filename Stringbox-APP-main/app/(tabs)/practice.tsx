import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, View, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { problemsData, Problem } from '@/constants/problems';
import { calculateScore } from '@/services/assessment';
import { simulatePythonExecution } from '@/services/codeExecution';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { saveChapterScore } from '@/services/scoreService';

// Stringbox Brand Colors (Dark Theme)
const PracticeColors = {
    primaryDark: '#1e122b',
    secondaryDark: '#2f1e40',
    accentPurple: '#8b5cf6', // The lighter purple for text
    badgePurple: '#7c3aed',  // The badge color
    textPrimary: '#ffffff',
    textSecondary: '#a89abf',
    textMuted: '#6b5a80', // Added for static notes
    borderColor: '#2d2438',
    background: '#130b1b', // Very dark background
    success: '#34C759',
    warning: '#FFD700',
    error: '#FF3B30',
};

export default function PracticeScreen() {

    // Navigation State
    const [currentView, setCurrentView] = useState<'chapter-selection' | 'workspace'>('chapter-selection');
    const [selectedChapter, setSelectedChapter] = useState<number>(1);
    const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);

    // Workspace State
    const [code, setCode] = useState<string>('');
    const [output, setOutput] = useState<string>('Tekan tombol "Jalankan Kode" untuk melihat hasil...');
    const [score, setScore] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const chapterTitles: { [key: number]: string } = {
        1: "Fondasi Pemrograman",
        2: "Kontrol Alur Program",
        3: "Kumpulan Data",
        4: "Struktur Data Lanjutan",
        5: "Fungsi"
    };

    const chapterDescriptions: { [key: number]: string } = {
        1: "Input, tipe data, operasi dasar",
        2: "Percabangan dan perulangan",
        3: "String dan list manipulation",
        4: "List 2D dan nested loops",
        5: "Kode modular dan reusable"
    };

    const handleChapterSelect = (chapter: number) => {
        setSelectedChapter(chapter);
        setCurrentProblemIndex(0);
        loadProblem(chapter, 0);
        setCurrentView('workspace');
    };

    const loadProblem = (chapter: number, index: number) => {
        const problem = problemsData[chapter][index];
        if (problem) {
            setCode(''); // Start with empty code, placeholder is shown as static text
            setOutput('Tekan tombol "Jalankan Kode" untuk melihat hasil...');
            setScore(0);
        }
    };

    const handleProblemChange = (index: number) => {
        setCurrentProblemIndex(index);
        loadProblem(selectedChapter, index);
    };

    const handleRunCode = async () => {
        // Allow empty user code because the placeholder might contain runnable code itself (though rarely)
        // But usually user needs to add something. We'll check combined length?
        // Let's just run it. The simulation will handle it.

        setIsRunning(true);
        setOutput('Sedang menjalankan...');

        // Simulate network delay
        setTimeout(async () => {
            const currentProblem = problemsData[selectedChapter][currentProblemIndex];
            const fullCode = currentProblem.placeholder + '\n' + code; // Concatenate static notes + user code
            const problemId = `${selectedChapter}-${currentProblemIndex + 1}`;

            const result = simulatePythonExecution(fullCode, problemId);
            const calculatedScore = calculateScore(fullCode, problemId);

            setOutput(result.output);
            setScore(calculatedScore);
            setIsRunning(false);

            // Save score to Supabase
            if (calculatedScore > 0) {
                await saveChapterScore(selectedChapter, currentProblemIndex + 1, calculatedScore);
                console.log(`📊 Score saved: Chapter ${selectedChapter}, Problem ${currentProblemIndex + 1}, Score ${calculatedScore}`);
            }
        }, 1000);
    };

    const handleReset = () => {
        setCode('');
        setOutput('Tekan tombol "Jalankan Kode" untuk melihat hasil...');
        setScore(0);
    };

    const handleBack = () => {
        setCurrentView('chapter-selection');
    };

    const renderChapterSelection = () => (
        <ScrollView style={styles.scrollContainer}>
            <ThemedView style={styles.headerContainer}>
                <ThemedText style={styles.headerTitle}>Latihan Praktik</ThemedText>
                <ThemedText style={styles.headerSubtitle}>Pilih Bab Untuk Berlatih</ThemedText>
                <ThemedText style={styles.headerDescription}>
                    Setiap bab memiliki 5 soal latihan yang dapat Anda kerjakan dengan editor kode interaktif
                </ThemedText>
                <View style={styles.divider} />
            </ThemedView>

            <View style={styles.chapterList}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={styles.chapterItem}
                        onPress={() => handleChapterSelect(num)}
                    >
                        <ThemedText style={styles.chapterNumber}>0{num}</ThemedText>

                        <ThemedText style={styles.chapterTitle}>{chapterTitles[num]}</ThemedText>
                        <ThemedText style={styles.chapterDesc}>{chapterDescriptions[num]}</ThemedText>

                        <View style={styles.badgeContainer}>
                            <ThemedText style={styles.badgeText}>5 SOAL TERSEDIA</ThemedText>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{ height: 40 }} />
        </ScrollView>
    );

    const renderWorkspace = () => {
        const currentProblem = problemsData[selectedChapter][currentProblemIndex];

        return (
            <KeyboardAvoidingView
                style={[styles.workspaceContainer, { backgroundColor: PracticeColors.background }]}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ThemedView style={[styles.workspaceHeader, { backgroundColor: PracticeColors.primaryDark }]}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <IconSymbol name="chevron.left" size={20} color="#fff" />
                        <ThemedText style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Kembali</ThemedText>
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <ThemedText type="subtitle" style={styles.navHeaderTitle}>
                            Bab {selectedChapter}
                        </ThemedText>
                    </View>
                    <View style={{ width: 90 }} /> {/* Spacer to balance Back button for centering */}
                </ThemedView>

                <ScrollView style={styles.workspaceContent}>
                    {/* Problem Navigation */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.problemNav}>
                        {[0, 1, 2, 3, 4].map((idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.problemTab,
                                    currentProblemIndex === idx
                                        ? { borderColor: PracticeColors.accentPurple, backgroundColor: 'rgba(139, 92, 246, 0.1)' }
                                        : { borderColor: PracticeColors.borderColor }
                                ]}
                                onPress={() => handleProblemChange(idx)}
                            >
                                <ThemedText style={[
                                    styles.problemTabText,
                                    currentProblemIndex === idx ? { color: PracticeColors.accentPurple } : { color: PracticeColors.textSecondary }
                                ]}>
                                    Soal {selectedChapter}.{idx + 1}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Problem Description */}
                    <ThemedView style={[styles.problemCard, { backgroundColor: 'transparent', borderBottomWidth: 2, borderBottomColor: PracticeColors.borderColor }]}>
                        <ThemedText type="subtitle" style={{ color: PracticeColors.accentPurple, marginBottom: 8 }}>{currentProblem.title}</ThemedText>
                        <ThemedText style={{ color: PracticeColors.textSecondary, lineHeight: 24 }}>{currentProblem.description}</ThemedText>
                    </ThemedView>

                    {/* Code Editor */}
                    <ThemedView style={[styles.editorSection, { backgroundColor: 'transparent' }]}>
                        <ThemedView style={[styles.sectionHeader, { backgroundColor: PracticeColors.primaryDark, padding: 12, borderBottomWidth: 1, borderBottomColor: PracticeColors.borderColor }]}>
                            <ThemedText type="defaultSemiBold" style={{ color: PracticeColors.textPrimary }}>Python Editor</ThemedText>
                            <ThemedText style={styles.editorLang}>Python 3.x</ThemedText>
                        </ThemedView>

                        <View style={[styles.codeEditorContainer, { backgroundColor: PracticeColors.primaryDark, borderColor: PracticeColors.borderColor }]}>
                            {/* Static Notes (Non-editable background) */}
                            <ThemedText style={[styles.staticCode, { color: PracticeColors.textMuted }]}>
                                {currentProblem.placeholder}
                            </ThemedText>

                            {/* User Input Area */}
                            <TextInput
                                style={[styles.codeEditor, { color: PracticeColors.textPrimary }]}
                                multiline
                                value={code}
                                onChangeText={setCode}
                                autoCapitalize="none"
                                autoCorrect={false}
                                textAlignVertical="top"
                                placeholder="Tulis solusi Anda di sini..."
                                placeholderTextColor={PracticeColors.textSecondary}
                            />
                        </View>
                    </ThemedView>

                    {/* Controls */}
                    <ThemedView style={[styles.controlBar, { backgroundColor: PracticeColors.secondaryDark }]}>
                        <TouchableOpacity
                            onPress={handleRunCode}
                            disabled={isRunning}
                            style={{ opacity: isRunning ? 0.7 : 1 }}
                        >
                            <LinearGradient
                                colors={[PracticeColors.accentPurple, PracticeColors.badgePurple]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.runButton}
                            >
                                {isRunning ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <>
                                        <IconSymbol name="play.fill" size={16} color="#fff" />
                                        <ThemedText style={styles.runButtonText}>Jalankan Kode</ThemedText>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.resetButton, { borderColor: PracticeColors.borderColor }]} onPress={handleReset}>
                            <ThemedText style={{ color: PracticeColors.textPrimary }}>Reset</ThemedText>
                        </TouchableOpacity>

                        <LinearGradient
                            colors={[PracticeColors.accentPurple, PracticeColors.badgePurple]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.scoreBadge}
                        >
                            <ThemedText style={styles.scoreText}>Skor: {score}/100</ThemedText>
                        </LinearGradient>
                    </ThemedView>

                    {/* Output */}
                    <ThemedView style={[styles.outputSection, { backgroundColor: PracticeColors.primaryDark }]}>
                        <ThemedView style={[styles.sectionHeader, { padding: 12, borderBottomWidth: 1, borderBottomColor: PracticeColors.borderColor }]}>
                            <ThemedText type="defaultSemiBold" style={{ color: PracticeColors.textPrimary }}>Output Console</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.outputBox}>
                            <ThemedText style={styles.outputText}>{output}</ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={{ height: 100, backgroundColor: 'transparent' }} />
                </ScrollView>
            </KeyboardAvoidingView>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: PracticeColors.background }}>
            <View style={{ flex: 1, backgroundColor: PracticeColors.background }}>
                {currentView === 'chapter-selection' ? renderChapterSelection() : renderWorkspace()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 80, // Increased from 40
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: PracticeColors.accentPurple,
        marginBottom: 20,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: PracticeColors.textPrimary,
        marginBottom: 16,
        textAlign: 'center',
    },
    headerDescription: {
        fontSize: 14,
        color: PracticeColors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
        marginBottom: 24,
    },
    divider: {
        height: 1,
        backgroundColor: PracticeColors.borderColor,
        width: '100%',
        marginTop: 10,
        opacity: 0.5,
    },
    chapterList: {
        marginTop: 20,
    },
    chapterItem: {
        marginBottom: 32,
        // No background color, transparent
        paddingBottom: 32,
        // Border separate from implementation to match look
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    chapterNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: PracticeColors.accentPurple,
        marginBottom: 8,
    },
    chapterTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: PracticeColors.textPrimary,
        marginBottom: 8,
    },
    chapterDesc: {
        fontSize: 14,
        color: PracticeColors.textSecondary,
        marginBottom: 16,
    },
    badgeContainer: {
        backgroundColor: PracticeColors.badgePurple,
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 0.5,
    },
    // Workspace Styles
    workspaceContainer: {
        flex: 1,
    },
    workspaceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        marginTop: 30, // Added margin to push down
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: PracticeColors.borderColor,
        justifyContent: 'space-between',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: PracticeColors.badgePurple, // Purple background
        borderRadius: 20, // Pill shape
        minWidth: 90,
        justifyContent: 'center',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navHeaderTitle: {
        textAlign: 'center',
        color: PracticeColors.accentPurple,
        fontSize: 18,
    },
    workspaceContent: {
        flex: 1,
        padding: 16,
    },
    problemNav: {
        marginBottom: 24,
    },
    problemTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    problemTabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    problemCard: {
        marginBottom: 24,
        paddingBottom: 24,
    },
    editorSection: {
        marginBottom: 24,
        borderWidth: 1,
        borderColor: PracticeColors.borderColor,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editorLang: {
        fontSize: 12,
        color: PracticeColors.textSecondary,
    },
    codeEditorContainer: {
        minHeight: 250,
        padding: 16,
        borderWidth: 1,
    },
    staticCode: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 22,
        opacity: 0.8,
    },
    codeEditor: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 14,
        minHeight: 100, // Reduced minHeight since it stacks
        padding: 0, // Remove padding to align with container
        textAlignVertical: 'top',
    },
    controlBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: PracticeColors.borderColor,
        borderBottomWidth: 1,
        borderBottomColor: PracticeColors.borderColor,
        flexWrap: 'wrap',
    },
    runButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 4,
        gap: 8,
    },
    runButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    resetButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: PracticeColors.primaryDark,
    },
    scoreBadge: {
        marginLeft: 'auto',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        minWidth: 100,
        alignItems: 'center',
    },
    scoreText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    outputSection: {
        marginBottom: 40,
        borderWidth: 1,
        borderColor: PracticeColors.borderColor,
    },
    outputBox: {
        minHeight: 200,
        padding: 16,
    },
    outputText: {
        color: PracticeColors.textSecondary,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 13,
        lineHeight: 22,
    },
});
