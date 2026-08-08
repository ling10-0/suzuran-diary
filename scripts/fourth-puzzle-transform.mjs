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
      passLabel: '場域查核完成'
    },
    {
      title: '當晚紀錄復原',
      prompt: '比對接待簿、廚房清點表與跑堂值班筆記，再依「先湯、再主食、最後甜點」與送出時間還原四張送菜單順序。將四個桌次記號填入轉交便條後，請輸入州立圖書館工程年報的分類號尾碼。',
      placeholder: '請輸入四位數分類號尾碼'
    }
  ],
  hashes: ['b02d413a5baaf2d60a8fb356a439557fbeb507c3a42485bff620eea37d0df610'],
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

      const oldQ1 = `<section className="case-subquestion"><small>Q1｜{item.subQuestions[0].title}</small><p>{item.subQuestions[0].prompt}</p><input id={'case-'+index+'-0'} value={value.split('|||')[0]||''} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[0]=event.target.value;return parts.join('|||')});setError(false)}} placeholder={item.subQuestions[0].placeholder||'請輸入答案'}/>{subStep<1&&<button type="button" className="case-submit-choice" onClick={()=>{const answer=(value.split('|||')[0]||'').trim().normalize('NFKC').replace(/\\s+/g,'');const ok=['2個三角形','兩個三角形','2個三角型','兩個三角型'].includes(answer);setError(!ok);if(ok)setSubStep(1)}}>確認現場勘查</button>}{subStep>=1&&<small className="case-step-passed">✓ 現場勘查完成，已開放下一題</small>}</section>`;
      const newQ1 = `{subStep<1?<section className="case-subquestion"><small>Q1｜{item.subQuestions[0].title}</small><p>{item.subQuestions[0].prompt}</p>{item.subQuestions[0].options?.length?<div className="case-choice-list">{item.subQuestions[0].options.map(option=>{const part=value.split('|||')[0]||'';return <label className={'case-choice '+(part===option.value?'is-selected':'')} key={option.value}><input type="radio" name={'case-sub-'+index+'-0'} value={option.value} checked={part===option.value} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[0]=event.target.value;return parts.join('|||')});setError(false)}}/><span>{option.label}</span></label>})}</div>:<input id={'case-'+index+'-0'} value={value.split('|||')[0]||''} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[0]=event.target.value;return parts.join('|||')});setError(false)}} placeholder={item.subQuestions[0].placeholder||'請輸入答案'}/>}<button type="button" className="case-submit-choice" disabled={item.subQuestions[0].options?.length&&!(value.split('|||')[0]||'')} onClick={()=>{const answer=(value.split('|||')[0]||'').trim().normalize('NFKC').replace(/\\s+/g,'');const accepted=item.subQuestions[0].correctValue?[item.subQuestions[0].correctValue]:['2個三角形','兩個三角形','2個三角型','兩個三角型'];const ok=accepted.includes(answer);setError(!ok);if(ok){setValue(current=>{const parts=current.split('|||');parts[0]='';return parts.join('|||')});setSubStep(1)}}}>確認場域查核</button></section>:<div className="case-step-passed case-step-summary">✓ {item.subQuestions[0].passLabel||'第一階段完成'}</div>}`;
      if (next.includes(oldQ1)) next = next.replace(oldQ1, newQ1);

      const oldQ2 = `{subStep>=1&&<section className="case-subquestion"><small>Q2｜{item.subQuestions[1].title}</small><p>{item.subQuestions[1].prompt}</p><div className="case-choice-list">{item.subQuestions[1].options.map(option=>{const part=value.split('|||')[1]||'';return <label className={'case-choice '+(part===option.value?'is-selected':'')} key={option.value}><input type="radio" name={'case-sub-'+index+'-1'} value={option.value} checked={part===option.value} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[1]=event.target.value;return parts.join('|||')});setError(false)}}/><span>{option.label}</span></label>})}</div></section>}`;
      const newQ2 = `{subStep>=1&&<section className="case-subquestion"><small>Q2｜{item.subQuestions[1].title}</small><p>{item.subQuestions[1].prompt}</p>{item.subQuestions[1].options?.length?<div className="case-choice-list">{item.subQuestions[1].options.map(option=>{const part=value.split('|||')[1]||'';return <label className={'case-choice '+(part===option.value?'is-selected':'')} key={option.value}><input type="radio" name={'case-sub-'+index+'-1'} value={option.value} checked={part===option.value} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[1]=event.target.value;return parts.join('|||')});setError(false)}}/><span>{option.label}</span></label>})}</div>:<input id={'case-'+index+'-1'} value={value.split('|||')[1]||''} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[1]=event.target.value;return parts.join('|||')});setError(false)}} placeholder={item.subQuestions[1].placeholder||'請輸入答案'}/>}</section>}`;
      if (next.includes(oldQ2)) next = next.replace(oldQ2, newQ2);

      return next===code?null:{code:next,map:null};
    }
  };
}
