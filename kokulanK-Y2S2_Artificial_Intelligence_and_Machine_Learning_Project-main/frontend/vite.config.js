import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";   // ✅ THIS LINE IS REQUIRED

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // ✅ This now works
  ],
});