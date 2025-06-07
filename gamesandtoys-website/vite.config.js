import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "src"), // Qui dici che la root del frontend è 'src'
  build: {
    outDir: path.resolve(__dirname, "dist"), // Dove mettere la cartella dist (qui nella root)
    emptyOutDir: true, // Pulisce la cartella dist prima di buildare
    rollupOptions: {
      input: path.resolve(__dirname, "src/index.html"), // punto di partenza per il build
    },
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000", // il tuo backend
    },
  },
});
