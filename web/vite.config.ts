import { defineConfig } from 'vite';

export default defineConfig({
    base: '/Electrolab',
    server: {
        fs: {
            allow: ['..'],
        },
    },
});