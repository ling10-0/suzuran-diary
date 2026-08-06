import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {routeTransform} from './scripts/route-transform.mjs';

export default defineConfig({
  plugins: [routeTransform(), react()],
  base: './'
});
