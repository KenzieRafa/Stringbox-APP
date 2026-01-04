import { supabase } from './supabase';
import { Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Required for OAuth to work properly
WebBrowser.maybeCompleteAuthSession();

export interface User {
    id: string;
    email?: string;
    user_metadata?: {
        full_name?: string;
        avatar_url?: string;
    };
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string, fullName: string) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) throw error;
        return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
        console.error('Sign up error:', error);
        return { user: null, session: null, error: error.message };
    }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
        console.error('Sign in error:', error);
        return { user: null, session: null, error: error.message };
    }
}

// Sign in with Google OAuth
export async function signInWithGoogle() {
    try {
        // Create redirect URL for OAuth callback
        const redirectUrl = AuthSession.makeRedirectUri({
            scheme: 'stringbox',
            path: 'auth/callback',
            preferLocalhost: false,
        });

        console.log('🔗 Redirect URL:', redirectUrl);

        // Start OAuth flow with Supabase
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                skipBrowserRedirect: true,
            },
        });

        if (error) throw error;
        if (!data?.url) throw new Error('No OAuth URL returned');

        console.log('🌐 Opening OAuth URL...');

        // Open OAuth URL in browser
        const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUrl
        );

        console.log('📱 OAuth result:', result.type);

        // Handle OAuth response
        if (result.type === 'success' && result.url) {
            const url = new URL(result.url);
            const params = url.searchParams;

            // Get tokens from URL fragments (Supabase uses hash fragments)
            const hashParams = new URLSearchParams(url.hash.substring(1));
            const access_token = hashParams.get('access_token') || params.get('access_token');
            const refresh_token = hashParams.get('refresh_token') || params.get('refresh_token');

            if (access_token) {
                console.log('✅ Got access token, setting session...');

                const { data: sessionData, error: sessionError } =
                    await supabase.auth.setSession({
                        access_token,
                        refresh_token: refresh_token || '',
                    });

                if (sessionError) throw sessionError;

                return {
                    user: sessionData.user,
                    session: sessionData.session,
                    error: null
                };
            }
        }

        if (result.type === 'cancel') {
            throw new Error('Authentication cancelled');
        }

        throw new Error('OAuth flow failed');
    } catch (error: any) {
        console.error('❌ Google sign in error:', error);
        return { user: null, session: null, error: error.message };
    }
}

// Sign out
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
    } catch (error: any) {
        console.error('Sign out error:', error);
        return { error: error.message };
    }
}

// Get current user
export async function getCurrentUser() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            // Return null silently for session missing/refresh errors
            return { user: null, error: null };
        }

        if (!session?.user) {
            return { user: null, error: null };
        }

        // Optional: specific check for user details if needed, but getSession is faster/safer for initial load
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
            // If info is stale, just return null
            return { user: null, error: null };
        }

        return { user, error: null };
    } catch (error: any) {
        // Silently handle auth session missing errors
        if (error?.message?.includes('Auth session missing')) {
            return { user: null, error: null };
        }
        console.error('Get user error:', error);
        return { user: null, error: error.message };
    }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user ?? null);
    });
}
