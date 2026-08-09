const directoryPlaceTitles = [
  '1916工坊',
  '敷島町市場（第三市場）',
  '新盛橋通、櫻橋通',
  '精養軒',
  '臺中州立圖書館',
  '臺中市役所',
  '大正橋通',
  '中央書局',
  '柳川',
  '新富町市場（第二市場）',
  '臺中驛鐵道路廊'
];

export function directoryTitleTransform() {
  return {
    name: 'suzuran-directory-title-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      let next = code;
      if (!next.includes("import './directory-mobile.css';")) {
        next = next.replace("import './newspaper.css';", "import './newspaper.css';\nimport './directory-mobile.css';");
      }

      const target = '<h3>{item.taskTitle}</h3>';
      const legacyTarget = '<h3>{item.directoryTitle||item.taskTitle}</h3>';
      const forcedTitle = `<h3>{${JSON.stringify(directoryPlaceTitles)}[item.index]||item.directoryTitle||item.taskTitle}</h3>`;

      if (next.includes(target)) next = next.split(target).join(forcedTitle);
      if (next.includes(legacyTarget)) next = next.split(legacyTarget).join(forcedTitle);

      return next===code?null:{code:next,map:null};
    }
  };
}
