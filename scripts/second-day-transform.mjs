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
  hint: '碎片①由工作人員於開場直接發放。依序完成四項追查，取得碎片②～⑤，最後拼回完整工程圖。',
  question: '昨晚鈴蘭與青木為什麼將工程圖拆成五片？',
  questionDetails: [
    '今早，集合地點收到一封沒有署名的信。信封中已有《七－圖庫地下工程圖》碎片①、鈴蘭留下的訊息，以及一張未完成的綠空廊道路線圖。',
    '鈴蘭寫道：「昨晚我去通知父親時，後面一直有人跟著，我們不能帶著完整的圖一起走，所以把它拆開了。有些是我們藏起來的，有些可能在逃跑時掉了。不要只追著我的腳步走，父親和我曾經分開。」',
    '你們已經拿到第一片。接下來必須重建兩人的行動，再找回其餘四片。'
  ],
  questionHint: '本日以網站判讀為主；每關完成後，依畫面指示向工作人員領取對應的實體工程圖碎片。',
  customFlow: 'greenCorridorFragments'
});`;

const component = String.raw`
function GreenCorridorFragmentFlow({onComplete}){
 const [stage,setStage]=useState(0);
 const [error,setError]=useState('');
 const [classes,setClasses]=useState({});
 const [order,setOrder]=useState([]);
 const [falseCard,setFalseCard]=useState('');
 const [hiddenSpot,setHiddenSpot]=useState('');
 const [actionOrder,setActionOrder]=useState([]);
 const [mapChecks,setMapChecks]=useState({});
 const [choice,setChoice]=useState('');
 const [received,setReceived]=useState({2:false,3:false,4:false,5:false});
 const classCards=[
  ['c1','一名男子抱著長紙筒，途中扶著欄杆休息。'],
  ['c2','一名年輕女子快速通過，數分鐘後又從反方向出現。'],
  ['c3','座椅旁留下一只寫有「飯後服用」的藥袋，附近有人看見抱著長紙筒的男子短暫休息。'],
  ['c4','兩名陌生男子詢問抱著紙筒者的去向。'],
  ['c5','一名普通路人牽著腳踏車經過。'],
  ['c6','一名年輕女子往車站方向跑去，數分鐘後又從另一條路折返。']
 ];
 const timeCards=[
  ['t4','19時50分｜有人聲稱，一名男子把長紙筒交給搬運工後前往車站。'],
  ['t1','19時38分｜一名年輕女子買了一瓶溫水，接著先走到前方路口查看，又折返回公共電話。'],
  ['t6','19時55分｜兩名陌生男子要求附近店家，若有人詢問，就回答抱著紙筒的人去了車站。'],
  ['t3','通話後五分鐘｜一名抱著長紙筒的年長男子在座椅旁休息，留下藥袋；此時年輕女子已通過下一個路口。'],
  ['t2','買水後四分鐘｜同一名女子使用公共電話，只說：「前面有人守著，不要走原來的方向。」'],
  ['t5','19時53分｜一名左袖破損、仍抱著長紙筒的年長男子，出現在與車站相反的路段。']
 ];
 const actions=['探路','示警','分開','藏圖','留給記者'];
 const addOrder=(id,setter,current)=>{if(!current.includes(id)){setter([...current,id]);setError('')}};
 const removeOrder=(id,setter,current)=>{setter(current.filter(x=>x!==id));setError('')};
 const fragmentBar=<div className="fragment-status" aria-label="工程圖碎片進度">{[1,2,3,4,5].map(no=><span key={no} className={no===1||received[no]?'is-found':''}><b>碎片{no}</b><small>{no===1?'開場取得':received[no]?'已取得':'待取得'}</small></span>)}</div>;
 const markReceived=no=>{setReceived(current=>({...current,[no]:true}));setError('');setStage(current=>current+1)};
 return <section className="day2-fragment-flow" aria-label="第二日工程圖碎片追查">
  <header className="day2-progress"><div><small>DAY 02 / GREEN CORRIDOR FILE</small><b>重建《七－圖庫地下工程圖》</b></div><strong>{Math.min(stage+1,6)} / 6</strong></header>
  {fragmentBar}

  {stage===0&&<section className="day2-stage">
   <p className="day2-kicker">第一關｜誰走過這裡</p><h4>把六張目擊紀錄分給正確的人</h4>
   <p>青木行動較慢且攜帶長紙筒；鈴蘭曾快速折返；另外還有追查者與無關路人。請逐張判斷。</p>
   <div className="day2-card-list">{classCards.map(([id,text],i)=><article key={id}><small>紀錄卡 {i+1}</small><p>{text}</p><select value={classes[id]||''} onChange={e=>{setClasses(current=>({...current,[id]:e.target.value}));setError('')}}><option value="">選擇人物</option><option value="aoki">青木</option><option value="suzuran">鈴蘭</option><option value="pursuer">追查者</option><option value="other">無關路人</option></select></article>)}</div>
   {error&&<p className="day2-error">{error}</p>}
   <button className="day2-next" type="button" onClick={()=>{const ok=classes.c1==='aoki'&&classes.c2==='suzuran'&&classes.c3==='aoki'&&classes.c4==='pursuer'&&classes.c5==='other'&&classes.c6==='suzuran';if(ok){setError('');setStage(1)}else setError('仍有紀錄卡分類不符。注意長紙筒、藥袋、折返與詢問去向的人。')}}>確認六張紀錄</button>
  </section>}

  {stage===1&&!received[2]&&<section className="day2-stage reward-stage"><p className="day2-kicker">第一關完成</p><h4>請向工作人員領取工程圖碎片②</h4><p>你們確認：青木仍帶著主要圖面、行動較慢；鈴蘭則刻意折返，引開追查者。兩人並非全程同行。</p><button className="day2-next" type="button" onClick={()=>markReceived(2)}>我已取得碎片②</button></section>}

  {stage===2&&<section className="day2-stage">
   <p className="day2-kicker">第二關｜昨晚的順序</p><h4>依時間排列六張紀錄，再找出最不可信的一張</h4>
   <p>點擊卡片依序加入時間線；點擊上方已加入的卡片可移除。</p>
   <div className="selected-order">{order.length===0?<span>尚未排列</span>:order.map((id,i)=><button key={id} type="button" onClick={()=>removeOrder(id,setOrder,order)}>{i+1}. {timeCards.find(x=>x[0]===id)?.[1].split('｜')[0]}</button>)}</div>
   <div className="time-card-grid">{timeCards.map(([id,text])=><button key={id} type="button" disabled={order.includes(id)} onClick={()=>addOrder(id,setOrder,order)}>{text}</button>)}</div>
   <label className="day2-select-label">哪一張最不可信？<select value={falseCard} onChange={e=>{setFalseCard(e.target.value);setError('')}}><option value="">請選擇</option>{timeCards.map(([id,text])=><option key={id} value={id}>{text.split('｜')[0]}</option>)}</select></label>
   {error&&<p className="day2-error">{error}</p>}
   <button className="day2-next" type="button" onClick={()=>{const correct=['t1','t2','t3','t4','t5','t6'];const ok=order.length===6&&order.every((id,i)=>id===correct[i])&&falseCard==='t4';if(ok){setError('');setStage(3)}else setError('時間線或假消息判斷仍不正確。相對時間要從19:38往後換算，並比對19:50、19:53與19:55三筆紀錄。')}}>確認時間線</button>
  </section>}

  {stage===3&&!received[3]&&<section className="day2-stage reward-stage"><p className="day2-kicker">第二關完成</p><h4>請向工作人員領取工程圖碎片③</h4><p>19時50分的「已交出紙筒、前往車站」與19時53分的目擊直接矛盾；19時55分又證明有人要求店家統一散布車站說法。</p><button className="day2-next" type="button" onClick={()=>markReceived(3)}>我已取得碎片③</button></section>}

  {stage===4&&<section className="day2-stage">
   <p className="day2-kicker">第三關｜藏起來，還是掉下來</p><h4>哪一處真正是兩人刻意藏圖的位置？</h4>
   <div className="spot-grid">{[
    ['A','紙張被壓在不易被風吹走的位置；外層包有防水紙；附近沒有拉扯痕跡，但外層沒有寫明《七－圖庫》。'],
    ['B','地面只有撕裂紙角、水漬與泥痕；角落留有藍綠色短線，另有一組較小鞋印停留後轉向別路，原本圖紙已不在現場。'],
    ['C','紙上清楚寫著《七－圖庫》；記號使用黑墨水；比例與第一日資料不同；紙張過於完整，沒有折疊與攜帶痕跡。']
   ].map(([id,text])=><label key={id} className={hiddenSpot===id?'is-selected':''}><input type="radio" name="hidden-spot" value={id} checked={hiddenSpot===id} onChange={()=>{setHiddenSpot(id);setError('')}}/><b>位置 {id}</b><span>{text}</span></label>)}</div>
   {error&&<p className="day2-error">{error}</p>}
   <button className="day2-next" type="button" onClick={()=>{if(hiddenSpot==='A'){setError('');setStage(5)}else setError('請區分「刻意藏好」、「逃跑時掉落」與「追查者製作的假圖」。')}}>確認藏圖位置</button>
  </section>}

  {stage===5&&!received[4]&&<section className="day2-stage reward-stage"><p className="day2-kicker">第三關完成</p><h4>請向工作人員領取工程圖碎片④</h4><p>防水包裝、固定位置與沒有拉扯痕跡，顯示這一片是刻意藏起；另一處則更像逃亡途中掉落。</p><button className="day2-next" type="button" onClick={()=>markReceived(4)}>我已取得碎片④</button></section>}

  {stage===6&&<section className="day2-stage">
   <p className="day2-kicker">第四關｜鈴蘭的無聲訊息</p><h4>先完成比手畫腳，再把五個行動排成鈴蘭當晚的順序</h4>
   <div className="charades-note"><b>實體任務</b><p>由隊輔提供五張題目卡：探路、示警、分開、藏圖、留給記者。每題45秒；表演者不能說話、寫字或用嘴型提示。</p></div>
   <div className="selected-order action-order">{actionOrder.length===0?<span>五詞猜完後，在這裡開始排序</span>:actionOrder.map((word,i)=><button key={word} type="button" onClick={()=>removeOrder(word,setActionOrder,actionOrder)}>{i+1}. {word}</button>)}</div>
   <div className="action-grid">{actions.map(word=><button key={word} type="button" disabled={actionOrder.includes(word)} onClick={()=>addOrder(word,setActionOrder,actionOrder)}>{word}</button>)}</div>
   {error&&<p className="day2-error">{error}</p>}
   <button className="day2-next" type="button" onClick={()=>{const ok=actionOrder.length===5&&actionOrder.every((word,i)=>word===actions[i]);if(ok){setError('');setStage(7)}else setError('行動順序仍不正確。回想鈴蘭先確認前方、再通知青木，之後兩人才分開。')}}>確認五個行動</button>
  </section>}

  {stage===7&&!received[5]&&<section className="day2-stage reward-stage"><p className="day2-kicker">第四關完成</p><h4>請向工作人員領取工程圖碎片⑤</h4><p>鈴蘭的行動可還原為：探路 → 示警 → 分開 → 藏圖 → 留給記者。</p><button className="day2-next" type="button" onClick={()=>markReceived(5)}>我已取得碎片⑤</button></section>}

  {stage===8&&<section className="day2-stage">
   <p className="day2-kicker">最終關｜重建《七－圖庫地下工程圖》</p><h4>把五片實體工程圖拼合，再核對完整圖面</h4>
   <p>拼好後，請勾選你們確實能從完整圖面辨認出的內容。</p>
   <div className="map-checks">{[
    ['m1','正式版本中不存在的地下空間'],
    ['m2','一條遭黑線覆蓋的通道'],
    ['m3','一處未列入工程年報的保管室'],
    ['m4','與第一日第五站經費紀錄相同的工程代碼'],
    ['m5','第七號技手留下的藍綠色「待上報」記號']
   ].map(([id,text])=><label key={id}><input type="checkbox" checked={!!mapChecks[id]} onChange={e=>setMapChecks(current=>({...current,[id]:e.target.checked}))}/><span>{text}</span></label>)}</div>
   {error&&<p className="day2-error">{error}</p>}
   <button className="day2-next" type="button" onClick={()=>{const ok=['m1','m2','m3','m4','m5'].every(k=>mapChecks[k]);if(ok){setError('');setStage(9)}else setError('請先實際拼合五片工程圖，再逐項核對完整圖面上的五個特徵。')}}>完成工程圖核對</button>
  </section>}

  {stage===9&&<section className="day2-stage final-choice-stage">
   <p className="day2-kicker">最終抉擇</p><h4>你們要把多少真相交出去？</h4>
   <div className="notice-pair"><article><small>市役所通知</small><p>「請立即提交工程圖，以及鈴蘭與青木的行蹤。」</p></article><article><small>報社總編通知</small><p>「最先交回完整獨家報導的隊伍，將獲得中央總社推薦資格。」</p></article></div>
   <div className="final-choice-list">
    <label className={choice==='official'?'is-selected':''}><input type="radio" name="day2-choice" checked={choice==='official'} onChange={()=>setChoice('official')}/><div><b>選擇一｜全部交給官方</b><p>提交工程圖、青木身分與兩人的逃亡路線。可能取得獨家新聞，但青木與鈴蘭會再次成為追查目標，工程圖也可能被收回。</p></div></label>
    <label className={choice==='hide'?'is-selected':''}><input type="radio" name="day2-choice" checked={choice==='hide'} onChange={()=>setChoice('hide')}/><div><b>選擇二｜隱藏全部資料</b><p>不公開工程圖與調查結果，以最大程度保護青木與鈴蘭，但《七－圖庫》與六名技術人員的真相可能再次被掩埋。</p></div></label>
   </div>
   <p className="choice-reminder">選擇沒有標準答案。完成前，請和隊友說明：你們的理由、願意承擔的後果，以及哪些資訊應公開、哪些應被保護。</p>
   <button className="day2-next" type="button" disabled={!choice} onClick={onComplete}>確認小隊最終決定</button>
  </section>}
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
   const puzzleAnchor='const puzzles = mainlineCases;';
   if(next.includes(puzzleAnchor)&&!next.includes("customFlow: 'greenCorridorFragments'"))next=next.replace(puzzleAnchor,secondDaySetup+'\n\n'+puzzleAnchor);
   const fieldAnchor='function FieldJournal({item,index,unlockedCount,sharedSolved,onSharedSolved}){';
   if(next.includes(fieldAnchor)&&!next.includes('function GreenCorridorFragmentFlow('))next=next.replace(fieldAnchor,component+'\n\n'+fieldAnchor);
   const oldForm=`{!item.direct&&!item.pending&&!solved&&<form onSubmit={submit}><label htmlFor={'case-'+index}>{item.inputLabel}</label><div><input id={'case-'+index} value={value} onChange={event=>{setValue(event.target.value);setError(false)}} placeholder={'請輸入'+item.inputLabel}/><button type="submit">送交查核</button></div>{error&&<small>登記內容不符，請重新確認現場線索。</small>}</form>}`;
   if(next.includes(oldForm)&&!next.includes("item.customFlow==='greenCorridorFragments'")){
    const wrapped=`<>{item.customFlow==='greenCorridorFragments'&&!solved?<GreenCorridorFragmentFlow onComplete={()=>{setSolved(true);window.localStorage.setItem(unlockKey,'1');onSharedSolved?.(index)}}/>:<>${oldForm}</>}</>`;
    next=next.replace(oldForm,wrapped);
   }
   return next===code?null:{code:next,map:null};
  }
 };
}
