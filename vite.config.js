import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {routeTransform} from './scripts/route-transform.mjs';
import {manuscriptTransform} from './scripts/manuscript-transform.mjs';
import {syncTransform} from './scripts/sync-transform.mjs';
import {firstPuzzleTransform} from './scripts/first-puzzle-transform.mjs';

export default defineConfig({
  plugins: [routeTransform(), manuscriptTransform(), syncTransform(), firstPuzzleTransform(), react()],
  base: './'
});
