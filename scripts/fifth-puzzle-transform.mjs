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
    '翻開正確年報的數位掃描檔後，封面、目錄與工程經費頁看似完整，但封面內側另夾著一張折得很小的經費抄本。',
    '抄本上的項目名稱與正式帳目並不完全一致，旁邊還留有熟悉的藍綠色筆跡與一張沒有署名的短箋。請先從館藏紀錄找出那一本不尋常的年報，再進一步翻閱掃描頁。'
  ],
  questionHint: '先輸入上一站得到的四位數；館藏卡出現後，不要只看分類號，還要比較出版年份、登錄日期、館藏位置與狀態。',
  subQuestions: [
    {title:'館藏索引',prompt:'請輸入第四站取得的分類號尾碼，開啟工程年報館藏紀錄。',placeholder:'請輸入四位數',correctValue:'3142',passLabel:'館藏索引已開啟'},
    {title:'館藏紀錄判讀',prompt:'比較下列四筆工程年報的年份、登錄日期、館藏位置與狀態，哪一本最值得進一步翻閱？',correctValue:'C',options:[
      {value:'A',label:'A｜《臺中州道路工程年報　昭和八年度》\\n出版：昭和九年（1934）｜分類號：土木／道路／3140\\n登錄：昭和九年六月十二日｜土木類書庫第三架｜館內閱覽'},
      {value:'B',label:'B｜《臺中州河川改修工程年報　昭和九年度》\\n出版：昭和十年｜分類號：土木／河川／3141\\n登錄：昭和十年五月二日｜土木類書庫第三架｜館內閱覽'},
      {value:'C',label:'C｜《臺中州地下保管設施工程年報　昭和十年度》\\n出版：昭和十一年｜分類號：土木／雜項／3142\\n登錄：昭和十年十一月十九日｜一般參考書庫第二架｜編目修正中'},
      {value:'D',label:'D｜《臺中州建築修繕工程年報　昭和十一年度》\\n出版：昭和十二年｜分類號：土木／建築／3143\\n登錄：昭和十二年四月七日｜土木類書庫第四架｜館內閱覽'}
    ]}
  ],
  hashes:['96b1f4e6d8cd3503a69066b208f015d8cb93639fa2637ac08af666df056b191f'],
  evidenceAfterCorrectChoice:true,
  evidenceHeading:'數位掃描檔｜請比對正式紀錄與夾藏抄本',
  evidenceCompact:true,
  evidenceDocuments:[
    {title:'掃描一｜工程年報封面',src:'./assets/puzzles/library/annual-report-cover.png',alt:'臺中州地下保管設施工程年報昭和十年度封面。'},
    {title:'掃描二｜年報目錄',src:'./assets/puzzles/library/annual-report-contents.png',alt:'工程年報目錄。'},
    {title:'掃描三｜正式工程經費頁',src:'./assets/puzzles/library/expense-page.png',alt:'正式工程經費明細。'},
    {title:'掃描四｜夾藏經費抄本與短箋',src:'./assets/puzzles/library/expense-copy-note.png',alt:'夾藏的經費抄本與短箋。'}
  ]
});`;

const fifthPuzzleObject = `
const fifthLibraryCase = mainlineCases.find(item => item.label === '合作金庫舊址' || item.taskTitle === '合作金庫');
if (fifthLibraryCase) Object.assign(fifthLibraryCase, {
  direct:false,
  pending:false,
  type:'investigation',
  code:'典藏第〇五號',
  taskTitle:'臺中州立圖書館（合作金庫）',
  label:'臺中州立圖書館（合作金庫）',
  inputLabel:'請循館藏線索完成查核',
  hint:'第四站留下的四位數是館藏搜尋的入口。輸入正確後，請比較四筆年報的年份、登錄日期、館藏位置與狀態。',
  question:'第四站留下的數字，指向了一筆不太合理的館藏紀錄。',
  questionDetails:[
    '第四站留下的數字，將你們帶進一份年代久遠的館藏目錄。幾本工程年報的封面與登錄資料看起來幾乎相同，只有其中一本，被放在不該出現的位置。',
    '翻開正確年報的數位掃描檔後，封面、目錄與工程經費頁看似完整，但封面內側另夾著一張折得很小的經費抄本。',
    '抄本上的項目名稱與正式帳目並不完全一致，旁邊還留有熟悉的藍綠色筆跡與一張沒有署名的短箋。請先從館藏紀錄找出那一本不尋常的年報，再進一步翻閱掃描頁。'
  ],
  questionHint:'先輸入上一站得到的四位數；館藏卡出現後，不要只看分類號，還要比較出版年份、登錄日期、館藏位置與狀態。',
  subQuestions:[
    {title:'館藏索引',prompt:'請輸入第四站取得的分類號尾碼，開啟工程年報館藏紀錄。',placeholder:'請輸入四位數',correctValue:'3142',passLabel:'館藏索引已開啟'},
    {title:'館藏紀錄判讀',prompt:'比較下列四筆工程年報的年份、登錄日期、館藏位置與狀態，哪一本最值得進一步翻閱？',correctValue:'C',options:[
      {value:'A',label:'A｜《臺中州道路工程年報　昭和八年度》\\n出版：昭和九年（1934）｜分類號：土木／道路／3140\\n登錄：昭和九年六月十二日｜土木類書庫第三架｜館內閱覽'},
      {value:'B',label:'B｜《臺中州河川改修工程年報　昭和九年度》\\n出版：昭和十年｜分類號：土木／河川／3141\\n登錄：昭和十年五月二日｜土木類書庫第三架｜館內閱覽'},
      {value:'C',label:'C｜《臺中州地下保管設施工程年報　昭和十年度》\\n出版：昭和十一年｜分類號：土木／雜項／3142\\n登錄：昭和十年十一月十九日｜一般參考書庫第二架｜編目修正中'},
      {value:'D',label:'D｜《臺中州建築修繕工程年報　昭和十一年度》\\n出版：昭和十二年｜分類號：土木／建築／3143\\n登錄：昭和十二年四月七日｜土木類書庫第四架｜館內閱覽'}
    ]}
  ],
  evidenceAfterCorrectChoice:true,
  evidenceHeading:'數位掃描檔｜請比對正式紀錄與夾藏抄本',
  evidenceCompact:true,
  evidenceDocuments:[
    {title:'掃描一｜工程年報封面',src:'./assets/puzzles/library/annual-report-cover.png',alt:'臺中州地下保管設施工程年報昭和十年度封面。'},
    {title:'掃描二｜年報目錄',src:'./assets/puzzles/library/annual-report-contents.png',alt:'工程年報目錄。'},
    {title:'掃描三｜正式工程經費頁',src:'./assets/puzzles/library/expense-page.png',alt:'正式工程經費明細。'},
    {title:'掃描四｜夾藏經費抄本與短箋',src:'./assets/puzzles/library/expense-copy-note.png',alt:'夾藏的經費抄本與短箋。'}
  ]
});`;

export function fifthPuzzleTransform(){
  return {
    name:'suzuran-fifth-puzzle-transform',
    enforce:'pre',
    transform(code,id){
      if(id.endsWith('/src/mainlineCases.js')){
        if(code.includes('const fifthLibraryCase =')) return null;
        const sourceAnchor='mainlineCases.forEach((item,index)=>{item.mainland=mainlandManuscripts[item.mainlandIndex??index]||item.travel||[]});';
        if(!code.includes(sourceAnchor)) return null;
        return {code:code.replace(sourceAnchor,fifthPuzzleObject+'\n\n'+sourceAnchor),map:null};
      }
      if(!id.endsWith('/src/main.jsx')) return null;
      const anchor='const puzzles = mainlineCases;';
      if(!code.includes(anchor)) return null;
      let next=code;
      next=next.replace(/\n?Object\.assign\(mainlineCases\[4\],[\s\S]*?\n\}\);\n?/g,'\n');
      next=next.replace(anchor,fifthPuzzleSetup+'\n\n'+anchor);
      return {code:next,map:null};
    }
  };
}
