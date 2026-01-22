import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['**/*.spec.ts'],
        exclude: ['node_modules', 'dist'],
    },
});
