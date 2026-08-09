export function suzuranMissingEventTransform() {
  return {
    name: 'suzuran-missing-event-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      let next = code;

      if (!next.includes("import './suzuran-missing.css';")) {
        next = next.replace("import './newspaper.css';", "import './newspaper.css';\nimport './suzuran-missing.css';");
      }

      if (!next.includes('function SuzuranMissingNotice(){')) {
        const component = `
function SuzuranMissingNotice(){
 const params=new URLSearchParams(window.location.search);
 const trigger=params.get('event')==='suzuran-missing';
 const storageKey='suzuran-event-missing';
 const acknowledgedKey='suzuran-event-missing-acknowledged';
 const [active,setActive]=useState(()=>trigger||window.localStorage.getItem(storageKey)==='1');
 const [open,setOpen]=useState(()=>trigger||window.localStorage.getItem(acknowledgedKey)!=='1');

 useEffect(()=>{
  if(trigger){
   window.localStorage.setItem(storageKey,'1');
   window.localStorage.removeItem(acknowledgedKey);
   setActive(true);
   setOpen(true);
  }
 },[trigger]);

 if(!active)return null;

 const acknowledge=()=>{
  window.localStorage.setItem(acknowledgedKey,'1');
  setOpen(false);
 };

 return <>
  <button className="suzuran-missing-banner" type="button" onClick={()=>setOpen(true)}>
   <span>臨時通報</span>
   <strong>案內係員・鈴蘭　所在不明</strong>
   <b>{open?'通報表示中':'調查継續中'}</b>
  </button>
  {open&&<div className="suzuran-missing-overlay" role="dialog" aria-modal="true" aria-labelledby="suzuran-missing-title">
   <article className="suzuran-missing-paper">
    <header>
     <small>臺中市役所　臨時通報</small>
     <span>臨時</span>
    </header>
    <p className="suzuran-missing-kicker">庶務課・緊急連絡</p>
    <h2 id="suzuran-missing-title">案內係員　鈴蘭　所在不明</h2>
    <div className="suzuran-missing-copy">
     <p>本日傍晚，案內係員鈴蘭於結束市街引導勤務後，未依原定時刻返回集合地點。</p>
     <p>隨身使用之行程簿仍未交回，目前亦無法確認其所在。</p>
     <p>最後一次有人看見她時，她正沿柳川方向離開，手中仍帶著今日採訪使用的資料袋。</p>
     <p>如各報社採訪員曾於今日行程中發現異常人物、未說明之文書或與鈴蘭有關的線索，請暫勿丟棄。</p>
    </div>
    <strong className="suzuran-missing-order">明日調查勤務照常進行。</strong>
    <footer>
     <div><span>文書係</span><time>昭和十三年八月十四日　午後</time></div>
     <i>急</i>
    </footer>
    <button type="button" className="suzuran-missing-confirm" onClick={acknowledge}>確認通報</button>
   </article>
  </div>}
 </>;
}

`;
        const anchor='function MunicipalHome(){';
        if (next.includes(anchor)) next=next.replace(anchor, component+anchor);
      }

      const homeAnchor='return <div className="municipal-site">';
      if (next.includes(homeAnchor) && !next.includes('return <div className="municipal-site"><SuzuranMissingNotice/>')) {
        next=next.replace(homeAnchor, 'return <div className="municipal-site"><SuzuranMissingNotice/>');
      }

      return next===code?null:{code:next,map:null};
    },
  };
}
