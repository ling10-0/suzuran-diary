import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowDown, ArrowLeft, ArrowUpRight, AtSign, CalendarDays, Clock, MapPin, Menu, X, LockKeyhole, Unlock, BookOpen, ExternalLink, Instagram} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
import './puzzle.css';
import './campaign.css';
import './refinements.css';

const chapters = [
  {date:'DAY / 01',year:'1938',tag:'角色登錄',title:'集合啦!見習調查員',text:'從舊報紙與街角暗號開始，認識鈴蘭通り的人們。收集散落線索，找出第一段未完的記憶。',place:'臺中舊城・第一章',tone:'ochre',points:[{name:'1916工坊',lat:24.131331,lng:120.681887},{name:'文化部文化資產園區',lat:24.1330547,lng:120.6805222},{name:'臺中市第三公有零售市場',lat:24.1331583,lng:120.6830965},{name:'富興工廠1962文創聚落',lat:24.135119,lng:120.683746},{name:'合作金庫銀行 台中分行',lat:24.1378939,lng:120.6800847},{name:'臺中市役所',lat:24.1383354,lng:120.6791052},{name:'三信商業銀行 台中分行',lat:24.1393276,lng:120.679735},{name:'永生蔘藥行三連棟',lat:24.1411747,lng:120.6794953},{name:'柳美術館',lat:24.1419249,lng:120.6777138},{name:'柳川古道',lat:24.1423566,lng:120.6775796},{name:'第二市場',lat:24.1424183,lng:120.6791452}]},
  {date:'DAY / 02',year:'1938',tag:'記憶回收',title:'替故事寫下待續',text:'解開最後一道謎題，翻閱一份不曾被收進史書的本島人手稿。',place:'臺中舊城・第二章',tone:'blue',points:[{name:'中山綠橋',lat:24.1378842,lng:120.6831311},{name:'台中市第四信用合作社',lat:24.1390204,lng:120.6819297},{name:'中央書局',lat:24.1408452,lng:120.6811557},{name:'全安堂台灣台中太陽餅博物館',lat:24.1397217,lng:120.6824917},{name:'綠空鐵道1908',lat:24.1354544,lng:120.6821701},{name:'歷史建築臺中第四市場',lat:24.140556,lng:120.6933848}]}
];

const puzzles = [
  {hint:'街區以一種花為名。它低垂、潔白，卻帶著微毒。',answer:'鈴蘭',label:'第一日暗號',manuscript:'昭和十三年，鈴蘭通り的風仍吹過店家的布簾。人們用不同的名字叫這座城，但我們記得每一扇門後的生活。這不是誰替我們寫的歷史，是我們自己留下的聲音。'},
  {hint:'請輸入故事發生的西元年份。',answer:'1938',label:'第二日暗號',manuscript:'我把未說完的話藏在紙頁之間，等下一個翻閱的人。若你讀到這裡，請不要只記得事件，也記得那些做飯、工作、相愛與等待的人。章節尚未結束，因為你已經來到其中。'}
];

const guidedTour = [
  {name:'第二市場',lat:24.1424183,lng:120.6791452},
  {name:'蔡內科醫院古宅',lat:24.141111,lng:120.6793089},
  {name:'市府路73號（吳眼科診所／1035）',lat:24.1398438,lng:120.6800528},
  {name:'台中市第四信用合作社（鈴蘭通）',lat:24.1390204,lng:120.6819297},
  {name:'彰化銀行營業部',lat:24.1395404,lng:120.6818351},
  {name:'阿蘭百草茶行（青草街）',lat:24.1400262,lng:120.6845023},
  {name:'東協廣場',lat:24.1393005,lng:120.6838692},
  {name:'宮原眼科',lat:24.1378278,lng:120.6835552},
  {name:'中山綠橋',lat:24.1378842,lng:120.6831311}
];

const schedules = [
  {day:'第一日',label:'DAY / 01',items:[
    {time:'09：00',title:'序章：集合啦！見習調查員'},
    {time:'10：30',title:'第一章：拾光琉璃'},
    {time:'12：30',title:'第二章：舌尖上的1938'},
    {time:'13：30',title:'第三章：連線1938重組篇章'},
    {time:'16：00',title:'第四章：漫步舊城區'},
    {time:'18：00',title:'第五章：玩轉舊城區美食'},
    {time:'19：30',title:'第六章：文學交流會'},
    {time:'20：00',title:'未完待續'}
  ]},
  {day:'第二日',label:'DAY / 02',items:[
    {time:'08：30',title:'第七章：元氣早點補給'},
    {time:'10：00',title:'第八章：悠遊循跡'},
    {time:'12：00',title:'第九章：走回1938'},
    {time:'13：00',title:'第十章：老味道重現'},
    {time:'15：00',title:'第十一章：記憶顯影中'},
    {time:'16：30',title:'終章：把1938寫回城市'}
  ]}
];

const investigationStages = [
  {no:'00',label:'序章',title:'接受市役所委派',text:'活動開始時，你將收到一份來自臺中市役所的調查命令。完成角色登錄、與隊員組成調查小組，確認彼此分工後，正式以「見習調查員」的身分進入任務。'},
  {no:'01',label:'第一日',title:'進入舊城，採集記憶線索',text:'依第一日路線前進，在建築、市場、店家與街道之間觀察細節。透過走讀、飲食體驗與解謎收集散落的文字、圖像和生活線索，拼回1938年的城市日常。'},
  {no:'02',label:'第一夜',title:'整理調查紀錄',text:'小組交換白天的發現，整理尚未解開的問題，並從文學交流中辨認「官方紀錄」之外的個人聲音。完成第一日暗號後，可在網站解鎖第一份本島人手稿。'},
  {no:'03',label:'第二日',title:'循跡追查，補回缺頁',text:'沿第二日路線繼續追查，將前一日取得的線索帶回街區比對。每到一站，都要留意空間用途、人物生活與城市變化，逐步完成最後一份調查紀錄。'},
  {no:'04',label:'解鎖',title:'翻閱本島人手稿',text:'答案藏在走讀現場。找到暗號後，進入網站的「謎題手稿」頁面輸入答案；正確即可解鎖手稿。解鎖後仍可在題目與手稿之間自由切換。'},
  {no:'05',label:'終章',title:'在第四市場留下待續',text:'抵達歷史建築臺中第四市場後，各組選出兩日中最有感的一個地點，整理成一段一分鐘的調查發表，並寫下一張「待續章節卡」，把你們看見的1938留給下一位閱讀城市的人。'}
];

function Puzzle({item,index}){
  const [value,setValue]=useState(''); const [solved,setSolved]=useState(false); const [view,setView]=useState('question'); const [error,setError]=useState(false);
  const submit=e=>{e.preventDefault(); const ok=value.trim().toLowerCase()===item.answer.toLowerCase();setSolved(ok);setView(ok?'manuscript':'question');setError(!ok)};
  return <article className={'puzzle '+(solved?'unlocked':'')}>
    <div className="puzzle-no">0{index+1}</div><div className="puzzle-body"><p className="eyebrow">{item.label}</p><div className="puzzle-title"><h3>{solved?'手稿已解鎖':'輸入謎題答案'}</h3>{solved&&<button onClick={()=>setView(view==='question'?'manuscript':'question')}>{view==='question'?'翻閱手稿':'返回題目'}</button>}</div>
    {view==='question'?<><p>{item.hint}</p>{!solved&&<form onSubmit={submit}><input aria-label={item.label+'答案'} value={value} onChange={e=>{setValue(e.target.value);setError(false)}} placeholder="在此輸入答案"/><button type="submit">確認暗號 <ArrowUpRight size={17}/></button></form>}{solved&&<p className="solved-note">此題已完成，可隨時切換回手稿。</p>}{error&&<small className="error">暗號不正確，請回到現場尋找線索。</small>}</>:<div className="manuscript"><BookOpen/><p>{item.manuscript}</p><small>— 本島人手稿・殘頁 {index+1}</small></div>}</div>
    {solved?<Unlock className="lock" aria-label="已解鎖"/>:<LockKeyhole className="lock" aria-label="未解鎖"/>}
  </article>
}

function PuzzlePage(){
 const home=()=>window.location.assign('./');
 return <div className="puzzle-page">
  <header className="route-nav"><button className="brand" onClick={home}><span>翻閱1938</span><i>待續</i></button><button className="route-back" onClick={home}><ArrowLeft size={18}/> 回到首頁</button></header>
  <main><section className="puzzle-page-hero"><img className="puzzle-character" src="./assets/decor-person-front.webp" alt="" aria-hidden="true"/><p className="eyebrow">UNLOCK THE MANUSCRIPTS</p><h1>解謎・翻閱本島人手稿</h1><p><span className="puzzle-lead-primary">答案藏在走讀現場，輸入正確暗號後，手稿將會解鎖；</span><span className="puzzle-lead-secondary">解鎖後仍可自由切換題目與手稿內容。</span></p></section>
  <section className="puzzles puzzle-page-content"><div className="puzzle-list">{puzzles.map((p,i)=><Puzzle key={p.label+i} item={p} index={i}/>)}</div></section></main>
 </div>
}

function StoryMap({onDayChange,onModeChange}){
 const mapNode=useRef(null); const mapInstance=useRef(null); const [filter,setFilter]=useState('days');
 useEffect(()=>{
  if(mapInstance.current) mapInstance.current.remove();
  const map=L.map(mapNode.current,{zoomControl:false,scrollWheelZoom:false}); mapInstance.current=map;
  L.control.zoom({position:'bottomright'}).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
  const visible=filter==='guide'
   ? guidedTour.map((point,index)=>({...point,index,kind:'guide'}))
   : chapters.flatMap((chapter,day)=>filter==='days'||filter===day+1?chapter.points.map((point,index)=>({...point,day,index,kind:'day'})):[]);
  const bounds=[];
  visible.forEach(point=>{
   const dayClass=point.kind==='guide'?'guided':point.day===0?'day-one':'day-two';
   const icon=L.divIcon({className:'story-pin-wrap',html:`<span class="story-pin ${dayClass}">${point.index+1}</span>`,iconSize:[38,46],iconAnchor:[19,42],popupAnchor:[0,-38]});
   const navigation=`https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
   const routeLabel=point.kind==='guide'?'GUIDED TOUR':`DAY ${point.day+1}`;
   L.marker([point.lat,point.lng],{icon}).addTo(map).bindPopup(`<div class="story-popup"><small>${routeLabel} · STOP ${String(point.index+1).padStart(2,'0')}</small><strong>${point.name}</strong><a href="${navigation}" target="_blank" rel="noreferrer">開啟導航 ↗</a></div>`).on('click',()=>{if(point.kind==='day')onDayChange(point.day);onModeChange(point.kind==='guide'?'guide':`day${point.day+1}`)});
   bounds.push([point.lat,point.lng]);
  });
  if(filter==='guide') L.polyline(guidedTour.map(p=>[p.lat,p.lng]),{color:'#cf2560',weight:4,opacity:.9,dashArray:'7 8'}).addTo(map);
  else chapters.forEach((chapter,day)=>{if(filter==='days'||filter===day+1)L.polyline(chapter.points.map(p=>[p.lat,p.lng]),{color:day===0?'#a73a2b':'#6a4a9b',weight:3,opacity:.85,dashArray:'7 8'}).addTo(map)});
  map.fitBounds(bounds,{padding:[40,40],maxZoom:16});
  return()=>{map.remove();mapInstance.current=null};
 },[filter,onDayChange,onModeChange]);
 const choose=value=>{setFilter(value);if(value===1||value===2)onDayChange(value-1);onModeChange(value==='guide'?'guide':value==='days'?'both':`day${value}`)};
 return <div className="story-map-shell"><div className="map-filter" aria-label="切換路線"><button className={filter==='days'?'active':''} onClick={()=>choose('days')}>兩日路線</button><button className={filter===1?'active day-one':''} onClick={()=>choose(1)}>DAY 1</button><button className={filter===2?'active day-two':''} onClick={()=>choose(2)}>DAY 2</button><button className={filter==='guide'?'active guided':''} onClick={()=>choose('guide')}>導覽路線</button></div><div ref={mapNode} className="story-map"></div></div>
}

function RoutePage({chapter,index}){
 const back=()=>window.location.assign('./#journey');
 const mapsUrl=name=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name+' 台中');
 return <div className={'route-page route-day-'+(index+1)}>
  <header className="route-nav"><button className="brand" onClick={back}><span>翻閱1938</span><i>待續</i></button><button className="route-back" onClick={back}><ArrowLeft size={18}/> 回到兩日章節</button></header>
  <main>
   <section className="route-hero"><div><p className="eyebrow">{chapter.date} · WALKING ROUTE</p><h1>{index===0?'第一日':'第二日'}路線</h1><p>依章節順序走進臺中舊城，共 <b>{chapter.points.length}</b> 個地點</p></div><img className="route-character" src={index===0?'./assets/decor-person-walk.webp':'./assets/decor-person-front.webp'} alt="" aria-hidden="true"/><div className="route-day-mark"><small>CHAPTER</small><b>0{index+1}</b><span>1938</span></div></section>
   <section className="route-page-list" aria-label={(index===0?'第一日':'第二日')+'可走地點'}>{chapter.points.map((point,i)=><article className="route-stop" key={point.name}><div className="route-sequence"><span>{String(i+1).padStart(2,'0')}</span><i></i></div><div className="route-stop-copy"><p>第 {i+1} 站</p><h2>{point.name}</h2><a href={mapsUrl(point.name)} target="_blank" rel="noreferrer">在地圖中尋找 <ExternalLink size={15}/></a></div></article>)}</section>
   {index===1&&<section className="route-final-mission"><div className="final-mission-heading"><p className="eyebrow">FINAL CHAPTER · FOURTH MARKET</p><h2>終章：把1938寫回城市</h2><p>完成最後一站後，請以小組為單位整理兩日調查成果，將你們看見的城市故事說給彼此聽。</p></div><div className="final-mission-grid"><article><span>01</span><h3>選一個地點</h3><p>選出兩日走讀中最有感、最想留下的一個地點。</p></article><article><span>02</span><h3>寫下待續</h3><p>完成句子：「我們在＿＿看見＿＿。如果替城市留下下一頁，我們想寫下＿＿。」</p></article><article><span>03</span><h3>一分鐘發表</h3><p>每組派一位代表分享發現，也可以由全組接力完成。</p></article><article><span>04</span><h3>把記憶留下</h3><p>將待續章節卡貼到活動地圖，在第四市場完成合照與任務收尾。</p></article></div></section>}
   <section className="route-finish"><p className="eyebrow">END OF ROUTE · CONTINUE THE STORY</p><h2><span>走完路線</span><span>回到謎題解鎖手稿</span></h2><button onClick={()=>window.location.assign('./?page=puzzles')}>前往謎題手稿 <ArrowUpRight size={18}/></button></section>
  </main>
 </div>
}

function GameGuidePage(){
 const home=()=>window.location.assign('./');
 return <div className="game-guide-page">
  <header className="route-nav"><button className="brand" onClick={home}><span>翻閱1938</span><i>待續</i></button><button className="route-back" onClick={home}><ArrowLeft size={18}/> 回到首頁</button></header>
  <main>
   <section className="game-guide-hero"><div><p className="eyebrow">INVESTIGATION HANDBOOK · 1938</p><h1>調查任務</h1><p>這不是一場普通的走讀。從收到市役所命令的那一刻起，你就是負責找回城市缺頁的見習調查員。</p></div><img src="./assets/decor-person-walk.webp" alt="" aria-hidden="true"/></section>
   <section className="game-story"><div className="guide-section-heading"><p className="eyebrow">STORY SETTING</p><h2>任務從一份缺頁檔案開始</h2></div><div className="assignment-letter"><small>臺中市役所・調查命令 第1938號</small><p>昭和十三年，市役所整理城市檔案時，發現關於臺中舊城的紀錄出現多處空白。建築仍在，街道仍有名字，然而曾經生活在這裡的人、氣味、聲音與日常，正從紙頁上逐漸消失。</p><p>市役所因此召集各位學生，委派你們成為「見習調查員」。你們必須走進街區，以觀察、走讀、飲食、訪談與解謎採集線索，找回沒有被正式史書完整收錄的故事，完成一份屬於本島人的城市手稿。</p><strong>調查目的不是找出唯一答案，而是確認：一座城市除了被記錄的歷史，還留下了哪些人的生活。</strong></div></section>
   <section className="investigator-role"><div className="guide-section-heading"><p className="eyebrow">YOUR ROLE</p><h2>你們是見習調查員</h2><p>每組都是一支調查小隊。行動時彼此提醒、交換發現，並共同保管取得的線索。</p></div><div className="role-grid"><article><span>01</span><h3>引路員</h3><p>確認路線、集合時間與下一個調查地點。</p></article><article><span>02</span><h3>觀察員</h3><p>留意建築、招牌、器物、氣味與現場細節。</p></article><article><span>03</span><h3>記錄員</h3><p>把發現、疑問與關鍵字寫進調查紀錄。</p></article><article><span>04</span><h3>發表員</h3><p>整理小組觀點，在終章代表小隊分享。</p></article></div><p className="role-note">人數較少時可以一人兼任多項；角色不是固定職位，途中可自由交換。</p></section>
   <section className="investigation-flow"><div className="guide-section-heading"><p className="eyebrow">HOW THE STORY UNFOLDS</p><h2>兩日任務進行方式</h2></div><div className="flow-list">{investigationStages.map(stage=><article key={stage.no}><div className="flow-no">{stage.no}</div><div><p>{stage.label}</p><h3>{stage.title}</h3><span>{stage.text}</span></div></article>)}</div></section>
   <section className="game-rules"><div className="guide-section-heading"><p className="eyebrow">FIELD RULES</p><h2>現場行動原則</h2></div><ol><li><b>先觀察，再作答。</b><span>題目線索來自現場，不必急著搜尋網路；請先看建築、街道與帶隊人員提供的材料。</span></li><li><b>以小組完成，不以速度競賽。</b><span>每個人看見的細節可能不同，交換觀察比搶先抵達更重要。</span></li><li><b>依帶隊指示移動。</b><span>過馬路、進入店家或公共空間時，以安全、現場秩序與工作人員提醒為優先。</span></li><li><b>尊重街區與居民。</b><span>拍攝人物、店家內部或私人空間前，請先取得同意；不碰觸未開放物件。</span></li><li><b>保留自己的解讀。</b><span>調查紀錄沒有標準感受。請分清楚「現場事實」與「你的想法」，兩者都值得被留下。</span></li></ol></section>
   <section className="guide-finale"><p className="eyebrow">FINAL CHAPTER</p><h2>你們找到的不是結局</h2><p>兩日任務最後將在第四市場完成。每一組的發表與待續章節卡，會成為這次調查新增的一頁。當你把觀察說出來、把記憶寫下來，城市的故事便不再只停留在1938，而是由你繼續往後書寫。</p><button onClick={()=>window.location.assign('./?page=schedule')}>查看兩日活動時程 <ArrowUpRight size={18}/></button><small>實際流程與集合移動仍以當日帶隊人員指示為準。</small></section>
  </main>
 </div>
}

function InfoPage(){
 const home=()=>window.location.assign('./');
 const link=hash=>window.location.assign('./'+hash);
 return <div className="participant-info-page">
  <header className="route-nav"><button className="brand" onClick={home}><span>翻閱1938</span><i>待續</i></button><button className="route-back" onClick={home}><ArrowLeft size={18}/> 回到活動首頁</button></header>
  <main><section className="participant-info-hero"><p className="eyebrow">PARTICIPANT INFORMATION</p><h1>參加者資訊</h1><p>集合提醒、活動異動與最新公告，請以官方 Instagram 發布內容為準。</p></section>
  <section className="participant-info-body"><div className="social-links"><a className="social-card instagram" href="https://www.instagram.com/tcold.spots/" target="_blank" rel="noreferrer"><Instagram/><div><small>INSTAGRAM</small><h2>@tcold.spots</h2><p>最新公告與活動提醒</p></div><ExternalLink/></a><a className="social-card threads" href="https://www.threads.com/@tcold.spots" target="_blank" rel="noreferrer"><AtSign/><div><small>THREADS</small><h2>@tcold.spots</h2><p>追蹤即時動態</p></div><ExternalLink/></a><a className="social-card facebook" href="https://www.facebook.com/TCOldHouse" target="_blank" rel="noreferrer"><span className="facebook-glyph">f</span><div><small>FACEBOOK</small><h2>TCOldHouse</h2><p>前往官方粉絲專頁</p></div><ExternalLink/></a></div><div className="participant-links five"><button onClick={()=>window.location.assign('./?page=guide')}><span>01</span><b>調查任務</b><small>了解故事設定與遊戲方式</small><ArrowUpRight/></button><button onClick={()=>link('#journey')}><span>02</span><b>兩日章節</b><small>查看 Day 1、Day 2 路線</small><ArrowUpRight/></button><button onClick={()=>window.location.assign('./?page=schedule')}><span>03</span><b>活動時程</b><small>查看兩日大概行程時間</small><ArrowUpRight/></button><button onClick={()=>link('#map')}><span>04</span><b>章節座標</b><small>開啟兩日點位與合作導覽路線</small><ArrowUpRight/></button><button onClick={()=>window.location.assign('./?page=puzzles')}><span>05</span><b>謎題手稿</b><small>輸入答案並翻閱手稿</small><ArrowUpRight/></button></div></section></main>
 </div>
}

function SchedulePage(){
 const home=()=>window.location.assign('./');
 return <div className="schedule-page">
  <header className="route-nav"><button className="brand" onClick={home}><span>翻閱1938</span><i>待續</i></button><button className="route-back" onClick={home}><ArrowLeft size={18}/> 回到首頁</button></header>
  <main><section className="schedule-hero"><div className="schedule-hero-copy"><p className="eyebrow">TWO-DAY PROGRAM</p><h1>兩日活動時程</h1><p>以下為活動的大概時程，當日進行時間可能依現場狀況調整。</p></div><img className="schedule-character" src="./assets/decor-person-front.webp" alt="" aria-hidden="true"/></section>
  <section className="schedule-body">{schedules.map((schedule,index)=><article className={'schedule-day schedule-day-'+(index+1)} key={schedule.day}><div className="schedule-day-head"><div><p className="eyebrow">{schedule.label}</p><h2>{schedule.day}</h2></div><span>1938</span></div><ol>{schedule.items.map((item,itemIndex)=><li key={item.time+item.title}><div className="schedule-time"><Clock size={17}/><time>{item.time}</time></div><div className="schedule-event"><small>{String(itemIndex+1).padStart(2,'0')}</small><h3>{item.title}</h3></div></li>)}</ol></article>)}</section></main>
 </div>
}

function App(){
 const params=new URLSearchParams(window.location.search); const day=Number(params.get('day')); const page=params.get('page');
 const [menu,setMenu]=useState(false); const [active,setActive]=useState(0); const [mapMode,setMapMode]=useState('both');
 const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false)};
 if(day===1||day===2) return <RoutePage chapter={chapters[day-1]} index={day-1}/>;
 if(page==='info') return <InfoPage/>;
 if(page==='puzzles') return <PuzzlePage/>;
 if(page==='schedule') return <SchedulePage/>;
 if(page==='guide') return <GameGuidePage/>;
 return <>
  <header><button className="brand" onClick={()=>go('top')}><span>翻閱1938</span><i>待續</i></button>
   <nav className={menu?'open':''}><button onClick={()=>window.location.assign('./?page=info')}>參加者資訊</button><button onClick={()=>window.location.assign('./?page=guide')}>調查任務</button><button onClick={()=>go('journey')}>兩日章節</button><button onClick={()=>window.location.assign('./?page=schedule')}>活動時程</button><button onClick={()=>window.location.assign('./?page=puzzles')}>謎題手稿</button><button onClick={()=>go('map')}>路線地圖</button><button className="seal" onClick={()=>go('journey')}>進入調查</button></nav>
   <button className="menu" aria-label="選單" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
  </header>
  <main id="top">
   <section className="hero campaign-hero"><div className="hero-copy campaign-copy"><p className="eyebrow">OLD CITY INVESTIGATION · 1938</p><img className="campaign-wordmark" src="./assets/campaign-logo.webp" alt="舊城調查團・翻閱一九三八：那些待續的章節"/><h1 className="sr-only">舊城調查團：翻閱一九三八，那些待續的章節</h1><p className="lead">有些歷史寫進書裡，有些故事留在人身上。<br/>循著鈴蘭與街道的線索，翻開尚未完結的章節。</p><div className="hero-facts"><span><b>DAY 01 — DAY 02</b><small>兩日調查任務</small></span><span><b>臺中舊城</b><small>章節座標已開啟</small></span></div><button className="read" onClick={()=>go('journey')}>進入第一章 <ArrowDown size={18}/></button></div>
    <div className="campaign-portrait"><div className="portrait-sun"></div><img src="./assets/campaign-portrait.webp" alt="穿著復古服裝、手持鈴蘭的調查員插畫"/><span>調查員<br/>已登錄</span></div><p className="vertical">臺中舊城・文化體驗・城市走讀</p></section>
   <section className="journal" id="journey"><div className="section-head"><div><p className="eyebrow">TWO-DAY JOURNEY</p><h2>兩日・兩個章節</h2></div><p>第一日進入故事，第二日回收記憶。<br/>點選任一章節，前往獨立頁面查看當日路線。</p></div><div className="cards two">{chapters.map((n,i)=><article key={n.title} role="button" tabIndex="0" className={n.tone+' chapter-card'} onMouseEnter={()=>setActive(i)} onClick={()=>window.location.assign('./?day='+(i+1))} onKeyDown={e=>e.key==='Enter'&&window.location.assign('./?day='+(i+1))}><div className="date"><b>{n.date}</b><small>{n.year}</small></div><div className="photo"><div className={'scene s'+i}></div><span>{n.tag}</span></div><div className="cardcopy"><h3>{n.title}</h3><p>{n.text}</p><div><span><MapPin size={14}/>{n.place}</span><button aria-label="前往當日路線頁面">開啟路線頁 <ArrowUpRight/></button></div></div></article>)}</div></section>
   <section className="map" id="map"><StoryMap onDayChange={setActive} onModeChange={setMapMode}/><div className="mapcopy"><p className="eyebrow">STORY COORDINATES</p><h2>章節座標</h2><p>切換兩日活動或合作導覽路線，縮放街區、點選編號，即可查看地點並開啟導航。</p><div className="selected"><CalendarDays/><span>{mapMode==='guide'?'導覽路線':mapMode==='both'?'兩日路線總覽':chapters[active].date}<small>{mapMode==='guide'?`合作導覽 · ${guidedTour.length} 個地點`:mapMode==='both'?`第一章與第二章 · ${chapters.reduce((total,chapter)=>total+chapter.points.length,0)} 個地點`:`${chapters[active].place} · ${chapters[active].points.length} 個地點`}</small></span></div></div></section>
  </main>
  <footer><div className="brand foot"><span>翻閱1938</span><i>待續</i></div><div><button onClick={()=>go('top')}>回到頁首 ↑</button><small>© 2026 那些待續的章節</small></div></footer>
 </>
}
createRoot(document.getElementById('root')).render(<App/>);
