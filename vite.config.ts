// vite.config.ts
import { defineConfig } from "vite";
import string from 'vite-plugin-string';

export default defineConfig({
    build: {
        outDir: "dist",
    },
    server: {
        // Povolení JS souborů
        strictPort: false,
    },
    resolve: {
        extensions: ['.ts', '.js'], // Podpora TS a JS
    },
    plugins: [string({ include: '**/*.html' })],
});
