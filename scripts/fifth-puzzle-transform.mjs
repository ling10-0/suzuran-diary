const fifthPuzzleSetup = `
Object.assign(mainlineCases[4], {
  direct: false,
  pending: false,
  type: 'investigation',
  code: '典藏第〇五號',
  taskTitle: '臺中州立圖書館（合作金庫）',
  label: '臺中州立圖書館（合作金庫）',
  inputLabel: '請循館藏線索完成查核',
  hint: '第四站留下的四位數是館藏搜尋的入口。輸入正確後，請比較四筆年報的年份、登錄日期、館藏位置與狀態。',
  question: '第四站留下的數字，指向了一筆不太合理的館藏紀錄。',
  questionDetails: [
    '第四站留下的數字，將你們帶進一份年代久遠的館藏目錄。幾本工程年報的封面與登錄資料看起來幾乎相同，只有其中一本，被放在不該出現的位置。',
    '正確年報的掃描頁中，封面內側夾著一張折得很小的經費抄頁。抄頁內容與正式帳目並不完全一致，部分名稱、字跡與墨色像是後來才被改動。',
    '抄頁旁另有一張未署名短箋：「若原件日後被改，至少還有人記得它原本的樣子。」請先用第四站取得的數字進入館藏搜尋，再找出異常的年報紀錄。'
  ],
  questionHint: '先輸入上一站得到的四位數；館藏卡出現後，不要只看分類號，還要比較出版年份、登錄日期、館藏位置與狀態。',
  subQuestions: [
    {
      title: '館藏索引',
      prompt: '請輸入第四站取得的分類號尾碼，開啟工程年報館藏紀錄。',
      placeholder: '請輸入四位數',
      correctValue: '3142',
      passLabel: '館藏索引已開啟'
    },
    {
      title: '館藏紀錄判讀',
      prompt: '比較下列四筆工程年報的年份、登錄日期、館藏位置與狀態，哪一本最值得進一步翻閱？',
      options: [
        {value: 'A', label: 'A｜《臺中州道路工程年報　昭和八年度》\n出版：昭和九年（1934）｜分類號：土木／道路／3140\n登錄：昭和九年六月十二日｜土木類書庫第三架｜館內閱覽'},
        {value: 'B', label: 'B｜《臺中州河川改修工程年報　昭和九年度》\n出版：昭和十年｜分類號：土木／河川／3141\n登錄：昭和十年五月二日｜土木類書庫第三架｜館內閱覽'},
        {value: 'C', label: 'C｜《臺中州地下保管設施工程年報　昭和十年度》\n出版：昭和十一年｜分類號：土木／雜項／3142\n登錄：昭和十年十一月十九日｜一般參考書庫第二架｜編目修正中'},
        {value: 'D', label: 'D｜《臺中州建築修繕工程年報　昭和十一年度》\n出版：昭和十二年｜分類號：土木／建築／3143\n登錄：昭和十二年四月七日｜土木類書庫第四架｜館內閱覽'}
      ],
      correctValue: 'C'
    }
  ],
  hashes: ['31e9a27fe779d3a4ae56495c60e274f56ebce6d34ab94043e503d3d0a39d1173'],
  evidenceHeading: '數位掃描檔｜正確年報內頁',
  evidenceCompact: true,
  evidenceDocuments: []
});`;

export function fifthPuzzleTransform() {
  return {
    name: 'suzuran-fifth-puzzle-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      const anchor = 'const puzzles = mainlineCases;';
      if (!code.includes(anchor)) return null;
      let next = code;
      next = next.replace(/\n?Object\.assign\(mainlineCases\[4\],[\s\S]*?\n\}\);\n?/g, '\n');
      next = next.replace(anchor, fifthPuzzleSetup + '\n\n' + anchor);
      return {code: next,map:null};
    }
  };
}
