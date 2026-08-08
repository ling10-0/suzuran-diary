import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {routeTransform} from './scripts/route-transform.mjs';
import {manuscriptTransform} from './scripts/manuscript-transform.mjs';
import {syncTransform} from './scripts/sync-transform.mjs';
import {firstPuzzleTransform} from './scripts/first-puzzle-transform.mjs';
import {secondPuzzleTransform} from './scripts/second-puzzle-transform.mjs';
import {thirdPuzzleTransform} from './scripts/third-puzzle-transform.mjs';
import {fourthPuzzleTransform} from './scripts/fourth-puzzle-transform.mjs';
import {fifthPuzzleTransform} from './scripts/fifth-puzzle-transform.mjs';
import {sixthPuzzleTransform} from './scripts/sixth-puzzle-transform.mjs';
import {seventhPuzzleTransform} from './scripts/seventh-puzzle-transform.mjs';
import {directoryTitleTransform} from './scripts/directory-title-transform.mjs';
import {finalSyncTransform} from './scripts/final-sync-transform.mjs';
import {readingGateTransform} from './scripts/reading-gate-transform.mjs';
import {guidedMapLabelTransform} from './scripts/guided-map-label-transform.mjs';
import {latestManuscriptsTransform} from './scripts/latest-manuscripts-transform.mjs';

export default defineConfig({
  plugins: [routeTransform(), manuscriptTransform(), latestManuscriptsTransform(), syncTransform(), firstPuzzleTransform(), secondPuzzleTransform(), thirdPuzzleTransform(), fourthPuzzleTransform(), fifthPuzzleTransform(), sixthPuzzleTransform(), seventhPuzzleTransform(), directoryTitleTransform(), finalSyncTransform(), readingGateTransform(), guidedMapLabelTransform(), react()],
  base: './'
});
