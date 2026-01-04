import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native'; // Vibration dihapus dari sini
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LinearGradient } from 'expo-linear-gradient';
import { updateDragDropStats } from '@/services/progress';
import { Ionicons } from '@expo/vector-icons';

// Aktifkan LayoutAnimation untuk Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CodeBlock {
    id: string;
    code: string;
}

interface Problem {
    title: string;
    blocks: CodeBlock[];
    correctOrder: string[];
    hint: string;
}

const PROBLEMS: Problem[] = [
    {
        title: 'Menyusun Fungsi Hitung Rata-rata',
        blocks: [
            { id: '1', code: 'def hitung_rata(nilai):' },
            { id: '2', code: '    total = sum(nilai)' },
            { id: '3', code: '    return total / len(nilai)' },
            { id: '4', code: 'nilai_siswa = [80, 90, 75, 85]' },
            { id: '5', code: 'print(f"Rata-rata: {hitung_rata(nilai_siswa)}")' },
        ],
        correctOrder: ['4', '1', '2', '3', '5'],
        hint: 'variabel → fungsi → panggil',
    },
    {
        title: 'Loop dengan Kondisi',
        blocks: [
            { id: '1', code: 'for i in range(5):' },
            { id: '2', code: '    if i % 2 == 0:' },
            { id: '3', code: '        print("Genap")' },
            { id: '4', code: '    print(f"Angka: {i}")' },
        ],
        correctOrder: ['1', '2', '3', '4'],
        hint: 'loop → if → aksi',
    },
];

// Komponen Blok Sederhana (Tanpa Getaran)
function ClickableBlock({ 
    block, 
    onPress, 
    type = 'source' 
}: { 
    block: CodeBlock; 
    onPress: () => void;
    type?: 'source' | 'target';
}) {
    return (
        <Pressable
            onPress={onPress} // Langsung panggil onPress tanpa Vibration
            style={({ pressed }) => [
                styles.blockContainer,
                type === 'target' ? styles.blockTarget : styles.blockSource,
                pressed && styles.blockPressed
            ]}
        >
            <ThemedView style={styles.blockContent}>
                <ThemedText style={styles.codeText}>{block.code}</ThemedText>
                
                {/* Indikator Visual */}
                <Ionicons 
                    name={type === 'source' ? "add-circle-outline" : "close-circle-outline"} 
                    size={20} 
                    color={type === 'source' ? "#9333EA" : "#EF4444"} 
                    style={styles.actionIcon}
                />
            </ThemedView>
        </Pressable>
    );
}

export default function DragDropScreen() {
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    // Init state
    const [availableBlocks, setAvailableBlocks] = useState<CodeBlock[]>([]);
    const [solutionBlocks, setSolutionBlocks] = useState<CodeBlock[]>([]);
    const [feedback, setFeedback] = useState({ show: false, correct: false, message: '' });

    // Load problem saat index berubah
    useEffect(() => {
        loadProblem(currentProblemIndex);
    }, [currentProblemIndex]);

    const loadProblem = (index: number) => {
        const problem = PROBLEMS[index];
        // Randomize urutan awal
        setAvailableBlocks([...problem.blocks].sort(() => Math.random() - 0.5));
        setSolutionBlocks([]);
        setFeedback({ show: false, correct: false, message: '' });
    };

    const currentProblem = PROBLEMS[currentProblemIndex];

    // Pindah dari Available -> Solution (Teleport ke bawah)
    const handleAddToSolution = (block: CodeBlock) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setAvailableBlocks(prev => prev.filter(b => b.id !== block.id));
        setSolutionBlocks(prev => [...prev, block]);
        setFeedback({ show: false, correct: false, message: '' });
    };

    // Pindah dari Solution -> Available (Kembali ke atas)
    const handleRemoveFromSolution = (block: CodeBlock) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSolutionBlocks(prev => prev.filter(b => b.id !== block.id));
        setAvailableBlocks(prev => [...prev, block]);
        setFeedback({ show: false, correct: false, message: '' });
    };

    const resetExercise = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        // Random soal baru atau reset soal yang sama
        const newIndex = Math.floor(Math.random() * PROBLEMS.length);
        setCurrentProblemIndex(newIndex);
        // Jika index sama, force reload manual karena useEffect dependensi index
        if (newIndex === currentProblemIndex) {
            loadProblem(newIndex);
        }
    };

    const checkSolution = async () => {
        if (solutionBlocks.length === 0) {
            setFeedback({
                show: true,
                correct: false,
                message: '❌ Belum ada kode! Tekan blok di atas untuk menyusun jawaban.',
            });
            return;
        }

        if (solutionBlocks.length !== currentProblem.correctOrder.length) {
            setFeedback({
                show: true,
                correct: false,
                message: `❌ Belum lengkap! Masih ada ${currentProblem.correctOrder.length - solutionBlocks.length} blok yang kurang.`,
            });
            return;
        }

        const userOrder = solutionBlocks.map(b => b.id);
        const isCorrect = JSON.stringify(userOrder) === JSON.stringify(currentProblem.correctOrder);

        if (isCorrect) {
            setFeedback({
                show: true,
                correct: true,
                message: '🎉 Sempurna! Urutan kode sudah benar! Progress tersimpan.',
            });
            await updateDragDropStats(true);
        } else {
            setFeedback({
                show: true,
                correct: false,
                message: `❌ Masih salah urutan. Hint: ${currentProblem.hint}`,
            });
            await updateDragDropStats(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <ThemedText type="title" style={styles.pageTitle}>
                    Susun Kode
                </ThemedText>

                <ThemedText type="subtitle" style={styles.problemTitle}>
                    {currentProblem.title}
                </ThemedText>

                <ThemedView style={styles.intro}>
                    <ThemedText style={styles.introText}>
                        Tekan blok kode untuk memindahkannya ke area jawaban. Susun dari atas ke bawah.
                    </ThemedText>
                </ThemedView>

                {/* 1. AREA SUMBER (AVAILABLE) */}
                <ThemedView style={styles.sectionContainer}>
                    <ThemedText style={styles.sectionTitle}>Pilihan Kode</ThemedText>
                    <ThemedView style={styles.poolContainer}>
                        {availableBlocks.length === 0 ? (
                            <ThemedText style={styles.emptyText}>Semua blok telah dipilih</ThemedText>
                        ) : (
                            availableBlocks.map((block) => (
                                <ClickableBlock
                                    key={block.id}
                                    block={block}
                                    type="source"
                                    onPress={() => handleAddToSolution(block)}
                                />
                            ))
                        )}
                    </ThemedView>
                </ThemedView>

                {/* PANAH VISUAL */}
                <ThemedView style={styles.arrowContainer}>
                    <Ionicons name="arrow-down-circle" size={32} color="#6B7280" />
                </ThemedView>

                {/* 2. AREA JAWABAN (SOLUTION) */}
                <ThemedView style={styles.sectionContainer}>
                    <ThemedText style={styles.sectionTitle}>Jawaban Anda</ThemedText>
                    <ThemedView style={[styles.solutionContainer, solutionBlocks.length > 0 && styles.solutionActive]}>
                        {solutionBlocks.length === 0 ? (
                            <ThemedView style={styles.emptyPlaceholder}>
                                <Ionicons name="code-slash-outline" size={48} color="#4B5563" />
                                <ThemedText style={styles.emptyText}>Tap blok di atas untuk mengisi ini</ThemedText>
                            </ThemedView>
                        ) : (
                            solutionBlocks.map((block, index) => (
                                <ThemedView key={block.id} style={styles.numberedBlockWrapper}>
                                    {/* Nomor Baris */}
                                    <ThemedText style={styles.lineNumber}>{index + 1}</ThemedText>
                                    <ClickableBlock
                                        block={block}
                                        type="target"
                                        onPress={() => handleRemoveFromSolution(block)}
                                    />
                                </ThemedView>
                            ))
                        )}
                    </ThemedView>
                </ThemedView>

                {/* CONTROLS */}
                <ThemedView style={styles.controls}>
                    <Pressable
                        onPress={checkSolution}
                        style={({ pressed }) => [styles.checkBtn, pressed && styles.btnPressed]}
                    >
                        <LinearGradient
                            colors={['#C084FC', '#9333EA']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientBtn}
                        >
                            <ThemedText style={styles.checkBtnText}>Periksa Jawaban</ThemedText>
                        </LinearGradient>
                    </Pressable>

                    <Pressable
                        onPress={resetExercise}
                        style={({ pressed }) => [styles.resetBtn, pressed && styles.btnPressed]}
                    >
                        <ThemedText style={styles.resetBtnText}>Reset</ThemedText>
                    </Pressable>
                </ThemedView>

                {/* FEEDBACK */}
                {feedback.show && (
                    <ThemedView style={[styles.feedback, feedback.correct ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
                        <ThemedText style={feedback.correct ? styles.feedbackTextCorrect : styles.feedbackTextIncorrect}>
                            {feedback.message}
                        </ThemedText>
                    </ThemedView>
                )}

                <ThemedView style={styles.bottomSpacer} />
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a0b2e',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    pageTitle: {
        textAlign: 'center',
        marginBottom: 8,
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    problemTitle: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#C084FC',
        fontSize: 16,
    },
    intro: {
        padding: 12,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderLeftWidth: 4,
        borderLeftColor: '#9333EA',
        marginBottom: 24,
        borderRadius: 8,
    },
    introText: {
        color: '#E5E7EB',
        fontSize: 14,
        lineHeight: 20,
    },
    sectionContainer: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 8,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    poolContainer: {
        backgroundColor: '#1e1b4b', // Darker bg for source
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#4B5563',
        minHeight: 100,
        gap: 10,
    },
    solutionContainer: {
        backgroundColor: '#111827', // Very dark for code editor look
        borderRadius: 12,
        padding: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#4B5563',
        minHeight: 150,
        gap: 10,
    },
    solutionActive: {
        borderStyle: 'solid',
        borderColor: '#9333EA',
        backgroundColor: 'rgba(147, 51, 234, 0.05)',
    },
    arrowContainer: {
        alignItems: 'center',
        marginVertical: 10,
        opacity: 0.5,
    },
    // BLOCK STYLES
    blockContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
    },
    blockSource: {
        backgroundColor: '#2D1B4E',
        borderColor: '#6B7280',
    },
    blockTarget: {
        backgroundColor: '#1F2937',
        borderColor: '#9333EA',
        flex: 1, // Agar mengambil sisa space di sebelah nomor baris
    },
    blockPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
    blockContent: {
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    codeText: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 13,
        color: '#FFFFFF',
        flexShrink: 1, 
        flexWrap: 'wrap',
    },
    actionIcon: {
        marginLeft: 10,
    },
    // LIST NUMBERING
    numberedBlockWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    lineNumber: {
        color: '#6B7280',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 12,
        width: 20,
        textAlign: 'right',
    },
    // EMPTY STATES
    emptyText: {
        color: '#6B7280',
        fontStyle: 'italic',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
    emptyPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    // CONTROLS & FEEDBACK
    controls: {
        marginTop: 20,
        flexDirection: 'row',
        gap: 12,
    },
    checkBtn: {
        flex: 2,
    },
    gradientBtn: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
    },
    checkBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resetBtn: {
        flex: 1,
        backgroundColor: '#1F2937',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#4B5563',
    },
    resetBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    btnPressed: {
        opacity: 0.7,
    },
    feedback: {
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
    },
    feedbackCorrect: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 1,
        borderColor: '#22c55e',
    },
    feedbackIncorrect: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    feedbackTextCorrect: {
        color: '#86efac',
        textAlign: 'center',
        fontWeight: '600',
    },
    feedbackTextIncorrect: {
        color: '#fca5a5',
        textAlign: 'center',
        fontWeight: '600',
    },
    bottomSpacer: {
        height: 50,
    },
});