import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowDown, ArrowLeft, ArrowUpRight, AtSign, CalendarDays, Clock, MapPin, Menu, X, LockKeyhole, Unlock, BookOpen, ExternalLink, Instagram} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
import './puzzle.css';
import './campaign.css';
import './refinements.css';
import './office.css';
import './newspaper.css';
import {caseDocuments} from './caseDocuments.js';

const chapters = [
  {date:'DAY / 01',year:'1938',tag:'角色登錄',title:'集合啦!見習調查員',text:'從舊報紙與街角暗號開始，認識鈴蘭通り的人們。收集散落線索，找出第一段未完的記憶。',place:'臺中舊城・第一章',tone:'ochre',points:[{name:'1916工坊',historic:'驛前南側倉庫區',lat:24.131331,lng:120.681887},{name:'文化部文化資產園區',historic:'臺中驛構內產業區',lat:24.1330547,lng:120.6805222},{name:'臺中市第三公有零售市場',historic:'新富町市場',lat:24.1331583,lng:120.6830965},{name:'富興工廠1962文創聚落',historic:'新富町工場',lat:24.135119,lng:120.683746},{name:'合作金庫銀行 台中分行',historic:'市役所前金融街',lat:24.1378939,lng:120.6800847},{name:'臺中市役所',historic:'臺中市役所',lat:24.1383354,lng:120.6791052},{name:'三信商業銀行 台中分行',historic:'榮町金融街',lat:24.1393276,lng:120.679735},{name:'永生蔘藥行三連棟',historic:'榮町藥種商街',lat:24.1411747,lng:120.6794953},{name:'柳美術館',historic:'柳川沿岸街屋',lat:24.1419249,lng:120.6777138},{name:'柳川古道',historic:'柳川水路',lat:24.1423566,lng:120.6775796},{name:'第二市場',historic:'新富町第二市場',lat:24.1424183,lng:120.6791452}]},
  {date:'DAY / 02',year:'1938',tag:'記憶回收',title:'替故事寫下待續',text:'解開最後一道謎題，翻閱一份不曾被收進史書的本島人手稿。',place:'臺中舊城・第二章',tone:'blue',points:[{name:'中山綠橋',historic:'綠川橋',lat:24.1378842,lng:120.6831311},{name:'台中市第四信用合作社',historic:'鈴蘭通信用組合',lat:24.1390204,lng:120.6819297},{name:'中央書局',historic:'大正町書店街',lat:24.1408452,lng:120.6811557},{name:'全安堂台灣台中太陽餅博物館',historic:'舊城菓子商街',lat:24.1397217,lng:120.6824917},{name:'綠空鐵道1908',historic:'臺中驛鐵道路廊',lat:24.1354544,lng:120.6821701},{name:'歷史建築臺中第四市場',historic:'東町第四市場',lat:24.140556,lng:120.6933848}]}
];

const puzzles = [
  {day:1,type:'flora',code:'庶務秘第〇一號',taskTitle:'花名簿核對',inputLabel:'花名',hint:'第一巡查區的暗號。低垂、潔白，街區曾以它為名。',hash:'08b4a3e523f2e56e43260f12c68b6dc3fb71d692d56062b891b661b5b3621b84',label:'第一號案件',manuscript:'臨時公告：鈴蘭通り的布簾仍隨風掀動。請記錄門牌、商號與每一扇門後的生活；城市的名字不只寫在地圖上，也由居住其中的人共同留下。'},
  {day:1,type:'year',code:'庶務秘第〇二號',taskTitle:'年代卷宗查核',inputLabel:'西元年份',hint:'請登記本次卷宗所屬的西元年份。',hash:'bd6303e3a1e73659f04940eed53dd9581a57ec3200b03d385790457d78637ee5',label:'第二號案件',manuscript:'補遺通知：本卷宗原應歸入昭和十三年度。檔案所缺並非日期，而是做飯、工作、相愛與等待的人。請勿只抄錄事件，務必記下生活。'},
  {day:1,type:'district',code:'巡查第〇三號',taskTitle:'舊町方位辨識',inputLabel:'舊町名',hint:'由1916工坊出發後，所處舊町區的方位名稱。',hash:'723fa34d842a6b71af4085c2ba528dd9e3aa12140f2137b1ad737f38aec6c92d',label:'第三號案件',manuscript:'巡查附記：驛前南側的倉庫、鐵道與工場構成城市入口。公文只記載用途，調查員應另行補錄工人移動與貨物流向。'},
  {day:1,type:'market',code:'商工第〇四號',taskTitle:'市場區名登記',inputLabel:'舊町名',hint:'第三市場與富興工廠所在的舊町名。',hash:'a7d883bc14476d7364d8ebde566f144755b6d84ce6b29982c961b9a70f3578ea',label:'第四號案件',manuscript:'商工課便箋：市場不是一張攤位名冊。叫賣聲、秤重的手勢與熟客間的招呼，才是每日真正運轉的帳簿。'},
  {day:1,type:'office',code:'文書第〇五號',taskTitle:'發令機關查核',inputLabel:'機關名稱',hint:'本次命令由哪一座公署發出？',hash:'d8db5c63f4b9a0361c6ae243a0ea628e11397511e8c1cb06bf254a5f8404f2ea',label:'第五號案件',manuscript:'未決裁稿：市役所保存城市的正式紀錄，卻也製造空白。若表格沒有欄位容納某人的聲音，那便由調查員寫在頁緣。'},
  {day:1,type:'commerce',code:'金融第〇六號',taskTitle:'商業街區核對',inputLabel:'舊町名',hint:'三信與永生蔘藥行一帶的舊町名。',hash:'d83cfa92e275094c99cfab727b640ce800d69e7a2798cfa2ec0438a24d1b3691',label:'第六號案件',manuscript:'異動備忘：金融街的帳冊記得數字，藥行的抽屜記得氣味。兩者都在保存信用，只是使用了不同的方法。'},
  {day:1,type:'river',code:'河川第〇七號',taskTitle:'河道名稱確認',inputLabel:'河川名稱',hint:'流經市場西側、也是末段巡查地名的水路。',hash:'c6da77165300a8289bb52e28761d44a463616b63ee24e2377590c9d8fa57ad3e',label:'第七號案件',manuscript:'結案前附記：河道帶走昨日的聲音，也把故事送往下一處。請將本次巡查所得寫成一頁，交由後來的人繼續閱覽。'},
  {day:2,type:'bridge',code:'土木第〇八號',taskTitle:'橋梁名錄核對',inputLabel:'橋梁名稱',hint:'第二日第一站，橫跨綠川、連接舊城記憶的橋名。',hash:'3d23ce199662275df1a256971c82cddbba842feed281c043952c5142cd1a776c',label:'第八號案件',manuscript:'橋梁巡查記：橋不只是跨越河道的構造，也讓不同時代的人在同一條路上擦肩。請記下你從橋面看見的城市方向。'},
  {day:2,type:'finance',code:'金融第〇九號',taskTitle:'信用組合名簿查核',inputLabel:'機構名稱',hint:'以冰品重新開門、前身為地方信用合作社的第二日站點。',hashes:['15ef220273253f14c6be2c00b8d00ef7a791c6652b069a97aac5501ec08ccb37','dc5a1a9a53b4f2dd78330c0e8c2d04983d85fb9f2e841e325708bdbc0b19674d'],label:'第九號案件',manuscript:'金融簿冊附記：建築的用途會改變，但櫃檯、金庫與人們等待的姿態，仍可能替往日留下形狀。'},
  {day:2,type:'book',code:'文教第〇十號',taskTitle:'書店名錄補登',inputLabel:'書店名稱',hint:'曾是文化交流的重要場所，今日仍以閱讀連結城市的書店。',hash:'f7a46d7e25b2b52f1259e90ad9d79046cd37b4bb3383449c8fdb3645f50e27c6',label:'第十號案件',manuscript:'文教課殘頁：書頁把不在場的人帶回眼前。城市若有共同的記憶，總有人曾在書店裡讀到另一種生活。'},
  {day:2,type:'food',code:'商工第十一號',taskTitle:'地方物產登記',inputLabel:'物產名稱',hint:'全安堂建築中展示、也是臺中代表性的傳統糕餅。',hash:'68fb1855e34927f7a24c5745c69fb0c34f5d7e389b97211c4fbb7d8671c03c67',label:'第十一號案件',manuscript:'物產課便箋：味道比公文更容易被記住。配方、店舖與包裝都會改變，但一口熟悉的甜味仍能叫人辨認故鄉。'},
  {day:2,type:'rail',code:'鐵道第十二號',taskTitle:'鐵道年份查核',inputLabel:'年份',hint:'綠空鐵道名稱中保存的四位數年份。',hash:'2a95383fa0ae197e26d33aa51e81f00f7b7643834e3fd3687fac06fe6642a250',label:'第十二號案件',manuscript:'鐵道課附記：列車離站後，軌道仍替城市保留方向。請沿著線形辨認產業、遷移與日常生活曾經如何相遇。'},
  {day:2,type:'finale',code:'終章第十三號',taskTitle:'終點市場確認',inputLabel:'市場名稱',hint:'兩日巡查的終點，也是小組發表與待續章節揭示之處。',hashes:['9f44b93d45a2140f60159d00b335d66c3ada229aa9307a62a28ed621237ca0bf','5d6980ba60af9ae958f3eab2b08678027b997213a560c36b7c1db4c144dc9407'],label:'第十三號案件',manuscript:'終章核准稿：市場收納的不只是交易，也收納相遇、手藝與地方的口音。請把兩日所見說給彼此聽，替城市留下仍可續寫的一頁。'}
];

const patrolRoute = [
  {no:'壹',district:'驛前南側巡查區',coverage:'1916工坊／文化資產園區',duty:'核對鐵道、倉庫及產業遺構'},
  {no:'貳',district:'新富町巡查區',coverage:'第三市場／富興工廠',duty:'查錄市場商號與工場用途'},
  {no:'參',district:'市役所前巡查區',coverage:'合作金庫／臺中市役所',duty:'領取文書並核對公署配置'},
  {no:'肆',district:'鈴蘭通巡查區',coverage:'第四信用合作社／中央書局',duty:'查訪通り沿線店家與案內標示'},
  {no:'伍',district:'榮町巡查區',coverage:'三信銀行／永生蔘藥行',duty:'記錄金融與民生商業往來'},
  {no:'陸',district:'柳川市場巡查區',coverage:'柳美術館／柳川古道／第二市場',duty:'沿河道採集市場生活紀錄'},
  {no:'柒',district:'東町終點巡查區',coverage:'綠空鐵道／歷史建築第四市場',duty:'彙整調查簿並辦理終章發表'}
];

const dailyPatrolRoutes = [
  {
    day:1,
    label:'第一日・驛前至柳川',
    points:chapters[0].points.map((point,index)=>({
      no:String(index+1).padStart(2,'0'),
      name:point.name,
      duty:index<2?'核對驛站、鐵道與產業遺構':index<6?'查錄市場、公署及商業用途':'記錄金融街、河道與市場生活'
    }))
  },
  {
    day:2,
    label:'第二日・綠川至第四市場',
    points:chapters[1].points.map((point,index)=>({
      no:String(index+1).padStart(2,'0'),
      name:point.name,
      duty:index<2?'辨認橋梁及地方金融建築':index<4?'查錄書店與地方物產記憶':index===4?'沿鐵道空間追查城市變遷':'彙整調查簿並辦理終章發表'
    }))
  }
];

const officeStaff = [
  {unit:'市尹室',title:'市尹',name:'佐久間 正一',note:'總理市政（劇情資料）'},
  {unit:'庶務課',title:'課長',name:'高橋 義雄',note:'文書總核'},
  {unit:'庶務課',title:'庶務係長',name:'林 清河',note:'巡查命令承辦'},
  {unit:'文書係',title:'屬',name:'陳 文彬',note:'昭和十三年八月異動'},
  {unit:'案內係',title:'雇',name:'鈴蘭',note:'名簿旁註：未到'},
  {unit:'商工係',title:'雇',name:'許 金水',note:'市場調查'},
  {unit:'臨時調查掛',title:'見習調查員',name:'本案受命學生',note:'七區巡查・未結案'}
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
    <div className="puzzle-no">{String(index+1).padStart(2,'0')}</div><div className="puzzle-body"><p className="eyebrow">{item.code} · {item.label}</p><div className="puzzle-title"><h3>{solved?'受理済・附屬公告已開示':'登記字號照會'}</h3>{solved&&<button onClick={()=>setView(view==='question'?'manuscript':'question')}>{view==='question'?'閱覽附屬公告':'返回照會欄'}</button>}</div>
    {view==='question'?<><p>{item.hint}</p>{!solved&&<form onSubmit={submit}><input aria-label={item.label+'登記字號'} value={value} onChange={e=>{setValue(e.target.value);setError(false)}} placeholder="請填入登記字號"/><button type="submit">送交查核 <ArrowUpRight size={17}/></button></form>}{solved&&<p className="solved-note">本件已核章，可隨時調閱附屬公告。</p>}{error&&<small className="error">查無此案號，請確認登記內容。</small>}</>:<div className="manuscript"><BookOpen/><p>{item.manuscript}</p><small>— 臺中市役所・未綴込文書 {index+1}</small></div>}</div>
    {solved?<Unlock className="lock" aria-label="已受理"/>:<LockKeyhole className="lock" aria-label="未受理"/>}
  </article>
}

function PuzzlePage(){
 const home=()=>window.location.assign('./');
 return <div className="puzzle-page office-subpage">
  <header className="route-nav"><button className="brand" onClick={home}><span>臺中市役所</span><i>文書</i></button><button className="route-back" onClick={home}><ArrowLeft size={18}/> 公示板へ戻る</button></header>
  <main><section className="puzzle-page-hero"><img className="puzzle-character" src="./assets/decor-person-front.webp" alt="" aria-hidden="true"/><p className="eyebrow">臺中市役所 庶務課 文書係</p><h1>受理番號照會所</h1><p><span className="puzzle-lead-primary">現地巡查所得之登記字號，請依號填入下列照會欄。</span><span className="puzzle-lead-secondary">查核相符者，附屬公告即予開示；已受理案件將保留核章紀錄。</span></p></section>
  <section className="puzzles puzzle-page-content"><div className="puzzle-list">{puzzles.map((p,i)=><Puzzle key={p.label+i} item={p} index={i}/>)}</div></section></main>
 </div>
}

function buildPersonalEnding(reflection,item,index,unlockedCount){
 const text=reflection.trim();
 const themes=[
  {words:['人','居民','店家','相遇','故事'],line:'你記住的並不只是街道，而是仍在街角生活的人。'},
  {words:['建築','房子','市場','街道','空間'],line:'你從牆面、屋簷與市場的聲音裡，讀出了城市留下的筆跡。'},
  {words:['記憶','歷史','1938','以前','過去'],line:'你沒有把過去當成答案，而是把它當成仍可繼續追問的記憶。'},
  {words:['食物','味道','吃','香味'],line:'你用味道記住了這趟調查，也替老城保存了一種最日常的證詞。'},
  {words:['改變','未來','保存','繼續'],line:'你看見城市一直改變，也選擇替下一段故事留下位置。'}
 ];
 const matched=themes.find(theme=>theme.words.some(word=>text.includes(word)));
 const opening=matched?.line||'你沿著今日的街道，讀見了另一個年代仍未寫完的段落。';
 const detail=text?`你留下「${text.slice(0,42)}${text.length>42?'……':''}」，這句話已編入本次調查記錄。`:'即使尚未寫下完整答案，你停留與觀看的片刻，也已成為這座城的新註記。';
 const progress=unlockedCount>=puzzles.length?'七份案卷均已受理；你不再只是調查員，也是這份城市記憶的續寫者。':`目前已有 ${unlockedCount} 份案卷完成受理，仍有一些聲音等待你回來翻閱。`;
 return `${opening}${detail}${progress}——第 ${index+1} 號案卷・${item.label}`;
}

function resizePhoto(file){
 return new Promise((resolve,reject)=>{
  const reader=new FileReader();
  reader.onerror=()=>reject(new Error('read'));
  reader.onload=()=>{
   const image=new Image();
   image.onerror=()=>reject(new Error('image'));
   image.onload=()=>{
    const max=1200;
    const scale=Math.min(1,max/Math.max(image.width,image.height));
    const canvas=document.createElement('canvas');
    canvas.width=Math.round(image.width*scale);
    canvas.height=Math.round(image.height*scale);
    canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
    resolve(canvas.toDataURL('image/jpeg',.78));
   };
   image.src=reader.result;
  };
  reader.readAsDataURL(file);
 });
}

function FieldJournal({item,index,unlockedCount}){
 const unlockKey='suzuran-office-unlocked-'+index;
 const recordKey='suzuran-field-record-'+index;
 const initialRecord=()=>{
  try{return JSON.parse(window.localStorage.getItem(recordKey))||{reflection:'',photo:'',ending:''}}catch{return {reflection:'',photo:'',ending:''}}
 };
 const [solved,setSolved]=useState(()=>window.localStorage.getItem(unlockKey)==='1');
 const [value,setValue]=useState('');
 const [error,setError]=useState(false);
 const [record,setRecord]=useState(initialRecord);
 const [documentView,setDocumentView]=useState('travel');
 const [photoError,setPhotoError]=useState('');
 const document=caseDocuments[index];
 const documentReady=solved&&(index!==puzzles.length-1||unlockedCount>=puzzles.length);
 const saveRecord=next=>{setRecord(next);try{window.localStorage.setItem(recordKey,JSON.stringify(next))}catch{setPhotoError('照片檔案較大，這次內容只能暫存在目前頁面。')}};
 const submit=async event=>{
  event.preventDefault();
  const submittedHash=await hashAnswer(value);
  const ok=(item.hashes||[item.hash]).includes(submittedHash);
  setError(!ok);
  if(ok){setSolved(true);window.localStorage.setItem(unlockKey,'1')}
 };
 const addPhoto=async event=>{
  const file=event.target.files?.[0];
  if(!file)return;
  if(!file.type.startsWith('image/')){setPhotoError('請選擇照片檔案。');return}
  setPhotoError('');
  try{saveRecord({...record,photo:await resizePhoto(file)})}catch{setPhotoError('照片無法讀取，請換一張再試。')}
 };
 const createEnding=()=>saveRecord({...record,ending:buildPersonalEnding(record.reflection,item,index,unlockedCount)});
 return <article className={'gazette-case case-type-'+item.type+' '+(solved?'is-open':'is-locked')}>
  <header className="gazette-case-head">
   <div className="gazette-issue"><small>臺中市報附錄</small><b>第 {String(index+1).padStart(3,'0')} 號</b></div>
   <div><p>{item.code}・第 {item.day} 日調查記錄</p><h2>{item.label}</h2></div>
   <div className="gazette-status">{solved?'受理済':'未受理'}</div>
  </header>
  <div className="gazette-columns">
   <section className="gazette-query">
    <h3>{item.taskTitle}</h3>
    <p>{item.hint}</p>
    {!solved&&<form onSubmit={submit}><label htmlFor={'case-'+index}>{item.inputLabel}</label><div><input id={'case-'+index} value={value} onChange={event=>{setValue(event.target.value);setError(false)}} placeholder={'請輸入'+item.inputLabel}/><button type="submit">送交查核</button></div>{error&&<small>登記內容不符，請重新確認現場線索。</small>}</form>}
    {solved&&<p className="gazette-approved">本件照合完了，准予閱覽附載手稿。</p>}
   </section>
   <section className="gazette-manuscript">
    <h3>{documentReady?'雙版本城市記錄':solved?'待全案辦結':'附載手稿・封緘中'}</h3>
    {documentReady?<div className="document-reader">
      <div className="document-tabs" role="tablist" aria-label="切換城市記錄版本">
       <button role="tab" aria-selected={documentView==='travel'} className={documentView==='travel'?'active':''} onClick={()=>setDocumentView('travel')}>內地人遊記</button>
       <button role="tab" aria-selected={documentView==='island'} className={documentView==='island'?'active':''} onClick={()=>setDocumentView('island')}>本島人手稿</button>
      </div>
      <div className={'document-copy '+documentView} role="tabpanel">
       <BookOpen/>
       <small>{document.title}</small>
       <h4>{documentView==='travel'?'內地人遊記':'本島人手稿'}</h4>
       {document[documentView].map((paragraph,paragraphIndex)=><p key={paragraphIndex}>{paragraph}</p>)}
       <footer>{documentView==='travel'?'市役所遊覽資料・公開稿':'昭和十三年・臺中市街生活記錄'}</footer>
      </div>
     </div>:<div className="gazette-sealed"><LockKeyhole/><span>{solved?'特殊手稿須待十三件案件全數受理後開封':'須經登記字號照合始得展閱'}</span></div>}
   </section>
  </div>
  <section className="field-record">
   <div className="field-record-heading"><div><small>FIELD NOTE / 私人附箋</small><h3>我的走讀記錄</h3></div><span>本欄僅保存於目前裝置</span></div>
   <div className="field-record-grid">
    <div className="photo-entry">
     {record.photo?<img src={record.photo} alt={'第 '+(index+1)+' 號走讀記錄'}/>:<div><b>寫真貼付欄</b><span>可放入現場照片、街景或小組合照</span></div>}
     <label><input type="file" accept="image/*" onChange={addPhoto}/>{record.photo?'更換寫真':'選擇寫真'}</label>
     {record.photo&&<button onClick={()=>saveRecord({...record,photo:''})}>移除</button>}
     {photoError&&<small>{photoError}</small>}
    </div>
    <div className="reflection-entry">
     <label htmlFor={'reflection-'+index}>調查後記</label>
     <textarea id={'reflection-'+index} value={record.reflection} onChange={event=>saveRecord({...record,reflection:event.target.value,ending:''})} placeholder="今天哪個人、地方、聲音或味道讓你停下來？"/>
     <button onClick={createEnding}>編製我的結語 <ArrowUpRight size={16}/></button>
    </div>
   </div>
   {record.ending&&<div className="personal-ending"><small>個人調查結語・編製済</small><p>{record.ending}</p><i>閱</i></div>}
  </section>
 </article>
}

function NewspaperJournalPage({caseIndex}){
 const home=()=>window.location.assign('./');
 const [unlockedCount,setUnlockedCount]=useState(()=>puzzles.filter((_,index)=>window.localStorage.getItem('suzuran-office-unlocked-'+index)==='1').length);
 useEffect(()=>{
  const refresh=()=>setUnlockedCount(puzzles.filter((_,index)=>window.localStorage.getItem('suzuran-office-unlocked-'+index)==='1').length);
  window.addEventListener('storage',refresh);
  const timer=window.setInterval(refresh,700);
  return()=>{window.removeEventListener('storage',refresh);window.clearInterval(timer)}
 },[]);
 const selected=Number.isInteger(caseIndex)&&caseIndex>=0&&caseIndex<puzzles.length?caseIndex:null;
 const openCase=index=>window.location.assign('./?page=puzzles&case='+(index+1));
 const goIndex=()=>window.location.assign('./?page=puzzles');
 const dayGroups=[1,2].map(day=>({day,items:puzzles.map((item,index)=>({...item,index})).filter(item=>item.day===day)}));
 return <div className={'newspaper-journal-page '+(selected===null?'journal-index-page':'journal-case-page')}>
  <header className="route-nav"><button className="brand" onClick={home}><span>翻閱1938</span><i>市報</i></button><button className="route-back" onClick={selected===null?home:goIndex}><ArrowLeft size={18}/> {selected===null?'返回市役所':'返回案件目錄'}</button></header>
  <main>
   <section className="gazette-hero"><div className="gazette-mast"><small>昭和十三年 臺中市街調查記錄</small><h1>臺中市報</h1><b>調查手稿特別附錄</b></div><div className="gazette-meta"><span>第千百七十三號外</span><time>昭和十三年八月十四日</time><strong>{unlockedCount} / {puzzles.length} 件受理</strong></div></section>
   <section className="gazette-guidance"><b>案件說明</b><p>選擇一件調查案件，輸入走讀現場取得的答案。查核完成後，可對照內地人遊記與本島人手稿、貼付寫真、記錄調查後記並編製個人結語。</p><span>照片與文字只保存在目前裝置</span></section>
   {selected===null
    ?<section className="case-directory">{dayGroups.map(group=><div className={'case-day-group day-'+group.day} key={group.day}><header><div><small>DAY / 0{group.day}</small><h2>第{group.day===1?'一':'二'}日調查案件</h2></div><span>{group.items.filter(item=>window.localStorage.getItem('suzuran-office-unlocked-'+item.index)==='1').length} / {group.items.length} 件完成</span></header><div className="case-directory-grid">{group.items.map(item=>{const solved=window.localStorage.getItem('suzuran-office-unlocked-'+item.index)==='1';return <button className={'case-file case-type-'+item.type+(solved?' is-open':'')} onClick={()=>openCase(item.index)} key={item.label}><span>{String(item.index+1).padStart(2,'0')}</span><div><small>{item.code}</small><h3>{item.taskTitle}</h3><p>{item.hint}</p></div><b>{solved?'已解鎖':'未查核'}</b><ArrowUpRight size={18}/></button>})}</div></div>)}</section>
    :<><nav className="case-pager" aria-label="案件切換"><button disabled={selected===0} onClick={()=>openCase(selected-1)}><ArrowLeft size={16}/> 上一件</button><span>第 {selected+1}／{puzzles.length} 件・DAY 0{puzzles[selected].day}</span><button disabled={selected===puzzles.length-1} onClick={()=>openCase(selected+1)}>下一件 <ArrowUpRight size={16}/></button></nav><section className="gazette-case-list"><FieldJournal item={puzzles[selected]} index={selected} unlockedCount={unlockedCount}/></section></>}
  </main>
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
   const marker=L.marker([point.lat,point.lng],{icon}).addTo(map).bindPopup(`<div class="story-popup"><small>${routeLabel} · STOP ${String(point.index+1).padStart(2,'0')}</small><strong>${point.historic||point.name}</strong>${point.historic?`<span>現代地點：${point.name}</span>`:''}<a href="${navigation}" target="_blank" rel="noreferrer">開啟導航 ↗</a></div>`).on('click',()=>{if(point.kind==='day')onDayChange(point.day);onModeChange(point.kind==='guide'?'guide':`day${point.day+1}`)});
   if(point.kind==='day')marker.bindTooltip(point.historic||point.name,{permanent:true,direction:'top',offset:[0,-35],className:'historic-tooltip'});
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
  <header className="route-nav"><button className="brand" onClick={back}><span>臺中市役所</span><i>巡查</i></button><button className="route-back" onClick={back}><ArrowLeft size={18}/> 公示板へ戻る</button></header>
  <main>
   <section className="route-hero"><div><p className="eyebrow">昭和十三年度 · {chapter.date}</p><h1>{index===0?'第一日':'第二日'}巡查路線</h1><p>左記順序辦理現地查錄，共 <b>{chapter.points.length}</b> 處</p></div><img className="route-character" src={index===0?'./assets/decor-person-walk.webp':'./assets/decor-person-front.webp'} alt="" aria-hidden="true"/><div className="route-day-mark"><small>巡查圖</small><b>0{index+1}</b><span>昭和十三年</span></div></section>
   <section className="route-page-list" aria-label={(index===0?'第一日':'第二日')+'巡查地點'}>{chapter.points.map((point,i)=><article className="route-stop" key={point.name}><div className="route-sequence"><span>{String(i+1).padStart(2,'0')}</span><i></i></div><div className="route-stop-copy"><p>第 {i+1} 地點</p><h2>{point.name}</h2><a href={mapsUrl(point.name)} target="_blank" rel="noreferrer">配置圖で確認 <ExternalLink size={15}/></a></div></article>)}</section>
   {index===1&&<section className="route-final-mission"><div className="final-mission-heading"><p className="eyebrow">FINAL CHAPTER · FOURTH MARKET</p><h2>終章：把1938寫回城市</h2><p>完成最後一站後，請以小組為單位整理兩日調查成果，將你們看見的城市故事說給彼此聽。</p></div><div className="final-mission-grid"><article><span>01</span><h3>選一個地點</h3><p>選出兩日走讀中最有感、最想留下的一個地點。</p></article><article><span>02</span><h3>寫下待續</h3><p>完成句子：「我們在＿＿看見＿＿。如果替城市留下下一頁，我們想寫下＿＿。」</p></article><article><span>03</span><h3>一分鐘發表</h3><p>每組派一位代表分享發現，也可以由全組接力完成。</p></article><article><span>04</span><h3>把記憶留下</h3><p>將待續章節卡貼到活動地圖，在第四市場完成合照與任務收尾。</p></article></div></section>}
    <section className="route-finish"><p className="eyebrow">巡查終了 · 案件查核</p><h2><span>巡查簿完成後</span><span>辦理調查案件查核</span></h2><button onClick={()=>window.location.assign('./?page=puzzles')}>前往調查案件目錄 <ArrowUpRight size={18}/></button></section>
  </main>
 </div>
}

function GameGuidePage(){
 const home=()=>window.location.assign('./');
 return <div className="game-guide-page">
  <header className="route-nav"><button className="brand" onClick={home}><span>臺中市役所</span><i>心得</i></button><button className="route-back" onClick={home}><ArrowLeft size={18}/> 公示板へ戻る</button></header>
  <main>
   <section className="game-guide-hero"><div><p className="eyebrow">昭和十三年度・臨時調查掛</p><h1>調查勤務心得</h1><p>受命之見習調查員，應依本心得辦理市街巡查、文書查錄及終章報告。</p></div><img src="./assets/decor-person-walk.webp" alt="" aria-hidden="true"/></section>
    <section className="game-story"><div className="guide-section-heading"><p className="eyebrow">任命緣由</p><h2>勤務始於一份缺頁檔案</h2></div><div className="assignment-letter"><small>臺中市役所・調查命令 第1938號</small><p>昭和十三年，市役所整理城市檔案時，發現關於臺中舊城的紀錄出現多處空白。建築仍在，街道仍有名字，然而曾經生活在這裡的人、氣味、聲音與日常，正從紙頁上逐漸消失。</p><p>市役所因此召集各位學生，委派為「見習調查員」。受命者須進入街區，以觀察、巡查、飲食、訪談與案件查核採集線索，找回未被正式史書完整收錄的故事，補成一份屬於本島人的城市手稿。</p><strong>本件不以取得唯一答案為目的；務必查明一座城市除正式紀錄之外，尚留下哪些人的生活。</strong></div></section>
   <section className="investigator-role"><div className="guide-section-heading"><p className="eyebrow">調查掛編制</p><h2>見習調查員勤務分掌</h2><p>各組編為一調查小隊。行動時彼此提醒、交換所見，並共同保管取得之文書與線索。</p></div><div className="role-grid"><article><span>01</span><h3>引路員</h3><p>確認路線、集合時間與下一個調查地點。</p></article><article><span>02</span><h3>觀察員</h3><p>留意建築、招牌、器物、氣味與現場細節。</p></article><article><span>03</span><h3>記錄員</h3><p>把發現、疑問與關鍵字寫進調查紀錄。</p></article><article><span>04</span><h3>報告員</h3><p>整理小組觀點，在終章代表小隊報告。</p></article></div><p className="role-note">人數不足時得兼任；勤務分掌可於巡查途中交換。</p></section>
   <section className="investigation-flow"><div className="guide-section-heading"><p className="eyebrow">勤務順序</p><h2>兩日巡查辦理方式</h2></div><div className="flow-list">{investigationStages.map(stage=><article key={stage.no}><div className="flow-no">{stage.no}</div><div><p>{stage.label}</p><h3>{stage.title}</h3><span>{stage.text}</span></div></article>)}</div></section>
   <section className="game-rules"><div className="guide-section-heading"><p className="eyebrow">執務心得</p><h2>現地行動注意事項</h2></div><ol><li><b>先觀察，再登記。</b><span>字號線索均在現地，應先查看建築、街道及係員交付之材料。</span></li><li><b>共同查錄，不競速度。</b><span>各員所見未必相同，互相核對比搶先抵達更為重要。</span></li><li><b>遵從係員指示移動。</b><span>通過道路、進入店家或公共空間時，以安全與現地秩序為先。</span></li><li><b>不得妨礙街區居民。</b><span>攝影人物、店家內部或私人空間前，須先取得同意；未開放物件不得觸碰。</span></li><li><b>事實與所感分別記入。</b><span>正式紀錄與個人感受均可保留，惟應於調查簿中清楚區分。</span></li></ol></section>
   <section className="guide-finale"><p className="eyebrow">FINAL CHAPTER</p><h2>你們找到的不是結局</h2><p>兩日任務最後將在第四市場完成。每一組的發表與待續章節卡，會成為這次調查新增的一頁。當你把觀察說出來、把記憶寫下來，城市的故事便不再只停留在1938，而是由你繼續往後書寫。</p><button onClick={()=>window.location.assign('./?page=schedule')}>查看兩日活動時程 <ArrowUpRight size={18}/></button><small>實際流程與集合移動仍以當日帶隊人員指示為準。</small></section>
  </main>
 </div>
}

function InfoPage(){
 const home=()=>window.location.assign('./');
 const link=hash=>window.location.assign('./'+hash);
 return <div className="participant-info-page">
  <header className="route-nav"><button className="brand" onClick={home}><span>臺中市役所</span><i>庶務</i></button><button className="route-back" onClick={home}><ArrowLeft size={18}/> 公示板へ戻る</button></header>
  <main><section className="participant-info-hero"><p className="eyebrow">庶務課・外部連絡掛</p><h1>庶務課案內</h1><p>集合時刻、勤務異動及緊急連絡，以左列外部連絡板之告示為準。</p></section>
  <section className="participant-info-body"><div className="social-links"><a className="social-card instagram" href="https://www.instagram.com/tcold.spots/" target="_blank" rel="noreferrer"><Instagram/><div><small>INSTAGRAM</small><h2>@tcold.spots</h2><p>最新公告與活動提醒</p></div><ExternalLink/></a><a className="social-card threads" href="https://www.threads.com/@tcold.spots" target="_blank" rel="noreferrer"><AtSign/><div><small>THREADS</small><h2>@tcold.spots</h2><p>追蹤即時動態</p></div><ExternalLink/></a><a className="social-card facebook" href="https://www.facebook.com/TCOldHouse" target="_blank" rel="noreferrer"><span className="facebook-glyph">f</span><div><small>FACEBOOK</small><h2>TCOldHouse</h2><p>前往官方粉絲專頁</p></div><ExternalLink/></a></div><div className="participant-links five"><button onClick={()=>window.location.assign('./?page=guide')}><span>01</span><b>調查任務</b><small>了解故事設定與遊戲方式</small><ArrowUpRight/></button><button onClick={()=>link('#journey')}><span>02</span><b>兩日章節</b><small>查看 Day 1、Day 2 路線</small><ArrowUpRight/></button><button onClick={()=>window.location.assign('./?page=schedule')}><span>03</span><b>活動時程</b><small>查看兩日大概行程時間</small><ArrowUpRight/></button><button onClick={()=>link('#map')}><span>04</span><b>章節座標</b><small>開啟兩日點位與合作導覽路線</small><ArrowUpRight/></button><button onClick={()=>window.location.assign('./?page=puzzles')}><span>05</span><b>謎題手稿</b><small>輸入答案並翻閱手稿</small><ArrowUpRight/></button></div></section></main>
 </div>
}

function SchedulePage(){
 const home=()=>window.location.assign('./');
 return <div className="schedule-page">
  <header className="route-nav"><button className="brand" onClick={home}><span>臺中市役所</span><i>時刻</i></button><button className="route-back" onClick={home}><ArrowLeft size={18}/> 公示板へ戻る</button></header>
  <main><section className="schedule-hero"><div className="schedule-hero-copy"><p className="eyebrow">昭和十三年度・臨時調查掛</p><h1>兩日執務時刻表</h1><p>左記為預定執務時刻。現地情況有變時，依帶隊係員之指示辦理。</p></div><img className="schedule-character" src="./assets/decor-person-front.webp" alt="" aria-hidden="true"/></section>
  <section className="schedule-body">{schedules.map((schedule,index)=><article className={'schedule-day schedule-day-'+(index+1)} key={schedule.day}><div className="schedule-day-head"><div><p className="eyebrow">{schedule.label}</p><h2>{schedule.day}</h2></div><span>1938</span></div><ol>{schedule.items.map((item,itemIndex)=><li key={item.time+item.title}><div className="schedule-time"><Clock size={17}/><time>{item.time}</time></div><div className="schedule-event"><small>{String(itemIndex+1).padStart(2,'0')}</small><h3>{item.title}</h3></div></li>)}</ol></article>)}</section></main>
 </div>
}

function MunicipalHome(){
 const [mapMode,setMapMode]=useState('both'); const [active,setActive]=useState(0);
 const [activeSection,setActiveSection]=useState('new-notices');
 const [visits]=useState(()=>{const key='suzuran-office-counter';const next=Math.min((Number(window.localStorage.getItem(key))||36)+1,9999);window.localStorage.setItem(key,String(next));return String(next).padStart(4,'0')});
 const open=target=>window.location.assign(target); const scroll=id=>{setActiveSection(id);document.getElementById(id)?.scrollIntoView({behavior:'smooth'})};
 return <div className="municipal-site">
  <header className="office-header"><div className="office-identity"><div className="office-seal-mark">臺中<br/>市役所</div><div><p>昭和十三年度・臨時公示板</p><h1>臺中市役所</h1><span>臺中州臺中市・庶務課文書係</span></div></div><div className="office-date"><small>告示更新</small><b>昭和十三年八月十三日</b><span>庶務秘第七二號</span></div></header>
  <nav className="office-portal-nav" aria-label="市役所公示板導覽"><button className={activeSection==='new-notices'?'active':''} onClick={()=>scroll('new-notices')}>最新通達</button><button className={activeSection==='patrol'?'active':''} onClick={()=>scroll('patrol')}>巡迴路線</button><button className={activeSection==='roster'?'active':''} onClick={()=>scroll('roster')}>職員編制</button><button onClick={()=>open('./?page=puzzles')}>調查案件</button><button className={activeSection==='office-map'?'active':''} onClick={()=>scroll('office-map')}>管內配置圖</button><button onClick={()=>open('./?page=schedule')}>執務時刻</button><button onClick={()=>open('./?page=info')}>洽詢須知</button></nav>
  <details className="office-mobile-menu"><summary>公示板選單 <Menu size={18}/></summary><div><button onClick={()=>scroll('new-notices')}>最新通達</button><button onClick={()=>scroll('patrol')}>巡迴路線</button><button onClick={()=>scroll('roster')}>職員編制</button><button onClick={()=>open('./?page=puzzles')}>調查案件</button><button onClick={()=>scroll('office-map')}>管內配置圖</button><button onClick={()=>open('./?page=schedule')}>執務時刻</button><button onClick={()=>open('./?page=info')}>洽詢須知</button></div></details>
  <div className="office-shell">
   <aside className="office-sidebar"><section><h2>公示板目錄</h2><button onClick={()=>scroll('new-notices')}>一、本日新到公告</button><button onClick={()=>scroll('patrol')}>二、兩日巡回路線</button><button onClick={()=>scroll('roster')}>三、職員編制表</button><button onClick={()=>scroll('office-map')}>四、市街配置圖</button></section><section className="office-counter"><h2>本日登入人數</h2><strong>{visits}</strong><p>本機到訪次數</p></section><section className="office-small-notice"><h2>洽詢須知</h2><p>巡查者須攜帶調查簿。案件答案不明者，請於現地重新核對，不得逕向文書係索取。</p></section></aside>
   <main className="office-main">
    <section className="office-welcome" id="new-notices"><div className="office-title-row"><p>臺中市役所告示</p><h2>本日新到公告</h2><span>揭示期間：昭和十三年八月</span></div><div className="notice-list no-stamps"><article><time>八月十三日</time><div><small>庶務秘第七二號</small><h3>臨時調查員任命及市街巡查要領</h3><p>因市役所舊簿冊出現缺頁，命受理學生編為見習調查員，依指定區域採集民生日常及商號紀錄。</p></div><button onClick={()=>open('./?page=guide')}>公告本文</button></article><article><time>八月十三日</time><div><small>巡查第十九號</small><h3>兩日巡回路線及配置變更</h3><p>本次巡查分兩日共十七處，應依公告順序完成查錄；各點詳見配置圖及附屬路線頁。</p></div><button onClick={()=>scroll('patrol')}>路線公告</button></article><article><time>八月十四日</time><div><small>文書秘第二號</small><h3>十三件調查案件開放查核</h3><p>現地所得答案可於案件目錄逐件查核。內容相符者，准予閱覽附屬公告及未綴込文書。</p></div><button onClick={()=>open('./?page=puzzles')}>案件目錄</button></article></div></section>
    <section className="patrol-notice office-paper" id="patrol"><div className="document-head"><div><small>臺中市役所　巡查第十九號</small><h2>兩日市街巡回路線公告</h2><p>昭和十三年八月十三日</p></div><div className="document-stamp">巡查<br/>指定</div></div><p className="document-intro">臨時調查員之巡查地點，分兩日依左列次序辦理。各處並非競速通過之關卡；應就現場用途、人物生活及異動痕跡詳實記入調查簿。</p>{dailyPatrolRoutes.map(group=><div className="patrol-day-block" key={group.day}><div className="patrol-day-title"><b>附圖{group.day===1?'甲':'乙'}</b><h3>{group.label}</h3><button onClick={()=>open('./?day='+group.day)}>開啟詳細路線 <ArrowUpRight size={15}/></button></div><div className="patrol-table place-version"><div className="table-head"><span>順序</span><span>巡查地點</span><span>勤務摘要</span><span>核章</span></div>{group.points.map(route=><div className="table-row" key={group.day+'-'+route.no}><b>{route.no}</b><strong>{route.name}</strong><span>{route.duty}</span><i></i></div>)}</div></div>)}</section>
    <section className="staff-board" id="roster"><div className="office-title-row"><p>劇情用編制資料</p><h2>市役所職員編制表</h2><span>庶務課保管・部外秘</span></div><table><thead><tr><th>所屬</th><th>官職</th><th>氏名</th><th>摘要</th></tr></thead><tbody>{officeStaff.map(person=><tr key={person.unit+person.name} className={person.name==='鈴蘭'?'staff-anomaly':''}><td>{person.unit}</td><td>{person.title}</td><td>{person.name}</td><td>{person.note}</td></tr>)}</tbody></table><p className="roster-footnote">※ 本表為活動情境之虛構資料。職稱用字參照當時官署慣例；人名與異動紀錄非真實史料。</p></section>
    <section className="office-map-board" id="office-map"><div className="office-title-row"><p>附圖・市街配置</p><h2>巡查區域配置圖</h2><span>縮尺及現況以現地為準</span></div><div className="office-map-layout"><StoryMap onDayChange={setActive} onModeChange={setMapMode}/><div className="map-register"><h3>配置圖取扱欄</h3><dl><div><dt>現在表示</dt><dd>{mapMode==='guide'?'案內係巡回路線':mapMode==='both'?'兩日巡查總圖':chapters[active].date+' 詳圖'}</dd></div><div><dt>圖面番號</dt><dd>中市庶圖 第〇七號</dd></div><div><dt>保管係</dt><dd>庶務課 文書係</dd></div><div><dt>閱覽</dt><dd>見習調查員限</dd></div></dl><button onClick={()=>open('./?page=schedule')}>當日執務時刻ヲ見る</button></div></div></section>
   </main>
   <aside className="office-rightbar"><section><h2>執務狀態</h2><p><b>受付</b><span>午前九時開始</span></p><p><b>巡查</b><span>兩日十七處</span></p><p><b>案件</b><span>十三件待查</span></p><p><b>終章</b><span>第四市場</span></p></section><section className="office-clipping"><h2>係員備忘</h2><p>「正式紀錄」與「人們記得的事」若有出入，兩者均須留下。</p><span>— 文書係頁緣註記</span></section><section><h2>官方聯絡板</h2><p className="rightbar-explain">活動異動、集合提醒與最新公告，以主辦單位發布內容為準。</p><button onClick={()=>open('./?page=info')}>開啟聯絡資訊</button></section></aside>
  </div>
  <footer className="office-footer"><p>本公示板由臺中市役所庶務課文書係維持管理。連結錯誤及文書缺落請向係員申告。</p><p>昭和十三年度臨時公示板　最佳閱覽幅員 1024px 以上　最終更新 08月13日 17時40分</p><small>本頁為《翻閱1938：那些待續的章節》活動情境網站，所列職員與公文均屬虛構。</small></footer>
 </div>
}

function App(){
 const params=new URLSearchParams(window.location.search); const day=Number(params.get('day')); const page=params.get('page'); const caseNumber=Number(params.get('case'));
 const [menu,setMenu]=useState(false); const [active,setActive]=useState(0); const [mapMode,setMapMode]=useState('both');
 const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false)};
 if(day===1||day===2) return <RoutePage chapter={chapters[day-1]} index={day-1}/>;
 if(page==='info') return <InfoPage/>;
 if(page==='puzzles') return <NewspaperJournalPage caseIndex={caseNumber?caseNumber-1:null}/>;
 if(page==='schedule') return <SchedulePage/>;
 if(page==='guide') return <GameGuidePage/>;
 return <MunicipalHome/>
}
createRoot(document.getElementById('root')).render(<App/>);
