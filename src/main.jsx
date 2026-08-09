import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowDown, ArrowLeft, ArrowUpRight, AtSign, CalendarDays, Clock, MapPin, X, LockKeyhole, Unlock, BookOpen, ExternalLink, Instagram} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
import './puzzle.css';
import './campaign.css';
import './refinements.css';
import './office.css';
import './newspaper.css';
import './route-mobile-fix.css';
import {sideQuests} from './sideQuestCases.js';
import {mainlineCases} from './mainlineCases.js';
import {createJapaneseName} from './japaneseName.js';
import {loadNewsroomProgress, saveNewsroomProgress} from './sharedProgress.js';

const chapters = [
  {date:'DAY / 01',year:'1938',tag:'角色登錄',title:'集合啦!見習調查員',text:'由驛前工坊出發，沿市場、公署與河道採集人們的生活記錄。',place:'臺中舊城・第一日主線',tone:'ochre',points:[{name:'1916工坊',historic:'驛前南側倉庫區',lat:24.131331,lng:120.681887},{name:'臺中市第三公有零售市場',historic:'敷島町第三市場',lat:24.1331583,lng:120.6830965},{name:'南園酒家／精養軒舊址',historic:'精養軒',lat:24.1362,lng:120.6798},{name:'臺中市役所',historic:'臺中市役所',lat:24.1383354,lng:120.6791052},{name:'臺中郵局',historic:'臺中郵便局',lat:24.1383,lng:120.6766},{name:'合作金庫舊址',historic:'臺中州立圖書館',lat:24.1411747,lng:120.6794953},{name:'柳川古道',historic:'柳川水路',lat:24.1423566,lng:120.6775796},{name:'第二市場',historic:'新富町第二市場',lat:24.1424183,lng:120.6791452}]},
  {date:'DAY / 02',year:'1938',tag:'記憶回收',title:'替故事寫下待續',text:'由橋與書局重新閱讀城市，最後沿鐵道前往第四市場完成聯合發刊。',place:'臺中舊城・第二日主線',tone:'blue',points:[{name:'中山綠橋',historic:'綠川橋',lat:24.1378842,lng:120.6831311},{name:'中央書局',historic:'寶町中央書局',lat:24.1408452,lng:120.6811557},{name:'綠空鐵道1908',historic:'臺中驛鐵道路廊',lat:24.1354544,lng:120.6821701},{name:'歷史建築臺中第四市場',historic:'東町第四市場',lat:24.140556,lng:120.6933848}]}
];

const puzzles = mainlineCases;

const patrolRoute = [
  {no:'壹',district:'驛前巡查區',coverage:'1916工坊／第三市場',duty:'核對產業、手作與市場生活'},
  {no:'貳',district:'精養軒巡查區',coverage:'精養軒舊址／臺中市役所',duty:'查錄宴飲接待與公署文書'},
  {no:'參',district:'郵便巡查區',coverage:'臺中郵局／合作金庫舊址',duty:'記錄郵遞與閱讀生活'},
  {no:'肆',district:'柳川市場巡查區',coverage:'柳川古道／第二市場',duty:'沿河道採集市場生活紀錄'},
  {no:'伍',district:'綠川文教巡查區',coverage:'中山綠橋／中央書局',duty:'辨認橋梁與閱讀生活'},
  {no:'陸',district:'東町終章巡查區',coverage:'綠空鐵道／第四市場',duty:'彙整調查簿並辦理聯合發刊'}
];

const dailyPatrolRoutes = [
  {
    day: 1,
    label: '第一日・驛前至柳川',
    points: [
      {no:'01', name:'1916工坊', duty:'完成琉璃手作，採集工藝現場'},
      {no:'02', name:'臺中市第三公有零售市場', duty:'追查市場遷址，記錄採買日常'},
      {no:'03', name:'南園酒家／精養軒舊址', duty:'採訪酒家宴飲，觀察城市交際'},
      {no:'04', name:'臺中市役所', duty:'翻查市役所資料，理解城市治理'},
      {no:'05', name:'臺中郵局', duty:'追蹤郵件傳遞，記錄消息往來'},
      {no:'06', name:'永生蔘藥行三連棟', duty:'走讀街屋商行，採集藥材買賣'},
      {no:'07', name:'柳川古道', duty:'沿水路前行，記錄河道與城市生活'},
      {no:'08', name:'第二市場', duty:'走進六角樓，觀察城中消費與人流'}
    ]
  },
  {
    day: 2,
    label: '第二日・綠川至第四市場',
    points: [
      {no:'01', name:'新盛橋', duty:'跨越鐵道，記錄抵達與通行'},
      {no:'02', name:'中央書局', duty:'走進書店，採訪閱讀與新知'},
      {no:'03', name:'綠空鐵道1908', duty:'循舊鐵道前行，對照城市變遷'},
      {no:'04', name:'歷史建築臺中第四市場', duty:'編輯採用稿件，完成遊記發表'}
    ]
  }
];

const officeStaff = [
  {unit:'市尹室',title:'市尹',name:'佐久間 正一',note:'總理市政（劇情資料）'},
  {unit:'庶務課',title:'課長',name:'高橋 義雄',note:'文書總核'},
  {unit:'庶務課',title:'庶務係長',name:'林 清河',note:'巡查命令承辦'},
  {unit:'文書係',title:'屬',name:'陳 文彬',note:'昭和十三年八月異動'},
  {unit:'案內係',title:'雇',name:'鈴蘭',note:'名簿旁註：未到'},
  {unit:'商工係',title:'雇',name:'許 金水',note:'市場調查'},
  {unit:'臨時調查掛',title:'見習調查員',name:'本案受命學生',note:'六區巡查・未結案'}
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
    {time:'16：30',title:'終章：把1938寫回城市'},
    {time:'17：00',title:'後記：從記憶中返航'}
  ]}
];

const investigationStages = [
  {no:'00',label:'序',title:'領受市役所調查命令',text:'於指定時刻至受付處領取調查命令，編成臨時調查小隊；確認引路、觀察、記錄及報告分掌後，以見習調查員身分開始勤務。'},
  {no:'01',label:'第一日',title:'進入舊城採集生活紀錄',text:'依第一日巡查圖前進，在建築、市場、商店與街道間觀察細節。將飲食、文字、圖像及現地所得登記字號，逐項記入調查簿。'},
  {no:'02',label:'第一夜',title:'整理調查簿及未決事項',text:'小隊交換當日所見，整理尚未查明事項，並從文學交流中辨認正式紀錄之外的個人聲音。第一日字號得送文書係照會。'},
  {no:'03',label:'第二日',title:'循跡追查補回缺頁',text:'依第二日巡查圖續行查錄，將前一日所得與現地互相比對。各地點均須留意空間用途、人物生活及城市變化。'},
  {no:'04',label:'查核',title:'辦理調查案件查核',text:'現地所得之答案，應至調查案件目錄逐件填具。查核相符者，附屬公告與未綴込文書即予開示；受理核章將留存於本機。'},
  {no:'05',label:'終章',title:'於第四市場提出終章報告',text:'抵達歷史建築臺中第四市場後，各隊選定兩日中最重要的一處，作一分鐘調查報告，並填具「待續章節卡」交付揭示。'}
];

async function hashAnswer(value){
  const normalized='suzuran-1938:'+value.trim().normalize('NFKC').toLowerCase();
  const bytes=new TextEncoder().encode(normalized);
  const digest=await window.crypto.subtle.digest('SHA-256',bytes);
  return Array.from(new Uint8Array(digest)).map(byte=>byte.toString(16).padStart(2,'0')).join('');
}

function Puzzle({item,index}){
  const storageKey='suzuran-office-unlocked-'+index;
  const [value,setValue]=useState(''); const [solved,setSolved]=useState(()=>window.localStorage.getItem(storageKey)==='1'); const [view,setView]=useState('question'); const [error,setError]=useState(false);
  const submit=async e=>{e.preventDefault(); const ok=await hashAnswer(value)===item.hash;setSolved(ok);setView(ok?'manuscript':'question');setError(!ok);if(ok)window.localStorage.setItem(storageKey,'1')};
  return <article className={'puzzle '+(solved?'unlocked':'')}>
    <div className="puzzle-no">{String(index+1).padStart(2,'0')}</div><div className="puzzle-body"><p className="eyebrow">{item.code} · {item.label}</p><div className="puzzle-title"><h3>{solved?'受理済・附屬公告已開示':'登記字號照會'}</h3>{solved&&<button onClick={()=>setView(view==='question'?'manuscript':'question')}>{view==='question'?'閱覽附屬公告':'返回查核'} <ArrowUpRight size={14}/></button>}</div>{view==='question'?<><p>{item.taskTitle}</p>{item.question&&<div className="puzzle-question"><b>{item.question}</b>{item.questionDetails?.map((detail,i)=><span key={i}>{detail}</span>)}</div>}{item.pending?<small>題目待發</small>:item.direct?<small>直接閱覽</small>:<form onSubmit={submit}><input value={value} onChange={e=>setValue(e.target.value)} placeholder={item.inputLabel}/><button>送交查核</button></form>}{error&&<small>登記內容不符，請重新確認現場線索。</small>}</>:<div className="puzzle-manuscript">{(item.island||[]).map((p,i)=><p key={i}>{p}</p>)}</div>}</div>
  </article>
}

function RoutePage({chapter,index}){
 const back=()=>window.location.assign('./#journey');
 const mapsUrl=name=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name+' 台中');
 return <div className={'route-page route-day-'+(index+1)}>
  <header className="route-nav"><button className="brand" onClick={back}><span>臺中市役所</span><i>巡查</i></button><button className="route-back" onClick={back}><ArrowLeft size={18}/> 公示板へ戻る</button></header>
  <main>
   <section className="route-hero"><div><p className="eyebrow">昭和十三年度 · {chapter.date}</p><h1>{index===0?'第一日':'第二日'}巡查路線</h1><p>左記順序辦理現地查錄，共 <b>{chapter.points.length}</b> 處</p></div><img className="route-character" src={index===0?'./assets/draw/man.PNG':'./assets/draw/woman.PNG'} alt="" aria-hidden="true"/><div className="route-day-mark"><small>巡查圖</small><b>0{index+1}</b><span>昭和十三年</span></div></section>
   <section className="route-page-list" aria-label={(index===0?'第一日':'第二日')+'巡查地點'}>{chapter.points.map((point,i)=><article className="route-stop" key={point.name}><div className="route-sequence"><span>{String(i+1).padStart(2,'0')}</span><i></i></div><div className="route-stop-copy"><p>第 {i+1} 地點</p><h2>{point.name}</h2><a href={mapsUrl(point.name)} target="_blank" rel="noreferrer">配置圖で確認 <ExternalLink size={15}/></a></div></article>)}</section>
   {index===1&&<section className="route-final-mission"><div className="final-mission-heading"><p className="eyebrow">FINAL CHAPTER · FOURTH MARKET</p><h2>終章：把1938寫回城市</h2><p>完成最後一站後，請以小組為單位整理兩日調查成果，將你們看見的城市故事說給彼此聽。</p></div><div className="final-mission-grid"><article><span>01</span><h3>選一個地點</h3><p>選出兩日走讀中最有感、最想留下的一個地點。</p></article><article><span>02</span><h3>寫下待續</h3><p>完成句子：「我們在＿＿看見＿＿。如果替城市留下下一頁，我們想寫下＿＿。」</p></article><article><span>03</span><h3>一分鐘發表</h3><p>每組派一位代表分享發現，也可以由全組接力完成。</p></article><article><span>04</span><h3>把記憶留下</h3><p>將待續章節卡貼到活動地圖，在第四市場完成合照與任務收尾。</p></article></div></section>}
    <section className="route-finish"><p className="eyebrow">巡查終了 · 案件查核</p><h2><span>巡查簿完成後</span><span>辦理調查案件查核</span></h2><button onClick={()=>window.location.assign('./?page=puzzles')}>前往調查案件目錄 <ArrowUpRight size={18}/></button></section>
  </main>
 </div>
}

function App(){
 const params=new URLSearchParams(window.location.search);
 const route=params.get('route');
 if(route!==null){
  const index=Math.max(0,Math.min(chapters.length-1,Number(route)||0));
  return <RoutePage chapter={chapters[index]} index={index}/>;
 }
 return <MunicipalHome/>;
}
createRoot(document.getElementById('root')).render(<App/>);
