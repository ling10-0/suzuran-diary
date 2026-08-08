const thirdPuzzleSetup = `
Object.assign(mainlineCases[2], {
  direct: false,
  pending: false,
  type: 'investigation',
  code: '巡查第〇三號',
  taskTitle: '新盛橋通、櫻橋通（中山綠橋）＋進來涼冬瓜茶',
  label: '新盛橋通、櫻橋通（中山綠橋）＋進來涼冬瓜茶',
  inputLabel: '請選擇橋上圖案的組成方式',
  hint: '先在新盛橋上找到象徵臺灣的圖案，再比對兩份原始資料。',
  question: '新盛橋上有一個象徵臺灣的圖案。請找出它，並回答這個圖案由幾個什麼形狀組成。',
  questionDetails: [
    '店家聽說玩家正在追查「青木仙」後，想起他曾有一段時間固定在傍晚來買冬瓜茶。青木每次只買一杯，停留時間不長，但經常帶著一只長紙筒。',
    '買完冬瓜茶後，他通常會從茶攤前往中山綠橋，再由橋東方向離開。某一天，青木依照平常時間出現，走到橋邊後卻突然折返，轉入橋西側巷道。沒過多久，幾名陌生男子來到茶攤，詢問一名攜帶長紙筒的男子去了哪裡。',
    '店家沒有透露男子的去向。事後，店家發現當晚其中一筆帳目曾被撕下後重新黏回，黏貼處下方仍隱約留有原本的時間與方向字跡。請觀察橋上圖案，並比對兩份原始資料後作答。'
  ],
  questionHint: '橋上圖案需要到現場觀察；兩份文件用來補足青木當晚行動的背景。',
  options: [
    {value: 'A', label: 'A. 1 個三角形'},
    {value: 'B', label: 'B. 2 個三角形'},
    {value: 'C', label: 'C. 2 個圓形'},
    {value: 'D', label: 'D. 3 個三角形'}
  ],
  hashes: ['179eea91584636de026b4ed8405300e00d0175e85f58f08697dbf2e4c4d5c9d6'],
  evidenceHeading: '原始資料｜還原青木當晚的行動',
  evidenceCompact: true,
  evidenceDocuments: [
    {
      title: '資料一｜茶擔帳本節錄',
      src: './assets/puzzles/green-bridge/tea-ledger.png',
      alt: '茶擔帳本節錄，其中一筆紀錄曾被撕下後重新黏回，底下留有模糊的原始字跡。'
    },
    {
      title: '資料二｜中山綠橋巡查紀錄＋店家營業紀錄',
      src: './assets/puzzles/green-bridge/patrol-record.png',
      alt: '中山綠橋巡查紀錄與店家營業紀錄，記載傍晚攜帶長紙筒男子的行動及茶擔收攤時間。'
    }
  ]
});`;

export function thirdPuzzleTransform() {
  return {
    name: 'suzuran-third-puzzle-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      const anchor = 'const puzzles = mainlineCases;';
      if (!code.includes(anchor)) return null;
      let next = code;
      next = next.replace(/\n?Object\.assign\(mainlineCases\[2\],[\s\S]*?\n\}\);\n?/g, '\n');
      next = next.replace(anchor, thirdPuzzleSetup + '\n\n' + anchor);
      return {code: next, map:null};
    }
  };
}
