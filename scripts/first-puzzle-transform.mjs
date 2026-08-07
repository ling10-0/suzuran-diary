const firstPuzzleSetup = `

Object.assign(mainlineCases[0], {
  direct: false,
  pending: false,
  type: 'investigation',
  code: '庶務秘第〇一號',
  taskTitle: '沒有名字的技術人員',
  inputLabel: '請選擇最值得追查的線索',
  hint: '比對工程圖封套與工程人員名冊，找出兩份資料之間最不尋常的共同點。',
  question: '比對兩份資料後，哪一項最值得繼續追查？',
  questionDetails: [
    '近期整理工場舊資料時，工作人員發現一只空的工程圖封套，以及一份殘缺的工程人員名冊。',
    '封套中的圖稿已不見，只剩襯紙；借用人姓名遭墨水覆蓋。工程人員名冊共列七人，第七人的姓名也遭塗黑。請仔細查看兩張原始資料。'
  ],
  questionHint: '注意兩份資料中被遮蔽的姓名、職務內容，以及重複出現的標記。',
  options: [
    {value: 'A', label: 'A. 工程共有七名技術人員'},
    {value: 'B', label: 'B. 第七名技術人員的姓名遭遮蔽，且工作內容與工程圖借用人相符'},
    {value: 'C', label: 'C. 工程圖封套已經老化'},
    {value: 'D', label: 'D. 封套內只剩保護圖紙使用的襯紙'}
  ],
  hashes: ['179eea91584636de026b4ed8405300e00d0175e85f58f08697dbf2e4c4d5c9d6'],
  evidenceDocuments: [
    {
      title: '資料一｜工程圖封套',
      src: './assets/puzzles/1916/engineering-envelope.png',
      alt: '工程圖封套。標示七-圖庫地下工程圖，借用人姓名被塗黑，職務為測量、製圖、現場複核。'
    },
    {
      title: '資料二｜工程人員名冊',
      src: './assets/puzzles/1916/engineer-roster.png',
      alt: '工程人員名冊。共有七名技術人員，第七人姓名被塗黑，職務為測量、製圖、現場複核，旁有藍綠色記號。'
    }
  ]
});`;

const evidenceMarkup = `{item.evidenceDocuments?.length>0&&<section className="case-evidence-documents" aria-label="案件原始資料">
     <header><small>EVIDENCE / 原始資料</small><h4>請放大檢視兩份文件</h4><p>手機可點擊圖片開啟原尺寸查看細節，再返回此頁作答。</p></header>
     <div className="case-evidence-grid">
      {item.evidenceDocuments.map((evidence,evidenceIndex)=><figure className="case-evidence-card" key={evidence.src}>
       <figcaption><b>{evidence.title}</b><span>點圖放大 ↗</span></figcaption>
       <a href={evidence.src} target="_blank" rel="noreferrer" aria-label={'放大查看'+evidence.title}>
        <img src={evidence.src} alt={evidence.alt} loading="lazy"/>
       </a>
      </figure>)}
     </div>
    </section>}`;

const answerMarkup = `{!item.direct&&!item.pending&&!solved&&<form onSubmit={submit}><label htmlFor={'case-'+index}>{item.inputLabel}</label>{item.options?.length
     ?<div className="case-choice-list" id={'case-'+index}>{item.options.map(option=><label className={'case-choice '+(value===option.value?'is-selected':'')} key={option.value}><input type="radio" name={'case-choice-'+index} value={option.value} checked={value===option.value} onChange={event=>{setValue(event.target.value);setError(false)}}/><span>{option.label}</span></label>)}</div>
     :<div><input id={'case-'+index} value={value} onChange={event=>{setValue(event.target.value);setError(false)}} placeholder={'請輸入'+item.inputLabel}/></div>}<button className="case-submit-choice" type="submit" disabled={item.options?.length&&!value}>送交查核</button>{error&&<small>登記內容不符，請重新確認現場線索。</small>}</form>}`;

export function firstPuzzleTransform() {
  return {
    name: 'suzuran-first-puzzle-transform',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('/src/mainlineCases.js')) {
        const marker = "mainlineCases.forEach((item,index)=>{item.mainland=mainlandManuscripts[item.mainlandIndex??index]||item.travel||[]});";
        if (!code.includes(marker)) return null;
        return {code: code.replace(marker, marker + firstPuzzleSetup), map: null};
      }

      if (id.endsWith('/src/main.jsx')) {
        let next = code;
        if (!next.includes("import './first-puzzle.css';")) {
          next = next.replace("import './newspaper.css';", "import './newspaper.css';\nimport './first-puzzle.css';");
        }

        const evidenceAnchor = "{item.direct&&<p className=\"gazette-approved\">本件無須輸入答案，可直接對照兩種城市記錄。</p>}";
        if (next.includes(evidenceAnchor) && !next.includes('case-evidence-documents')) {
          next = next.replace(evidenceAnchor, evidenceMarkup + '\n    ' + evidenceAnchor);
        }

        const oldForm = `{!item.direct&&!item.pending&&!solved&&<form onSubmit={submit}><label htmlFor={'case-'+index}>{item.inputLabel}</label><div><input id={'case-'+index} value={value} onChange={event=>{setValue(event.target.value);setError(false)}} placeholder={'請輸入'+item.inputLabel}/><button type="submit">送交查核</button></div>{error&&<small>登記內容不符，請重新確認現場線索。</small>}</form>}`;
        if (next.includes(oldForm)) next = next.replace(oldForm, answerMarkup);

        return next===code?null:{code:next,map:null};
      }
      return null;
    }
  };
}
