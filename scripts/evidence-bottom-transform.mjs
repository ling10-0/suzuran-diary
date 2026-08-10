const evidenceMarkup = `

    {item.evidenceDocuments?.length>0
      &&(!item.subQuestions?.length||subStep>=1)
      &&(!item.evidenceAfterCorrectChoice||(value.split('|||')[1]||'')===item.subQuestions?.[1]?.correctValue)
      &&<section className={'case-evidence-documents '+(item.evidenceCompact?'is-compact':'')} aria-label="案件原始資料">
       <header>
        {!item.evidenceCompact&&<small>EVIDENCE / 原始資料</small>}
        <h4>{item.evidenceHeading||'請放大檢視原始資料'}</h4>
        <p>近期整理工場舊資料時，工作人員發現一只空的工程圖封套，以及一份殘缺的工程人員名冊。<br/>封套中的圖稿已不見，只剩襯紙；借用人姓名遭墨水覆蓋，工程人員名冊共列七人，第七人的姓名也遭塗黑。請仔細查看兩張原始資料。</p>
       </header>
       <div className="case-evidence-grid">
        {item.evidenceDocuments.map((evidence,evidenceIndex)=><figure className="case-evidence-card" key={evidence.src}>
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

export function evidenceBottomTransform(){
 return {
  name:'suzuran-evidence-bottom-transform',
  enforce:'pre',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   if(code.includes('aria-label="案件原始資料"'))return null;

   const queryStart=code.indexOf('<section className="gazette-query">');
   if(queryStart===-1)return null;

   const queryEndMarker='\n   </section>\n\n  </article>';
   const queryEnd=code.indexOf(queryEndMarker,queryStart);
   if(queryEnd===-1)return null;

   const next=code.slice(0,queryEnd)+evidenceMarkup+code.slice(queryEnd);
   return {code:next,map:null};
  }
 };
}
