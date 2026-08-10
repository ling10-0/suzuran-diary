const fifthPuzzleSetup = `
Object.assign(mainlineCases[4], {
  direct: false,
  pending: false,
  type: 'investigation',
  code: '典藏第〇五號',
  taskTitle: '臺中州立圖書館（合作金庫）',
  label: '臺中州立圖書館（合作金庫）',
  inputLabel: '請循館藏線索完成查核',
  hint: '先用第四站留下的分類號找到年報，再判斷館藏紀錄中的時間矛盾，最後直接比對掃描頁與夾藏經費抄本。',
  question: '這筆館藏紀錄的異常，究竟只是編目錯誤，還是有人刻意留下了另一套工程紀錄？',
  questionDetails: [
    '第四站留下的數字將你們帶進一份年代久遠的館藏目錄。分類號相近的工程年報看似排列正常，但其中一筆資料的出版時間、登錄時間與館藏狀態彼此對不上。',
    '找到該筆年報後，請繼續查看封面、目錄、正式工程經費頁，以及夾在封面內側的經費抄本與短箋。',
    '本關不是只找出哪一本年報，而是要確認：館藏紀錄為什麼可疑，以及正式經費頁與私下抄本之間到底差了什麼。'
  ],
  questionHint: 'Q2 看時間先後；Q3 才真正使用四張掃描圖，比對正式經費頁與夾藏抄本。',
  subQuestions: [
    {
      title:'館藏索引',
      prompt:'請輸入第四站取得的分類號尾碼，開啟對應的工程年報紀錄。',
      placeholder:'請輸入四位數',
      correctValue:'3142',
      passLabel:'館藏索引已開啟'
    },
    {
      title:'編目矛盾判讀',
      prompt:'你找到的是《臺中州地下保管設施工程年報　昭和十年度》：出版標示為昭和十一年，登錄日期卻是昭和十年十一月十九日，且被放在一般參考書庫並標記「編目修正中」。哪一項最值得追查？',
      correctValue:'B',
      options:[
        {value:'A',label:'A. 分類號是3142，所以其他欄位都可以忽略'},
        {value:'B',label:'B. 年報在標示的出版年份之前就已完成登錄，加上館藏位置與狀態異常，顯示這筆紀錄可能曾被提前建立或重新編目'},
        {value:'C',label:'C. 只要狀態寫著「編目修正中」，就代表內容一定完全錯誤'},
        {value:'D',label:'D. 一般參考書庫比土木書庫更方便閱讀，因此沒有任何可疑之處'}
      ],
      submitLabel:'確認編目矛盾',
      passLabel:'編目異常已確認'
    },
    {
      title:'經費掃描比對',
      prompt:'現在直接比對下方「正式工程經費頁」與「夾藏經費抄本與短箋」。哪一項最能說明這份抄本為何重要？',
      correctValue:'B',
      options:[
        {value:'A',label:'A. 正式頁與抄本的項目名稱、金額與備註完全一致，只是多抄了一份'},
        {value:'B',label:'B. 抄本保留了地下保管設施相關經費與藍綠色註記，但正式帳目把相關支出改列到較模糊的項目，顯示工程名稱或金流曾被重新處理'},
        {value:'C',label:'C. 抄本只記錄一般圖書採購費，和地下工程沒有關係'},
        {value:'D',label:'D. 唯一差異只是紙張顏色，因此不能支持任何進一步追查'}
      ]
    }
  ],
  evidenceAfterCorrectChoice:false,
  evidenceHeading:'數位掃描檔｜Q3請直接比對正式紀錄與夾藏抄本',
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
  hint:'先用第四站留下的分類號找到年報，再判斷館藏紀錄中的時間矛盾，最後直接比對掃描頁與夾藏經費抄本。',
  question:'這筆館藏紀錄的異常，究竟只是編目錯誤，還是有人刻意留下了另一套工程紀錄？',
  questionDetails:[
    '第四站留下的數字將你們帶進一份年代久遠的館藏目錄。分類號相近的工程年報看似排列正常，但其中一筆資料的出版時間、登錄時間與館藏狀態彼此對不上。',
    '找到該筆年報後，請繼續查看封面、目錄、正式工程經費頁，以及夾在封面內側的經費抄本與短箋。',
    '本關不是只找出哪一本年報，而是要確認：館藏紀錄為什麼可疑，以及正式經費頁與私下抄本之間到底差了什麼。'
  ],
  questionHint:'Q2 看時間先後；Q3 才真正使用四張掃描圖，比對正式經費頁與夾藏抄本。',
  subQuestions:[
    {title:'館藏索引',prompt:'請輸入第四站取得的分類號尾碼，開啟對應的工程年報紀錄。',placeholder:'請輸入四位數',correctValue:'3142',passLabel:'館藏索引已開啟'},
    {title:'編目矛盾判讀',prompt:'你找到的是《臺中州地下保管設施工程年報　昭和十年度》：出版標示為昭和十一年，登錄日期卻是昭和十年十一月十九日，且被放在一般參考書庫並標記「編目修正中」。哪一項最值得追查？',correctValue:'B',options:[
      {value:'A',label:'A. 分類號是3142，所以其他欄位都可以忽略'},
      {value:'B',label:'B. 年報在標示的出版年份之前就已完成登錄，加上館藏位置與狀態異常，顯示這筆紀錄可能曾被提前建立或重新編目'},
      {value:'C',label:'C. 只要狀態寫著「編目修正中」，就代表內容一定完全錯誤'},
      {value:'D',label:'D. 一般參考書庫比土木書庫更方便閱讀，因此沒有任何可疑之處'}
    ],submitLabel:'確認編目矛盾',passLabel:'編目異常已確認'},
    {title:'經費掃描比對',prompt:'現在直接比對下方「正式工程經費頁」與「夾藏經費抄本與短箋」。哪一項最能說明這份抄本為何重要？',correctValue:'B',options:[
      {value:'A',label:'A. 正式頁與抄本的項目名稱、金額與備註完全一致，只是多抄了一份'},
      {value:'B',label:'B. 抄本保留了地下保管設施相關經費與藍綠色註記，但正式帳目把相關支出改列到較模糊的項目，顯示工程名稱或金流曾被重新處理'},
      {value:'C',label:'C. 抄本只記錄一般圖書採購費，和地下工程沒有關係'},
      {value:'D',label:'D. 唯一差異只是紙張顏色，因此不能支持任何進一步追查'}
    ]}
  ],
  evidenceAfterCorrectChoice:false,
  evidenceHeading:'數位掃描檔｜Q3請直接比對正式紀錄與夾藏抄本',
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
