const sixthPuzzleSetup = `
Object.assign(mainlineCases[5], {
  direct: false,
  pending: false,
  type: 'investigation',
  code: '警務第〇六號',
  taskTitle: '失蹤通報與後續追查命令',
  label: '失蹤通報與後續追查命令',
  inputLabel: '請比對兩份官方文書後作答',
  hint: '不要只看最後的追查命令；先確認警方最初受理時記錄的人數、名稱與日期，再比較後續命令如何描述同一批技術人員。',
  question: '同一批技術人員，在兩份官方文書中被寫成了不同的故事。',
  questionDetails: [
    '第五站找到的經費抄本顯示，第七號技手不只追查工程圖，也曾追查相關經費的改列情形。調查繼續往官方文書延伸後，你們找到一份警方失蹤通報，以及稍後發布的追查命令。',
    '警方失蹤通報記錄六名技術人員失蹤，第七名技術人員則為失去聯絡；後續追查命令卻將七名技術人員與失蹤工程圖面一併列為追查對象。',
    '請仔細比對兩份文件的報案／受理日期、失聯人數、案件名稱，以及後續命令引用的前一份文件，判斷哪個變化最值得追查。'
  ],
  questionHint: '重點不是單獨找日期，而是看「最初怎麼記錄」與「後來怎麼定義」是否一致。',
  options: [
    {value: 'A', label: 'A. 兩份文件內容完全一致，只是後續命令補上了工程圖面名稱'},
    {value: 'B', label: 'B. 最初通報區分「六人失蹤」與「第七人失聯」，後續命令卻把七人一併視為同一追查事件，顯示官方說法曾被重新整理'},
    {value: 'C', label: 'C. 第七名技術人員在警方受理前就已被正式認定為竊圖者'},
    {value: 'D', label: 'D. 後續命令只要求尋找工程圖面，並未追查任何技術人員'}
  ],
  hashes: ['179eea91584636de026b4ed8405300e00d0175e85f58f08697dbf2e4c4d5c9d6'],
  evidenceHeading: '官方文書｜請比對最初通報與後續追查內容',
  evidenceCompact: true,
  evidenceDocuments: [
    {
      title: '文件三｜警方失蹤通報',
      src: './assets/puzzles/police/missing-person-report.png',
      alt: '警方失蹤通報，記錄報案日期、正式受理日期、六名技術人員失蹤與第七名技術人員失去聯絡等資料。'
    },
    {
      title: '文件四｜後續追查命令',
      src: './assets/puzzles/police/follow-up-order.png',
      alt: '後續追查命令，要求各單位查找七名技術人員及失蹤工程圖面，並引用前一份警方文件。'
    }
  ]
});`;

export function sixthPuzzleTransform() {
  return {
    name: 'suzuran-sixth-puzzle-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      const anchor = 'const puzzles = mainlineCases;';
      if (!code.includes(anchor)) return null;
      let next = code;
      next = next.replace(/\n?Object\.assign\(mainlineCases\[5\],[\s\S]*?\n\}\);\n?/g, '\n');
      next = next.replace(anchor, sixthPuzzleSetup + '\n\n' + anchor);
      return {code: next,map:null};
    }
  };
}
