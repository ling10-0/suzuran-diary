import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowDown, ArrowUpRight, CalendarDays, MapPin, Menu, X} from 'lucide-react';
import './style.css';

const notes = [
  {date:'DAY / 01',year:'1916',tag:'初次登陸',title:'尋找失落的名字',text:'從一張舊報與陌生人的招呼開始。玩家不是旁觀者，而是剛踏進鈴蘭世界、尚未被寫進故事的人。',place:'鈴蘭通り・任務 001',tone:'ochre'},
  {date:'DAY / 02',year:'1916',tag:'人物任務',title:'街角的人正在等你',text:'真人 NPC 帶著各自的生活與秘密出現。完成對話、交換物件，讓塵封的關係重新連上線。',place:'中央市場・人物線索',tone:'blue'},
  {date:'DAY / 03',year:'1916',tag:'記憶回收',title:'把我們的故事帶回來',text:'所有片段在最後一站匯合。你留下的選擇，將成為這座城市繼續被記得的一部分。',place:'鈴蘭園區・最終章',tone:'red'}
];

function App(){
 const [menu,setMenu]=useState(false); const [active,setActive]=useState(0);
 const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false)};
 return <>
  <header><button className="brand" onClick={()=>go('top')}><span>登陸</span><i>日記</i></button>
   <nav className={menu?'open':''}><button onClick={()=>go('journal')}>登陸任務</button><button onClick={()=>go('map')}>記憶座標</button><button onClick={()=>go('about')}>世界設定</button><button className="seal" onClick={()=>go('journal')}>進入 1916</button></nav>
   <button className="menu" aria-label="選單" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
  </header>
  <main id="top">
   <section className="hero">
    <div className="hero-copy"><p className="eyebrow">SUZURAN MEMORY SYSTEM · 1916</p><h1>登入一段，<br/><em>尚未完成的記憶。</em></h1><p className="lead">城市忘記的，人還記得。<br/>跟著鈴蘭的居民，走進 1916 年仍在發生的故事。</p><button className="read" onClick={()=>go('journal')}>開始登陸 <ArrowDown size={18}/></button></div>
    <div className="hero-art"><div className="sun"></div><div className="building b1"></div><div className="building b2"></div><div className="building b3"></div><div className="wire"></div><div className="stamp">舊城<br/><b>採集</b><small>2026</small></div><span className="coord">23° 00′ 42″ N<br/>120° 12′ 33″ E</span></div>
    <p className="vertical">鈴蘭園區沉浸式走讀計畫　第一章</p>
   </section>

   <section className="manifesto" id="about"><span>01</span><div><p>核心命題</p><h2>你不是來參觀過去，<br/>而是<span>被過去記住</span>。</h2></div><p className="sidecopy">以真人 NPC、城市場景與手機任務交織出一條可被參與的歷史。每一次選擇、對話與物件交換，都讓玩家從觀眾成為故事裡真正的人。</p></section>

   <section className="journal" id="journal"><div className="section-head"><div><p className="eyebrow">THREE-DAY JOURNEY</p><h2>三日登陸任務</h2></div><p>登入系統、遇見人物、回收記憶。<br/>每一日都會把你帶得更深。</p></div>
    <div className="cards">{notes.map((n,i)=><article key={n.title} className={n.tone} onMouseEnter={()=>setActive(i)}><div className="date"><b>{n.date}</b><small>{n.year}</small></div><div className="photo"><div className={'scene s'+i}></div><span>{n.tag}</span></div><div className="cardcopy"><h3>{n.title}</h3><p>{n.text}</p><div><span><MapPin size={14}/>{n.place}</span><button aria-label="閱讀文章"><ArrowUpRight/></button></div></div></article>)}</div>
   </section>

   <section className="map" id="map"><div className="map-grid"><span className="road r1"></span><span className="road r2"></span><span className="road r3"></span>{notes.map((n,i)=><button key={i} className={'pin p'+i+(active===i?' active':'')} onClick={()=>setActive(i)}><i>{i+1}</i><b>{n.title}</b></button>)}</div><div className="mapcopy"><p className="eyebrow">MEMORY COORDINATES</p><h2>鈴蘭記憶座標</h2><p>任務不是把玩家鎖在螢幕裡，而是引導你抬起頭、走進街道。真人 NPC 會在座標上出現，讓數位線索在真實城市裡獲得回應。</p><div className="selected"><CalendarDays/><span>{notes[active].date}<small>{notes[active].place}</small></span></div></div></section>
  </main>
  <footer><div className="brand foot"><span>登陸</span><i>日記</i></div><p>登入不是驗證身分，<br/>而是向這座城市留下「我來過」的證明。</p><div><button onClick={()=>go('top')}>回到頁首 ↑</button><small>© 2026 SUZURAN MEMORY PROJECT</small></div></footer>
 </>
}
createRoot(document.getElementById('root')).render(<App/>);
