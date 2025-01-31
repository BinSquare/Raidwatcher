import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Use optional chaining and provide type assertion
const SUPABASE_PROJECT_URL = Constants.expoConfig?.extra?.SUPABASE_PROJECT_URL as string;
const SUPABASE_API_KEY = Constants.expoConfig?.extra?.SUPABASE_API_KEY as string;


if (!SUPABASE_PROJECT_URL|| !SUPABASE_API_KEY) {
    throw new Error('Missing Supabase environment variables');
  }

export const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_API_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});