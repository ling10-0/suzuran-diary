const secondPuzzleSetup = `
Object.assign(mainlineCases[1], {
  direct: false,
  pending: false,
  type: 'investigation',
  code: '商工第〇二號',
  taskTitle: '敷島町市場（第三市場）＋榮記餅店',
  directoryTitle: '敷島町市場（第三市場）',
  label: '敷島町市場（第三市場）＋榮記餅店',
  inputLabel: '請選擇解讀出的姓氏',
  hint: '先查看兩份原始資料，依貨物交易紀錄中的訂單編號、品項與數量，對照暗碼表解讀文字。',
  question: '你解讀出的文字，對應到下列哪一個姓氏？',
  questionDetails: [
    '近期店家在整理倉庫時，找到一本年代久遠的訂貨簿，簿冊中有幾頁的字跡和其他頁面不同，紙張角落還留有藍綠色的小圈記號。',
    '根據店家長輩過去留下的說法，從前曾有一名外地男子在市場附近幫忙。他不太會說臺語，卻很會計算，也會替店家整理帳目、繪製簡單的配置圖。居民並不知道他的完整姓名，只記得大家都稱他「青木仙」。',
    '後來，有幾名陌生人來到市場詢問青木的住處與工作情況，從那之後，青木便沒有再出現在店裡。請比較貨物交易紀錄與訂貨暗碼表，找出店員暗中記錄的姓氏。'
  ],
  questionHint: '先找出被標記的三筆訂單，再依每筆的品項與數量查表。',
  options: [
    {value: 'A', label: 'A. 青木（あおき）'},
    {value: 'B', label: 'B. 赤木（あかぎ）'},
    {value: 'C', label: 'C. 青山（あおやま）'},
    {value: 'D', label: 'D. 木村（きむら）'}
  ],
  hashes: ['3cddd95f18e8e7b1bd1d364a3f7a92e622d434bf99e48bdb7baa9665dbff471b'],
  evidenceHeading: '原始資料',
  evidenceCompact: true,
  questionAfterFirstEvidence: true,
  evidenceDocuments: [
    {
      title: '資料一｜貨物交易紀錄',
      src: './assets/puzzles/third-market/goods-transaction-record.png',
      alt: '貨物交易紀錄，記載第三一號、第三二號、第三七號、第四一號、第四六號等訂單的品項、數量與備註。'
    },
    {
      title: '資料二｜敷島町市場訂貨暗碼表',
      src: './assets/puzzles/third-market/market-code-table.png',
      alt: '敷島町市場訂貨暗碼表，可依品項與數量查得對應假名。'
    }
  ]
});`;

export function secondPuzzleTransform() {
  return {
    name: 'suzuran-second-puzzle-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      const anchor = 'const puzzles = mainlineCases;';
      if (!code.includes(anchor)) return null;

      let next = code;
      next = next.replace(/\n?Object\.assign\(mainlineCases\[1\],[\s\S]*?\n\}\);\n?/g, '\n');
      next = next.replace(anchor, secondPuzzleSetup + '\n\n' + anchor);
      return {code: next, map:null};
    }
  };
}
