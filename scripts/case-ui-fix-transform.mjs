const evidenceMarkup = String.raw`

    {item.evidenceDocuments?.length>0
      &&(!item.subQuestions?.length||subStep>=1)
      &&(!item.evidenceAfterCorrectChoice||(value.split('|||')[1]||'')===item.subQuestions?.[1]?.correctValue)
      &&<section className={'case-evidence-documents '+(item.evidenceCompact?'is-compact':'')} aria-label="案件原始資料">
       <header>
        {!item.evidenceCompact&&<small>EVIDENCE / 原始資料</small>}
        <h4>{item.evidenceHeading||'原始資料'}</h4>
        <p>可點擊圖片開啟原尺寸查看細節，再返回此頁作答。</p>
       </header>
       <div className="case-evidence-grid">
        {item.evidenceDocuments.map(evidence=><figure className="case-evidence-card" key={evidence.src}>
         <a href={evidence.src} target="_blank" rel="noreferrer" aria-label={'放大查看'+evidence.title}>
          <img src={evidence.src} alt={evidence.alt} loading="lazy"/>
         </a>
         <figcaption>
          {item.evidenceCompact
           ?<b className="evidence-title-split"><small>{evidence.title.split('｜')[0]}</small><strong>{evidence.title.split('｜').slice(1).join('｜')}</strong></b>
           :<b>{evidence.title}</b>}
          <span>點圖放大 ↗</span>
         </figcaption>
        </figure>)}
       </div>
      </section>}`;

const answerMarkup = String.raw`
    {/* 作答 */}
    {item.customFlow==='liuchuan'&&!solved
     ?<LiuchuanFlow onComplete={()=>{setSolved(true);window.localStorage.setItem(unlockKey,'1');onSharedSolved?.(index)}}/>
     :item.customFlow==='marketLocker'&&!solved
      ?<MarketLockerFlow onComplete={()=>{setSolved(true);window.localStorage.setItem(unlockKey,'1');onSharedSolved?.(index)}}/>
      :!item.direct&&!item.pending&&!solved&&(
       <form onSubmit={submit}>
        <label htmlFor={'case-'+index}>{item.inputLabel}</label>
        {item.subQuestions?.length
         ?<div className="case-subquestions">
          {subStep<1?<section className="case-subquestion">
           <small>Q1｜{item.subQuestions[0].title}</small>
           <p>{item.subQuestions[0].prompt}</p>
           {item.subQuestions[0].options?.length
            ?<div className="case-choice-list">{item.subQuestions[0].options.map(option=>{const part=value.split('|||')[0]||'';return <label className={'case-choice '+(part===option.value?'is-selected':'')} key={option.value}><input type="radio" name={'case-sub-'+index+'-0'} value={option.value} checked={part===option.value} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[0]=event.target.value;return parts.join('|||')});setError(false)}}/><span>{option.label}</span></label>})}</div>
            :<input id={'case-'+index+'-0'} value={value.split('|||')[0]||''} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[0]=event.target.value;return parts.join('|||')});setError(false)}} placeholder={item.subQuestions[0].placeholder||'請輸入答案'}/>} 
           <button type="button" className="case-submit-choice" onClick={()=>{const answer=(value.split('|||')[0]||'').trim().normalize('NFKC').replace(/\s+/g,'');const accepted=item.subQuestions[0].acceptedValues||[item.subQuestions[0].correctValue].filter(Boolean);const ok=accepted.map(v=>String(v).trim().normalize('NFKC').replace(/\s+/g,'')).includes(answer);setError(!ok);if(ok)setSubStep(1)}}>{item.subQuestions[0].submitLabel||('確認'+item.subQuestions[0].title)}</button>
          </section>:<div className="case-step-passed case-step-summary">✓ {item.subQuestions[0].passLabel||'第一階段完成'}</div>}
          {subStep>=1&&<section className="case-subquestion">
           <small>Q2｜{item.subQuestions[1].title}</small>
           <p>{item.subQuestions[1].prompt}</p>
           {item.subQuestions[1].options?.length
            ?<div className="case-choice-list">{item.subQuestions[1].options.map(option=>{const part=value.split('|||')[1]||'';return <label className={'case-choice '+(part===option.value?'is-selected':'')} key={option.value}><input type="radio" name={'case-sub-'+index+'-1'} value={option.value} checked={part===option.value} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[1]=event.target.value;return parts.join('|||')});setError(false)}}/><span>{option.label}</span></label>})}</div>
            :<input id={'case-'+index+'-1'} value={value.split('|||')[1]||''} onChange={event=>{setValue(current=>{const parts=current.split('|||');parts[1]=event.target.value;return parts.join('|||')});setError(false)}} placeholder={item.subQuestions[1].placeholder||'請輸入答案'}/>} 
          </section>}
         </div>
         :item.options?.length
          ?<div className="case-choice-list" id={'case-'+index}>{item.options.map(option=><label className={'case-choice '+(value===option.value?'is-selected':'')} key={option.value}><input type="radio" name={'case-choice-'+index} value={option.value} checked={value===option.value} onChange={event=>{setValue(event.target.value);setError(false)}}/><span>{option.label}</span></label>)}</div>
          :<div><input id={'case-'+index} value={value} onChange={event=>{setValue(event.target.value);setError(false)}} placeholder={'請輸入'+item.inputLabel}/></div>}
        {(!item.subQuestions?.length||subStep>=1)&&<button className="case-submit-choice" type="submit">送交查核</button>}
        {error&&<small>登記內容不符，請重新確認現場線索。</small>}
       </form>
      )}

`;

export function caseUiFixTransform(){
 return {
  name:'suzuran-case-ui-fix-transform',
  enforce:'pre',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   let next=code;
   const fieldStart='function FieldJournal({item,index,unlockedCount,sharedSolved,onSharedSolved}){';
   const fieldIndex=next.indexOf(fieldStart);
   if(fieldIndex<0)return null;
   const before=next.slice(0,fieldIndex);
   let field=next.slice(fieldIndex);

   if(!field.includes('const [subStep,setSubStep]=useState(0);')){
    field=field.replace(' const [error,setError]=useState(false);',' const [error,setError]=useState(false);\n const [subStep,setSubStep]=useState(0);');
   }

   const submitStart=field.indexOf(' const submit=async event=>{');
   const addPhotoStart=field.indexOf(' const addPhoto=async event=>{',submitStart);
   if(submitStart>=0&&addPhotoStart>submitStart){
    const newSubmit=String.raw` const submit=async event=>{
  event.preventDefault();
  if(item.pending||item.direct)return;
  let ok=false;
  if(item.subQuestions?.length){
   const answer=(value.split('|||')[1]||'').trim().normalize('NFKC').replace(/\s+/g,'');
   const accepted=item.subQuestions[1].acceptedValues||[item.subQuestions[1].correctValue].filter(Boolean);
   ok=accepted.map(v=>String(v).trim().normalize('NFKC').replace(/\s+/g,'')).includes(answer);
  }else{
   const submittedHash=await hashAnswer(value);
   ok=(item.hashes||[]).includes(submittedHash);
  }
  setError(!ok);
  if(ok){setSolved(true);window.localStorage.setItem(unlockKey,'1');onSharedSolved?.(index)}
 };

`;
    field=field.slice(0,submitStart)+newSubmit+field.slice(addPhotoStart);
   }

   if(!field.includes('aria-label="案件原始資料"')){
    const directComment='    {/* 直接閱覽案件 */}';
    const pos=field.indexOf(directComment);
    if(pos>=0)field=field.slice(0,pos)+evidenceMarkup+'\n\n'+field.slice(pos);
   }

   const answerComment='    {/* 作答 */}';
   const solvedComment='    {/* 解鎖成功 */}';
   const a=field.indexOf(answerComment);
   const b=field.indexOf(solvedComment,a);
   if(a>=0&&b>a){field=field.slice(0,a)+answerMarkup+field.slice(b)}

   next=before+field;
   return next===code?null:{code:next,map:null};
  }
 };
}
