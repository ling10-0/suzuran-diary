function findSectionEnd(code, startIndex) {
  const tagPattern = /<\/?section\b[^>]*>/g;
  tagPattern.lastIndex = startIndex;
  let depth = 0;
  let match;

  while ((match = tagPattern.exec(code))) {
    if (match.index < startIndex) continue;
    if (match[0].startsWith('</section')) {
      depth -= 1;
      if (depth === 0) return tagPattern.lastIndex;
    } else {
      depth += 1;
    }
  }
  return -1;
}

export function caseReadingFirstTransform() {
  return {
    name: 'suzuran-case-reading-first-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;

      const columnsStart = code.indexOf('<div className="gazette-columns">');
      if (columnsStart === -1) return null;

      const queryStart = code.indexOf('<section className="gazette-query">', columnsStart);
      const manuscriptStart = code.indexOf('<section className="gazette-manuscript">', columnsStart);
      if (queryStart === -1 || manuscriptStart === -1) return null;

      const queryEnd = findSectionEnd(code, queryStart);
      const manuscriptEnd = findSectionEnd(code, manuscriptStart);
      if (queryEnd === -1 || manuscriptEnd === -1) return null;

      // 已經是調查資料在前面時，不重複處理。
      if (manuscriptStart < queryStart) return null;

      const before = code.slice(0, queryStart);
      const between = code.slice(queryEnd, manuscriptStart);
      const queryBlock = code.slice(queryStart, queryEnd);
      const manuscriptBlock = code.slice(manuscriptStart, manuscriptEnd);
      const after = code.slice(manuscriptEnd);

      // 實際 DOM 順序固定為：調查資料 → 題目／原始資料／作答。
      const next = before + manuscriptBlock + between + queryBlock + after;
      return next === code ? null : {code: next, map: null};
    },
  };
}
