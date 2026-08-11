const publishBlock = String.raw`   {choice==='publish'&&<section className="ending-experience ending-reveal ending-a-visual">
    <div className="ending-toolbar"><small>ENDING A / 同意刊登</small><button type="button" onClick={reset}>重新選擇結局</button></div>
    <div className="ending-visual-sheet ending-a-sheet">
     <header className="ending-visual-title">
      <small>ENDING A / 同意刊登</small>
      <h1>真相刊出</h1>
      <p>完整報導正式發刊。</p>
     </header>

     <section className="ending-frontpage-card">
      <div className="ending-section-tab"><b>號外</b><span>EXTRA EDITION</span></div>
      <div className="ending-frontpage-copy">
       <small>號外頭版</small>
       <h2>《七－圖庫案曝光》</h2>
       <p>異常金流與地下工程真相公開</p>
      </div>
      <div className="ending-evidence-strip" aria-label="本案關鍵證據">
       <figure><img src="./assets/puzzles/1916/engineering-envelope.png" alt="工程圖封套"/><figcaption>工程圖封套</figcaption></figure>
       <figure><img src="./assets/puzzles/library/expense-copy-note.png" alt="經費抄本"/><figcaption>異常經費抄本</figcaption></figure>
       <figure><img src="./assets/puzzles/liuchuan/liuchuan-map.png" alt="沿河追查地圖"/><figcaption>人物追查路線</figcaption></figure>
      </div>
     </section>

     <section className="ending-promotion-card">
      <div className="ending-promotion-seal">升等<br/>認可</div>
      <div><small>報社升等證章</small><h3>發刊成功，取得報社升等資格</h3><p>最終等級依目前活動積分結算。</p></div>
     </section>

     <section className="ending-urgent-card">
      <div className="ending-urgent-stamp">至急</div>
      <div><small>市役所最新通告</small><h3>鈴蘭、青木已遭尋獲並帶回調查。</h3></div>
     </section>

     <blockquote className="ending-final-banner ending-final-publish">你們得到了<strong>頭版</strong>，<br/>也失去了他們的<strong>自由</strong>。</blockquote>
     <div className="ending-action"><button type="button" onClick={home}>返回市役所</button><button type="button" className="secondary" onClick={reset}>重新選擇</button></div>
    </div>
   </section>}`;

const protectBlock = String.raw`   {choice==='protect'&&<section className="ending-experience ending-reveal ending-b-visual">
    <div className="ending-toolbar"><small>ENDING B / 不同意刊登</small><button type="button" onClick={reset}>重新選擇結局</button></div>
    <div className="ending-visual-sheet ending-b-sheet">
     <header className="ending-visual-title">
      <small>ENDING B / 不同意刊登</small>
      <h1>未刊出的名字</h1>
      <p>真相留下了，名字沒有被交出去。</p>
     </header>

     <section className="ending-telegram-visual">
      <div className="ending-section-tab"><b>01</b><span>平安電報</span></div>
      <article className="ending-telegram-paper">
       <small>電報 / TELEGRAM</small><span className="telegram-seal">發報濟</span>
       <p>我和父親都平安。<br/>謝謝你們沒有刊出我們的名字。</p>
       <em>——蘭</em>
      </article>
     </section>

     <section className="ending-desk-visual">
      <div className="ending-section-tab"><b>02</b><span>今晚的編輯桌</span></div>
      <div className="ending-desk-photo"><img src="./assets/travel/bookstore.jpg" alt="夜晚仍持續工作的編輯桌氛圍"/></div>
      <div className="ending-desk-tags"><span>🍜 泡麵晚餐</span><span>♨ 暖爐故障中</span><span>▤ 下一期照常排版</span></div>
     </section>

     <section className="ending-nextissue-card">
      <div className="ending-section-tab"><b>03</b><span>地方新聞｜下一期稿件</span></div>
      <div className="ending-nextissue-paper">
       <div><small>地方新聞</small><h3>港口夜市整修完成</h3><p>攤商盼人潮回流</p></div>
       <img src="./assets/travel/second.jpg" alt="地方市場與日常生活"/>
      </div>
     </section>

     <blockquote className="ending-final-banner ending-final-protect">我們選擇成為<strong>值得信任的小報社</strong>。<small>留下應該留下的真相，保護應該被保護的名字。</small></blockquote>
     <div className="ending-action"><button type="button" onClick={home}>返回市役所</button><button type="button" className="secondary" onClick={reset}>重新選擇</button></div>
    </div>
   </section>}`;

export function endingVisualRedesignTransform(){
 return {
  name:'suzuran-ending-visual-redesign-transform',
  enforce:'pre',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   let next=code;
   if(!next.includes("import './ending-visual-redesign.css';")){
    next=next.replace("import './ending-consistency.css';","import './ending-consistency.css';\nimport './ending-visual-redesign.css';");
   }

   const publishStart=next.indexOf("   {choice==='publish'&&<section");
   const protectStart=next.indexOf("   {choice==='protect'&&<section");
   if(publishStart>=0&&protectStart>publishStart){
    next=next.slice(0,publishStart)+publishBlock+'\n\n'+next.slice(protectStart);
   }

   const newProtectStart=next.indexOf("   {choice==='protect'&&<section");
   const mainEnd=next.indexOf("\n  </main>",newProtectStart);
   if(newProtectStart>=0&&mainEnd>newProtectStart){
    next=next.slice(0,newProtectStart)+protectBlock+next.slice(mainEnd);
   }

   return next===code?null:{code:next,map:null};
  }
 };
}
