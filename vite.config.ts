import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // This is a user Pages repository, served at the domain root.
  base: '/',
  plugins: [react(), tailwindcss()],
})
