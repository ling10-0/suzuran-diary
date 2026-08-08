const seventhPuzzleSetup = `
Object.assign(mainlineCases[6], {
  direct: false,
  pending: false,
  type: 'investigation',
  code: '巡查第〇七號',
  taskTitle: '大正橋通（民權綠橋）',
  directoryTitle: '大正橋通（民權綠橋）',
  label: '大正橋通（民權綠橋）',
  inputLabel: '請比對巡查紀錄與居民口述後作答',
  hint: '先核對巡查員的簽到時間與步行路線，再比較居民口述中重複出現的人物特徵。',
  question: '巡查紀錄只寫著「例行巡視，無異常」，但當晚真的沒有異常嗎？',
  questionDetails: [
    '你們來到大正橋後，取得一份當晚的巡查紀錄。紀錄只留下「例行巡視，無異常」幾個字。',
    '橋邊居民的說法卻不完全一致：有人曾看見一名抱著長紙筒的男子被幾名陌生人攔下，也有人注意到男子離開時左袖破損、鞋褲沾水，手中的紙筒仍在。',
    '請比對巡查員簽到時間、實際步行路線與居民口述，找出巡查紀錄沒有覆蓋的時段，再判斷哪一項推論最合理。'
  ],
  questionHint: '注意巡查時間是否真的能涵蓋居民目擊的那一段，以及不同居民是否描述了相同特徵。',
  options: [
    {value: 'A', label: 'A. 巡查紀錄已完整涵蓋整晚，因此居民口述應全數排除'},
    {value: 'B', label: 'B. 巡查路線存在未被覆蓋的時段；居民又共同提到長紙筒與受損衣袖等特徵，因此「無異常」並不足以排除當晚曾發生攔查或衝突'},
    {value: 'C', label: 'C. 男子離開時沒有帶走紙筒，因此工程圖面應已在橋邊被取走'},
    {value: 'D', label: 'D. 居民口述可以直接證明另外六名技術人員的去向'}
  ],
  hashes: ['97b15735556e097e143a0439fd90ef34693f5f13f201aa6ae0373e91c7e8eaa0'],
  evidenceHeading: '橋邊紀錄｜請核對巡查時段與居民目擊',
  evidenceCompact: true
});`;

export function seventhPuzzleTransform() {
  return {
    name: 'suzuran-seventh-puzzle-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      const anchor = 'const puzzles = mainlineCases;';
      if (!code.includes(anchor)) return null;
      let next = code;
      next = next.replace(/\n?Object\.assign\(mainlineCases\[6\],[\s\S]*?\n\}\);\n?/g, '\n');
      next = next.replace(anchor, seventhPuzzleSetup + '\n\n' + anchor);
      return {code: next,map:null};
    }
  };
}
