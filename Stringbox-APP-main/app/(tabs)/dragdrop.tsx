import React, { useState, useRef } from 'react';
import { StyleSheet, ScrollView, Pressable, Animated, PanResponder, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LinearGradient } from 'expo-linear-gradient';
import { updateDragDropStats } from '@/services/progress';

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

// Draggable Block Component
function DraggableBlock({ block, onDrop, onDragStart, onDragEnd }: {
    block: CodeBlock;
    onDrop: () => void;
    onDragStart: () => void;
    onDragEnd: () => void;
}) {
    const pan = useRef(new Animated.ValueXY()).current;
    const scale = useRef(new Animated.Value(1)).current;
    const [isDragging, setIsDragging] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setIsDragging(true);
                onDragStart();
                Animated.spring(scale, {
                    toValue: 1.1,
                    useNativeDriver: true,
                }).start();
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                setIsDragging(false);
                onDragEnd();

                // Animate back to original position with slower timing
                Animated.parallel([
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        friction: 7,
                        tension: 40,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scale, {
                        toValue: 1,
                        friction: 7,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    // Delay before moving to show the return animation clearly
                    setTimeout(() => {
                        onDrop();
                    }, 200);
                });
            },
        })
    ).current;

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.draggableWrapper,
                {
                    transform: [
                        { translateX: pan.x },
                        { translateY: pan.y },
                        { scale },
                    ],
                    opacity: isDragging ? 0.7 : 1,
                    zIndex: isDragging ? 1000 : 1,
                },
            ]}
        >
            <ThemedView style={styles.codeBlock}>
                <ThemedText style={styles.codeText}>{block.code}</ThemedText>
                <ThemedText style={styles.dragHint}>Tekan dan geser</ThemedText>
            </ThemedView>
        </Animated.View>
    );
}

export default function DragDropScreen() {
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [availableBlocks, setAvailableBlocks] = useState<CodeBlock[]>(() =>
        [...PROBLEMS[0].blocks].sort(() => Math.random() - 0.5)
    );
    const [solutionBlocks, setSolutionBlocks] = useState<CodeBlock[]>([]);
    const [feedback, setFeedback] = useState({ show: false, correct: false, message: '' });
    const [isDropZoneActive, setIsDropZoneActive] = useState(false);

    const currentProblem = PROBLEMS[currentProblemIndex];

    const moveToSolution = (block: CodeBlock) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setAvailableBlocks(prev => prev.filter(b => b.id !== block.id));
        setSolutionBlocks(prev => [...prev, block]);
        setFeedback({ show: false, correct: false, message: '' });
    };

    const moveToAvailable = (block: CodeBlock) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSolutionBlocks(prev => prev.filter(b => b.id !== block.id));
        setAvailableBlocks(prev => [...prev, block]);
        setFeedback({ show: false, correct: false, message: '' });
    };

    const resetExercise = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const newIndex = Math.floor(Math.random() * PROBLEMS.length);
        setCurrentProblemIndex(newIndex);
        setAvailableBlocks([...PROBLEMS[newIndex].blocks].sort(() => Math.random() - 0.5));
        setSolutionBlocks([]);
        setFeedback({ show: false, correct: false, message: '' });
    };

    const checkSolution = async () => {
        if (solutionBlocks.length === 0) {
            setFeedback({
                show: true,
                correct: false,
                message: '❌ Belum ada kode! Drag blok ke area solusi.',
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
                message: '🎉 Sempurna! Urutan kode sudah benar! Progress tersimpan di Academic Progress.',
            });

            // Save stats to Supabase
            await updateDragDropStats(true);
        } else {
            setFeedback({
                show: true,
                correct: false,
                message: `❌ Belum tepat. Hint: ${currentProblem.hint}`,
            });

            // Save stats to Supabase
            await updateDragDropStats(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <ThemedText type="title" style={styles.pageTitle}>
                    Latihan Drag & Drop
                </ThemedText>

                <ThemedText type="subtitle" style={styles.problemTitle}>
                    {currentProblem.title}
                </ThemedText>

                <ThemedView style={styles.intro}>
                    <ThemedText style={styles.introText}>
                        Susun blok kode berikut menjadi program yang benar dengan cara drag & drop!
                    </ThemedText>
                </ThemedView>

                {/* Available Blocks */}
                <ThemedView style={styles.availableBlocksWrapper}>
                    <ThemedText style={styles.sectionTitle}>Blok Kode Tersedia</ThemedText>
                    <ThemedView style={styles.blocksContainer}>
                        {availableBlocks.map((block) => (
                            <DraggableBlock
                                key={block.id}
                                block={block}
                                onDrop={() => moveToSolution(block)}
                                onDragStart={() => setIsDropZoneActive(true)}
                                onDragEnd={() => setIsDropZoneActive(false)}
                            />
                        ))}
                        {availableBlocks.length === 0 && (
                            <ThemedText style={styles.emptyMessage}>
                                Semua blok sudah dipindahkan
                            </ThemedText>
                        )}
                    </ThemedView>
                </ThemedView>

                {/* Solution Area */}
                <ThemedView style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Area Solusi</ThemedText>
                    <ThemedView style={[styles.dropZone, isDropZoneActive && styles.dropZoneActive]}>
                        {solutionBlocks.length === 0 ? (
                            <ThemedText style={styles.emptyMessage}>
                                Drag blok kode ke sini untuk menyusun program
                            </ThemedText>
                        ) : (
                            solutionBlocks.map((block) => (
                                <Pressable
                                    key={block.id}
                                    style={({ pressed }) => [
                                        styles.codeBlockInSolution,
                                        pressed && styles.blockPressed
                                    ]}
                                    onPress={() => moveToAvailable(block)}
                                >
                                    <ThemedText style={styles.codeText}>{block.code}</ThemedText>
                                    <ThemedText style={styles.removeHint}>Tap untuk hapus</ThemedText>
                                </Pressable>
                            ))
                        )}
                    </ThemedView>
                </ThemedView>

                {/* Controls */}
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

                {/* Feedback */}
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
        marginBottom: 12,
        color: '#FFFFFF',
        fontSize: 28,
    },
    problemTitle: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#C084FC',
        fontSize: 18,
    },
    intro: {
        padding: 16,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderLeftWidth: 4,
        borderLeftColor: '#9333EA',
        marginBottom: 24,
        borderRadius: 8,
    },
    introText: {
        color: '#FFFFFF',
        lineHeight: 22,
        fontSize: 14,
    },
    section: {
        marginBottom: 24,
        backgroundColor: 'transparent',
    },
    availableBlocksWrapper: {
        marginBottom: 24,
        padding: 20,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#6B7280',
        borderRadius: 12,
        backgroundColor: '#1e1b4b',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
        color: '#9333EA',
    },
    blocksContainer: {
        backgroundColor: 'transparent',
    },
    draggableWrapper: {
        marginBottom: 12,
    },
    codeBlock: {
        backgroundColor: '#2D1B4E',
        borderWidth: 2,
        borderColor: '#4B5563',
        borderRadius: 8,
        padding: 16,
        alignItems: 'flex-start',
        flexDirection: 'column',
    },
    blockPressed: {
        opacity: 0.6,
        transform: [{ scale: 0.98 }],
    },
    codeBlockInSolution: {
        backgroundColor: '#16213E',
        borderWidth: 2,
        borderColor: '#9333EA',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    codeText: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 13,
        color: '#FFFFFF',
        textAlign: 'left',
        width: '100%',
        flexShrink: 1,
    },
    removeHint: {
        fontSize: 11,
        color: '#999',
        marginTop: 8,
        fontStyle: 'italic',
    },
    dragHint: {
        fontSize: 11,
        color: '#9333EA',
        marginTop: 8,
        fontStyle: 'italic',
    },
    dropZone: {
        minHeight: 300,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#6B7280',
        borderRadius: 12,
        padding: 20,
        backgroundColor: '#1e1b4b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropZoneActive: {
        borderColor: '#9333EA',
        borderStyle: 'solid',
        backgroundColor: 'rgba(147, 51, 234, 0.15)',
        borderWidth: 3,
    },
    emptyMessage: {
        textAlign: 'center',
        color: '#6B7280',
        fontStyle: 'italic',
        paddingVertical: 60,
        fontSize: 15,
        lineHeight: 24,
    },
    controls: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
        backgroundColor: 'transparent',
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
        backgroundColor: '#2D1B4E',
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
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
    },
    feedbackCorrect: {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 2,
        borderColor: '#22c55e',
    },
    feedbackIncorrect: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 2,
        borderColor: '#ef4444',
    },
    feedbackTextCorrect: {
        color: '#86efac',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    feedbackTextIncorrect: {
        color: '#fca5a5',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    bottomSpacer: {
        height: 40,
        backgroundColor: 'transparent',
    },
});
