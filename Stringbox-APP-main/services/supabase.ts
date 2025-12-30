import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Replace with your Supabase credentials
// Temporary valid URL format - replace with your actual Supabase project URL
const SUPABASE_URL = 'https://blkplgvhkgtsgnindwht.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa3BsZ3Zoa2d0c2duaW5kd2h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDM1NjMsImV4cCI6MjA3NTUxOTU2M30.HClTmehLskf_mgebwpRH9g-gyprqjIs8mn97HBOIT1k';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
