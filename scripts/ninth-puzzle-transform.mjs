const ninthPuzzleSetup = `
Object.assign(mainlineCases[8], {
  day: 1,
  direct: false,
  pending: false,
  type: 'investigation',
  code: '河岸第〇九號',
  taskTitle: '柳川古道',
  directoryTitle: '柳川古道',
  label: '柳川古道',
  inputLabel: '請完成柳川路線查核',
  hint: '沿柳川舊地圖依序還原青木與「蘭」的移動路線，再比對巡查空檔與兩人的行動模式。',
  question: '兩條相隔數年的路線，為什麼會在同一批隱密位置重疊？',
  questionDetails: [
    '整理柳川舊送貨紀錄時，工作人員發現幾張沒有完整姓名的收據，其中一張只留下「蘭」字，背面還有熟悉的藍綠色記號。',
    '居民也曾回憶，一名外地男子抱著長紙筒沿河移動；幾年後，一名年輕女子固定沿著相似路線送藥、食物與信件。',
    '本關全程在網站上進行。請依地圖、居民證詞、送貨紀錄與警備隊巡查表，逐步還原兩人的移動方式。'
  ],
  questionHint: '本站只能支持「可能長期聯絡」的推論，不能單憑「蘭」字直接確認女子就是鈴蘭。',
  customFlow: 'liuchuan'
});`;

const liuchuanComponent = String.raw`
function LiuchuanFlow({onComplete}){
 const [stage,setStage]=useState(0);
 const [route,setRoute]=useState([]);
 const [error,setError]=useState('');
 const [gap,setGap]=useState('');
 const [within,setWithin]=useState('');
 const [similar,setSimilar]=useState([]);
 const [relation,setRelation]=useState('');
 const [readyToFinish,setReadyToFinish]=useState(false);
 const points={A:'北側橋口',B:'河岸階梯',C:'步道轉折處',D:'南側送貨點'};
 const choosePoint=code=>{if(route.includes(code))return;setRoute(current=>[...current,code]);setError('')};
 const resetRoute=()=>{setRoute([]);setError('')};
 const checkRoute=(correct,next)=>{if(route.join('')===correct){setRoute([]);setError('');setStage(next)}else setError('路線順序仍有一處不符，請再比對紀錄。')};
 const toggleSimilar=value=>setSimilar(current=>current.includes(value)?current.filter(item=>item!==value):[...current,value]);
 return <section className="liuchuan-flow" aria-label="柳川古道路線查核">
  <header className="liuchuan-progress"><small>LIUCHUAN ROUTE FILE</small><b>第 {Math.min(stage+1,6)}／6 階段</b></header>
  {stage===0&&<section className="liuchuan-stage">
   <p className="liuchuan-kicker">第一階段｜閱讀柳川舊地圖</p><h4>先熟悉四個虛構調查點</h4>
   <div className="liuchuan-map" aria-label="柳川簡化舊地圖">
    <div className="river-line"></div>
    {Object.entries(points).map(([code,name])=><article className={'map-point point-'+code.toLowerCase()} key={code}><b>{code}</b><span>{name}</span></article>)}
   </div>
   <div className="liuchuan-point-notes"><p><b>A｜北側橋口</b>警備人員最容易看見行人的位置。</p><p><b>B｜河岸階梯</b>可由道路下降至河岸步道。</p><p><b>C｜步道轉折處</b>視線受橋體與植栽遮擋，適合短暫停留。</p><p><b>D｜南側送貨點</b>舊送貨收據中經常出現的位置。</p></div>
   <button className="liuchuan-next" type="button" onClick={()=>setStage(1)}>查看第一份紀錄</button>
  </section>}
  {stage===1&&<section className="liuchuan-stage">
   <p className="liuchuan-kicker">第二階段｜還原青木的行走路線</p><h4>居民證詞</h4>
   <blockquote>那名外地男子從北側橋口走來，手中抱著一支長紙筒。他看見巡查人員後沒有繼續向前，而是折返回河岸階梯。後來有人在南側看見他離開，但他手上的紙筒已經不見了。</blockquote>
   <RoutePicker points={points} route={route} choosePoint={choosePoint} resetRoute={resetRoute}/>
   {error&&<small className="liuchuan-error">{error}</small>}
   <button className="liuchuan-next" type="button" onClick={()=>checkRoute('ABCD',2)}>確認青木路線</button>
  </section>}
  {stage===2&&<section className="liuchuan-stage">
   <p className="liuchuan-kicker">第三階段｜還原「蘭」的送貨路線</p><h4>沒有完整姓名的送貨紀錄</h4>
   <div className="delivery-records"><article><b>18:08</b><span>退燒藥｜南側送貨點｜簽收：蘭</span></article><article><b>18:11</b><span>備註：走向北側橋口</span></article><article><b>18:14</b><span>備註：由河岸階梯下行</span></article><article><b>18:17</b><span>信件與乾糧｜放置於步道轉折處</span></article></div>
   <p className="liuchuan-note">同一個「蘭」字與藍綠色記號，在不同日期的同類送貨收據中反覆出現；本頁四筆則是其中一次完整送貨行程。</p>
   <RoutePicker points={points} route={route} choosePoint={choosePoint} resetRoute={resetRoute}/>
   {error&&<small className="liuchuan-error">{error}</small>}
   <button className="liuchuan-next" type="button" onClick={()=>checkRoute('DABC',3)}>確認女子路線</button>
  </section>}
  {stage===3&&<section className="liuchuan-stage">
   <p className="liuchuan-kicker">第四階段｜找出巡查空檔</p><h4>警備隊巡查表</h4>
   <div className="patrol-table"><div><b>北側橋口</b><span>17:30–17:45</span></div><div><b>河岸主要步道</b><span>17:46–18:05</span></div><div><b>南側道路</b><span>18:20–18:35</span></div><div><b>河岸階梯與步道轉折處</b><span>無固定巡查</span></div></div>
   <p className="liuchuan-question">哪一段時間最可能是巡查空檔？</p>
   <div className="liuchuan-options">{[['A','17:30–17:45'],['B','17:46–18:05'],['C','18:06–18:19'],['D','18:20–18:35']].map(([value,label])=><label key={value}><input type="radio" name="liuchuan-gap" checked={gap===value} onChange={()=>{setGap(value);setError('')}}/><span>{value}. 下午 {label}</span></label>)}</div>
   <p className="liuchuan-question">女子留下的四張送貨紀錄，是否都位於這段時間內？</p>
   <div className="liuchuan-options inline"><label><input type="radio" name="liuchuan-within" checked={within==='yes'} onChange={()=>{setWithin('yes');setError('')}}/><span>是</span></label><label><input type="radio" name="liuchuan-within" checked={within==='no'} onChange={()=>{setWithin('no');setError('')}}/><span>否</span></label></div>
   {error&&<small className="liuchuan-error">{error}</small>}
   <button className="liuchuan-next" type="button" onClick={()=>{if(gap==='C'&&within==='yes'){setError('');setStage(4)}else setError('請重新比對巡查時段與四筆送貨時間。')}}>確認巡查空檔</button>
  </section>}
  {stage===4&&<section className="liuchuan-stage">
   <p className="liuchuan-kicker">第五階段｜比較兩條路線</p><h4>兩人的行動有哪些相似之處？請選出三項。</h4>
   <div className="route-compare"><p><b>青木</b>A 北側橋口 → B 河岸階梯 → C 步道轉折處 → D 南側送貨點</p><p><b>「蘭」</b>D 南側送貨點 → A 北側橋口 → B 河岸階梯 → C 步道轉折處</p></div>
   <div className="liuchuan-options">{[
    ['A','都使用河岸階梯避開主要道路'],['B','都在步道轉折處停留'],['C','都使用藍綠色記號'],['D','都在同一天抵達柳川'],['E','都搭乘相同交通工具'],['F','都會先繞行，再前往真正的目的地']
   ].map(([value,label])=><label key={value}><input type="checkbox" checked={similar.includes(value)} onChange={()=>{toggleSimilar(value);setError('')}}/><span>{value}. {label}</span></label>)}</div>
   {error&&<small className="liuchuan-error">{error}</small>}
   <button className="liuchuan-next" type="button" onClick={()=>{const answer=[...similar].sort().join('');if(answer==='ABF'){setError('');setStage(5)}else setError('應選三項；注意哪些特徵是兩條路線都能直接證明的。')}}>完成路線比較</button>
  </section>}
  {stage===5&&<section className="liuchuan-stage">
   <p className="liuchuan-kicker">第六階段｜判斷兩人的關係</p><h4>留下「蘭」字的女子，是否可能長期與青木保持聯絡？</h4>
   <div className="liuchuan-options">{[
    ['A','不可能，兩人的行走方向不同'],['B','可能，女子持續使用青木曾經使用的隱密路線'],['C','可以完全確認女子就是鈴蘭'],['D','女子只是普通送貨員']
   ].map(([value,label])=><label key={value}><input type="radio" name="liuchuan-relation" checked={relation===value} onChange={()=>{setRelation(value);setError('')}}/><span>{value}. {label}</span></label>)}</div>
   {error&&<small className="liuchuan-error">{error}</small>}
   {!readyToFinish?<button className="liuchuan-next" type="button" onClick={()=>{if(relation==='B'){setError('');setReadyToFinish(true)}else setError('目前證據只能支持「可能」，不能直接確認女子身分。')}}>送交最後判讀</button>:<div className="liuchuan-final"><b>判讀成立</b><p>「蘭」字仍不足以完全證明女子身分；但她反覆使用河岸階梯、步道轉折處與巡查空檔，並將藥物、食物與信件送往固定位置，顯示這更像一條被長期使用的秘密聯絡路線，而非偶然經過。</p><button className="liuchuan-next" type="button" onClick={onComplete}>完成第九號案件查核</button></div>}
  </section>}
 </section>
}
function RoutePicker({points,route,choosePoint,resetRoute}){
 return <div className="route-picker"><p>依序點選路線卡（手機與平板可直接點選）：</p><div className="route-card-bank">{Object.entries(points).map(([code,name])=><button type="button" key={code} disabled={route.includes(code)} onClick={()=>choosePoint(code)}><b>{code}</b><span>{name}</span></button>)}</div><div className="route-answer">{route.length?route.map((code,index)=><span key={code}><i>{index+1}</i>{code} {points[code]}</span>):<em>尚未排列</em>}</div><button className="route-reset" type="button" onClick={resetRoute}>重新排列</button></div>
}
`;

export function ninthPuzzleTransform(){
 return {
  name:'suzuran-ninth-puzzle-transform',
  enforce:'pre',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   let next=code;
   if(!next.includes("import './ninth-puzzle.css';")) next=next.replace("import './newspaper.css';","import './newspaper.css';\nimport './ninth-puzzle.css';");
   const puzzleAnchor='const puzzles = mainlineCases;';
   if(next.includes(puzzleAnchor)&&!next.includes("customFlow: 'liuchuan'")) next=next.replace(puzzleAnchor,ninthPuzzleSetup+'\n\n'+puzzleAnchor);
   const fieldAnchor='function FieldJournal({item,index,unlockedCount,sharedSolved,onSharedSolved}){';
   if(next.includes(fieldAnchor)&&!next.includes('function LiuchuanFlow(')) next=next.replace(fieldAnchor,liuchuanComponent+'\n\n'+fieldAnchor);
   const oldForm=`{!item.direct&&!item.pending&&!solved&&<form onSubmit={submit}><label htmlFor={'case-'+index}>{item.inputLabel}</label><div><input id={'case-'+index} value={value} onChange={event=>{setValue(event.target.value);setError(false)}} placeholder={'請輸入'+item.inputLabel}/><button type="submit">送交查核</button></div>{error&&<small>登記內容不符，請重新確認現場線索。</small>}</form>}`;
   if(next.includes(oldForm)&&!next.includes("item.customFlow==='liuchuan'")){
    const wrapped=`{item.customFlow==='liuchuan'&&!solved?<LiuchuanFlow onComplete={()=>{setSolved(true);window.localStorage.setItem(unlockKey,'1');onSharedSolved?.(index)}}/>:${oldForm}}`;
    next=next.replace(oldForm,wrapped);
   }
   return next===code?null:{code:next,map:null};
  }
 };
}
