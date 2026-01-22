import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['**/*.spec.ts'],   // 👈 más genérico, cubre todo
        exclude: ['node_modules', 'dist'], // 👈 evita carpetas innecesarias
    },
});
