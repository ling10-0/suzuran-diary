import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {routeTransform} from './scripts/route-transform.mjs';
import {routePlaceNameTransform} from './scripts/route-place-name-transform.mjs';
import {manuscriptTransform} from './scripts/manuscript-transform.mjs';
import {syncTransform} from './scripts/sync-transform.mjs';
import {ninthPuzzleTransform} from './scripts/ninth-puzzle-transform.mjs';
import {tenthPuzzleTransform} from './scripts/tenth-puzzle-transform.mjs';
import {secondDayTransform} from './scripts/second-day-transform.mjs';
import {secondDayAnswerBalanceTransform} from './scripts/second-day-answer-balance-transform.mjs';
import {greenCorridorReviewTransform} from './scripts/green-corridor-review-transform.mjs';
import {endingConsistencyTransform} from './scripts/ending-consistency-transform.mjs';
import {endingGateTransform} from './scripts/ending-gate-transform.mjs';
import {endingVisualRedesignTransform} from './scripts/ending-visual-redesign-transform.mjs';
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
import {latestTraveloguesTransform} from './scripts/latest-travelogues-transform.mjs';
import {caseReadingFirstTransform} from './scripts/case-reading-first-transform.mjs';
import {evidenceBottomTransform} from './scripts/evidence-bottom-transform.mjs';
import {suzuranMissingEventTransform} from './scripts/suzuran-missing-event-transform.mjs';
import {caseQuestionTitleTransform} from './scripts/case-question-title-transform.mjs';
import {photoCheckinTransform} from './scripts/photo-checkin-transform.mjs';
import {caseUiFixTransform} from './scripts/case-ui-fix-transform.mjs';
import {fixFifthEvidenceFlowTransform} from './scripts/fix-fifth-evidence-flow-transform.mjs';
import {liuchuanPlayerCleanupTransform} from './scripts/liuchuan-player-cleanup-transform.mjs';
import {firstPhotoScoringFlowTransform} from './scripts/first-photo-scoring-flow-transform.mjs';

export default defineConfig({
  plugins: [routeTransform(), routePlaceNameTransform(), manuscriptTransform(), latestManuscriptsTransform(), latestTraveloguesTransform(), syncTransform(), ninthPuzzleTransform(), tenthPuzzleTransform(), secondDayTransform(), secondDayAnswerBalanceTransform(), greenCorridorReviewTransform(), endingConsistencyTransform(), endingGateTransform(), secondDayMobileFixTransform(), routeMobileFixTransform(), scheduleMobileFixTransform(), firstPuzzleTransform(), customReplayTransform(), secondPuzzleTransform(), thirdPuzzleTransform(), fourthPuzzleTransform(), fifthPuzzleTransform(), sixthPuzzleTransform(), seventhPuzzleTransform(), eighthPuzzleTransform(), placeOnlyDirectoryTitleTransform(), directoryTitleTransform(), finalSyncTransform(), readingGateTransform(), guidedMapLabelTransform(), caseReadingFirstTransform(), evidenceBottomTransform(), suzuranMissingEventTransform(), caseQuestionTitleTransform(), photoCheckinTransform(), caseUiFixTransform(), fixFifthEvidenceFlowTransform(), liuchuanPlayerCleanupTransform(), firstPhotoScoringFlowTransform(), endingVisualRedesignTransform(), react()],
  base: './'
});
