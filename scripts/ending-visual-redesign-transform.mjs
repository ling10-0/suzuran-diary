const endingComponent = String.raw`
function EndingChoicePage(){
 const savedChoice=window.localStorage.getItem('suzuran-final-choice')||'';
 const [choice,setChoice]=useState(savedChoice);
 const day2Ready=window.localStorage.getItem('suzuran-ending-ready')==='1';
 const choose=next=>{
  if(window.localStorage.getItem('suzuran-final-choice'))return;
  window.localStorage.setItem('suzuran-final-choice',next);
  setChoice(next);
  window.scrollTo({top:0,behavior:'smooth'});
 };
 const home=()=>window.location.assign('./');
 return <div className={'ending-page '+(choice?'ending-page-'+choice:'')}>
  <header className="route-nav ending-nav">
   <button className="brand" onClick={home}><span>翻閱1938</span><i>終局</i></button>
   <button className="route-back" onClick={home}><ArrowLeft size={18}/> 返回市役所</button>
  </header>
  <main className="ending-main">
   {!choice&&<section className="ending-choice-hub">
    <div className="ending-choice-head">
     <small>FINAL DECISION / 最終發刊決定</small>
     <h1>真相已經完整，是否要刊出？</h1>
     <p>請先完成小組討論，再決定是否交出完整報導與人物線索。選擇一旦送出，就不能更改。</p>
     <p><b>第二日碎片追查：</b>{day2Ready?'已完成，可以進行最終決定。':'尚未在本機登記完成；測試期間仍可直接預覽。'}</p>
    </div>
    <div className="publication-choice-grid">
     <button type="button" className="publication-choice-card publish-choice" onClick={()=>choose('publish')}>
      <small>ENDING A / 選擇一</small><b>同意刊登</b><span>公開《七－圖庫》地下工程、異常經費與人物線索。</span><em>公開真相，也承擔公開之後的結果。</em>
     </button>
     <button type="button" className="publication-choice-card protect-choice" onClick={()=>choose('protect')}>
      <small>ENDING B / 選擇二</small><b>不同意刊登</b><span>保留鈴蘭與青木的關鍵資訊，不公開所有名字。</span><em>留下真相，也保護被捲入其中的人。</em>
     </button>
    </div>
   </section>}
   {choice==='publish'&&<section className="ending-experience ending-poster-result ending-poster-result-a">
    <div className="ending-poster-shell">
     <figure className="ending-poster-frame"><img className="ending-poster-image" src="./assets/ending/ending-a.png" alt="結局 A：真相刊出。"/></figure>
     <div className="ending-poster-footer"><span>最終決定已記錄，無法重新選擇。</span><button type="button" onClick={home}>返回市役所</button></div>
    </div>
   </section>}
   {choice==='protect'&&<section className="ending-experience ending-poster-result ending-poster-result-b">
    <div className="ending-poster-shell">
     <figure className="ending-poster-frame"><img className="ending-poster-image" src="./assets/ending/ending-b.png" alt="結局 B：未刊出的名字。"/></figure>
     <div className="ending-poster-footer"><span>最終決定已記錄，無法重新選擇。</span><button type="button" onClick={home}>返回市役所</button></div>
    </div>
   </section>}
  </main>
 </div>
}
`;

export function endingVisualRedesignTransform(){
 return {
  name:'suzuran-ending-visual-redesign-transform',
  enforce:'pre',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   let next=code;

   if(!next.includes("import './ending-visual-redesign.css';")){
    if(next.includes("import './ending-consistency.css';")){
     next=next.replace("import './ending-consistency.css';","import './ending-consistency.css';\nimport './ending-visual-redesign.css';");
    }else if(next.includes("import './second-day-ending.css';")){
     next=next.replace("import './second-day-ending.css';","import './second-day-ending.css';\nimport './ending-visual-redesign.css';");
    }else{
     next=next.replace("import './newspaper.css';","import './newspaper.css';\nimport './ending-visual-redesign.css';");
    }
   }

   const wholeEnding=/function EndingChoicePage\(\)\{[\s\S]*?(?=\nfunction GreenCorridorFragmentFlow\()/;
   if(wholeEnding.test(next)){
    next=next.replace(wholeEnding,endingComponent+'\n');
   }

   return next===code?null:{code:next,map:null};
  }
 };
}
