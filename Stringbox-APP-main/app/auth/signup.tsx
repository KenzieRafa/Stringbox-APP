import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, View, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { signUpWithEmail, signInWithGoogle } from '@/services/auth';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import { CustomAlert } from '@/components/CustomAlert';

export default function SignUpScreen() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Custom Alert State
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        type: 'info' as 'success' | 'error' | 'info',
        onClose: () => { }
    });

    const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info', onClose = () => { }) => {
        setAlertConfig({
            title, message, type, onClose: () => {
                setAlertVisible(false);
                onClose();
            }
        });
        setAlertVisible(true);
    };

    const handleSignUp = async () => {
        if (!email || !password || !fullName) {
            showAlert('Error', 'Please fill in all fields', 'error');
            return;
        }

        if (password.length < 6) {
            showAlert('Error', 'Password must be at least 6 characters', 'error');
            return;
        }

        setLoading(true);
        const { user, session, error } = await signUpWithEmail(email, password, fullName);
        setLoading(false);

        if (error) {
            showAlert('Sign Up Failed', error, 'error');
        } else if (session) {
            // If session exists, email confirmation is disabled -> Auto Login
            showAlert('Success', 'Account created successfully!', 'success', () => {
                router.replace('/(tabs)');
            });
        } else {
            // If no session, email confirmation is enabled on server
            showAlert(
                'Verification Required',
                'Account created! Please check your email to verify your account. If you want to skip this, disable "Confirm Email" in Supabase dashboard.',
                'info',
                () => {
                    router.replace('/auth/signin');
                }
            );
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setGoogleLoading(true);
            const { user, error } = await signInWithGoogle();

            if (error) throw new Error(error);

            if (user) {
                showAlert('Success', 'Signed in with Google!', 'success', () => {
                    router.replace('/(tabs)');
                });
            }
        } catch (error: any) {
            showAlert('Google Sign In', error.message || 'Failed to sign in', 'error');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={alertConfig.onClose}
            />

            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <View style={styles.card}>
                        {/* Header */}
                        <View style={styles.header}>
                            <ThemedText style={styles.title}>Sign Up</ThemedText>
                            <Pressable onPress={() => router.back()} style={styles.closeButton}>
                                <IconSymbol name="xmark" size={20} color="#a89abf" />
                            </Pressable>
                        </View>

                        {/* Google Sign In */}
                        <Pressable
                            style={[styles.googleButton, (googleLoading || loading) && styles.buttonDisabled]}
                            onPress={handleGoogleSignIn}
                            disabled={googleLoading || loading}>
                            {googleLoading ? (
                                <ActivityIndicator color="#4285F4" />
                            ) : (
                                <>
                                    <Svg width="18" height="18" viewBox="0 0 48 48">
                                        <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                        <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                        <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                        <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                    </Svg>
                                    <ThemedText style={styles.googleButtonText}>
                                        Continue with Google
                                    </ThemedText>
                                </>
                            )}
                        </Pressable>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <ThemedText style={styles.dividerText}>atau</ThemedText>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Inputs */}
                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nama Lengkap"
                                placeholderTextColor="#a89abf"
                                value={fullName}
                                onChangeText={setFullName}
                                editable={!loading}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#a89abf"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                editable={!loading}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Password (min 6 karakter)"
                                placeholderTextColor="#a89abf"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                editable={!loading}
                            />

                            <Pressable
                                onPress={handleSignUp}
                                disabled={loading}>
                                <LinearGradient
                                    colors={['#8b5cf6', '#7c3aed']}
                                    style={[styles.primaryButton, loading && styles.buttonDisabled]}>
                                    {loading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <ThemedText style={styles.primaryButtonText}>Sign Up</ThemedText>
                                    )}
                                </LinearGradient>
                            </Pressable>

                            <Pressable
                                style={styles.linkButton}
                                onPress={() => router.push('/auth/signin')}
                                disabled={loading}>
                                <ThemedText style={styles.linkText}>
                                    Sudah punya akun? <ThemedText style={styles.linkTextBold}>Sign In</ThemedText>
                                </ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a0b2e', // Dark app background
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#2f1e40', // Modal/Card background
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#2d2438',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        padding: 4,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: 14,
        borderRadius: 12,
        marginBottom: 20,
        gap: 12,
    },
    googleButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#4a3b55',
    },
    dividerText: {
        fontSize: 14,
        color: '#a89abf',
    },
    form: {
        gap: 16,
    },
    input: {
        backgroundColor: '#1a0b2e', // Darker input bg
        borderRadius: 12,
        padding: 16,
        color: '#ffffff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#4a3b55',
    },
    primaryButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    linkButton: {
        alignItems: 'center',
        marginTop: 8,
    },
    linkText: {
        color: '#a89abf',
        fontSize: 14,
    },
    linkTextBold: {
        color: '#8b5cf6', // Accent purple
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});
