export function finalSyncTransform() {
  return {
    name: 'suzuran-final-sync-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;

      let next = code;

      // 共同進度邏輯直接維護在來源檔，避免建置期間再次改寫 ID 或統計公式。

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
