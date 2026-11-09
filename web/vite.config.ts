import { defineConfig } from 'vite';

export default defineConfig({
    base: '/Electrobase',
    server: {
        fs: {
            allow: ['..'],
        },
    },
});