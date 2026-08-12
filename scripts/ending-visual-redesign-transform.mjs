const endingComponent = String.raw`
function EndingChoicePage(){
 const savedChoice=window.localStorage.getItem('suzuran-final-choice')||'';
 const [choice,setChoice]=useState(savedChoice);
 const [truthSeen,setTruthSeen]=useState([]);
 const [activeTruth,setActiveTruth]=useState(0);
 const day2Ready=window.localStorage.getItem('suzuran-ending-ready')==='1';
 const truths=[
  {id:'drawing',label:'工程圖',title:'被帶走的不是贓物',image:'./assets/puzzles/1916/engineering-envelope.png',text:'工程團隊發現地下工程的圖面與正式紀錄彼此對不上。青木等人帶走圖面，是為了避免原件被回收或消失，並留下可供追查的證據。'},
  {id:'money',label:'經費紀錄',title:'工程背後有異常金流',image:'./assets/puzzles/library/expense-copy-note.png',text:'圖書館年報與經費抄本顯示，《七－圖庫》相關工程費曾被改列到其他項目；地籍、補償與私人收據也出現無法互相吻合的數字。'},
  {id:'team',label:'工程團隊',title:'「竊圖失蹤」並不是完整真相',image:'./assets/puzzles/1916/engineer-roster.png',text:'名冊、接待紀錄與沿途證詞拼起來後，可以確認工程團隊曾分頭保存資料、轉移證物並避開追查。後來留下的官方說法，只保留了「竊圖後失蹤」這一面。'},
  {id:'suzuran',label:'鈴蘭留下的記錄',title:'有人把被抹去的故事留了下來',image:'./assets/puzzles/central-bookstore/final-fragment.png',text:'鈴蘭以筆名留下日記、小說殘頁與暗記，讓青木與工程團隊的行動沒有完全從城市記憶中消失。你們一路找到的手稿，正是她留下來的另一條紀錄。'}
 ];
 const truthComplete=truthSeen.length===truths.length;
 const inspectTruth=index=>{
  setActiveTruth(index);
  setTruthSeen(current=>current.includes(truths[index].id)?current:[...current,truths[index].id]);
 };
 const choose=next=>{
  if(!truthComplete||window.localStorage.getItem('suzuran-final-choice'))return;
  window.localStorage.setItem('suzuran-final-choice',next);
  setChoice(next);
  window.scrollTo({top:0,behavior:'smooth'});
 };
 const home=()=>window.location.assign('./');
 const active=truths[activeTruth];
 return <div className={'ending-page '+(choice?'ending-page-'+choice:'')}>
  <header className="route-nav ending-nav">
   <button className="brand" onClick={home}><span>翻閱1938</span><i>終局</i></button>
   <button className="route-back" onClick={home}><ArrowLeft size={18}/> 返回市役所</button>
  </header>
  <main className="ending-main">
   {!choice&&<>
    <section className="truth-investigation-hub">
     <header className="truth-investigation-head">
      <small>FINAL TRUTH / 最終真相</small>
      <h1>把最後四塊證據重新拼起來</h1>
      <p>你們已經走完調查路線。請依序點開關鍵證物，確認它們彼此之間的關係，再決定這則新聞是否刊出。</p>
      <div className="truth-progress"><span style={{width:(truthSeen.length/truths.length*100)+'%'}}></span><b>{truthSeen.length} / {truths.length} 已查明</b></div>
     </header>
     <div className="truth-evidence-grid">
      {truths.map((item,index)=><button type="button" className={'truth-evidence-card '+(truthSeen.includes(item.id)?'is-seen ':'')+(activeTruth===index?'is-active':'')} key={item.id} onClick={()=>inspectTruth(index)}>
       <img src={item.image} alt=""/>
       <span><small>證物 {String(index+1).padStart(2,'0')}</small><b>{item.label}</b><em>{truthSeen.includes(item.id)?'已查明 ✓':'點擊查閱'}</em></span>
      </button>)}
     </div>
     <article className="truth-detail-panel">
      <div className="truth-detail-image"><img src={active.image} alt={active.label}/></div>
      <div><small>KEY EVIDENCE / {active.label}</small><h2>{active.title}</h2><p>{active.text}</p></div>
     </article>
     <div className={'truth-complete-note '+(truthComplete?'is-ready':'')}>
      <b>{truthComplete?'真相拼合完成':'還有證物尚未查閱'}</b>
      <span>{truthComplete?'你們已經看過四項關鍵證據，可以進行最後的發刊決定。':'請把四項關鍵證據都點開一次。'}</span>
     </div>
    </section>
    <section className={'ending-choice-hub '+(!truthComplete?'is-locked':'')}>
     <div className="ending-choice-head">
      <small>FINAL DECISION / 最終發刊決定</small>
      <h1>{truthComplete?'真相已經完整，是否要刊出？':'完成真相查核後才能決定'}</h1>
      <p>請先完成小組討論，再決定是否交出完整報導與人物線索。選擇一旦送出，就不能更改。</p>
      <p><b>第二日碎片追查：</b>{day2Ready?'已完成，可以進行最終決定。':'尚未在本機登記完成；測試期間仍可直接預覽。'}</p>
     </div>
     <div className="publication-choice-grid">
      <button type="button" disabled={!truthComplete} className="publication-choice-card publish-choice" onClick={()=>choose('publish')}>
       <small>ENDING A / 選擇一</small><b>同意刊登</b><span>公開《七－圖庫》地下工程、異常經費與人物線索。</span><em>公開真相，也承擔公開之後的結果。</em>
      </button>
      <button type="button" disabled={!truthComplete} className="publication-choice-card protect-choice" onClick={()=>choose('protect')}>
       <small>ENDING B / 選擇二</small><b>不同意刊登</b><span>保留鈴蘭與青木的關鍵資訊，不公開所有名字。</span><em>留下真相，也保護被捲入其中的人。</em>
      </button>
     </div>
    </section>
   </>}
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
