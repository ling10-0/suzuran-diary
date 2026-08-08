const secondPuzzleSetup = `
Object.assign(mainlineCases[1], {
  direct: false,
  pending: false,
  type: 'investigation',
  code: '商工第〇二號',
  taskTitle: '敷島町市場（第三市場）＋榮記餅店',
  label: '敷島町市場（第三市場）＋榮記餅店',
  inputLabel: '請選擇解讀出的姓氏',
  hint: '依訂貨簿中的品項與數量查表，將三個假名依序拼起來。',
  question: '你解讀出的文字，對應到下列哪一個姓氏？',
  questionDetails: [
    '近期店家整理倉庫時，找到一本年代久遠的訂貨簿。部分頁面的字跡與其他頁不同，紙張角落還留有藍綠色的小圈記號。',
    '店家長輩曾提過，一名被稱作「青木仙」的外地男子會替市場店家計算、整理帳目，也會繪製簡單配置圖。後來有陌生人到市場詢問他的住處，此人便不再出現。',
    '店員似乎利用品項與數量，暗中記錄了某個人的名字。請依序查表：第三一號「布匹＋1」→ あ；第三七號「布匹＋5」→ お；第四六號「砂糖＋2」→ き。將三個假名拼起來後，選出對應姓氏。'
  ],
  questionHint: '依序讀出「あ」「お」「き」。',
  options: [
    {value: 'A', label: 'A. 青木（あおき）'},
    {value: 'B', label: 'B. 赤木（あかぎ）'},
    {value: 'C', label: 'C. 青山（あおやま）'},
    {value: 'D', label: 'D. 木村（きむら）'}
  ],
  hashes: ['3cddd95f18e8e7b1bd1d364a3f7a92e622d434bf99e48bdb7baa9665dbff471b']
});`;

export function secondPuzzleTransform() {
  return {
    name: 'suzuran-second-puzzle-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      if (code.includes("taskTitle: '敷島町市場（第三市場）＋榮記餅店'")) return null;
      const anchor = 'const puzzles = mainlineCases;';
      if (!code.includes(anchor)) return null;
      return {code: code.replace(anchor, secondPuzzleSetup + '\n\n' + anchor), map:null};
    }
  };
}
