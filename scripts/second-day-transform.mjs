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
  question: '昨晚鈴蘭與青木為什麼將工程圖拆成五片？',
  questionDetails: [
    '今早，集合地點收到一封沒有署名的信。信封中已有《七－圖庫地下工程圖》碎片①、鈴蘭留下的訊息，以及一張未完成的綠空廊道路線圖。',
    '鈴蘭寫道：「昨晚我去通知父親時，後面一直有人跟著，我們不能帶著完整的圖一起走，所以把它拆開了。有些是我們藏起來的，有些可能在逃跑時掉了。不要只追著我的腳步走，父親和我曾經分開。」',
    '你們已經拿到第一片。前三題要重建行動邏輯；第四題則要靠現場比手畫腳還原鈴蘭沒有直接寫下來的行動訊息。'
  ],
  questionHint: '第四題請先完成五個關鍵字的比手畫腳，再把五個詞依正確順序放回網站句子。',
  customFlow: 'greenCorridorFragments'
});`;

const component = String.raw`
function GreenCorridorFragmentFlow({onComplete}){
 const [stage,setStage]=useState(0);
 const [answer,setAnswer]=useState('');
 const [charadeText,setCharadeText]=useState('');
 const [error,setError]=useState('');
 const [received,setReceived]=useState({2:false,3:false,4:false,5:false});
 const questions=[
  {
   no:1,
   title:'哪一組證據最能說明「拆圖」是刻意分散風險？',
   prompt:'不要只抓到「有人跟蹤」這一句。請把鈴蘭的訊息前後連起來，選出最能完整解釋他們為何拆圖的推論。',
   options:[
    ['A','有人跟蹤，所以兩人把完整工程圖交給鈴蘭，再由她一個人帶走。'],
    ['B','有人跟蹤，加上兩人之後分開行動；因此把圖拆開能避免其中一人被攔下時，完整證據一次全部消失。'],
    ['C','兩人分開行動，所以工程圖應該原本就是五張獨立文件，與跟蹤無關。'],
    ['D','有些碎片可能掉落，因此拆圖的目的只是讓紙張比較容易攜帶。']
   ],
   correct:'B',
   result:'關鍵不是單純「被跟蹤」，而是被跟蹤後又必須分開行動。拆圖讓完整證據不會集中在同一個人身上。',
   fragment:2
  },
  {
   no:2,
   title:'如果只追鈴蘭，會在哪裡產生推理漏洞？',
   prompt:'鈴蘭提醒「不要只追著我的腳步走，父親和我曾經分開」。哪一個推論最能說明這句話真正要你們修正什麼？',
   options:[
    ['A','鈴蘭走得比較快，所以只要把她的路線延長，就能推算青木的位置。'],
    ['B','兩人的路線既然分開，青木可能仍帶著、藏起或遺落部分碎片；只追鈴蘭會把另一條證據路線整段漏掉。'],
    ['C','父女分開表示青木已經放棄工程圖，所以之後只需調查鈴蘭。'],
    ['D','兩人分開只代表時間不同，所有碎片最後仍一定回到鈴蘭手上。']
   ],
   correct:'B',
   result:'這一題要求你們把「人物分開」轉成「證據來源也分開」。接下來不能把所有碎片都預設在鈴蘭的路線上。',
   fragment:3
  },
  {
   no:3,
   title:'三種現場痕跡，哪一組判讀最合理？',
   prompt:'假設你們找到三處不同痕跡：A 有防水包裝且固定穩妥；B 有撕裂、水漬與凌亂腳印；C 圖面過於完整、記號與第一日資料不同。哪一組分類最合理？',
   options:[
    ['A','A＝刻意藏圖；B＝逃跑途中遺落；C＝可能是追查者留下的假圖或干擾物。'],
    ['B','A＝逃跑途中遺落；B＝刻意藏圖；C＝青木留下的正式備份。'],
    ['C','A、B、C 都是刻意藏圖，只是保存方式不同。'],
    ['D','只要紙張看起來完整就是真圖，因此 C 最可信，A、B 都可以忽略。']
   ],
   correct:'A',
   result:'「藏好」應有保護與固定痕跡；「掉落」較容易伴隨撕裂、泥水與混亂；而與既有資料不一致、又過度完整的圖面反而需要提高警覺。',
   fragment:4
  },
  {
   no:4,
   title:'鈴蘭的無聲訊息',
   prompt:'這一題不提供選項。先完成現場五個比手畫腳，再把猜到的五個詞依順序放回句子。',
   charades:true,
   keywords:['跟蹤','示警','分開','藏圖','留訊'],
   frame:'發現有人＿＿後，鈴蘭先向父親＿＿；兩人決定＿＿行動，她把其中一片工程圖＿＿，並設法＿＿給後來追查的人。',
   result:'你們還原出的訊息顯示：鈴蘭不是單純逃跑，而是在被跟蹤後先示警、再和父親分開，並刻意留下能讓後人接續追查的線索。',
   fragment:5
  }
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
   if(!ok){setError('還缺少比手畫腳得到的關鍵字，或五個詞的順序不正確。請依「跟蹤 → 示警 → 分開 → 藏圖 → 留訊」重新整理。');return}
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
 return <section className="day2-fragment-flow" aria-label="第二日工程圖碎片追查">
  <header className="day2-progress"><div><small>DAY 02 / GREEN CORRIDOR FILE</small><b>重建《七－圖庫地下工程圖》</b></div><strong>{foundCount} / 5</strong></header>
  {fragmentBar}
  {stage<8&&stage%2===0&&current&&<section className="day2-stage">
   <p className="day2-kicker">Q{current.no}｜碎片追查</p>
   <h4>{current.title}</h4>
   <p>{current.prompt}</p>
   {current.charades?<>
    <div className="charades-note"><b>現場任務</b><p>隊輔依序出示五張關鍵字卡：跟蹤、示警、分開、藏圖、留訊。每題40秒；表演者不能說話、寫字、用嘴型提示或直接指出答案文字。</p></div>
    <p className="day2-charades-frame">「{current.frame}」</p>
    <label className="day2-charades-input">請輸入完整句子<textarea rows="4" value={charadeText} onChange={event=>{setCharadeText(event.target.value);setError('')}} placeholder="把五個比手畫腳答案依序放進句子中。"/></label>
   </>:<div className="day2-choice-list">{current.options.map(([value,label])=><label key={value} className={answer===value?'is-selected':''}><input type="radio" name={'day2-q-'+current.no} value={value} checked={answer===value} onChange={()=>{setAnswer(value);setError('')}}/><span><b>{value}.</b> {label}</span></label>)}</div>}
   {error&&<p className="day2-error">{error}</p>}
   <button className="day2-next" type="button" onClick={submitQuestion}>{current.charades?'完成無聲訊息':'確認答案'}</button>
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
