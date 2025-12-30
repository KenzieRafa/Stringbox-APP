import React from 'react';
import { Modal, StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

interface WelcomeModalProps {
    visible: boolean;
    onClose: () => void;
}

const Colors = {
    background: '#1a0b2e',
    modalBg: '#2f1e40',
    accentPurple: '#8b5cf6',
    textPrimary: '#ffffff',
    textSecondary: '#a89abf',
    borderColor: '#2d2438',
};

export default function WelcomeModal({ visible, onClose }: WelcomeModalProps) {
    const handleSignIn = () => {
        onClose();
        router.push('/auth/signin');
    };

    const handleSignUp = () => {
        onClose();
        router.push('/auth/signup');
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => {
                // Prevent closing with back button to force sign in
            }}>
            <View style={styles.overlay}>
                <ThemedView style={styles.modalContainer}>
                    <ThemedText style={styles.title}>
                        Selamat Datang di Stringbox! 🎉
                    </ThemedText>

                    <ThemedText style={styles.description}>
                        Untuk menyimpan progress pembelajaran Anda, silakan Sign In atau Sign Up terlebih dahulu.
                    </ThemedText>

                    <View style={styles.buttonsContainer}>
                        {/* Sign In Button */}
                        <Pressable onPress={handleSignIn}>
                            <LinearGradient
                                colors={['#8b5cf6', '#7c3aed']}
                                style={styles.primaryButton}>
                                <ThemedText style={styles.primaryButtonText}>
                                    Sign In
                                </ThemedText>
                            </LinearGradient>
                        </Pressable>

                        {/* Sign Up Button */}
                        <Pressable onPress={handleSignUp}>
                            <LinearGradient
                                colors={['#8b5cf6', '#7c3aed']}
                                style={styles.primaryButton}>
                                <ThemedText style={styles.primaryButtonText}>
                                    Sign Up
                                </ThemedText>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </ThemedView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: Colors.modalBg,
        borderRadius: 20,
        padding: 32,
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: Colors.borderColor,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    buttonsContainer: {
        gap: 12,
    },
    primaryButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    skipButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.borderColor,
        backgroundColor: 'transparent',
    },
    skipButtonText: {
        color: Colors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
});
