import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, getCurrentUser, User } from '@/services/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial user - silently handle errors for development
        getCurrentUser()
            .then(({ user }) => {
                setUser(user);
                setLoading(false);
            })
            .catch((error) => {
                console.log('Auth check finished:', error?.message || 'No user found');
                setUser(null);
                setLoading(false);
            });

        // Listen to auth changes - wrap in try-catch for safety
        try {
            const { data: { subscription } } = onAuthStateChange((user) => {
                setUser(user);
            });

            return () => {
                subscription?.unsubscribe();
            };
        } catch (error) {
            console.log('Auth listener not available - using guest mode');
            return () => { };
        }
    }, []);

    const handleSignOut = async () => {
        const { signOut } = await import('@/services/auth');
        await signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
