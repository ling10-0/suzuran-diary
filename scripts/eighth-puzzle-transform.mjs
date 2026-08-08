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
  hint: '先依工作箋上的八個字在書名中逐一尋找，完成現場確認後，再開啟舊稿資料庫。',
  question: '字不在稿上，藏在書名裡。',
  questionDetails: [
    '你們在中央書局取得一張舊排字工留下的工作箋，上面只留下八個分開的字：青／木／留／下／重／要／線／索。',
    '請依順序在現場尋找書名中含有這八個字的書。每個字只需找到一本符合條件的完整書名，書籍位置不限；完成後請拍照留證，交由隊輔確認。',
    '八個字依序組成一句話。將完整句子輸入網站後，才能開啟書局舊稿資料庫。'
  ],
  questionHint: '每個字不必出現在同一本書；重點是依工作箋順序完成八個字的現場查找。',
  subQuestions: [
    {
      title: '書局找字',
      prompt: '完成八個字的書名查找並經隊輔確認後，請輸入八個字依序組成的完整句子。',
      placeholder: '請輸入完整句子',
      acceptedValues: ['青木留下重要線索'],
      submitLabel: '開啟舊稿資料庫',
      passLabel: '舊稿資料庫已開啟'
    },
    {
      title: '匿名舊稿判讀',
      prompt: '閱讀匿名文章、退稿紀錄與最後一頁殘稿後，哪一項最能解釋這份資料留下的線索，以及投稿者沒有公開身分的原因？',
      options: [
        {value: 'A', label: 'A. 投稿者只是在整理一般工程新聞，並未接觸七－圖庫或技術人員失蹤事件'},
        {value: 'B', label: 'B. 投稿者留下了七－圖庫、工程款改列與六人失蹤等證據；末頁僅留「青」字，並擔心公開身分會使協助留下資料的人一併遭追查'},
        {value: 'C', label: 'C. 投稿者已公開完整姓名，因此退稿與身分保護無關'},
        {value: 'D', label: 'D. 稿件證明六名技術人員與第七人都已安全離開臺中'}
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
      alt: '匿名文章最後一頁殘稿，末尾僅留下青字，並寫有若出面將使留下資料的人一併被找到。'
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
