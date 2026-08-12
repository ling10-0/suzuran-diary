const thirdPuzzleSetup = `
Object.assign(mainlineCases[2], {
  direct: false,
  pending: false,
  type: 'investigation',
  code: '巡查第〇三號',
  taskTitle: '新盛橋通、櫻橋通（中山綠橋）＋進來涼',
  directoryTitle: '新盛橋通、櫻橋通（中山綠橋）＋進來涼',
  label: '新盛橋通、櫻橋通（中山綠橋）＋進來涼',
  inputLabel: '請循線完成查核',
  hint: '先完成橋上觀察；確認現場線索後，再比對茶擔帳本與橋邊紀錄。',
  question: '青木改道之後，茶攤留下了一筆不太自然的紀錄。',
  questionDetails: [
    '店家聽說玩家正在追查「青木仙」後，想起他曾有一段時間固定在傍晚來買冬瓜茶。青木每次只買一杯，停留時間不長，但經常帶著一只長紙筒。',
    '買完冬瓜茶後，他通常會從茶攤前往中山綠橋，再由橋東方向離開。某一天，青木走到橋邊後突然折返，轉入橋西側巷道；不久後，幾名陌生男子來到茶攤詢問攜帶長紙筒男子的去向。',
    '事後，店家發現當晚其中一筆帳目曾被撕下後重新黏回。先完成橋上的現場觀察，再確認帳本與巡查紀錄之間是否對得上。'
  ],
  questionHint: '先從橋上的現場線索著手；完成後，茶擔留下的原始紀錄才會開放。',
  subQuestions: [
    {
      title: '現場勘查',
      prompt: '新盛橋上有一個象徵臺灣的圖案。請找出它，並回答這個圖案由幾個什麼形狀組成。',
      placeholder: '請輸入：X個X形',
      acceptedValues: ['2個三角形','兩個三角形','2個三角型','兩個三角型'],
      passLabel: '現場勘查完成'
    },
    {
      title: '當晚動線復原',
      prompt: '比對茶擔帳本與中山綠橋巡查／營業紀錄後，哪一項最符合青木當晚真正的行動？',
      options: [
        {value: 'A', label: 'A. 青木照常由橋東方向離開，並將長紙筒交給陌生男子'},
        {value: 'B', label: 'B. 青木察覺有人接近後折返橋西側巷道，長紙筒仍由自己帶走，帳本事後疑遭改寫'},
        {value: 'C', label: 'C. 青木在下午六時五分才抵達茶擔，之後一直留在店內'},
        {value: 'D', label: 'D. 青木當晚沒有到橋邊，陌生男子只是向店家詢問一般路況'}
      ],
      correctValue: 'B'
    }
  ],
  hashes: [
    '0f0d2131a2bdad9307a8d47d0e58bc137b1a8378428368252b7e494477662f77',
    '97b15735556e097e143a0439fd90ef34693f5f13f201aa6ae0373e91c7e8eaa0',
    '43b5d87f577992782e09be2d1c889872f20c555cb886685fdf37b3dedfe51ae8',
    '72a8d49300270420f11c13ab27fcbef664c3d4d0f98257147873664ee2a8e4eb',
    '391d5d74b56278f9d342eaa178869b5942094b7bd53f8e3283c4cf5e7568248b',
    'f12fa30eaf64739a3f195e7fa3fe32a417cec815ca9717a366b825b5e4c8c2b6'
  ],
  evidenceHeading: '留下來的紀錄｜請確認哪裡對不上',
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
      return {code: next,map:null};
    }
  };
}
