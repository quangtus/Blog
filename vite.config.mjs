import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react({
            jsxRuntime: 'automatic',
            fastRefresh: true,
        }),
    ],
    server: {
        host: 'localhost',
        port: 5173,
        strictPort: true, // Khong tu dong doi port neu bi chiem
        hmr: {
            host: 'localhost',
            port: 5173,
        },
    },
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});