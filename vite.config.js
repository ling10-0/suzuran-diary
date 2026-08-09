import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {routeTransform} from './scripts/route-transform.mjs';
import {routePlaceNameTransform} from './scripts/route-place-name-transform.mjs';
import {manuscriptTransform} from './scripts/manuscript-transform.mjs';
import {syncTransform} from './scripts/sync-transform.mjs';
import {ninthPuzzleTransform} from './scripts/ninth-puzzle-transform.mjs';
import {tenthPuzzleTransform} from './scripts/tenth-puzzle-transform.mjs';
import {secondDayTransform} from './scripts/second-day-transform.mjs';
import {secondDayMobileFixTransform} from './scripts/second-day-mobile-fix-transform.mjs';
import {routeMobileFixTransform} from './scripts/route-mobile-fix-transform.mjs';
import {scheduleMobileFixTransform} from './scripts/schedule-mobile-fix-transform.mjs';
import {firstPuzzleTransform} from './scripts/first-puzzle-transform.mjs';
import {customReplayTransform} from './scripts/custom-replay-transform.mjs';
import {secondPuzzleTransform} from './scripts/second-puzzle-transform.mjs';
import {thirdPuzzleTransform} from './scripts/third-puzzle-transform.mjs';
import {fourthPuzzleTransform} from './scripts/fourth-puzzle-transform.mjs';
import {fifthPuzzleTransform} from './scripts/fifth-puzzle-transform.mjs';
import {sixthPuzzleTransform} from './scripts/sixth-puzzle-transform.mjs';
import {seventhPuzzleTransform} from './scripts/seventh-puzzle-transform.mjs';
import {eighthPuzzleTransform} from './scripts/eighth-puzzle-transform.mjs';
import {placeOnlyDirectoryTitleTransform} from './scripts/place-only-directory-title-transform.mjs';
import {directoryTitleTransform} from './scripts/directory-title-transform.mjs';
import {finalSyncTransform} from './scripts/final-sync-transform.mjs';
import {readingGateTransform} from './scripts/reading-gate-transform.mjs';
import {guidedMapLabelTransform} from './scripts/guided-map-label-transform.mjs';
import {latestManuscriptsTransform} from './scripts/latest-manuscripts-transform.mjs';
import {caseReadingFirstTransform} from './scripts/case-reading-first-transform.mjs';
import {evidenceBottomTransform} from './scripts/evidence-bottom-transform.mjs';

export default defineConfig({
  plugins: [routeTransform(), routePlaceNameTransform(), manuscriptTransform(), latestManuscriptsTransform(), syncTransform(), ninthPuzzleTransform(), tenthPuzzleTransform(), secondDayTransform(), secondDayMobileFixTransform(), routeMobileFixTransform(), scheduleMobileFixTransform(), firstPuzzleTransform(), customReplayTransform(), secondPuzzleTransform(), thirdPuzzleTransform(), fourthPuzzleTransform(), fifthPuzzleTransform(), sixthPuzzleTransform(), seventhPuzzleTransform(), eighthPuzzleTransform(), placeOnlyDirectoryTitleTransform(), directoryTitleTransform(), finalSyncTransform(), readingGateTransform(), guidedMapLabelTransform(), caseReadingFirstTransform(), evidenceBottomTransform(), react()],
  base: './'
});
