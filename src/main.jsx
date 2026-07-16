import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowDown, ArrowLeft, ArrowUpRight, CalendarDays, MapPin, Menu, X, LockKeyhole, BookOpen, ExternalLink} from 'lucide-react';
import './style.css';
import './puzzle.css';

const chapters = [
  {date:'DAY / 01',year:'1938',tag:'角色登錄',title:'城市把名字交給你',text:'從舊報紙與街角暗號開始，認識鈴蘭通り的人們。收集散落線索，找出第一段未完的記憶。',place:'臺中舊城・第一章',tone:'ochre',points:['1916工坊','臺中市第三公有零售市場','富興工廠1962文創聚落','合作金庫銀行 台中分行','臺中市役所','三信商業銀行 台中分行','永生蔘藥行三連棟','柳川古道','第二市場','柳美術館','文化部文化資產園區']},
  {date:'DAY / 02',year:'1938',tag:'記憶回收',title:'替故事寫下待續',text:'真人角色與城市場景在終章交會。解開最後一道謎題，翻閱一份不曾被收進史書的本島人手稿。',place:'臺中舊城・第二章',tone:'blue',points:['中山綠橋','台中市第四信用合作社','中央書局','全安堂台灣台中太陽餅博物館','歷史建築臺中第四市場','綠空鐵道1908']}
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

function RoutePage({chapter,index}){
 const back=()=>window.location.assign('./#journey');
 const mapsUrl=name=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name+' 台中');
 return <div className={'route-page route-day-'+(index+1)}>
  <header className="route-nav"><button className="brand" onClick={back}><span>翻閱1938</span><i>待續</i></button><button className="route-back" onClick={back}><ArrowLeft size={18}/> 回到兩日章節</button></header>
  <main>
   <section className="route-hero"><div><p className="eyebrow">{chapter.date} · WALKING ROUTE</p><h1>{index===0?'第一日':'第二日'}路線</h1><p>沿著章節順序走進臺中舊城，共有 <b>{chapter.points.length}</b> 個可走地點。</p></div><div className="route-day-mark"><small>CHAPTER</small><b>0{index+1}</b><span>1938</span></div></section>
   <section className="route-page-list" aria-label={(index===0?'第一日':'第二日')+'可走地點'}>{chapter.points.map((name,i)=><article className="route-stop" key={name}><div className="route-sequence"><span>{String(i+1).padStart(2,'0')}</span><i></i></div><div className="route-stop-copy"><p>第 {i+1} 站</p><h2>{name}</h2><a href={mapsUrl(name)} target="_blank" rel="noreferrer">在地圖中尋找 <ExternalLink size={15}/></a></div></article>)}</section>
   <section className="route-finish"><p className="eyebrow">END OF ROUTE · CONTINUE THE STORY</p><h2>走完路線，回到謎題解鎖手稿。</h2><button onClick={()=>window.location.assign('./#puzzles')}>前往謎題手稿 <ArrowUpRight size={18}/></button></section>
  </main>
 </div>
}

function App(){
 const day=Number(new URLSearchParams(window.location.search).get('day'));
 const [menu,setMenu]=useState(false); const [active,setActive]=useState(0);
 const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false)};
 if(day===1||day===2) return <RoutePage chapter={chapters[day-1]} index={day-1}/>;
 return <>
  <header><button className="brand" onClick={()=>go('top')}><span>翻閱1938</span><i>待續</i></button>
   <nav className={menu?'open':''}><button onClick={()=>go('journey')}>兩日章節</button><button onClick={()=>go('puzzles')}>謎題手稿</button><button onClick={()=>go('about')}>關於活動</button><button className="seal" onClick={()=>go('journey')}>開始翻閱</button></nav>
   <button className="menu" aria-label="選單" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
  </header>
  <main id="top">
   <section className="hero"><div className="hero-copy"><p className="eyebrow">SUZURAN · OLD TOWN · 1938</p><h1>翻閱1938<br/><em>那些待續的章節</em></h1><p className="lead">有些歷史寫進書裡，有些故事留在人身上。<br/>用兩日時間，走進舊城尚未完結的章節。</p><button className="read" onClick={()=>go('journey')}>開始翻閱 <ArrowDown size={18}/></button></div>
    <div className="hero-art"><div className="sun"></div><div className="building b1"></div><div className="building b2"></div><div className="building b3"></div><div className="wire"></div><div className="stamp">待續<br/><b>章節</b><small>1938</small></div><span className="coord">OLD TOWN ARCHIVE<br/>MANUSCRIPT No. 1938</span></div><p className="vertical">鈴蘭舊城沉浸式走讀活動</p></section>
   <section className="manifesto" id="about"><span>01</span><div><p>活動命題</p><h2>歷史不是完成式，<br/>而是一頁頁<span>等待翻閱</span>的手稿。</h2></div><p className="sidecopy">參與者在兩日活動中走入街區，與真人角色相遇、交換線索並完成謎題。手機是打開故事的鑰匙，真正的內容則發生在城市與人的相遇之間。</p></section>
   <section className="journal" id="journey"><div className="section-head"><div><p className="eyebrow">TWO-DAY JOURNEY</p><h2>兩日・兩個章節</h2></div><p>第一日進入故事，第二日回收記憶。<br/>點選任一章節，前往獨立頁面查看當日路線。</p></div><div className="cards two">{chapters.map((n,i)=><article key={n.title} role="button" tabIndex="0" className={n.tone+' chapter-card'} onMouseEnter={()=>setActive(i)} onClick={()=>window.location.assign('./?day='+(i+1))} onKeyDown={e=>e.key==='Enter'&&window.location.assign('./?day='+(i+1))}><div className="date"><b>{n.date}</b><small>{n.year}</small></div><div className="photo"><div className={'scene s'+i}></div><span>{n.tag}</span></div><div className="cardcopy"><h3>{n.title}</h3><p>{n.text}</p><div><span><MapPin size={14}/>{n.place}</span><button aria-label="前往當日路線頁面">開啟路線頁 <ArrowUpRight/></button></div></div></article>)}</div></section>
   <section className="puzzles" id="puzzles"><div className="puzzle-intro"><p className="eyebrow">UNLOCK THE MANUSCRIPTS</p><h2>解謎・翻閱本島人手稿</h2><p>答案藏在走讀現場。輸入正確暗號後，塵封的手稿殘頁將在此展開。</p></div><div className="puzzle-list">{puzzles.map((p,i)=><Puzzle key={p.label} item={p} index={i}/>)}</div></section>
   <section className="map" id="map"><div className="map-grid"><span className="road r1"></span><span className="road r2"></span><span className="road r3"></span>{chapters.map((n,i)=><button key={i} className={'pin p'+i+(active===i?' active':'')} onClick={()=>setActive(i)}><i>{i+1}</i><b>{n.title}</b></button>)}</div><div className="mapcopy"><p className="eyebrow">STORY COORDINATES</p><h2>章節座標</h2><p>沿著兩日路線，數位線索會把你帶到真實街角。請抬起頭，故事的下一句也許正由某個人親口說出。</p><div className="selected"><CalendarDays/><span>{chapters[active].date}<small>{chapters[active].place}</small></span></div></div></section>
  </main>
  <footer><div className="brand foot"><span>翻閱1938</span><i>待續</i></div><p>我們留下的不是結局，<br/>而是邀請下一個人繼續閱讀。</p><div><button onClick={()=>go('top')}>回到頁首 ↑</button><small>© 2026 那些待續的章節</small></div></footer>
 </>
}
createRoot(document.getElementById('root')).render(<App/>);
