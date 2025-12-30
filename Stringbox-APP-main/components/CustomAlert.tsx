import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    type?: 'success' | 'error' | 'info';
}

export function CustomAlert({ visible, title, message, onClose, type = 'success' }: CustomAlertProps) {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'checkmark.circle.fill';
            case 'error':
                return 'exclamationmark.circle.fill';
            default:
                return 'info.circle.fill';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'success':
                return '#4ade80'; // Green
            case 'error':
                return '#ef4444'; // Red
            default:
                return '#60a5fa'; // Blue
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <View style={styles.iconContainer}>
                        <IconSymbol
                            name={getIcon() as any}
                            size={48}
                            color={getIconColor()}
                        />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={styles.buttonContainer}>
                        <LinearGradient
                            colors={['#8b5cf6', '#7c3aed']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>OK</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    alertContainer: {
        width: Math.min(width - 48, 320),
        backgroundColor: '#2f1e40',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#4c1d95',
    },
    iconContainer: {
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold', // Assuming font exists, or falls back
    },
    message: {
        fontSize: 14,
        color: '#e9d5ff',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});
