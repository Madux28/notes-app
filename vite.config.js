import path from "path";
import { fileURLToPath } from "url"; // Importă funcția necesară
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// Obține calea către directorul curent într-un mod compatibil cu ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Acum poți folosi __dirname fără erori
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
