const sixthPuzzleSetup = `
Object.assign(mainlineCases[5], {
  direct: false,
  pending: false,
  type: 'investigation',
  code: '警務第〇六號',
  taskTitle: '臺中市役所｜失蹤通報與追查命令',
  label: '臺中市役所',
  inputLabel: '請比對兩份官方文書後作答',
  hint: '兩份文件記錄的是同一批技術人員，但用詞、日期與追查範圍並不完全相同。請先看原始文書，再判斷哪一處變化最值得追查。',
  question: '兩份官方文書之間，有一處關鍵的敘事發生了改變。',
  questionDetails: [
    '第五站找到的經費抄本，使調查方向從工程帳目延伸到官方處理紀錄。你們在市役所相關檔案中找到一份警方受理的失蹤通報，以及數日後發布的追查命令。',
    '兩份文件看似前後承接，但案件名稱、人數記載、追查對象與引用方式之間存在細微差異。',
    '請直接比對文件三與文件四，找出官方對同一事件的描述，究竟在哪裡發生了最值得注意的變化。'
  ],
  questionHint: '先看最早的受理文件怎麼區分人員狀態，再看後續命令如何重新描述追查對象。',
  options: [
    {value: 'A', label: 'A. 兩份文件內容完全一致，後續命令只是補上工程圖面的名稱'},
    {value: 'B', label: 'B. 最初通報將六名失蹤者與另一名失聯者分開記錄，後續命令卻改以七名技術人員為同一追查對象'},
    {value: 'C', label: 'C. 最初通報已正式認定第七名技術人員竊取工程圖面，後續命令只是依判決追捕'},
    {value: 'D', label: 'D. 後續命令只追查工程圖面，沒有要求追查任何技術人員'}
  ],
  hashes: ['179eea91584636de026b4ed8405300e00d0175e85f58f08697dbf2e4c4d5c9d6'],
  evidenceHeading: '官方文書｜請比對兩份文件的日期、人數與追查對象',
  evidenceCompact: true,
  evidenceDocuments: [
    {
      title: '文件三｜警方失蹤通報',
      src: './assets/puzzles/police/missing-person-report.png',
      alt: '警方失蹤通報。請查看報案日期、正式受理日期、案件名稱及失聯或失蹤人數。'
    },
    {
      title: '文件四｜後續追查命令',
      src: './assets/puzzles/police/follow-up-order.png',
      alt: '後續追查命令。請查看命令發布日期、追查對象與引用的前一份文件。'
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
