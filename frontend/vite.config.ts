import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:4000/",
        },
        "/public": {
          target: "http://127.0.0.1:4000/",
        },
        "/auth": {
          target: "http://127.0.0.1:4000/",
        },
      },
    },
    plugins: [react(), tsconfigPaths()],
    build: {
      rollupOptions: {
        output: {
          dir: "./public/dist",
          sourcemap: false,
        },
      },
      sourcemap: false,
    },
  };
});
