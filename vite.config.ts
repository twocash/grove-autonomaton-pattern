import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

// Get git commit hash at build time (with fallback for Vercel)
let commitHash = 'unknown'
try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim()
} catch {
  commitHash = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown'
}

export default defineConfig({
  plugins: [react()],
  base: '/autonomaton/',
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
})
