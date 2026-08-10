const secondDaySetup = `
Object.assign(mainlineCases[10], {
  day: 2,
  direct: false,
  pending: false,
  type: 'rail',
  code: '鐵道第〇一號',
  taskTitle: '綠空廊道｜重建《七－圖庫地下工程圖》',
  directoryTitle: '綠空廊道｜工程圖碎片追查',
  label: '第二日・綠空廊道',
  inputLabel: '完成第二日碎片追查',
  hint: '碎片①由工作人員於開場直接發放。每答對一題，依畫面指示向工作人員領取下一片；第四題為現場比手畫腳。',
  question: '',
  questionDetails: [],
  questionHint: '',
  customFlow: 'greenCorridorFragments'
});`;

const component = String.raw`
function EndingChoicePage(){
 const savedChoice=window.localStorage.getItem('suzuran-final-choice')||'';
 const [choice,setChoice]=useState(savedChoice);
 const [reveal,setReveal]=useState(savedChoice?1:0);
 const day2Ready=window.localStorage.getItem('suzuran-ending-ready')==='1';
 const choose=next=>{
  window.localStorage.setItem('suzuran-final-choice',next);
  setChoice(next);
  setReveal(1);
  window.scrollTo({top:0,behavior:'smooth'});
 };
 const reset=()=>{
  window.localStorage.removeItem('suzuran-final-choice');
  setChoice('');
  setReveal(0);
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
     <h1>真相已經完整，你們要不要把它刊出去？</h1>
     <p>這一頁獨立於第二日案件。請先完成小組討論，再決定是否交出完整報導與人物線索。這一題沒有標準答案。</p>
     <p><b>第二日碎片追查：</b>{day2Ready?'已完成，可以進行最終決定。':'尚未在本機登記完成；測試期間仍可直接預覽兩種結局。'}</p>
    </div>
    <div className="publication-choice-grid">
     <button type="button" className="publication-choice-card publish-choice" onClick={()=>choose('publish')}>
      <small>ENDING A / 選擇一</small><b>同意刊登</b><span>把《七－圖庫》地下工程、異常經費與人物線索交給總社，換取正式發刊與報社晉升。</span><em>公開真相，也承擔公開之後的結果。</em>
     </button>
     <button type="button" className="publication-choice-card protect-choice" onClick={()=>choose('protect')}>
      <small>ENDING B / 選擇二</small><b>不同意刊登</b><span>保留鈴蘭與青木的關鍵資訊，不以他們的安全交換報社地位與頭版。</span><em>留下真相，但選擇不公開所有名字。</em>
     </button>
    </div>
   </section>}

   {choice==='publish'&&<section className="ending-experience ending-reveal">
    <div className="ending-toolbar"><small>ENDING A / 同意刊登</small><button type="button" onClick={reset}>重新選擇結局</button></div>
    <div className="ending-extra">
     <div className="extra-stamp">號外</div>
     <div className="extra-masthead"><small>公正・真實・敢言</small><h2>中央報</h2><span>特別增刊・獨家報導</span></div>
     <h1 className="extra-headline">《七－圖庫案曝光！中央報社獨家揭密》</h1>
     <div className="extra-grid">
      <article className="extra-column"><h3>七－圖庫案真相大白</h3><p>本社取得完整工程圖與經費資料，地下工程的異常金流、資料改列與追查行動正式曝光。</p><p><b>恭喜！報導成功發刊。</b></p></article>
      <figure className="extra-photo"><img src="./assets/puzzles/1916/engineering-envelope.png" alt="七－圖庫工程圖相關資料"/><figcaption>本社取得之《七－圖庫地下工程圖》相關原始資料</figcaption></figure>
      <article className="extra-column"><h3>獨家報導</h3><p>城市開始談論這宗案件，報紙在街頭快速售罄。總社通知你們：因本案調查有功，報社獲准晉升。</p><p>表面的結果，看起來像一次完美勝利。</p></article>
     </div>
     {reveal===1&&<div className="ending-action"><button type="button" onClick={()=>setReveal(2)}>查看報社晉升證章</button></div>}
     {reveal>=2&&<article className="promotion-certificate ending-reveal">
      <h3>報社晉升證章</h3><p>茲證明本報社因揭露《七－圖庫案》之調查成果，獲准升格。</p>
      <div className="promotion-levels"><b>地方小報</b><span>→</span><b>區域報社</b><span>→</span><b>中央報社</b></div>
      <div className="promotion-seal">晉升<br/>認可</div>
     </article>}
     {reveal===2&&<div className="ending-action"><button type="button" onClick={()=>setReveal(3)}>查看市役所最新消息</button></div>}
     {reveal>=3&&<>
      <article className="official-telegram ending-reveal"><small>市役所・至急通告</small><b>鈴蘭、青木已遭尋獲並帶回調查。</b><p>感謝報社提供完整人物線索與工程資料。相關人員已由市役所帶回，後續將依案辦理。</p></article>
      <div className="publish-cost ending-reveal"><p>你們得到了<strong>頭版</strong>，<br/>也失去了他們的<strong>自由</strong>。</p></div>
      <div className="ending-action"><button type="button" onClick={home}>返回市役所</button><button type="button" className="secondary" onClick={reset}>重新選擇</button></div>
     </>}
    </div>
   </section>}

   {choice==='protect'&&<section className="ending-experience ending-reveal">
    <div className="ending-toolbar"><small>ENDING B / 不同意刊登</small><button type="button" onClick={reset}>重新選擇結局</button></div>
    <div className="ending-night">
     <div className="desk-lamp" aria-hidden="true"></div>
     <div className="night-heading"><small>結局・不刊登的選擇</small><h1>三個月後……</h1></div>
     <div className="newsroom-status">
      <p><span>報社等級</span><b>地方小報社</b></p><p><span>本月訂閱</span><b>沒有明顯增加</b></p><p><span>暖爐</span><strong>故障中</strong></p>
     </div>
     {reveal===1&&<button type="button" className="telegram-trigger" onClick={()=>setReveal(2)}>叮——收到一封電報</button>}
     <div className="night-desk">
      <div className="noodle-cup"><b>泡麵</b><span>今晚的編輯晚餐</span></div>
      {reveal>=2?<article className="telegram-card ending-reveal"><small>電報 / TELEGRAM</small><h3>致那間沒有刊出我名字的報社</h3><p>我和父親都平安。<br/>謝謝你們沒有刊出我們的名字。</p><em>——蘭</em></article>:<article className="local-draft"><small>地方新聞・排版中</small><h3>下一期仍然要出刊</h3><p>地方市場、街角小店、居民來信……沒有獨家頭版的晚上，報社還是在整理這座城市每天發生的事。</p></article>}
      {reveal>=3&&<article className="local-draft ending-reveal"><small>地方新聞｜稿件草稿</small><h3>港口夜市整修完成　攤商盼人潮回流</h3><p>沒有升格，也沒有突然增加的訂閱。桌上的下一期報紙仍在排版，這間小報社繼續記錄那些不一定會上頭版的生活。</p></article>}
     </div>
     {reveal===2&&<div className="ending-action"><button type="button" onClick={()=>setReveal(3)}>翻開桌上的下一期報紙</button></div>}
     {reveal>=3&&<>
      <p className="protect-final ending-reveal">我們沒有變得更大，但我們選擇成為<strong>值得信任的小報社</strong>。<br/>有些真相可以留下，有些名字也值得被好好保護。</p>
      <div className="ending-action"><button type="button" onClick={home}>返回市役所</button><button type="button" className="secondary" onClick={reset}>重新選擇</button></div>
     </>}
    </div>
   </section>}
  </main>
 </div>
}

function GreenCorridorFragmentFlow({onComplete}){
 const [stage,setStage]=useState(0);
 const [answer,setAnswer]=useState('');
 const [charadeText,setCharadeText]=useState('');
 const [error,setError]=useState('');
 const [received,setReceived]=useState({2:false,3:false,4:false,5:false});
 const questions=[
  {no:1,title:'哪一組證據最能說明「拆圖」是刻意分散風險？',prompt:'不要只抓到「有人跟蹤」這一句。請把鈴蘭的訊息前後連起來，選出最能完整解釋他們為何拆圖的推論。',options:[['A','有人跟蹤，所以兩人把完整工程圖交給鈴蘭，再由她一個人帶走。'],['B','有人跟蹤，加上兩人之後分開行動；因此把圖拆開能避免其中一人被攔下時，完整證據一次全部消失。'],['C','兩人分開行動，所以工程圖應該原本就是五張獨立文件，與跟蹤無關。'],['D','有些碎片可能掉落，因此拆圖的目的只是讓紙張比較容易攜帶。']],correct:'B',result:'關鍵不是單純「被跟蹤」，而是被跟蹤後又必須分開行動。拆圖讓完整證據不會集中在同一個人身上。',fragment:2},
  {no:2,title:'如果只追鈴蘭，會在哪裡產生推理漏洞？',prompt:'鈴蘭提醒「不要只追著我的腳步走，父親和我曾經分開」。哪一個推論最能說明這句話真正要你們修正什麼？',options:[['A','鈴蘭走得比較快，所以只要把她的路線延長，就能推算青木的位置。'],['B','兩人的路線既然分開，青木可能仍帶著、藏起或遺落部分碎片；只追鈴蘭會把另一條證據路線整段漏掉。'],['C','父女分開表示青木已經放棄工程圖，所以之後只需調查鈴蘭。'],['D','兩人分開只代表時間不同，所有碎片最後仍一定回到鈴蘭手上。']],correct:'B',result:'這一題要求你們把「人物分開」轉成「證據來源也分開」。接下來不能把所有碎片都預設在鈴蘭的路線上。',fragment:3},
  {no:3,title:'三種現場痕跡，哪一組判讀最合理？',prompt:'假設你們找到三處不同痕跡：A 有防水包裝且固定穩妥；B 有撕裂、水漬與凌亂腳印；C 圖面過於完整、記號與第一日資料不同。哪一組分類最合理？',options:[['A','A＝刻意藏圖；B＝逃跑途中遺落；C＝可能是追查者留下的假圖或干擾物。'],['B','A＝逃跑途中遺落；B＝刻意藏圖；C＝青木留下的正式備份。'],['C','A、B、C 都是刻意藏圖，只是保存方式不同。'],['D','只要紙張看起來完整就是真圖，因此 C 最可信，A、B 都可以忽略。']],correct:'A',result:'「藏好」應有保護與固定痕跡；「掉落」較容易伴隨撕裂、泥水與混亂；而與既有資料不一致、又過度完整的圖面反而需要提高警覺。',fragment:4},
  {no:4,title:'鈴蘭的無聲訊息',prompt:'這一題不提供選項。請先完成現場五個比手畫腳，再把猜到的五個詞依正確順序放回句子。',charades:true,keywords:['跟蹤','打電話','分開','線索','寫信'],frame:'發現有人＿＿後，鈴蘭先＿＿通知父親；兩人決定＿＿行動，沿路留下＿＿，最後再以＿＿交代後續。',result:'你們還原出的訊息顯示：鈴蘭不是單純逃跑，而是在發現跟蹤後先聯絡父親，再分開行動、沿路留下線索，並以寫信交代後續。',fragment:5}
 ];
 const questionIndex=Math.floor(stage/2);
 const current=questions[questionIndex];
 const foundCount=1+Object.values(received).filter(Boolean).length;
 const fragmentBar=<div className="fragment-status" aria-label="工程圖碎片進度">{[1,2,3,4,5].map(no=><span key={no} className={no===1||received[no]?'is-found':''}><b>碎片{no}</b><small>{no===1?'開場取得':received[no]?'已取得':'待取得'}</small></span>)}</div>;
 const submitQuestion=()=>{
  if(current.charades){
   const normalized=charadeText.normalize('NFKC').replace(/\\s+/g,'');
   const positions=current.keywords.map(word=>normalized.indexOf(word));
   const ok=positions.every(position=>position>=0)&&positions.every((position,index)=>index===0||position>positions[index-1]);
   if(!ok){setError('還缺少比手畫腳得到的關鍵字，或五個詞的順序不正確。請依「跟蹤 → 打電話 → 分開 → 線索 → 寫信」重新整理。');return}
   setError('');setStage(stage+1);return
  }
  if(!answer){setError('請先選擇一個答案。');return}
  if(answer!==current.correct){setError('查核不符。請確認你選的是「完整推論」，不是只符合其中一小段線索的說法。');return}
  setError('');setStage(stage+1)
 };
 const receiveFragment=()=>{
  const no=current.fragment;
  setReceived(prev=>({...prev,[no]:true}));
  setAnswer('');setCharadeText('');setError('');setStage(stage+1)
 };
 const finishSecondDay=()=>{
  window.localStorage.setItem('suzuran-ending-ready','1');
  onComplete?.();
 };
 return <section className="day2-fragment-flow" aria-label="第二日工程圖碎片追查">
  <header className="day2-progress"><div><small>DAY 02 / GREEN CORRIDOR FILE</small><b>重建《七－圖庫地下工程圖》</b></div><strong>{foundCount} / 5</strong></header>
  {fragmentBar}
  {stage===0&&<section className="day2-stage day2-intro-stage"><p className="day2-kicker">案件查核資料</p><h4>昨晚鈴蘭與青木為什麼將工程圖拆成五片？</h4><p>今早，集合地點收到一封沒有署名的信。信封中已有《七－圖庫地下工程圖》碎片①、鈴蘭留下的訊息，以及一張未完成的綠空廊道路線圖。</p><p>鈴蘭寫道：「昨晚我去通知父親時，後面一直有人跟著，我們不能帶著完整的圖一起走，所以把它拆開了。有些是我們藏起來的，有些可能在逃跑時掉了。不要只追著我的腳步走，父親和我曾經分開。」</p><p>你們已經拿到第一片。前三題要重建行動邏輯；第四題則要靠現場比手畫腳，還原鈴蘭沒有直接寫下來的行動訊息。</p><p className="choice-reminder">提示：第四題請先完成五個關鍵字的比手畫腳，再把五個詞依正確順序放回網站句子。</p></section>}
  {stage<8&&stage%2===0&&current&&<section className="day2-stage"><p className="day2-kicker">Q{current.no}｜碎片追查</p><h4>{current.title}</h4><p>{current.prompt}</p>{current.charades?<><div className="charades-note"><b>現場任務</b><p>隊輔依序出示五張關鍵字卡：跟蹤、打電話、分開、線索、寫信。每題40秒；表演者不能說話、寫字、用嘴型提示或直接指出答案文字。</p></div><p className="day2-charades-frame">「{current.frame}」</p><label className="day2-charades-input">請輸入完整句子<textarea rows="4" value={charadeText} onChange={event=>{setCharadeText(event.target.value);setError('')}} placeholder="把五個比手畫腳答案依正確順序填入句子中。"/></label></>:<div className="day2-choice-list">{current.options.map(([value,label])=><label key={value} className={answer===value?'is-selected':''}><input type="radio" name={'day2-q-'+current.no} value={value} checked={answer===value} onChange={()=>{setAnswer(value);setError('')}}/><span><b>{value}.</b> {label}</span></label>)}</div>}{error&&<p className="day2-error">{error}</p>}<button className="day2-next" type="button" onClick={submitQuestion}>{current.charades?'完成無聲訊息':'確認答案'}</button></section>}
  {stage<8&&stage%2===1&&current&&<section className="day2-stage reward-stage"><p className="day2-kicker">Q{current.no} 查核完成</p><h4>請向工作人員領取工程圖碎片{current.fragment}</h4><p>{current.result}</p><p>領到實體碎片後，再按下方按鈕進入下一題。</p><button className="day2-next" type="button" onClick={receiveFragment}>我已取得碎片{current.fragment}・進入下一項追查</button></section>}
  {stage===8&&<section className="day2-stage final-choice-stage"><p className="day2-kicker">最終步驟｜拼回完整工程圖</p><h4>你們已經取得碎片①～⑤</h4><p>請把五片實體工程圖放在一起，依線條、文字與邊緣位置拼回完整《七－圖庫地下工程圖》。</p><div className="charades-note"><b>完成條件</b><p>五片必須能組成同一張連續圖面。拼好後由小組自行再次核對。本關到此結束；「是否刊登」已移至市役所首頁的獨立「最終發刊決定」。</p></div><button className="day2-next" type="button" onClick={finishSecondDay}>工程圖已重建・完成第二日追查</button></section>}
 </section>
}
`;

export function secondDayTransform(){
 return {
  name:'suzuran-second-day-transform',
  enforce:'pre',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   let next=code;
   if(!next.includes("import './second-day.css';"))next=next.replace("import './newspaper.css';","import './newspaper.css';\nimport './second-day.css';");
   if(!next.includes("import './second-day-ending.css';"))next=next.replace("import './second-day.css';","import './second-day.css';\nimport './second-day-ending.css';");
   const puzzleAnchor='const puzzles = mainlineCases;';
   if(next.includes(puzzleAnchor)&&!next.includes("customFlow: 'greenCorridorFragments'"))next=next.replace(puzzleAnchor,secondDaySetup+'\n\n'+puzzleAnchor);
   const fieldAnchor='function FieldJournal({item,index,unlockedCount,sharedSolved,onSharedSolved}){';
   if(next.includes(fieldAnchor)&&!next.includes('function GreenCorridorFragmentFlow('))next=next.replace(fieldAnchor,component+'\n\n'+fieldAnchor);
   const oldForm=`{!item.direct&&!item.pending&&!solved&&<form onSubmit={submit}><label htmlFor={'case-'+index}>{item.inputLabel}</label><div><input id={'case-'+index} value={value} onChange={event=>{setValue(event.target.value);setError(false)}} placeholder={'請輸入'+item.inputLabel}/><button type="submit">送交查核</button></div>{error&&<small>登記內容不符，請重新確認現場線索。</small>}</form>}`;
   if(next.includes(oldForm)&&!next.includes("item.customFlow==='greenCorridorFragments'")){
    const wrapped=`<>{item.customFlow==='greenCorridorFragments'&&!solved?<GreenCorridorFragmentFlow onComplete={()=>{setSolved(true);window.localStorage.setItem(unlockKey,'1');onSharedSolved?.(index)}}/>:<>${oldForm}</>}</>`;
    next=next.replace(oldForm,wrapped);
   }
   const routeAnchor="if(page==='guide') return <GameGuidePage/>;";
   if(next.includes(routeAnchor)&&!next.includes("if(page==='ending')"))next=next.replace(routeAnchor,routeAnchor+"\n if(page==='ending') return <EndingChoicePage/>;");
   const sidebarAnchor="<button onClick={()=>open('./?page=info')}>六、洽詢須知</button>";
   if(next.includes(sidebarAnchor)&&!next.includes("七、最終發刊決定"))next=next.replace(sidebarAnchor,sidebarAnchor+"<button onClick={()=>open('./?page=ending')}>七、最終發刊決定</button>");
   const noticeAnchor="<button onClick={()=>open('./?page=puzzles')}>案件目錄</button></article></div></section>";
   if(next.includes(noticeAnchor)&&!next.includes('終局第〇一號'))next=next.replace(noticeAnchor,"<button onClick={()=>open('./?page=puzzles')}>案件目錄</button></article><article><time>八月十五日</time><div><small>終局第〇一號</small><h3>最終發刊決定另案辦理</h3><p>第二日工程圖重建完成後，是否刊登之抉擇不再接續於關卡頁；請由本公示板另行進入最終發刊決定。</p></div><button onClick={()=>open('./?page=ending')}>前往結局</button></article></div></section>");
   return next===code?null:{code:next,map:null};
  }
 };
}
