import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const sparkToken = env.SPARK_API_TOKEN || env.VITE_SPARK_API_TOKEN || 'ar8u3ybcd71qewwrbahvacz6d';

  return {
    plugins: [react()],
    envPrefix: ['VITE_', 'SUPABASE_', 'SPARK_', 'GOOGLE_', 'RESEND_'],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.SUPABASE_URL || env.VITE_SUPABASE_URL || 'https://rxejkmuzhkxfezkqrjnm.supabase.co'),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZWprbXV6aGt4ZmV6a3Fyam5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2ODc3MDksImV4cCI6MjEwNTI2MzcwOX0.-p98aKj5-g47E1_kfniokkXGCgejyj072fXSv78WW0o'),
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.GOOGLE_MAPS_API_KEY || env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyB1HxGEstPbqv5eRXDc97UyixJx3cgHl4U'),
      'import.meta.env.VITE_SPARK_API_TOKEN': JSON.stringify(env.SPARK_API_TOKEN || env.VITE_SPARK_API_TOKEN || 'ar8u3ybcd71qewwrbahvacz6d'),
      'import.meta.env.VITE_SPARK_API_BASE_URL': JSON.stringify(env.SPARK_API_BASE_URL || env.VITE_SPARK_API_BASE_URL || 'https://replication.sparkapi.com/v1'),
      'import.meta.env.VITE_SPARK_FEED_ID': JSON.stringify(env.SPARK_FEED_ID || env.VITE_SPARK_FEED_ID || 'de200oeasbpno34ion3cmqfrv'),
      'import.meta.env.VITE_RESEND_API_KEY': JSON.stringify(env.RESEND_API_KEY || env.VITE_RESEND_API_KEY || ''),
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api/spark': {
          target: 'https://replication.sparkapi.com/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/spark/, ''),
          headers: {
            'Authorization': `Bearer ${sparkToken}`,
            'X-SparkApi-User-Agent': 'NewEraRealEstate/1.0',
            'Accept': 'application/json'
          }
        }
      }
    }
  };
});

