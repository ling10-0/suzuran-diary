import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowDown, ArrowUpRight, CalendarDays, MapPin, Menu, X} from 'lucide-react';
import './style.css';

const notes = [
  {date:'06 / 18',year:'2026',tag:'街屋觀察',title:'光從木窗的縫裡醒來',text:'清晨六點，市場鐵門還沒完全拉起。騎樓下的磨石子地，留著昨夜雨水的光。',place:'北門街・23°00′N',tone:'ochre'},
  {date:'06 / 12',year:'2026',tag:'人物採集',title:'修鐘的人，仍替城市守時',text:'林師傅說，老鐘慢一分鐘不是故障，是它也需要喘氣。牆上的擺鐘一起發出細小心跳。',place:'鐘錶巷・120°12′E',tone:'blue'},
  {date:'05 / 29',year:'2026',tag:'聲音地圖',title:'午後三點的廟埕',text:'風鈴、棋子、遠處的叫賣聲。聲音繞過紅磚牆，把陌生人也留在同一個午後。',place:'城隍廟前・編號 017',tone:'red'}
];

function App(){
 const [menu,setMenu]=useState(false); const [active,setActive]=useState(0);
 const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false)};
 return <>
  <header><button className="brand" onClick={()=>go('top')}><span>登陸</span><i>日記</i></button>
   <nav className={menu?'open':''}><button onClick={()=>go('journal')}>踏查日誌</button><button onClick={()=>go('map')}>記憶座標</button><button onClick={()=>go('about')}>關於計畫</button><button className="seal" onClick={()=>go('journal')}>開始閱讀</button></nav>
   <button className="menu" aria-label="選單" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
  </header>
  <main id="top">
   <section className="hero">
    <div className="hero-copy"><p className="eyebrow">OLD TOWN FIELD NOTES · 2026</p><h1>在離開以前，<br/><em>記住一座城。</em></h1><p className="lead">我們走進街巷，記下正在消失，也正在發生的事。<br/>這是一份關於舊城、日常與人的登陸日記。</p><button className="read" onClick={()=>go('journal')}>翻開日記 <ArrowDown size={18}/></button></div>
    <div className="hero-art"><div className="sun"></div><div className="building b1"></div><div className="building b2"></div><div className="building b3"></div><div className="wire"></div><div className="stamp">舊城<br/><b>採集</b><small>2026</small></div><span className="coord">23° 00′ 42″ N<br/>120° 12′ 33″ E</span></div>
    <p className="vertical">地方記憶採集計畫　第一輯</p>
   </section>

   <section className="manifesto" id="about"><span>01</span><div><p>我們相信</p><h2>一座城真正的樣子，<br/>藏在那些<span>不被標記</span>的地方。</h2></div><p className="sidecopy">從一扇窗、一碗湯，到一段沒有被寫進史書的記憶。我們用步行丈量舊城，以文字與影像，保存它此刻的呼吸。</p></section>

   <section className="journal" id="journal"><div className="section-head"><div><p className="eyebrow">RECENT ENTRIES</p><h2>最近登陸</h2></div><p>每一次走入，都是重新認識。<br/>點開一頁，跟我們一起回到現場。</p></div>
    <div className="cards">{notes.map((n,i)=><article key={n.title} className={n.tone} onMouseEnter={()=>setActive(i)}><div className="date"><b>{n.date}</b><small>{n.year}</small></div><div className="photo"><div className={'scene s'+i}></div><span>{n.tag}</span></div><div className="cardcopy"><h3>{n.title}</h3><p>{n.text}</p><div><span><MapPin size={14}/>{n.place}</span><button aria-label="閱讀文章"><ArrowUpRight/></button></div></div></article>)}</div>
   </section>

   <section className="map" id="map"><div className="map-grid"><span className="road r1"></span><span className="road r2"></span><span className="road r3"></span>{notes.map((n,i)=><button key={i} className={'pin p'+i+(active===i?' active':'')} onClick={()=>setActive(i)}><i>{i+1}</i><b>{n.title}</b></button>)}</div><div className="mapcopy"><p className="eyebrow">MEMORY COORDINATES</p><h2>記憶座標</h2><p>把散落在街區裡的故事，一個一個釘回地圖。這不是觀光路線，而是一張由氣味、聲音與相遇組成的城市肖像。</p><div className="selected"><CalendarDays/><span>{notes[active].date}<small>{notes[active].place}</small></span></div></div></section>
  </main>
  <footer><div className="brand foot"><span>登陸</span><i>日記</i></div><p>我們仍在路上，也仍在記錄。<br/>下一篇，或許就在你每天經過的轉角。</p><div><button onClick={()=>go('top')}>回到頁首 ↑</button><small>© 2026 OLD TOWN FIELD NOTES</small></div></footer>
 </>
}
createRoot(document.getElementById('root')).render(<App/>);
