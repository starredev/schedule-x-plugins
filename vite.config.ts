import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import typescript from '@rollup/plugin-typescript'

// https://vitejs.dev/config/
export default defineConfig({
    root: 'example',
    plugins: [vue(), typescript({ tsconfig: './tsconfig.rollup.json' })],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'schedule-x-plugin',
            fileName: (format) =>
            format === 'es' ? 'schedule-x-plugin.mjs' : 'schedule-x-plugin.umd.js',
        },
        rollupOptions: {
            external: ['vue', '@schedule-x/calendar'],
            output: {
            dir: 'dist',
            globals: {
                vue: 'Vue',
            },
            },
        },
    },
})