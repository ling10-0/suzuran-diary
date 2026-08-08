export function finalSyncTransform() {
  return {
    name: 'suzuran-final-sync-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;

      let next = code;

      // 最後一層保險：所有主線案件共同進度統一使用 0,1,2... 編號。
      next = next.replace(/const mainProgressId\s*=\s*index\s*=>\s*1000\s*\+\s*index\s*;/g, 'const mainProgressId=index=>index;');

      // 手機與桌機都在案件頁主內容最上方直接顯示組別、共同進度、分數與報社等級。
      // 每件共同進度 10 分；11 件滿分 110。
      const heroAnchor = '<main>\n   <section className="gazette-hero">';
      if (next.includes(heroAnchor) && !next.includes('className="journal-group-status"')) {
        next = next.replace(
          heroAnchor,
          `<main>\n   {(()=>{const syncedCount=sharedProgress===null?null:(sharedProgress||[]).filter(id=>Number.isInteger(id)&&id>=0&&id<11).length;const score=syncedCount===null?null:Math.min(110,syncedCount*10);const newsroomLevel=score===null?'計算中…':score>=90?'中央報社':score>=60?'全島報社':score>=30?'州級報社':'地方報社';return <section className="journal-group-status" aria-label="組別、共同進度與報社等級"><div><span>目前組別</span><strong>{newsroom}</strong></div><div><span>共同進度</span><strong>{syncedCount===null?'連線中…':syncedCount+' 件已同步'}</strong></div><div><span>目前分數</span><strong>{score===null?'—':score+' / 110'}</strong></div><div className="newsroom-level"><span>報社等級</span><strong>{newsroomLevel}</strong></div></section>})()}\n   <section className="gazette-hero">`,
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
