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

const evidenceMarkup = `{item.evidenceDocuments?.length>0&&(!item.subQuestions?.length||subStep>=1)&&(!item.evidenceAfterCorrectChoice||(value.split('|||')[1]||'')===item.subQuestions?.[1]?.correctValue)&&<section className={'case-evidence-documents '+(item.evidenceCompact?'is-compact':'')} aria-label="案件原始資料">
     <header>{!item.evidenceCompact&&<small>EVIDENCE / 原始資料</small>}<h4>{item.evidenceHeading||'請放大檢視兩份文件'}</h4><p>手機可點擊圖片開啟原尺寸查看細節，再返回此頁作答。</p></header>
     <div className="case-evidence-grid">
      {item.evidenceDocuments.map((evidence,evidenceIndex)=><figure className="case-evidence-card" key={evidence.src}>
       <figcaption>{item.evidenceCompact?<b className="evidence-title-split"><small>{evidence.title.split('｜')[0]}</small><strong>{evidence.title.split('｜').slice(1).join('｜')}</strong></b>:<b>{evidence.title}</b>}<span>點圖放大 ↗</span></figcaption>
       <a href={evidence.src} target="_blank" rel="noreferrer" aria-label={'放大查看'+evidence.title}>
        <img src={evidence.src} alt={evidence.alt} loading="lazy"/>
       </a>
      </figure>)}
     </div>
    </section>}`;

const answerMarkup = `{!item.direct&&!item.pending&&(!solved||replayMode)&&<form onSubmit={submit}><label htmlFor={'case-'+index}>{item.inputLabel}</label>{item.subQuestions?.length
     ?<div className="case-subquestions">
       {subStep<1?<section className="case-subquestion"><small>Q1｜{item.subQuestions[0].title}</small><p>{item.subQuestions[0].prompt}</p>{item.subQuestions[0].options?.length?<div className="case-choice-list">{item.subQuestions[0].options.map(option=>{const part=value.split('|||')[0]||'';return <label className={'case-choice '+(part===option.value?'is-selected':'')} key={option.value}><input type="radio" name={'case-sub-'+index+'-0'} value={option.value} checked={part===option.value} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[0]=event.target.value;return parts.join('|||')});setError(false)}}/><span>{option.label}</span></label>})}</div>:<input id={'case-'+index+'-0'} value={value.split('|||')[0]||''} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[0]=event.target.value;return parts.join('|||')});setError(false)}} placeholder={item.subQuestions[0].placeholder||'請輸入答案'}/>}<button type="button" className="case-submit-choice" disabled={item.subQuestions[0].options?.length&&!(value.split('|||')[0]||'')} onClick={()=>{const answer=(value.split('|||')[0]||'').trim().normalize('NFKC').replace(/\\s+/g,'');const accepted=item.subQuestions[0].acceptedValues||[item.subQuestions[0].correctValue].filter(Boolean);const ok=accepted.map(v=>String(v).trim().normalize('NFKC').replace(/\\s+/g,'')).includes(answer);setError(!ok);if(ok){setValue(current=>{const parts=current.split('|||');parts[0]='';return parts.join('|||')});setSubStep(1)}}}>{item.subQuestions[0].submitLabel||('確認'+item.subQuestions[0].title)}</button></section>:<div className="case-step-passed case-step-summary">✓ {item.subQuestions[0].passLabel||'第一階段完成'}</div>}
       {subStep>=1&&<section className="case-subquestion"><small>Q2｜{item.subQuestions[1].title}</small><p>{item.subQuestions[1].prompt}</p>{item.subQuestions[1].options?.length?<div className="case-choice-list">{item.subQuestions[1].options.map(option=>{const part=value.split('|||')[1]||'';return <label className={'case-choice '+(part===option.value?'is-selected':'')} key={option.value}><input type="radio" name={'case-sub-'+index+'-1'} value={option.value} checked={part===option.value} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[1]=event.target.value;return parts.join('|||')});setError(false)}}/><span>{option.label}</span></label>})}</div>:<input id={'case-'+index+'-1'} value={value.split('|||')[1]||''} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[1]=event.target.value;return parts.join('|||')});setError(false)}} placeholder={item.subQuestions[1].placeholder||'請輸入答案'}/>}</section>}
      </div>
     :item.options?.length
      ?<div className="case-choice-list" id={'case-'+index}>{item.options.map(option=><label className={'case-choice '+(value===option.value?'is-selected':'')} key={option.value}><input type="radio" name={'case-choice-'+index} value={option.value} checked={value===option.value} onChange={event=>{setValue(event.target.value);setError(false)}}/><span>{option.label}</span></label>)}</div>
      :<div><input id={'case-'+index} value={value} onChange={event=>{setValue(event.target.value);setError(false)}} placeholder={'請輸入'+item.inputLabel}/></div>}{(!item.subQuestions?.length||subStep>=1)&&<button className="case-submit-choice" type="submit" disabled={item.subQuestions?.length?!(value.split('|||')[1]||'').trim():item.options?.length&&!value}>送交查核</button>}{error&&<small>登記內容不符，請重新確認現場線索。</small>}</form>}`;

export function firstPuzzleTransform() {
  return {
    name: 'suzuran-first-puzzle-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;

      let next = code;
      if (!next.includes("import './first-puzzle.css';")) {
        next = next.replace("import './newspaper.css';", "import './newspaper.css';\nimport './first-puzzle.css';");
      }

      if (!next.includes("taskTitle: '沒有名字的技術人員'")) {
        const puzzleAnchor = 'const puzzles = mainlineCases;';
        if (next.includes(puzzleAnchor)) {
          next = next.replace(puzzleAnchor, firstPuzzleSetup + '\n\n' + puzzleAnchor);
        }
      }

      const fieldJournalStart = 'function FieldJournal({item,index,unlockedCount,sharedSolved,onSharedSolved}){';
      const fieldJournalIndex = next.indexOf(fieldJournalStart);
      if (fieldJournalIndex >= 0) {
        const before = next.slice(0, fieldJournalIndex);
        let fieldJournalAndAfter = next.slice(fieldJournalIndex);
        if (!fieldJournalAndAfter.includes('const [subStep,setSubStep]=useState(0);')) {
          fieldJournalAndAfter = fieldJournalAndAfter.replace(
            ' const [error,setError]=useState(false);',
            ' const [error,setError]=useState(false);\n const [subStep,setSubStep]=useState(0);\n const [replayMode,setReplayMode]=useState(false);'
          );
        }
        const oldSubmit = ` const submit=async event=>{\n  event.preventDefault();\n  if(item.pending||item.direct)return;\n  const submittedHash=await hashAnswer(value);\n  const ok=(item.hashes||[]).includes(submittedHash);\n  setError(!ok);\n  if(ok){setSolved(true);window.localStorage.setItem(unlockKey,'1');onSharedSolved?.(index)}\n };`;
        const newSubmit = ` const submit=async event=>{\n  event.preventDefault();\n  if(item.pending||item.direct)return;\n  let ok=false;\n  if(item.subQuestions?.length){\n   const answer=(value.split('|||')[1]||'').trim().normalize('NFKC').replace(/\\s+/g,'');\n   const accepted=item.subQuestions[1].acceptedValues||[item.subQuestions[1].correctValue].filter(Boolean);\n   ok=accepted.map(v=>String(v).trim().normalize('NFKC').replace(/\\s+/g,'')).includes(answer);\n  }else{\n   const submittedHash=await hashAnswer(value);\n   ok=(item.hashes||[]).includes(submittedHash);\n  }\n  setError(!ok);\n  if(ok){setSolved(true);window.localStorage.setItem(unlockKey,'1');onSharedSolved?.(index)}\n };`;
        if (fieldJournalAndAfter.includes(oldSubmit)) fieldJournalAndAfter = fieldJournalAndAfter.replace(oldSubmit, newSubmit);
        next = before + fieldJournalAndAfter;
      }

      const evidenceAnchor = "{item.direct&&<p className=\"gazette-approved\">本件無須輸入答案，可直接對照兩種城市記錄。</p>}";
      if (next.includes(evidenceAnchor) && !next.includes('case-evidence-documents')) {
        next = next.replace(evidenceAnchor, evidenceMarkup + '\n    ' + evidenceAnchor);
      }

      const oldForm = `{!item.direct&&!item.pending&&!solved&&<form onSubmit={submit}><label htmlFor={'case-'+index}>{item.inputLabel}</label><div><input id={'case-'+index} value={value} onChange={event=>{setValue(event.target.value);setError(false)}} placeholder={'請輸入'+item.inputLabel}/><button type="submit">送交查核</button></div>{error&&<small>登記內容不符，請重新確認現場線索。</small>}</form>}`;
      if (next.includes(oldForm)) next = next.replace(oldForm, answerMarkup);

      const solvedAnchor = `{!item.direct&&!item.pending&&solved&&<p className="gazette-approved">本件照合完了，准予閱覽本島人手稿。</p>}`;
      if (next.includes(solvedAnchor) && !next.includes('重新測試本題流程')) {
        next = next.replace(solvedAnchor, `{!item.direct&&!item.pending&&solved&&<><p className="gazette-approved">本件照合完了，准予閱覽本島人手稿。</p>{item.subQuestions?.length&&!replayMode&&<button type="button" className="case-replay-button" onClick={()=>{setValue('');setError(false);setSubStep(0);setReplayMode(true)}}>重新測試本題流程</button>}{item.subQuestions?.length&&replayMode&&<button type="button" className="case-replay-button" onClick={()=>{setReplayMode(false);setValue('');setError(false);setSubStep(0)}}>結束測試</button>}</>}`);
      }

      return next===code?null:{code:next,map:null};
    }
  };
}
