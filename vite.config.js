import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {routeTransform} from './scripts/route-transform.mjs';
import {manuscriptTransform} from './scripts/manuscript-transform.mjs';

export default defineConfig({
  plugins: [routeTransform(), manuscriptTransform(), react()],
  base: './'
});
