import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {routeTransform} from './scripts/route-transform.mjs';
import {manuscriptTransform} from './scripts/manuscript-transform.mjs';
import {syncTransform} from './scripts/sync-transform.mjs';
import {firstPuzzleTransform} from './scripts/first-puzzle-transform.mjs';
import {finalSyncTransform} from './scripts/final-sync-transform.mjs';
import {readingGateTransform} from './scripts/reading-gate-transform.mjs';
import {guidedMapLabelTransform} from './scripts/guided-map-label-transform.mjs';
import {latestManuscriptsTransform} from './scripts/latest-manuscripts-transform.mjs';

export default defineConfig({
  plugins: [routeTransform(), manuscriptTransform(), latestManuscriptsTransform(), syncTransform(), firstPuzzleTransform(), finalSyncTransform(), readingGateTransform(), guidedMapLabelTransform(), react()],
  base: './'
});
