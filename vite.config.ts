import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
        react({
            babel: {
                plugins: [["babel-plugin-react-compiler"]],
            },
        }),
    ],
    server: {
        proxy: {
            "/auth": {
                target: "http://localhost:3000",
                changeOrigin: true,
                secure: false,
            },
            "/me": {
                target: "http://localhost:3000",
                changeOrigin: true,
                secure: false,
            },
            "/health": {
                target: "http://localhost:3000",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
