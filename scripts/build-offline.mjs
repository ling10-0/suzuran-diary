import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');
const outputDir = path.join(projectRoot, 'offline-package');
const gameDir = path.join(outputDir, 'game');
const offlineSourceDir = path.join(projectRoot, 'offline');

if (!existsSync(distDir)) {
  throw new Error('dist/ 不存在，請先執行 Vite build。');
}

rmSync(outputDir, {recursive: true, force: true});
mkdirSync(outputDir, {recursive: true});
cpSync(distDir, gameDir, {recursive: true});

// Hosting-only files are unnecessary in the portable archive.
rmSync(path.join(gameDir, 'server'), {recursive: true, force: true});
rmSync(path.join(gameDir, '.openai'), {recursive: true, force: true});

for (const fileName of ['啟動遊戲.bat', 'offline-server.ps1', 'README.txt']) {
  cpSync(path.join(offlineSourceDir, fileName), path.join(outputDir, fileName));
}
cpSync(
  path.join(offlineSourceDir, 'offline-map-tile.svg'),
  path.join(gameDir, 'offline-map-tile.svg'),
);
cpSync(
  path.join(offlineSourceDir, 'offline-ui.css'),
  path.join(gameDir, 'offline-ui.css'),
);

// Keep the game UI identical to the web build. The only offline-specific visual
// is a tiny unobtrusive reset control layered on top of the normal page.
const offlineIndexPath = path.join(gameDir, 'index.html');
let offlineIndex = readFileSync(offlineIndexPath, 'utf8');
if (!offlineIndex.includes('./offline-ui.css')) {
  offlineIndex = offlineIndex.replace(
    '</head>',
    '    <link rel="stylesheet" href="./offline-ui.css" />\n  </head>',
  );
  writeFileSync(offlineIndexPath, offlineIndex, 'utf8');
}

// The normal web version uses OpenStreetMap. For the archive, replace that
// network tile source with the bundled neutral tile so the route map still
// works without an internet connection.
const osmTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const offlineTileUrl = './offline-map-tile.svg';
let tileReplacements = 0;

function rewriteOfflineAssets(directory) {
  for (const entry of readdirSync(directory)) {
    const filePath = path.join(directory, entry);
    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      rewriteOfflineAssets(filePath);
      continue;
    }
    if (!/\.(?:js|mjs|html|css)$/i.test(entry)) continue;

    const source = readFileSync(filePath, 'utf8');
    if (!source.includes(osmTileUrl)) continue;
    const occurrences = source.split(osmTileUrl).length - 1;
    writeFileSync(filePath, source.split(osmTileUrl).join(offlineTileUrl), 'utf8');
    tileReplacements += occurrences;
  }
}

rewriteOfflineAssets(gameDir);

const version = [
  '翻閱1938：那些待續的章節｜單機展示版',
  `Built: ${new Date().toISOString()}`,
  `Source commit: ${process.env.GITHUB_SHA || 'local-build'}`,
  `Offline map replacements: ${tileReplacements}`,
  '',
  '啟動方式：完整解壓縮後，雙擊「啟動遊戲.bat」。',
].join('\n');
writeFileSync(path.join(outputDir, 'VERSION.txt'), version, 'utf8');

console.log(`Offline package ready: ${path.relative(projectRoot, outputDir)}`);
console.log(`OpenStreetMap tile replacements: ${tileReplacements}`);
