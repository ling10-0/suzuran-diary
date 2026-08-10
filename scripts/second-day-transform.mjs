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
  hint: '碎片①由工作人員於開場直接發放。每答對一題，依畫面指示向工作人員領取下一片，最後將碎片①～⑤拼回完整工程圖。',
  question: '昨晚鈴蘭與青木為什麼將工程圖拆成五片？',
  questionDetails: [
    '今早，集合地點收到一封沒有署名的信。信封中已有《七－圖庫地下工程圖》碎片①、鈴蘭留下的訊息，以及一張未完成的綠空廊道路線圖。',
    '鈴蘭寫道：「昨晚我去通知父親時，後面一直有人跟著，我們不能帶著完整的圖一起走，所以把它拆開了。有些是我們藏起來的，有些可能在逃跑時掉了。不要只追著我的腳步走，父親和我曾經分開。」',
    '你們已經拿到第一片。接下來完成四項判讀；每完成一題，就向工作人員領取一片工程圖碎片。'
  ],
  questionHint: '選擇題都有唯一正解。答對後才會出現領取碎片並進入下一題的按鈕。',
  customFlow: 'greenCorridorFragments'
});`;

const component = String.raw`
function GreenCorridorFragmentFlow({onComplete}){
 const [stage,setStage]=useState(0);
 const [answer,setAnswer]=useState('');
 const [error,setError]=useState('');
 const [received,setReceived]=useState({2:false,3:false,4:false,5:false});
 const questions=[
  {
   no:1,
   title:'為什麼要把工程圖拆開？',
   prompt:'依鈴蘭留下的訊息，昨晚她與青木為什麼沒有帶著完整工程圖一起離開？',
   options:[
    ['A','因為完整工程圖太大，無法放進隨身包裡。'],
    ['B','因為有人跟蹤他們，完整工程圖若集中在一人身上，一旦被攔下就會全部失去。'],
    ['C','因為兩人打算把工程圖分送給不同報社。'],
    ['D','因為工程圖原本就只有五張互不相關的紙。']
   ],
   correct:'B',
   result:'他們拆圖不是為了方便攜帶，而是為了分散風險，避免完整證據一次被奪走。',
   fragment:2
  },
  {
   no:2,
   title:'兩人分開後，碎片可能怎麼被保管？',
   prompt:'鈴蘭特別提醒「不要只追著我的腳步走，父親和我曾經分開」。哪一項推論最合理？',
   options:[
    ['A','所有碎片最後都交給鈴蘭保管，青木身上沒有任何資料。'],
    ['B','青木把全部碎片帶去車站，鈴蘭只是負責引路。'],
    ['C','兩人分開保管不同碎片，有些刻意藏起，有些可能在逃跑時掉落。'],
    ['D','兩人分開後就放棄工程圖，不再試圖保留證據。']
   ],
   correct:'C',
   result:'所以剩餘碎片不會只集中在一條路線上；必須同時重建鈴蘭與青木的行動。',
   fragment:3
  },
  {
   no:3,
   title:'為什麼不能只追鈴蘭的路線？',
   prompt:'若只沿著鈴蘭最後出現的方向尋找，最可能漏掉什麼？',
   options:[
    ['A','市場裡一般旅客留下的物品。'],
    ['B','青木在兩人分開後藏起或遺落的工程圖碎片。'],
    ['C','第一日所有已經完成的案件。'],
    ['D','鈴蘭沒有任何線索，因此追哪條路都一樣。']
   ],
   correct:'B',
   result:'鈴蘭留下這句提醒，就是要你們把兩人的路線拆開看，而不是把所有線索都歸到她身上。',
   fragment:4
  },
  {
   no:4,
   title:'拿齊五片之後要做什麼？',
   prompt:'當碎片①～⑤都找回後，哪一個行動才算完成這次追查？',
   options:[
    ['A','只拍下五張碎片的照片，不需要確認能否拼合。'],
    ['B','把其中最清楚的一片交給工作人員即可。'],
    ['C','依取得順序疊在一起，不必查看圖面是否連續。'],
    ['D','將碎片①～⑤實際拼合，確認能還原成完整《七－圖庫地下工程圖》。']
   ],
   correct:'D',
   result:'五片必須能重新拼成同一張完整工程圖，才能證明你們真的把分散的證據找回來。',
   fragment:5
  }
 ];
 const questionIndex=Math.floor(stage/2);
 const current=questions[questionIndex];
 const foundCount=1+Object.values(received).filter(Boolean).length;
 const fragmentBar=<div className="fragment-status" aria-label="工程圖碎片進度">{[1,2,3,4,5].map(no=><span key={no} className={no===1||received[no]?'is-found':''}><b>碎片{no}</b><small>{no===1?'開場取得':received[no]?'已取得':'待取得'}</small></span>)}</div>;
 const submitQuestion=()=>{
  if(!answer){setError('請先選擇一個答案。');return}
  if(answer!==current.correct){setError('查核不符，請重新閱讀鈴蘭留下的訊息與題目線索。');return}
  setError('');setStage(stage+1)
 };
 const receiveFragment=()=>{
  const no=current.fragment;
  setReceived(prev=>({...prev,[no]:true}));
  setAnswer('');setError('');setStage(stage+1)
 };
 return <section className="day2-fragment-flow" aria-label="第二日工程圖碎片追查">
  <header className="day2-progress"><div><small>DAY 02 / GREEN CORRIDOR FILE</small><b>重建《七－圖庫地下工程圖》</b></div><strong>{foundCount} / 5</strong></header>
  {fragmentBar}
  {stage<8&&stage%2===0&&current&&<section className="day2-stage">
   <p className="day2-kicker">Q{current.no}｜碎片追查</p>
   <h4>{current.title}</h4>
   <p>{current.prompt}</p>
   <div className="day2-choice-list">{current.options.map(([value,label])=><label key={value} className={answer===value?'is-selected':''}><input type="radio" name={'day2-q-'+current.no} value={value} checked={answer===value} onChange={()=>{setAnswer(value);setError('')}}/><span><b>{value}.</b> {label}</span></label>)}</div>
   {error&&<p className="day2-error">{error}</p>}
   <button className="day2-next" type="button" onClick={submitQuestion}>確認答案</button>
  </section>}
  {stage<8&&stage%2===1&&current&&<section className="day2-stage reward-stage">
   <p className="day2-kicker">Q{current.no} 查核完成</p>
   <h4>請向工作人員領取工程圖碎片{current.fragment}</h4>
   <p>{current.result}</p>
   <p>領到實體碎片後，再按下方按鈕進入下一題。</p>
   <button className="day2-next" type="button" onClick={receiveFragment}>我已取得碎片{current.fragment}・進入下一項追查</button>
  </section>}
  {stage===8&&<section className="day2-stage final-choice-stage">
   <p className="day2-kicker">最終步驟｜拼回完整工程圖</p>
   <h4>你們已經取得碎片①～⑤</h4>
   <p>請把五片實體工程圖放在一起，依線條、文字與邊緣位置拼回完整《七－圖庫地下工程圖》。</p>
   <div className="charades-note"><b>完成條件</b><p>五片必須能組成同一張連續圖面。拼好後由小組自行再次核對，再按下「完成工程圖重建」。</p></div>
   <button className="day2-next" type="button" onClick={onComplete}>完成工程圖重建</button>
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
