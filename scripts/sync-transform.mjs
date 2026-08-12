// Shared-progress behavior now lives in src/main.jsx and src/sharedProgress.js.
// Keep this plugin as a no-op so older Vite configuration remains compatible
// without silently rewriting progress IDs during production builds.
export function syncTransform() {
  return {
    name: 'suzuran-sync-transform',
    transform() {
      return null;
    },
  };
}
