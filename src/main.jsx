import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowDown, ArrowUpRight, CalendarDays, MapPin, Menu, X, LockKeyhole, BookOpen} from 'lucide-react';
import './style.css';
import './puzzle.css';

const chapters = [
  {date:'DAY / 01',year:'1938',tag:'角色登錄',title:'城市把名字交給你',text:'從舊報紙與街角暗號開始，認識鈴蘭通り的人們。收集散落線索，找出第一段未完的記憶。',place:'鈴蘭通り・序章',tone:'ochre',points:[{time:'10 min',name:'鈴蘭通り入口',type:'報到・取得角色',detail:'領取第一張舊報，完成角色登錄。'},{time:'20 min',name:'中央市場',type:'人物線索',detail:'尋找攤商 NPC，以指定物件交換口述記憶。'},{time:'15 min',name:'時計店街角',type:'觀察任務',detail:'從招牌、鐘面與門牌拼出第一組暗號。'},{time:'10 min',name:'第一日手稿站',type:'章節解鎖',detail:'輸入暗號，翻閱本島人手稿第一張殘頁。'}]},
  {date:'DAY / 02',year:'1938',tag:'記憶回收',title:'替故事寫下待續',text:'真人角色與城市場景在終章交會。解開最後一道謎題，翻閱一份不曾被收進史書的本島人手稿。',place:'舊城街區・終章',tone:'blue',points:[{time:'15 min',name:'舊城驛站',type:'線索重組',detail:'把第一日取得的紙片排回正確年代。'},{time:'20 min',name:'廟埕口述站',type:'真人對話',detail:'與居民 NPC 對話，找出兩份記憶的共同人物。'},{time:'15 min',name:'鈴蘭記憶座標',type:'城市定向',detail:'依座標找到藏在街角的最後一句話。'},{time:'15 min',name:'終章手稿室',type:'最終解謎',detail:'輸入年份，翻閱手稿終頁並留下你的待續章節。'}]}
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

function App(){
 const [menu,setMenu]=useState(false); const [active,setActive]=useState(0); const [selectedDay,setSelectedDay]=useState(null);
 const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false)};
 return <>
  <header><button className="brand" onClick={()=>go('top')}><span>翻閱1938</span><i>待續</i></button>
   <nav className={menu?'open':''}><button onClick={()=>go('journey')}>兩日章節</button><button onClick={()=>go('puzzles')}>謎題手稿</button><button onClick={()=>go('about')}>關於活動</button><button className="seal" onClick={()=>go('journey')}>開始翻閱</button></nav>
   <button className="menu" aria-label="選單" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
  </header>
  <main id="top">
   <section className="hero"><div className="hero-copy"><p className="eyebrow">SUZURAN · OLD TOWN · 1938</p><h1>翻閱1938<br/><em>那些待續的章節</em></h1><p className="lead">有些歷史寫進書裡，有些故事留在人身上。<br/>用兩日時間，走進舊城尚未完結的章節。</p><button className="read" onClick={()=>go('journey')}>開始翻閱 <ArrowDown size={18}/></button></div>
    <div className="hero-art"><div className="sun"></div><div className="building b1"></div><div className="building b2"></div><div className="building b3"></div><div className="wire"></div><div className="stamp">待續<br/><b>章節</b><small>1938</small></div><span className="coord">OLD TOWN ARCHIVE<br/>MANUSCRIPT No. 1938</span></div><p className="vertical">鈴蘭舊城沉浸式走讀活動</p></section>
   <section className="manifesto" id="about"><span>01</span><div><p>活動命題</p><h2>歷史不是完成式，<br/>而是一頁頁<span>等待翻閱</span>的手稿。</h2></div><p className="sidecopy">參與者在兩日活動中走入街區，與真人角色相遇、交換線索並完成謎題。手機是打開故事的鑰匙，真正的內容則發生在城市與人的相遇之間。</p></section>
   <section className="journal" id="journey"><div className="section-head"><div><p className="eyebrow">TWO-DAY JOURNEY</p><h2>兩日・兩個章節</h2></div><p>第一日進入故事，第二日回收記憶。<br/>點選任一章節，查看當日可走的地點。</p></div><div className="cards two">{chapters.map((n,i)=><article key={n.title} role="button" tabIndex="0" className={n.tone+' chapter-card'} onMouseEnter={()=>setActive(i)} onClick={()=>setSelectedDay(i)} onKeyDown={e=>e.key==='Enter'&&setSelectedDay(i)}><div className="date"><b>{n.date}</b><small>{n.year}</small></div><div className="photo"><div className={'scene s'+i}></div><span>{n.tag}</span></div><div className="cardcopy"><h3>{n.title}</h3><p>{n.text}</p><div><span><MapPin size={14}/>{n.place}</span><button aria-label="查看當日路線">查看路線 <ArrowUpRight/></button></div></div></article>)}</div>{selectedDay!==null&&<div className="day-route"><div className="route-head"><div><p className="eyebrow">{chapters[selectedDay].date} · ROUTE</p><h3>{selectedDay===0?'第一日可走的地點':'第二日可走的地點'}</h3></div><button onClick={()=>setSelectedDay(null)}><X/> 關閉</button></div><div className="route-points">{chapters[selectedDay].points.map((p,i)=><article key={p.name}><i>{String(i+1).padStart(2,'0')}</i><div><span>{p.type} · {p.time}</span><h4>{p.name}</h4><p>{p.detail}</p></div></article>)}</div><button className="route-next" onClick={()=>go('puzzles')}>前往謎題手稿 <ArrowDown size={17}/></button></div>}</section>
   <section className="puzzles" id="puzzles"><div className="puzzle-intro"><p className="eyebrow">UNLOCK THE MANUSCRIPTS</p><h2>解謎・翻閱本島人手稿</h2><p>答案藏在走讀現場。輸入正確暗號後，塵封的手稿殘頁將在此展開。</p></div><div className="puzzle-list">{puzzles.map((p,i)=><Puzzle key={p.label} item={p} index={i}/>)}</div></section>
   <section className="map" id="map"><div className="map-grid"><span className="road r1"></span><span className="road r2"></span><span className="road r3"></span>{chapters.map((n,i)=><button key={i} className={'pin p'+i+(active===i?' active':'')} onClick={()=>setActive(i)}><i>{i+1}</i><b>{n.title}</b></button>)}</div><div className="mapcopy"><p className="eyebrow">STORY COORDINATES</p><h2>章節座標</h2><p>沿著兩日路線，數位線索會把你帶到真實街角。請抬起頭，故事的下一句也許正由某個人親口說出。</p><div className="selected"><CalendarDays/><span>{chapters[active].date}<small>{chapters[active].place}</small></span></div></div></section>
  </main>
  <footer><div className="brand foot"><span>翻閱1938</span><i>待續</i></div><p>我們留下的不是結局，<br/>而是邀請下一個人繼續閱讀。</p><div><button onClick={()=>go('top')}>回到頁首 ↑</button><small>© 2026 那些待續的章節</small></div></footer>
 </>
}
createRoot(document.getElementById('root')).render(<App/>);
