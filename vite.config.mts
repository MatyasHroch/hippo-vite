// vite.config.mts
import { defineConfig } from "vite";
import string from 'vite-plugin-string';

export default defineConfig({
    build: {
        outDir: "dist",
    },
    server: {
        // Support of js files
        strictPort: false,
    },
    resolve: {
        extensions: ['.ts', '.js'], // Support of TS and JS
    },
    plugins: [string({
        include: '**/*.html',
        exclude: ['./index.html']
    })],
});
