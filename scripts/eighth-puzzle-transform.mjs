const eighthPuzzleSetup = `
Object.assign(mainlineCases[7], {
  direct: false,
  pending: false,
  type: 'investigation',
  code: '文教第〇八號',
  taskTitle: '中央書局',
  directoryTitle: '中央書局',
  label: '中央書局',
  inputLabel: '請循線完成書局查核',
  hint: '把十五個字拆開，在十五本不同書的書名中逐字找到；拍滿十五本後交給隊輔確認，再輸入通關密碼。',
  question: '一句不敢直接寫下來的話，被拆散藏進了十五本書名裡。',
  questionDetails: [
    '你們在中央書局取得一張舊排字工留下的工作箋。上面不是完整句子，而是十五個依序排列的字：我／若／出／面／留／下／資／料／的／人／也／會／被／找／到。',
    '請依順序在現場尋找十五本不同的書，每一本書的完整書名中都必須包含指定的那一個字；一個字對應一本書，所以總共要找到十五本。',
    '每找到一本就拍下能清楚看見書名的照片。集滿十五張後交由隊輔逐張檢查；確認全部符合後，隊輔會告訴你們網站通關密碼。'
  ],
  questionHint: '同一本書不能重複代替兩個字；照片必須能辨識完整書名與指定字。',
  subQuestions: [
    {
      title: '十五字書名採集',
      prompt: '依「我若出面留下資料的人也會被找到」的十五個字，找到十五本不同書籍並完成十五張照片。經隊輔確認後，請輸入隊輔提供的通關密碼。',
      placeholder: '請輸入隊輔通關密碼',
      acceptedValues: ['ok','OK','Ok','ＯＫ','ｏｋ'],
      submitLabel: '開啟舊稿資料庫',
      passLabel: '十五本書已確認・舊稿資料庫開啟'
    },
    {
      title: '匿名舊稿判讀',
      prompt: '閱讀匿名文章、退稿紀錄與最後一頁殘稿後，哪一項最能解釋這十五個字真正指向的風險？',
      options: [
        {value: 'A', label: 'A. 投稿者只是擔心自己的文章寫得不夠好，所以沒有署名'},
        {value: 'B', label: 'B. 投稿者掌握七－圖庫、工程款改列與失蹤事件的資料；若本人公開出面，協助保存與傳遞資料的人也可能一起被追查'},
        {value: 'C', label: 'C. 投稿者已公開完整姓名，因此十五字訊息只是排字練習'},
        {value: 'D', label: 'D. 這些資料已被官方完整公開，所以沒有保護資料提供者的必要'}
      ],
      correctValue: 'B'
    }
  ],
  evidenceHeading: '舊稿資料庫｜請比對三份被留下的文件',
  evidenceCompact: true,
  evidenceDocuments: [
    {
      title: '資料一｜匿名文章',
      src: './assets/puzzles/central-bookstore/anonymous-article.png',
      alt: '中央書局舊稿資料庫中的匿名文章，內容涉及七－圖庫、工程款改列、六名技術人員失去行蹤及攜帶圖面離開的第七人。'
    },
    {
      title: '資料二｜退稿紀錄',
      src: './assets/puzzles/central-bookstore/rejection-record.png',
      alt: '中央書局退稿紀錄，記載匿名稿件在付印前被撤下，並提及稿件內容敏感及可能暴露資料提供者。'
    },
    {
      title: '資料三｜最後一頁殘稿',
      src: './assets/puzzles/central-bookstore/final-fragment.png',
      alt: '匿名文章最後一頁殘稿，寫有「我若出面，留下資料的人也會被找到」的意思。'
    }
  ]
});`;

export function eighthPuzzleTransform() {
  return {
    name: 'suzuran-eighth-puzzle-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      const anchor = 'const puzzles = mainlineCases;';
      if (!code.includes(anchor)) return null;
      let next = code;
      next = next.replace(/\n?Object\.assign\(mainlineCases\[7\],[\s\S]*?\n\}\);\n?/g, '\n');
      next = next.replace(anchor, eighthPuzzleSetup + '\n\n' + anchor);
      return {code: next,map:null};
    }
  };
}
