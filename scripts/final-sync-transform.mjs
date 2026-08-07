export function finalSyncTransform() {
  return {
    name: 'suzuran-final-sync-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;

      let next = code;

      // 最後一層保險：所有主線案件共同進度統一使用 0,1,2... 編號。
      next = next.replace(/const mainProgressId\s*=\s*index\s*=>\s*1000\s*\+\s*index\s*;/g, 'const mainProgressId=index=>index;');

      // 手機與桌機都在案件頁主內容最上方直接顯示組別與同步件數。
      const heroAnchor = '<main>\n   <section className="gazette-hero">';
      if (next.includes(heroAnchor) && !next.includes('className="journal-group-status"')) {
        next = next.replace(
          heroAnchor,
          `<main>\n   <section className="journal-group-status" aria-label="組別與共同進度"><div><span>目前組別</span><strong>{newsroom}</strong></div><div><span>共同進度</span><strong>{sharedProgress===null?'連線中…':((sharedProgress||[]).filter(id=>Number.isInteger(id)&&id>=0&&id<puzzles.length).length+' 件已同步')}</strong></div></section>\n   <section className="gazette-hero">`,
        );
      }

      // 原案件說明右側也保留組別，不再使用「報社」舊稱。
      next = next.replace(
        /<span>所屬(?:報社|組別)：\{newsroom\}<br\/>解謎進度由同組(?:共用|跨手機共用)<\/span>/g,
        '<span>所屬組別：{newsroom}<br/>解謎進度由同組跨手機共用</span>',
      );

      // 暫時移除所有關卡內的「現場短對話／採訪筆記」。保留原始資料內容，之後需要可再開回來。
      next = next.replace(
        /\{document\.dialogue\?\.length>0&&<section className="travel-dialogue case-dialogue"[\s\S]*?<\/section>\}\n?/g,
        '',
      );
      next = next.replace(
        /\{quest\.dialogue\?\.length>0&&<section className="travel-dialogue"[\s\S]*?<\/section>\}/g,
        '',
      );

      return next === code ? null : {code: next, map: null};
    },
  };
}
