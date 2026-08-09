export function caseReadingFirstTransform() {
  return {
    name: 'suzuran-case-reading-first-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;

      const columnsStart = code.indexOf('  <div className="gazette-columns">');
      if (columnsStart === -1) return null;

      const queryStart = code.indexOf('   <section className="gazette-query">', columnsStart);
      const manuscriptStart = code.indexOf('    <section className="gazette-manuscript">', queryStart);
      if (queryStart === -1 || manuscriptStart === -1) return null;

      const columnsEnd = code.indexOf('\n  </div>\n </article>', manuscriptStart);
      if (columnsEnd === -1) return null;

      const before = code.slice(0, queryStart);
      const queryBlock = code.slice(queryStart, manuscriptStart);
      const manuscriptBlock = code.slice(manuscriptStart, columnsEnd);
      const after = code.slice(columnsEnd);

      // 案件頁固定閱讀順序：調查資料（遊記／走讀紀錄／手稿）→ 題目／原始資料／作答。
      const next = before + manuscriptBlock + queryBlock + after;
      return next === code ? null : {code: next, map: null};
    },
  };
}
