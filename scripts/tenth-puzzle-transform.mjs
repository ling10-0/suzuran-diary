const tenthPuzzleSetup = `
Object.assign(mainlineCases[9], {
  day: 1,
  direct: false,
  pending: false,
  type: 'investigation',
  code: '市場第〇十號',
  taskTitle: '新富町市場（第二市場）＋鹿港阿甫師肉包',
  directoryTitle: '新富町市場（第二市場）',
  label: '新富町市場（第二市場）＋鹿港阿甫師肉包',
  inputLabel: '請完成四號置物箱查核',
  hint: '從舊寄放帳冊找出青先生與阿蘭共同使用的置物箱，再整理箱內不同年代的物件，判斷兩人的關係。',
  question: '同一個置物箱，為什麼會同時留下多年前與今日的訊息？',
  questionDetails: [
    '第二市場的老店員翻出一本多年未動的舊寄放帳冊。幾筆紀錄沒有完整姓名，只留下「青先生」、「阿蘭」、「兩人份」、「不送，等來取」等簡短文字。',
    '兩人很少在同一天出現，卻曾使用同一個置物箱。開啟正確箱子後，你們將看到一本兒童識字簿、一張舊取物紙條、一張帶有藍綠色記號的紙封，以及一封日期就在今日的未寄便條。',
    '請依序查帳、開箱、整理物件年代並配對證據。本站將把第九站留下的「蘭」與更早以前的「阿蘭」重新連在一起。'
  ],
  questionHint: '不要只看姓名，也要比對箱號、代取備註、物件年代與「父親」這個稱呼。',
  customFlow: 'marketLocker'
});`;

const marketLockerComponent = String.raw`
function MarketLockerFlow({onComplete}){
 const [stage,setStage]=useState(0);
 const [lockerAnswer,setLockerAnswer]=useState('');
 const [openedLocker,setOpenedLocker]=useState(null);
 const [error,setError]=useState('');
 const [classification,setClassification]=useState({book:'',slip:'',wrapper:'',note:''});
 const [pairs,setPairs]=useState({p1:'',p2:'',p3:'',p4:''});
 const [finalOne,setFinalOne]=useState('');
 const [finalTwo,setFinalTwo]=useState('');
 const [ready,setReady]=useState(false);
 const objects={
  book:{title:'阿蘭的識字簿',detail:'封面寫著「阿蘭」。內頁反覆練習「父、親、青、木」，其中「青」「木」被藍綠色鉛筆圈起；後頁寫著：「父親教我寫自己的名字。他說，在外面不要叫他的本名。」'},
  slip:{title:'舊取物紙條',detail:'「四號箱。青先生未到。飯食仍留兩人份。阿蘭晚些來取。藥包一併交付。」'},
  wrapper:{title:'藍綠色記號紙封',detail:'舊紙封寫著「四號」「阿蘭取」，角落留有熟悉的藍綠色圈記，以及與先前青木資料相似的數字寫法。'},
  note:{title:'今日未寄便條',detail:'日期為今日。內容：「父親：最近又有人在問當年的圖。我會照常帶他們走完今天，晚上再去找你。」'}
 };
 const setClass=(key,value)=>{setClassification(current=>({...current,[key]:value}));setError('')};
 const checkClassification=()=>{
  const ok=classification.book==='past'&&classification.slip==='past'&&classification.wrapper==='past'&&classification.note==='today';
  if(ok){setError('');setStage(4)}else setError('至少有一件物品的年代分類不符，請特別注意便條上的日期。')
 };
 const checkPairs=()=>{
  const ok=pairs.p1==='E1'&&pairs.p2==='E2'&&pairs.p3==='E3'&&pairs.p4==='E4';
  if(ok){setError('');setStage(5)}else setError('證據配對仍有一處不符，請回頭比對識字簿、紙封與今日便條。')
 };
 return <section className="market-locker-flow" aria-label="第二市場四號置物箱查核">
  <header className="market-progress"><small>SHINTOMICHO LOCKER FILE</small><b>第 {Math.min(stage+1,6)}／6 階段</b></header>
  {stage===0&&<section className="market-stage">
   <p className="market-kicker">第一階段｜查看舊寄放帳冊</p><h4>哪一個箱子同時與青先生和阿蘭有關？</h4>
   <div className="market-ledger" role="table" aria-label="第二市場舊寄放帳冊">
    <div className="ledger-row ledger-head"><b>日期</b><b>取物人</b><b>寄放品項</b><b>數量</b><b>備註</b><b>箱號</b></div>
    {[
     ['六月三日','林先生','布包','1','已送出','1'],['六月八日','青先生','餐盒','2','不送，等來取','4'],['六月十一日','陳氏','茶葉','1','當日取走','2'],['六月十五日','阿蘭','藥袋','1','放原箱','6'],['六月十九日','黃先生','麵粉袋','2','已送出','3'],['六月二十二日','阿蘭','餐盒','2','代青先生取，不送','4']
    ].map((row,index)=><div className="ledger-row" key={index}>{row.map((cell,i)=><span key={i}>{cell}</span>)}</div>)}
   </div>
   <div className="market-options">{[['A','1號箱'],['B','2號箱'],['C','4號箱'],['D','6號箱']].map(([value,label])=><label key={value}><input type="radio" name="locker-ledger" checked={lockerAnswer===value} onChange={()=>{setLockerAnswer(value);setError('')}}/><span>{value}. {label}</span></label>)}</div>
   {error&&<small className="market-error">{error}</small>}
   <button className="market-next" type="button" onClick={()=>{if(lockerAnswer==='C'){setError('');setStage(1)}else setError('請再比對六月八日與六月二十二日的箱號及代取備註。')}}>確認帳冊線索</button>
  </section>}
  {stage===1&&<section className="market-stage">
   <p className="market-kicker">第二階段｜開啟網站置物箱</p><h4>請點選帳冊指向的置物箱</h4>
   <div className="locker-grid">{[[1,'普通布包'],[2,'空茶罐'],[3,'麵粉寄放紀錄'],[4,'存在未登錄物件'],[5,'無資料'],[6,'一只舊藥袋']].map(([no,desc])=><button type="button" className={openedLocker===no?'is-open':''} key={no} onClick={()=>{setOpenedLocker(no);setError(no===4?'':'這個箱子只有一般寄放資料，沒有主要線索。')}}><b>{no}</b><span>{openedLocker===no?desc:'置物箱'}</span></button>)}</div>
   {openedLocker===4&&<div className="locker-found"><b>4號箱・開封</b><p>箱內有四件年代不同的物品，而且其中一張便條的日期就在今日。</p></div>}
   {error&&<small className="market-error">{error}</small>}
   <button className="market-next" type="button" disabled={openedLocker!==4} onClick={()=>setStage(2)}>整理箱內物件</button>
  </section>}
  {stage===2&&<section className="market-stage">
   <p className="market-kicker">第三階段｜檢視四件物品</p><h4>先讀完內容，再判斷它們分屬哪個時間</h4>
   <div className="locker-object-grid">{Object.entries(objects).map(([key,obj],index)=><article key={key}><small>物件 {index+1}</small><h5>{obj.title}</h5><p>{obj.detail}</p></article>)}</div>
   <button className="market-next" type="button" onClick={()=>setStage(3)}>開始整理年代</button>
  </section>}
  {stage===3&&<section className="market-stage">
   <p className="market-kicker">第四階段｜整理物件時間</p><h4>將每件物品分成「過去留下」或「今日留下」</h4>
   <div className="classification-list">{Object.entries(objects).map(([key,obj])=><article key={key}><b>{obj.title}</b><div><button type="button" className={classification[key]==='past'?'active':''} onClick={()=>setClass(key,'past')}>過去留下</button><button type="button" className={classification[key]==='today'?'active':''} onClick={()=>setClass(key,'today')}>今日留下</button></div></article>)}</div>
   {error&&<small className="market-error">{error}</small>}
   <button className="market-next" type="button" onClick={checkClassification}>確認年代分類</button>
  </section>}
  {stage===4&&<section className="market-stage">
   <p className="market-kicker">第五階段｜證據配對</p><h4>哪一份證據最能支持下面的推論？</h4>
   <div className="evidence-pair-list">{[['p1','阿蘭與現在的鈴蘭高度相關'],['p2','青先生很可能就是青木'],['p3','青木與阿蘭是父女關係'],['p4','這段聯絡直到現在仍未中斷']].map(([key,label])=><label key={key}><span>{label}</span><select value={pairs[key]} onChange={event=>{setPairs(current=>({...current,[key]:event.target.value}));setError('')}}><option value="">請選擇證據</option><option value="E1">識字簿封面「阿蘭」＋第九站反覆出現的「蘭」</option><option value="E2">藍綠色記號紙封＋與前站相似的數字寫法</option><option value="E3">識字簿中的「父親」＋「青」「木」文字</option><option value="E4">日期為今日、以「父親」開頭的未寄便條</option></select></label>)}</div>
   {error&&<small className="market-error">{error}</small>}
   <button className="market-next" type="button" onClick={checkPairs}>完成證據配對</button>
  </section>}
  {stage===5&&<section className="market-stage">
   <p className="market-kicker">第六階段｜最後判斷</p><h4>把人物關係與「現在仍在聯絡」分開確認</h4>
   <p className="market-question">題目一｜哪一項最能解釋「青先生」與「阿蘭」的關係？</p>
   <div className="market-options">{[['A','只是經常使用同一家店的顧客'],['B','市場店員與送貨女孩'],['C','很可能是父女；青先生即青木，阿蘭則與現在的鈴蘭高度相關'],['D','無法建立任何關係']].map(([value,label])=><label key={value}><input type="radio" name="market-final-one" checked={finalOne===value} onChange={()=>{setFinalOne(value);setError('')}}/><span>{value}. {label}</span></label>)}</div>
   <p className="market-question">題目二｜哪一份資料最能證明這段聯絡沒有只停留在過去？</p>
   <div className="market-options">{[['A','六月八日的寄放帳冊'],['B','舊取物紙條'],['C','藍綠色紙封'],['D','日期為今日、以「父親」開頭的未寄便條']].map(([value,label])=><label key={value}><input type="radio" name="market-final-two" checked={finalTwo===value} onChange={()=>{setFinalTwo(value);setError('')}}/><span>{value}. {label}</span></label>)}</div>
   {error&&<small className="market-error">{error}</small>}
   {!ready?<button className="market-next" type="button" onClick={()=>{if(finalOne==='C'&&finalTwo==='D'){setReady(true);setError('')}else setError('請重新比對父女關係的證據，以及哪一份資料明確標示為今日。')}}>送交最後判讀</button>:<div className="market-final"><b>四號箱的時間線已接上</b><p>多年以前，阿蘭會替青先生領取餐食與藥物；而今天，仍有人使用同一個箱子留下寫給「父親」的便條。現有證據足以讓你們高度懷疑青先生就是青木、阿蘭與現在的鈴蘭高度相關，且這條聯絡並未中斷。</p><p>但在最後真相揭露前，案件記錄仍保留「高度相關」而非直接將兩個名字完全畫上等號。</p><button className="market-next" type="button" onClick={onComplete}>完成第十號案件查核</button></div>}
  </section>}
 </section>
}
`;

export function tenthPuzzleTransform(){
 return {
  name:'suzuran-tenth-puzzle-transform',
  enforce:'pre',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   let next=code;
   if(!next.includes("import './tenth-puzzle.css';")) next=next.replace("import './newspaper.css';","import './newspaper.css';\nimport './tenth-puzzle.css';");
   const puzzleAnchor='const puzzles = mainlineCases;';
   if(next.includes(puzzleAnchor)&&!next.includes("customFlow: 'marketLocker'")) next=next.replace(puzzleAnchor,tenthPuzzleSetup+'\n\n'+puzzleAnchor);
   const fieldAnchor='function FieldJournal({item,index,unlockedCount,sharedSolved,onSharedSolved}){';
   if(next.includes(fieldAnchor)&&!next.includes('function MarketLockerFlow(')) next=next.replace(fieldAnchor,marketLockerComponent+'\n\n'+fieldAnchor);
   const oldForm=`{!item.direct&&!item.pending&&!solved&&<form onSubmit={submit}><label htmlFor={'case-'+index}>{item.inputLabel}</label><div><input id={'case-'+index} value={value} onChange={event=>{setValue(event.target.value);setError(false)}} placeholder={'請輸入'+item.inputLabel}/><button type="submit">送交查核</button></div>{error&&<small>登記內容不符，請重新確認現場線索。</small>}</form>}`;
   if(next.includes(oldForm)&&!next.includes("item.customFlow==='marketLocker'")){
    const wrapped=`<>{item.customFlow==='marketLocker'&&!solved?<MarketLockerFlow onComplete={()=>{setSolved(true);window.localStorage.setItem(unlockKey,'1');onSharedSolved?.(index)}}/>:<>{${oldForm}}</>}</>`;
    next=next.replace(oldForm,wrapped);
   }
   return next===code?null:{code:next,map:null};
  }
 };
}
