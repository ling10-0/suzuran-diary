const fourthPuzzleSetup = `
Object.assign(mainlineCases[3], {
  direct: false,
  pending: false,
  type: 'investigation',
  code: '商工第〇四號',
  taskTitle: '原精養軒／臺灣拓殖株式會社臺中出張所',
  label: '原精養軒／臺灣拓殖株式會社臺中出張所',
  inputLabel: '請依序完成兩階段查核',
  hint: '先確認建築後來的機構用途；答對後，再比對當晚接待與送菜紀錄，還原分類號尾碼。',
  question: '本件分為「場域題」與「當晚紀錄查核」兩階段，請依序完成。',
  questionDetails: [
    '第三站的追查紀錄顯示，調查者在新盛橋附近失去青木的行蹤，之後轉往南園一帶確認他的落腳處。',
    '玩家抵達原精養軒後，從建築改作臺灣拓殖株式會社臺中出張所時留下的清點資料中，找到一冊舊接待簿、數張送菜單與一份跑堂值班筆記。',
    '接待簿中「青先生」的離店時間與出口欄位有重新描寫的痕跡；同頁背面另壓著一張未完成的轉交便條。請先完成場域題，再進一步查核當晚紀錄。'
  ],
  questionHint: '第一階段可由現場建築歷史判斷；第二階段需同時比對接待簿、廚房清點、跑堂筆記與送菜單。',
  subQuestions: [
    {
      title: '場域題',
      prompt: '精養軒所在建築後來曾作為哪種機構？',
      options: [
        {value: 'A', label: 'A. 出張所'},
        {value: 'B', label: 'B. 州立圖書館'},
        {value: 'C', label: 'C. 警察派出所'},
        {value: 'D', label: 'D. 郵便局'}
      ],
      correctValue: 'A',
      passLabel: '場域查核完成，已開放第二階段'
    },
    {
      title: '比對當晚紀錄',
      prompt: '比對接待簿、廚房清點表與跑堂值班筆記，再依「先湯、再主食、最後甜點」與送出時間還原四張送菜單順序。將四個桌次記號填入轉交便條後，請輸入州立圖書館工程年報的分類號尾碼。',
      placeholder: '請輸入四位數分類號尾碼'
    }
  ],
  hashes: ['b02d413a5baaf2d60a8fb356a439557fbeb507c3a42485bff620eea37d0df610'],
  evidenceHeading: '原始資料｜比對精養軒當晚紀錄',
  evidenceCompact: true,
  evidenceDocuments: []
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
      const newQ1 = `<section className="case-subquestion"><small>Q1｜{item.subQuestions[0].title}</small><p>{item.subQuestions[0].prompt}</p>{item.subQuestions[0].options?.length?<div className="case-choice-list">{item.subQuestions[0].options.map(option=>{const part=value.split('|||')[0]||'';return <label className={'case-choice '+(part===option.value?'is-selected':'')} key={option.value}><input type="radio" name={'case-sub-'+index+'-0'} value={option.value} checked={part===option.value} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[0]=event.target.value;return parts.join('|||')});setError(false)}}/><span>{option.label}</span></label>})}</div>:<input id={'case-'+index+'-0'} value={value.split('|||')[0]||''} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[0]=event.target.value;return parts.join('|||')});setError(false)}} placeholder={item.subQuestions[0].placeholder||'請輸入答案'}/>} {subStep<1&&<button type="button" className="case-submit-choice" disabled={item.subQuestions[0].options?.length&&!(value.split('|||')[0]||'')} onClick={()=>{const answer=(value.split('|||')[0]||'').trim().normalize('NFKC').replace(/\\s+/g,'');const accepted=item.subQuestions[0].correctValue?[item.subQuestions[0].correctValue]:['2個三角形','兩個三角形','2個三角型','兩個三角型'];const ok=accepted.includes(answer);setError(!ok);if(ok)setSubStep(1)}}>確認第一階段</button>}{subStep>=1&&<small className="case-step-passed">✓ {item.subQuestions[0].passLabel||'第一階段完成，已開放下一題'}</small>}</section>`;
      if (next.includes(oldQ1)) next = next.replace(oldQ1, newQ1);

      const oldQ2 = `{subStep>=1&&<section className="case-subquestion"><small>Q2｜{item.subQuestions[1].title}</small><p>{item.subQuestions[1].prompt}</p><div className="case-choice-list">{item.subQuestions[1].options.map(option=>{const part=value.split('|||')[1]||'';return <label className={'case-choice '+(part===option.value?'is-selected':'')} key={option.value}><input type="radio" name={'case-sub-'+index+'-1'} value={option.value} checked={part===option.value} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[1]=event.target.value;return parts.join('|||')});setError(false)}}/><span>{option.label}</span></label>})}</div></section>}`;
      const newQ2 = `{subStep>=1&&<section className="case-subquestion"><small>Q2｜{item.subQuestions[1].title}</small><p>{item.subQuestions[1].prompt}</p>{item.subQuestions[1].options?.length?<div className="case-choice-list">{item.subQuestions[1].options.map(option=>{const part=value.split('|||')[1]||'';return <label className={'case-choice '+(part===option.value?'is-selected':'')} key={option.value}><input type="radio" name={'case-sub-'+index+'-1'} value={option.value} checked={part===option.value} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[1]=event.target.value;return parts.join('|||')});setError(false)}}/><span>{option.label}</span></label>})}</div>:<input id={'case-'+index+'-1'} value={value.split('|||')[1]||''} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[1]=event.target.value;return parts.join('|||')});setError(false)}} placeholder={item.subQuestions[1].placeholder||'請輸入答案'}/>}</section>}`;
      if (next.includes(oldQ2)) next = next.replace(oldQ2, newQ2);

      return next===code?null:{code:next,map:null};
    }
  };
}
