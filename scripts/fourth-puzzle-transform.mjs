const fourthPuzzleSetup = `
Object.assign(mainlineCases[3], {
  direct: false,
  pending: false,
  type: 'investigation',
  code: '商工第〇四號',
  taskTitle: '原精養軒／臺灣拓殖株式會社臺中出張所',
  label: '原精養軒／臺灣拓殖株式會社臺中出張所',
  inputLabel: '請循線完成查核',
  hint: '先確認建築後來的機構用途；完成後，再比對當晚留下的接待、廚房與值班紀錄。',
  question: '青木離開精養軒前，留下了兩組彼此矛盾的紀錄。',
  questionDetails: [
    '第三站的追查紀錄顯示，調查者在新盛橋附近失去青木的行蹤，之後轉往南園一帶確認他的落腳處。',
    '玩家抵達原精養軒後，從建築改作臺灣拓殖株式會社臺中出張所時留下的清點資料中，找到一冊舊接待簿、數張送菜單與一份跑堂值班筆記。',
    '接待簿、廚房清點與值班筆記對同一晚的離店時間與出口記載並不一致。請先確認這棟建築後來的用途，再進一步還原當晚的實際動線與被留下的分類線索。'
  ],
  questionHint: '先從建築沿革著手；完成場域查核後，新的原始資料才會開放。',
  subQuestions: [
    {
      title: '場域查核',
      prompt: '精養軒所在建築後來曾作為哪種機構？',
      options: [
        {value: 'A', label: 'A. 出張所'},
        {value: 'B', label: 'B. 州立圖書館'},
        {value: 'C', label: 'C. 警察派出所'},
        {value: 'D', label: 'D. 郵便局'}
      ],
      correctValue: 'A',
      buttonLabel: '確認場域查核',
      passLabel: '場域查核完成'
    },
    {
      title: '當晚紀錄復原',
      prompt: '比對接待簿、廚房清點表與跑堂值班筆記，再依「先湯、再主食、最後甜點」與送出時間還原四張送菜單順序。將四個桌次記號填入轉交便條後，請輸入州立圖書館工程年報的分類號尾碼。',
      placeholder: '請輸入四位數分類號尾碼',
      correctValue: '3142'
    }
  ],
  evidenceHeading: '留下來的紀錄｜請找出彼此矛盾之處',
  evidenceCompact: true,
  evidenceDocuments: [
    {
      title: '資料一｜接待簿',
      src: './assets/puzzles/seiyoken/reception-ledger.png',
      alt: '精養軒接待簿，其中青先生的離店時間與離開方向欄有重新描寫的痕跡。'
    },
    {
      title: '資料二｜廚房清點表',
      src: './assets/puzzles/seiyoken/kitchen-checklist.png',
      alt: '廚房清點表，記錄最後送菜、配膳通道開啟及完成清點的時間。'
    },
    {
      title: '資料三｜跑堂值班筆記',
      src: './assets/puzzles/seiyoken/waiter-duty-note.png',
      alt: '跑堂值班筆記，記載一名攜帶長紙筒且未入席的男子由配膳通道離開。'
    },
    {
      title: '資料四｜送菜單與轉交便條',
      src: './assets/puzzles/seiyoken/delivery-slips.png',
      alt: '四張送菜單與未完成轉交便條，可依料理順序與送出時間還原分類號尾碼。'
    }
  ]
});`;

export function fourthPuzzleTransform() {
  return {
    name: 'suzuran-fourth-puzzle-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      const anchor = 'const puzzles = mainlineCases;';
      if (!code.includes(anchor)) return null;
      let next = code;
      next = next.replace(/\n?Object\.assign\(mainlineCases\[3\],[\s\S]*?\n\}\);\n?/g, '\n');
      next = next.replace(anchor, fourthPuzzleSetup + '\n\n' + anchor);
      return next===code?null:{code:next,map:null};
    }
  };
}
