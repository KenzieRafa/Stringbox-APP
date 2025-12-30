import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable, View, Animated } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

type AlgorithmType = 'bubble' | 'selection' | 'insertion';

interface SortingState {
    array: number[];
    comparisons: number;
    swaps: number;
    isSorting: boolean;
    status: 'Siap' | 'Sorting...' | 'Selesai!';
    highlightIndices: number[];
}

const ARRAY_SIZE = 20;
const MAX_VALUE = 100;
const COLORS = {
    default: '#3b82f6',
    highlight: '#ef4444',
    sorted: '#22c55e',
};

export default function VisualizationScreen() {
    const [algorithm, setAlgorithm] = useState<AlgorithmType>('bubble');
    const [speed, setSpeed] = useState(50);
    const [state, setState] = useState<SortingState>({
        array: [],
        comparisons: 0,
        swaps: 0,
        isSorting: false,
        status: 'Siap',
        highlightIndices: [],
    });

    const isSortingRef = useRef(false);

    useEffect(() => {
        generateRandomArray();
    }, []);

    const generateRandomArray = () => {
        if (state.isSorting) return;
        const newArray = Array.from({ length: ARRAY_SIZE }, () =>
            Math.floor(Math.random() * MAX_VALUE) + 10
        );
        setState({
            array: newArray,
            comparisons: 0,
            swaps: 0,
            isSorting: false,
            status: 'Siap',
            highlightIndices: [],
        });
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const updateState = (updates: Partial<SortingState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const bubbleSort = async (arr: number[]) => {
        const array = [...arr];
        let comparisons = 0;
        let swaps = 0;

        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                if (!isSortingRef.current) return;

                comparisons++;
                updateState({
                    array: [...array],
                    comparisons,
                    swaps,
                    highlightIndices: [j, j + 1]
                });
                await sleep(speed);

                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    swaps++;
                    updateState({ array: [...array], swaps });
                }
            }
        }
    };

    const selectionSort = async (arr: number[]) => {
        const array = [...arr];
        let comparisons = 0;
        let swaps = 0;

        for (let i = 0; i < array.length - 1; i++) {
            let minIdx = i;

            for (let j = i + 1; j < array.length; j++) {
                if (!isSortingRef.current) return;

                comparisons++;
                updateState({
                    array: [...array],
                    comparisons,
                    swaps,
                    highlightIndices: [minIdx, j]
                });
                await sleep(speed);

                if (array[j] < array[minIdx]) {
                    minIdx = j;
                }
            }

            if (minIdx !== i) {
                [array[i], array[minIdx]] = [array[minIdx], array[i]];
                swaps++;
                updateState({ array: [...array], swaps });
            }
        }
    };

    const insertionSort = async (arr: number[]) => {
        const array = [...arr];
        let comparisons = 0;
        let swaps = 0;

        for (let i = 1; i < array.length; i++) {
            const key = array[i];
            let j = i - 1;

            while (j >= 0 && array[j] > key) {
                if (!isSortingRef.current) return;

                comparisons++;
                updateState({
                    array: [...array],
                    comparisons,
                    swaps,
                    highlightIndices: [j, j + 1]
                });
                await sleep(speed);

                array[j + 1] = array[j];
                swaps++;
                j--;
            }

            array[j + 1] = key;
            updateState({ array: [...array], swaps });
        }
    };

    const startSorting = async () => {
        if (state.isSorting || state.array.length === 0) return;

        isSortingRef.current = true;
        updateState({ isSorting: true, status: 'Sorting...' });

        try {
            switch (algorithm) {
                case 'bubble':
                    await bubbleSort(state.array);
                    break;
                case 'selection':
                    await selectionSort(state.array);
                    break;
                case 'insertion':
                    await insertionSort(state.array);
                    break;
            }

            if (isSortingRef.current) {
                updateState({
                    status: 'Selesai!',
                    isSorting: false,
                    highlightIndices: []
                });
            }
        } catch (error) {
            console.error('Sorting error:', error);
        } finally {
            isSortingRef.current = false;
            updateState({ isSorting: false });
        }
    };

    const resetCanvas = () => {
        isSortingRef.current = false;
        generateRandomArray();
    };

    const getBarColor = (index: number): string => {
        if (state.status === 'Selesai!') return COLORS.sorted;
        if (state.highlightIndices.includes(index)) return COLORS.highlight;
        return COLORS.default;
    };

    const algorithmDescriptions: Record<AlgorithmType, { title: string; desc: string; }> = {
        bubble: {
            title: 'Bubble Sort',
            desc: 'Bubble Sort bekerja dengan membandingkan elemen yang bersebelahan. Jika urutannya salah, kedua elemen ditukar. Proses ini dilakukan berulang-ulang hingga tidak ada lagi pertukaran.',
        },
        selection: {
            title: 'Selection Sort',
            desc: 'Selection Sort mencari elemen terkecil dari seluruh elemen yang belum terurut, kemudian menempatkannya di posisi yang sesuai. Proses dilanjutkan untuk bagian sisa dari array.',
        },
        insertion: {
            title: 'Insertion Sort',
            desc: 'Insertion Sort bekerja seperti menyusun kartu. Setiap elemen diambil lalu dimasukkan ke posisi yang tepat di antara elemen-elemen yang sudah terurut sebelumnya.',
        },
    };

    const maxValue = Math.max(...state.array, 1);

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Title */}
                <ThemedText type="title" style={styles.pageTitle}>
                    Visualisasi Algoritma Sorting
                </ThemedText>

                {/* Description */}
                <ThemedView style={styles.intro}>
                    <ThemedText style={styles.introText}>
                        Lihat bagaimana algoritma sorting bekerja secara visual! Pilih algoritma dan tekan "Mulai Sorting" untuk melihat animasinya.
                    </ThemedText>
                </ThemedView>

                {/* Controls */}
                <ThemedView style={styles.controls}>
                    <Pressable
                        onPress={generateRandomArray}
                        disabled={state.isSorting}
                        style={({ pressed }) => [
                            styles.controlBtn,
                            state.isSorting && styles.btnDisabled,
                            pressed && styles.btnPressed
                        ]}>
                        <ThemedText style={styles.controlBtnText}>Generate Baru</ThemedText>
                    </Pressable>

                    <ThemedView style={styles.pickerContainer}>
                        <Picker
                            selectedValue={algorithm}
                            onValueChange={(value) => !state.isSorting && setAlgorithm(value as AlgorithmType)}
                            style={styles.picker}
                            enabled={!state.isSorting}
                            dropdownIconColor="#FFFFFF">
                            <Picker.Item label="Bubble Sort" value="bubble" />
                            <Picker.Item label="Selection Sort" value="selection" />
                            <Picker.Item label="Insertion Sort" value="insertion" />
                        </Picker>
                    </ThemedView>

                    <Pressable
                        onPress={startSorting}
                        disabled={state.isSorting}
                        style={({ pressed }) => [
                            styles.controlBtn,
                            styles.primaryBtn,
                            state.isSorting && styles.btnDisabled,
                            pressed && styles.btnPressed
                        ]}>
                        <LinearGradient
                            colors={state.isSorting ? ['#666', '#444'] : ['#C084FC', '#9333EA']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientBtn}>
                            <ThemedText style={styles.primaryBtnText}>Mulai Sorting</ThemedText>
                        </LinearGradient>
                    </Pressable>
                </ThemedView>

                {/* Speed Control */}
                <ThemedView style={styles.speedControl}>
                    <ThemedText style={styles.speedLabel}>
                        Kecepatan: {speed}ms
                    </ThemedText>
                    <View style={styles.speedSlider}>
                        {[10, 30, 50, 100, 200].map((value) => (
                            <Pressable
                                key={value}
                                onPress={() => !state.isSorting && setSpeed(value)}
                                style={[
                                    styles.speedBtn,
                                    speed === value && styles.speedBtnActive
                                ]}>
                                <ThemedText style={[
                                    styles.speedBtnText,
                                    speed === value && styles.speedBtnTextActive
                                ]}>
                                    {value}
                                </ThemedText>
                            </Pressable>
                        ))}
                    </View>
                </ThemedView>

                {/* Canvas/Visualization */}
                <ThemedView style={styles.canvasContainer}>
                    <View style={styles.barsContainer}>
                        {state.array.map((value, index) => {
                            const heightPercentage = (value / maxValue) * 100;
                            return (
                                <View key={index} style={styles.barWrapper}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: `${heightPercentage}%`,
                                                backgroundColor: getBarColor(index),
                                            },
                                        ]}
                                    />
                                </View>
                            );
                        })}
                    </View>
                </ThemedView>

                {/* Stats */}
                <ThemedView style={styles.statsContainer}>
                    <ThemedView style={styles.statItem}>
                        <ThemedText style={styles.statLabel}>Status:</ThemedText>
                        <ThemedText style={styles.statValue}>{state.status}</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.statItem}>
                        <ThemedText style={styles.statLabel}>Perbandingan:</ThemedText>
                        <ThemedText style={styles.statValue}>{state.comparisons}</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.statItem}>
                        <ThemedText style={styles.statLabel}>Swap:</ThemedText>
                        <ThemedText style={styles.statValue}>{state.swaps}</ThemedText>
                    </ThemedView>
                </ThemedView>

                {/* Algorithm Explanation */}
                <ThemedView style={styles.explanation}>
                    <ThemedText type="subtitle" style={styles.explanationTitle}>
                        {algorithmDescriptions[algorithm].title}
                    </ThemedText>
                    <ThemedText style={styles.explanationText}>
                        {algorithmDescriptions[algorithm].desc}
                    </ThemedText>
                </ThemedView>

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
        marginBottom: 20,
        color: '#FFFFFF',
        fontSize: 28,
        marginTop: 40,
    },
    intro: {
        padding: 16,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderLeftWidth: 4,
        borderLeftColor: '#9333EA',
        marginBottom: 20,
    },
    introText: {
        color: '#FFFFFF',
        lineHeight: 22,
        fontSize: 14,
    },
    controls: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    controlBtn: {
        flex: 1,
        minWidth: 140,
        backgroundColor: '#2D1B4E',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4B5563',
    },
    primaryBtn: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
    },
    gradientBtn: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    controlBtnText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
    },
    primaryBtnText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
    },
    btnDisabled: {
        opacity: 0.5,
    },
    btnPressed: {
        opacity: 0.7,
    },
    pickerContainer: {
        flex: 1,
        minWidth: 140,
        backgroundColor: '#2D1B4E',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4B5563',
        overflow: 'hidden',
    },
    picker: {
        color: '#FFFFFF',
        backgroundColor: 'transparent',
    },
    speedControl: {
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    speedLabel: {
        color: '#FFFFFF',
        marginBottom: 10,
        fontSize: 14,
        fontWeight: '600',
    },
    speedSlider: {
        flexDirection: 'row',
        gap: 8,
    },
    speedBtn: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#2D1B4E',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#4B5563',
        alignItems: 'center',
    },
    speedBtnActive: {
        backgroundColor: '#9333EA',
        borderColor: '#9333EA',
    },
    speedBtnText: {
        color: '#999',
        fontSize: 12,
        fontWeight: '600',
    },
    speedBtnTextActive: {
        color: '#FFFFFF',
    },
    canvasContainer: {
        padding: 20,
        backgroundColor: '#16213E',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#4B5563',
        marginBottom: 20,
        minHeight: 200,
    },
    barsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 180,
        gap: 2,
    },
    barWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bar: {
        width: '100%',
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        minHeight: 5,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: '#2D1B4E',
        borderRadius: 8,
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    statLabel: {
        color: '#999',
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        color: '#9333EA',
        fontSize: 24,
        fontWeight: 'bold',
    },
    explanation: {
        padding: 20,
        backgroundColor: '#2D1B4E',
        borderLeftWidth: 4,
        borderLeftColor: '#9333EA',
        borderRadius: 8,
    },
    explanationTitle: {
        color: '#9333EA',
        marginBottom: 12,
        fontSize: 18,
        fontWeight: 'bold',
    },
    explanationText: {
        color: '#CCC',
        lineHeight: 24,
        fontSize: 14,
    },
    bottomSpacer: {
        height: 40,
        backgroundColor: 'transparent',
    },
});
