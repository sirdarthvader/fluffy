import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@fluffy/core": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist/client",
    rollupOptions: {
      input: {
        main: "./index.html",
        client: "./src/client/entry-client.tsx",
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name].[ext]",
        manualChunks: (id) => {
          if (id.includes("node_modules")) return "vendor";
          if (id.includes("src/pages")) return "pages/[name]";
        },
      },
    },
  },
  ssr: {
    noExternal: ["react-router-dom"],
    target: "node",
  },
});
