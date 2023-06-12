import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@image-browser': './image-browser/',
      '@settings': './settings/',
      '@main': './main/'
    }
  },
  plugins: [
    react({
      babel: {
        plugins: ['@babel/plugin-syntax-import-assertions'],
      },
    }),
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
          res.setHeader("Cross-Origin-Opener-Policy", "unsafe-non");
          next();
        });
      },
    },
    {
      name: 'route-default-to-index',
      configureServer: (server) => {
        server.middlewares.use(
          async (_req, res, next): Promise<void> => {
            if (_req.originalUrl === '/cozy-nest-client'
              || _req.originalUrl === '/cozy-nest-client?__theme=dark'
              || _req.originalUrl === '/cozy-nest-client?__theme=light') {

              let updatedResponse =await (await fetch('http://127.0.0.1:7860/')).text()

              const toAdd = `
                        <script type="module" src="/cozy-nest-client/main/_dev.js"></script>
                        <script type="module" src="/cozy-nest-client/main.jsx"></script>
                       `

              // replace </body> with </body><script type="module" src="/main.js"></script>
              updatedResponse = updatedResponse.replace('</body>', `</body>${toAdd}`)

              // Set the modified response
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html');
              res.setHeader('charset', 'utf-8');
              res.end(updatedResponse);
              return;
            }

            // Continue to the next middleware
            next();
          });
      }
    }
  ],
  build: {
    outDir: '../client',
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/queue/join': {
        target: 'ws://127.0.0.1:7860',
        ws: true,
      },
      'http://127.0.0.1:5173/theme-cozy-json.js': 'http://127.0.0.1:5173/cozy-nest-client/image-browser/src/editor/theme-cozy-json.js',
      //route everything except /cozy-nest-client/ to localhost:7860
      '^(?!.*cozy-nest-client).*$': 'http://127.0.0.1:7860',
      'http://127.0.0.1:5173/cozy-nest-client/assets/worker-json.js': 'http://127.0.0.1:7860/cozy-nest-client/assets/worker-json.js'
    }
  },
  base: 'cozy-nest-client'
})
