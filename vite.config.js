import { 
// build,
defineConfig, } from "vite";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
// import nodeAdapter from "@hono/vite-dev-server/node";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import config from "./src/config";
// import { resolve } from 'path'
export default defineConfig({
    base: "./",
    server: {
        port: config.API_PORT,
    },
    // This is the default
    build: {
        outDir: "dist/",
        // lib: {
        //   name: 'MyLib',
        //   entry: resolve(__dirname, 'lib/main.ts')
        // },
        // rollupOptions: {
        // input: ['./src/main.ts'],
        // output: {
        //     entryFileNames: 'public/main.js',
        //     chunkFileNames: 'public/assets/[name]-[hash].js',
        //     assetFileNames: 'public/assets/[name].[ext]'
        // }
        // },
        // minify: true,
        // emptyOutDir: false,
        // copyPublicDir: false
    },
    plugins: [
        react(),
        tsconfigPaths(),
        tailwindcss(),
        devServer({
            entry: "./src/server.ts",
            // adapter: nodeAdapter,
            exclude: defaultOptions.exclude.concat([
                /.*\.tsx?($|\?)/,
                /.*\.vue$/,
                /.*\.(s?css|less)($|\?)/,
                /.*\.(jpg|svg|png)($|\?)/,
                /^\/@.+$/,
                /^\/favicon\.ico$/,
                /^\/(public|assets|static)\/.+/,
                /^\/node_modules\/.*/,
            ]),
            injectClientScript: false, // this option is buggy, disable it and inject the code manually
        }),
    ],
    resolve: {},
});
