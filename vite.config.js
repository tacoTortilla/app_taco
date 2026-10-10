import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' にしておくと GitHub Pages のサブパス (/app_taco/) でもそのまま動く
export default defineConfig({
  plugins: [react()],
  base: './',
})
