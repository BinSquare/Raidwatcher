import 'dotenv/config'; // Load .env variables (optional)

export default ({ config }) => ({
  ...config,
  extra: {
    SUPABASE_PROJECT_URL: process.env.SUPABASE_PROJECT_URL,
    SUPABASE_API_KEY: process.env.SUPABASE_API_KEY,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    ENV: process.env.ENV || 'development',
  },
});