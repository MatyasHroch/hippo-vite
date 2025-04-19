// vite.config.mts
import { defineConfig } from "vite";

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
    // assetsInclude: ['**/*.html'],
    plugins: [],
});
