const endingComponent = String.raw`
function EndingChoicePage(){
 const savedChoice=window.localStorage.getItem('suzuran-final-choice')||'';
 const [choice,setChoice]=useState(savedChoice);
 const [posterStep,setPosterStep]=useState(0);
 const day2Ready=window.localStorage.getItem('suzuran-ending-ready')==='1';
 const choose=next=>{
  if(window.localStorage.getItem('suzuran-final-choice'))return;
  window.localStorage.setItem('suzuran-final-choice',next);
  setChoice(next);
  setPosterStep(0);
  window.scrollTo({top:0,behavior:'smooth'});
 };
 const revealPoster=()=>setPosterStep(step=>Math.min(step+1,3));
 const home=()=>window.location.assign('./');
 const revealLabel=choice==='publish'
  ?['點一下，揭開報社升等結果','再點一下，查看市役所至急通告','最後一次，揭開這個選擇的代價'][posterStep]
  :['點一下，看看三個月後的報社','再點一下，打開收到的消息','最後一次，看看你們留下了什麼'][posterStep];
 const coverTop=choice==='publish'
  ?['43%','62%','77%'][posterStep]
  :['42%','63%','79%'][posterStep];
 return <div className={'ending-page '+(choice?'ending-page-'+choice:'')}>
  <header className="route-nav ending-nav">
   <button className="brand" onClick={home}><span>翻閱1938</span><i>終局</i></button>
   <button className="route-back" onClick={home}><ArrowLeft size={18}/> 返回市役所</button>
  </header>
  <main className="ending-main">
   {!choice&&<section className="ending-choice-hub ending-choice-direct">
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
     <div className="ending-poster-kicker"><span>ENDING A / 同意刊登</span><b>點擊畫面，逐段揭開結局</b></div>
     <figure className={'ending-poster-frame interactive-poster '+(posterStep<3?'is-revealing':'is-complete')} onClick={posterStep<3?revealPoster:undefined}>
      <img className="ending-poster-image" src="./assets/ending/ending-a.png" alt="結局 A：真相刊出。"/>
      {posterStep<3&&<button type="button" className="ending-reveal-cover" style={{top:coverTop}} onClick={event=>{event.stopPropagation();revealPoster()}} aria-label={revealLabel}>
       <span>{revealLabel}</span><small>TOUCH TO REVEAL</small>
      </button>}
     </figure>
     <div className="ending-poster-progress"><span className={posterStep>=1?'done':''}></span><span className={posterStep>=2?'done':''}></span><span className={posterStep>=3?'done':''}></span><b>{posterStep<3?'結局揭露 '+posterStep+' / 3':'結局閱讀完成'}</b></div>
     <div className="ending-poster-footer"><span>{posterStep<3?'請依序點擊畫面揭開後續結果。':'最終決定已記錄，無法重新選擇。'}</span><button type="button" onClick={home}>返回市役所</button></div>
    </div>
   </section>}
   {choice==='protect'&&<section className="ending-experience ending-poster-result ending-poster-result-b">
    <div className="ending-poster-shell">
     <div className="ending-poster-kicker"><span>ENDING B / 不同意刊登</span><b>點擊畫面，逐段揭開結局</b></div>
     <figure className={'ending-poster-frame interactive-poster '+(posterStep<3?'is-revealing':'is-complete')} onClick={posterStep<3?revealPoster:undefined}>
      <img className="ending-poster-image" src="./assets/ending/ending-b.png" alt="結局 B：未刊出的名字。"/>
      {posterStep<3&&<button type="button" className="ending-reveal-cover" style={{top:coverTop}} onClick={event=>{event.stopPropagation();revealPoster()}} aria-label={revealLabel}>
       <span>{revealLabel}</span><small>TOUCH TO REVEAL</small>
      </button>}
     </figure>
     <div className="ending-poster-progress"><span className={posterStep>=1?'done':''}></span><span className={posterStep>=2?'done':''}></span><span className={posterStep>=3?'done':''}></span><b>{posterStep<3?'結局揭露 '+posterStep+' / 3':'結局閱讀完成'}</b></div>
     <div className="ending-poster-footer"><span>{posterStep<3?'請依序點擊畫面揭開後續結果。':'最終決定已記錄，無法重新選擇。'}</span><button type="button" onClick={home}>返回市役所</button></div>
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
