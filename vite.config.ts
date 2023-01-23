import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import envCompatible from "vite-plugin-env-compatible";
import { splitVendorChunkPlugin } from "vite";
import inject from "@rollup/plugin-inject";
// https://vitejs.dev/config/
export default defineConfig({
    envPrefix: "REACT_APP_",
    build: {
        outDir: "build",
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: "globalThis",
            },
        },
    },
    plugins: [
        inject({
            $: "jquery",
            jQuery: "jquery",
        }),
        splitVendorChunkPlugin(),
        react({
            jsxImportSource: "@emotion/react",
            babel: {
                plugins: ["@emotion/babel-plugin"],
            },
        }),
        viteTsconfigPaths(),
        envCompatible(),
        svgrPlugin({
            svgrOptions: {
                icon: true,
            },
        }),
    ],
    server: {
        open: true,
        port: 3000,
    },
});
