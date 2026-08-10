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
  hint: '先查看兩份橋邊紀錄，核對巡查時間、路線與居民口述，再判斷「無異常」是否足以成立。',
  question: '巡查紀錄只寫著「例行巡視，無異常」，但當晚真的沒有異常嗎？',
  questionDetails: [
    '你們來到大正橋後，取得一份當晚的巡查紀錄。紀錄中的巡視時間與路線看似完整，但橋邊居民留下的口述卻與官方記錄不完全一致。',
    '請先核對巡查員的簽到、簽退與實際巡視路線，再比較不同居民在相近時段所描述的人物與事件。',
    '找出巡查紀錄沒有說明的時間落差，判斷哪一項推論最合理。'
  ],
  questionHint: '不要只看最後一句「無異常」；注意巡查員何時離開橋面，以及居民口述中有哪些細節反覆出現。',
  options: [
    {value: 'A', label: 'A. 巡查紀錄已完整涵蓋整晚，因此居民口述應全數排除'},
    {value: 'B', label: 'B. 巡查路線存在未被覆蓋的時段；居民口述又有多項細節彼此重合，因此「無異常」不足以排除當晚曾發生攔查或衝突'},
    {value: 'C', label: 'C. 男子離開時沒有帶走紙筒，因此工程圖面應已在橋邊被取走'},
    {value: 'D', label: 'D. 居民口述可以直接證明另外六名技術人員的去向'}
  ],
  hashes: ['179eea91584636de026b4ed8405300e00d0175e85f58f08697dbf2e4c4d5c9d6'],
  evidenceHeading: '橋邊紀錄｜請核對巡查時段與居民目擊',
  evidenceCompact: true,
  evidenceDocuments: [
    {
      title: '資料一｜大正橋巡查紀錄',
      src: './assets/puzzles/taisho-bridge/patrol-log.png',
      alt: '大正橋巡查紀錄，記載巡查員的簽到、簽退時間、巡視路線以及「例行巡視，無異常」的結論。'
    },
    {
      title: '資料二｜橋邊居民口述紀錄',
      src: './assets/puzzles/taisho-bridge/resident-statements.png',
      alt: '橋邊居民口述紀錄，彙整數名居民對當晚橋邊人物與異常情況的目擊。'
    }
  ]
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
