import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [glsl()],
    base: process.env.NODE_ENV === 'production' ? '/Shape-Crushing-Shader/' : ''
});