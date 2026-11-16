import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function localInboxApiPlugin(): Plugin {
  return {
    name: 'local-inbox-api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/inbox', async (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          res.end();
          return;
        }
        if (req.method !== 'POST') {
          return next();
        }
        try {
          const chunks: Buffer[] = [];
          let totalBytes = 0;
          const MAX_BYTES = 16 * 1024 * 1024;
          await new Promise<void>((resolve, reject) => {
            req.on('data', (chunk: Buffer) => {
              totalBytes += chunk.length;
              if (totalBytes > MAX_BYTES) {
                reject(new Error('Payload too large'));
                return;
              }
              chunks.push(chunk);
            });
            req.on('end', () => resolve());
            req.on('error', reject);
          });

          const rawBody = Buffer.concat(chunks).toString('utf8');
          let parsedBody: any = {};
          if (rawBody) {
            parsedBody = JSON.parse(rawBody);
          }

          const vercelReq: any = {
            method: req.method,
            headers: req.headers,
            body: parsedBody,
          };

          const vercelRes: any = {
            setHeader(key: string, val: string) {
              res.setHeader(key, val);
              return vercelRes;
            },
            status(code: number) {
              res.statusCode = code;
              return vercelRes;
            },
            json(payload: unknown) {
              if (!res.getHeader('Content-Type')) {
                res.setHeader('Content-Type', 'application/json');
              }
              res.end(JSON.stringify(payload));
              return vercelRes;
            },
            end(data?: any) {
              res.end(data);
              return vercelRes;
            },
          };

          const mod = await server.ssrLoadModule('/api/inbox.ts');
          await mod.default(vercelReq, vercelRes);
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              success: false,
              error: err?.message || 'Error en middleware local /api/inbox',
            })
          );
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const sparkToken = env.SPARK_API_TOKEN || env.VITE_SPARK_API_TOKEN || 'ar8u3ybcd71qewwrbahvacz6d';

  if (env.RESEND_API_KEY || env.VITE_RESEND_API_KEY) {
    process.env.RESEND_API_KEY = env.RESEND_API_KEY || env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY || '';
  }

  return {
    plugins: [react(), localInboxApiPlugin()],
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

