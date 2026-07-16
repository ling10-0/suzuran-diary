import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowDown, ArrowLeft, ArrowUpRight, CalendarDays, MapPin, Menu, X, LockKeyhole, BookOpen, ExternalLink, Instagram} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
import './puzzle.css';
import './campaign.css';

const chapters = [
  {date:'DAY / 01',year:'1938',tag:'角色登錄',title:'城市把名字交給你',text:'從舊報紙與街角暗號開始，認識鈴蘭通り的人們。收集散落線索，找出第一段未完的記憶。',place:'臺中舊城・第一章',tone:'ochre',points:[{name:'1916工坊',lat:24.131331,lng:120.681887},{name:'臺中市第三公有零售市場',lat:24.1331583,lng:120.6830965},{name:'富興工廠1962文創聚落',lat:24.135119,lng:120.683746},{name:'合作金庫銀行 台中分行',lat:24.1378939,lng:120.6800847},{name:'臺中市役所',lat:24.1383354,lng:120.6791052},{name:'三信商業銀行 台中分行',lat:24.1393276,lng:120.679735},{name:'永生蔘藥行三連棟',lat:24.1411747,lng:120.6794953},{name:'柳川古道',lat:24.1423566,lng:120.6775796},{name:'第二市場',lat:24.1424183,lng:120.6791452},{name:'柳美術館',lat:24.1419249,lng:120.6777138},{name:'文化部文化資產園區',lat:24.1330547,lng:120.6805222}]},
  {date:'DAY / 02',year:'1938',tag:'記憶回收',title:'替故事寫下待續',text:'真人角色與城市場景在終章交會。解開最後一道謎題，翻閱一份不曾被收進史書的本島人手稿。',place:'臺中舊城・第二章',tone:'blue',points:[{name:'中山綠橋',lat:24.1378842,lng:120.6831311},{name:'台中市第四信用合作社',lat:24.1390204,lng:120.6819297},{name:'中央書局',lat:24.1408452,lng:120.6811557},{name:'全安堂台灣台中太陽餅博物館',lat:24.1397217,lng:120.6824917},{name:'歷史建築臺中第四市場',lat:24.140556,lng:120.6933848},{name:'綠空鐵道1908',lat:24.1354544,lng:120.6821701}]}
];

const puzzles = [
  {hint:'街區以一種花為名。它低垂、潔白，卻帶著微毒。',answer:'鈴蘭',label:'第一日暗號',manuscript:'昭和十三年，鈴蘭通り的風仍吹過店家的布簾。人們用不同的名字叫這座城，但我們記得每一扇門後的生活。這不是誰替我們寫的歷史，是我們自己留下的聲音。'},
  {hint:'請輸入故事發生的西元年份。',answer:'1938',label:'第二日暗號',manuscript:'我把未說完的話藏在紙頁之間，等下一個翻閱的人。若你讀到這裡，請不要只記得事件，也記得那些做飯、工作、相愛與等待的人。章節尚未結束，因為你已經來到其中。'}
];

function Puzzle({item,index}){
  const [value,setValue]=useState(''); const [solved,setSolved]=useState(false); const [view,setView]=useState('question'); const [error,setError]=useState(false);
  const submit=e=>{e.preventDefault(); const ok=value.trim().toLowerCase()===item.answer.toLowerCase();setSolved(ok);setView(ok?'manuscript':'question');setError(!ok)};
  return <article className={'puzzle '+(solved?'unlocked':'')}>
    <div className="puzzle-no">0{index+1}</div><div className="puzzle-body"><p className="eyebrow">{item.label}</p><div className="puzzle-title"><h3>{solved?'手稿已解鎖':'輸入謎題答案'}</h3>{solved&&<button onClick={()=>setView(view==='question'?'manuscript':'question')}>{view==='question'?'翻閱手稿':'返回題目'}</button>}</div>
    {view==='question'?<><p>{item.hint}</p>{!solved&&<form onSubmit={submit}><input aria-label={item.label+'答案'} value={value} onChange={e=>{setValue(e.target.value);setError(false)}} placeholder="在此輸入答案"/><button type="submit">確認暗號 <ArrowUpRight size={17}/></button></form>}{solved&&<p className="solved-note">此題已完成，可隨時切換回手稿。</p>}{error&&<small className="error">暗號不正確，請回到現場尋找線索。</small>}</>:<div className="manuscript"><BookOpen/><p>{item.manuscript}</p><small>— 本島人手稿・殘頁 {index+1}</small></div>}</div>
    <LockKeyhole className="lock"/>
  </article>
}

function StoryMap({onDayChange}){
 const mapNode=useRef(null); const mapInstance=useRef(null); const [filter,setFilter]=useState('all');
 useEffect(()=>{
  if(mapInstance.current) mapInstance.current.remove();
  const map=L.map(mapNode.current,{zoomControl:false,scrollWheelZoom:false}); mapInstance.current=map;
  L.control.zoom({position:'bottomright'}).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
  const visible=chapters.flatMap((chapter,day)=>filter==='all'||filter===day+1?chapter.points.map((point,index)=>({...point,day,index})):[]);
  const bounds=[];
  visible.forEach(point=>{
   const dayClass=point.day===0?'day-one':'day-two';
   const icon=L.divIcon({className:'story-pin-wrap',html:`<span class="story-pin ${dayClass}">${point.index+1}</span>`,iconSize:[38,46],iconAnchor:[19,42],popupAnchor:[0,-38]});
   const navigation=`https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
   L.marker([point.lat,point.lng],{icon}).addTo(map).bindPopup(`<div class="story-popup"><small>DAY ${point.day+1} · STOP ${String(point.index+1).padStart(2,'0')}</small><strong>${point.name}</strong><a href="${navigation}" target="_blank" rel="noreferrer">開啟導航 ↗</a></div>`).on('click',()=>onDayChange(point.day));
   bounds.push([point.lat,point.lng]);
  });
  chapters.forEach((chapter,day)=>{if(filter==='all'||filter===day+1)L.polyline(chapter.points.map(p=>[p.lat,p.lng]),{color:day===0?'#a73a2b':'#6a4a9b',weight:3,opacity:.85,dashArray:'7 8'}).addTo(map)});
  map.fitBounds(bounds,{padding:[40,40],maxZoom:16});
  return()=>{map.remove();mapInstance.current=null};
 },[filter,onDayChange]);
 return <div className="story-map-shell"><div className="map-filter" aria-label="切換路線"><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>全部</button><button className={filter===1?'active day-one':''} onClick={()=>setFilter(1)}>DAY 1</button><button className={filter===2?'active day-two':''} onClick={()=>setFilter(2)}>DAY 2</button></div><div ref={mapNode} className="story-map"></div></div>
}

function RoutePage({chapter,index}){
 const back=()=>window.location.assign('./#journey');
 const mapsUrl=name=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name+' 台中');
 return <div className={'route-page route-day-'+(index+1)}>
  <header className="route-nav"><button className="brand" onClick={back}><span>翻閱1938</span><i>待續</i></button><button className="route-back" onClick={back}><ArrowLeft size={18}/> 回到兩日章節</button></header>
  <main>
   <section className="route-hero"><div><p className="eyebrow">{chapter.date} · WALKING ROUTE</p><h1>{index===0?'第一日':'第二日'}路線</h1><p>沿著章節順序走進臺中舊城，共有 <b>{chapter.points.length}</b> 個可走地點。</p></div><div className="route-day-mark"><small>CHAPTER</small><b>0{index+1}</b><span>1938</span></div></section>
   <section className="route-page-list" aria-label={(index===0?'第一日':'第二日')+'可走地點'}>{chapter.points.map((point,i)=><article className="route-stop" key={point.name}><div className="route-sequence"><span>{String(i+1).padStart(2,'0')}</span><i></i></div><div className="route-stop-copy"><p>第 {i+1} 站</p><h2>{point.name}</h2><a href={mapsUrl(point.name)} target="_blank" rel="noreferrer">在地圖中尋找 <ExternalLink size={15}/></a></div></article>)}</section>
   <section className="route-finish"><p className="eyebrow">END OF ROUTE · CONTINUE THE STORY</p><h2>走完路線，回到謎題解鎖手稿。</h2><button onClick={()=>window.location.assign('./#puzzles')}>前往謎題手稿 <ArrowUpRight size={18}/></button></section>
  </main>
 </div>
}

function InfoPage(){
 const home=()=>window.location.assign('./');
 const link=hash=>window.location.assign('./'+hash);
 return <div className="participant-info-page">
  <header className="route-nav"><button className="brand" onClick={home}><span>翻閱1938</span><i>待續</i></button><button className="route-back" onClick={home}><ArrowLeft size={18}/> 回到活動首頁</button></header>
  <main><section className="participant-info-hero"><p className="eyebrow">PARTICIPANT INFORMATION</p><h1>參加者資訊</h1><p>集合提醒、活動異動與最新公告，請以官方 Instagram 發布內容為準。</p></section>
  <section className="participant-info-body"><a className="instagram-card" href="https://www.instagram.com/tcold.spots/" target="_blank" rel="noreferrer"><Instagram/><div><small>OFFICIAL INSTAGRAM</small><h2>@tcold.spots</h2><p>查看最新公告與活動提醒</p></div><ExternalLink/></a><div className="participant-links"><button onClick={()=>link('#journey')}><span>01</span><b>兩日章節</b><small>查看 Day 1、Day 2 路線</small><ArrowUpRight/></button><button onClick={()=>link('#map')}><span>02</span><b>章節座標</b><small>開啟真實點位與導航</small><ArrowUpRight/></button><button onClick={()=>link('#puzzles')}><span>03</span><b>謎題手稿</b><small>輸入答案並翻閱手稿</small><ArrowUpRight/></button></div></section></main>
 </div>
}

function App(){
 const params=new URLSearchParams(window.location.search); const day=Number(params.get('day')); const page=params.get('page');
 const [menu,setMenu]=useState(false); const [active,setActive]=useState(0);
 const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false)};
 if(day===1||day===2) return <RoutePage chapter={chapters[day-1]} index={day-1}/>;
 if(page==='info') return <InfoPage/>;
 return <>
  <header><button className="brand" onClick={()=>go('top')}><span>翻閱1938</span><i>待續</i></button>
   <nav className={menu?'open':''}><button onClick={()=>window.location.assign('./?page=info')}>參加者資訊</button><button onClick={()=>go('journey')}>兩日章節</button><button onClick={()=>go('puzzles')}>謎題手稿</button><button onClick={()=>go('map')}>路線地圖</button><button className="seal" onClick={()=>go('journey')}>進入調查</button></nav>
   <button className="menu" aria-label="選單" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
  </header>
  <main id="top">
   <section className="hero campaign-hero"><div className="hero-copy campaign-copy"><p className="eyebrow">OLD CITY INVESTIGATION · 1938</p><img className="campaign-wordmark" src="./assets/campaign-logo.webp" alt="舊城調查團・翻閱一九三八：那些待續的章節"/><h1 className="sr-only">舊城調查團：翻閱一九三八，那些待續的章節</h1><p className="lead">有些歷史寫進書裡，有些故事留在人身上。<br/>循著鈴蘭與街道的線索，翻開尚未完結的章節。</p><div className="hero-facts"><span><b>DAY 01 — DAY 02</b><small>兩日調查任務</small></span><span><b>臺中舊城</b><small>章節座標已開啟</small></span></div><button className="read" onClick={()=>go('journey')}>進入第一章 <ArrowDown size={18}/></button></div>
    <div className="campaign-portrait"><div className="portrait-sun"></div><img src="./assets/campaign-portrait.webp" alt="穿著復古服裝、手持鈴蘭的調查員插畫"/><span>調查員<br/>已登錄</span></div><p className="vertical">臺中舊城・文化體驗・城市走讀</p></section>
   <section className="manifesto" id="about"><span>01</span><div><p>活動命題</p><h2>歷史不是完成式，<br/>而是一頁頁<span>等待翻閱</span>的手稿。</h2></div><p className="sidecopy">參與者在兩日活動中走入街區，與真人角色相遇、交換線索並完成謎題。手機是打開故事的鑰匙，真正的內容則發生在城市與人的相遇之間。</p></section>
   <section className="journal" id="journey"><div className="section-head"><div><p className="eyebrow">TWO-DAY JOURNEY</p><h2>兩日・兩個章節</h2></div><p>第一日進入故事，第二日回收記憶。<br/>點選任一章節，前往獨立頁面查看當日路線。</p></div><div className="cards two">{chapters.map((n,i)=><article key={n.title} role="button" tabIndex="0" className={n.tone+' chapter-card'} onMouseEnter={()=>setActive(i)} onClick={()=>window.location.assign('./?day='+(i+1))} onKeyDown={e=>e.key==='Enter'&&window.location.assign('./?day='+(i+1))}><div className="date"><b>{n.date}</b><small>{n.year}</small></div><div className="photo"><div className={'scene s'+i}></div><span>{n.tag}</span></div><div className="cardcopy"><h3>{n.title}</h3><p>{n.text}</p><div><span><MapPin size={14}/>{n.place}</span><button aria-label="前往當日路線頁面">開啟路線頁 <ArrowUpRight/></button></div></div></article>)}</div></section>
   <section className="puzzles" id="puzzles"><div className="puzzle-intro"><p className="eyebrow">UNLOCK THE MANUSCRIPTS</p><h2>解謎・翻閱本島人手稿</h2><p>答案藏在走讀現場。輸入正確暗號後，塵封的手稿殘頁將在此展開。</p></div><div className="puzzle-list">{puzzles.map((p,i)=><Puzzle key={p.label} item={p} index={i}/>)}</div></section>
   <section className="map" id="map"><StoryMap onDayChange={setActive}/><div className="mapcopy"><p className="eyebrow">STORY COORDINATES</p><h2>章節座標</h2><p>地圖標示兩日活動的真實位置。切換路線、縮放街區或點選編號，即可查看地點並開啟導航。</p><div className="selected"><CalendarDays/><span>{chapters[active].date}<small>{chapters[active].place} · {chapters[active].points.length} 個地點</small></span></div></div></section>
  </main>
  <footer><div className="brand foot"><span>翻閱1938</span><i>待續</i></div><p>我們留下的不是結局，<br/>而是邀請下一個人繼續閱讀。</p><div><button onClick={()=>go('top')}>回到頁首 ↑</button><small>© 2026 那些待續的章節</small></div></footer>
 </>
}
createRoot(document.getElementById('root')).render(<App/>);
