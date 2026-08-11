const publishBlock = String.raw`   {choice==='publish'&&<section className="ending-experience ending-reveal ending-a-visual">
    <div className="ending-toolbar ending-toolbar-switch">
     <small>ENDING A / 同意刊登</small>
     <div className="ending-switcher" aria-label="切換結局">
      <button type="button" className="is-active" onClick={()=>choose('publish')}>結局 A</button>
      <button type="button" onClick={()=>choose('protect')}>結局 B</button>
      <button type="button" onClick={reset}>重新選擇</button>
     </div>
    </div>
    <div className="ending-artwork-page ending-artwork-page-a">
     <figure className="ending-artwork-frame">
      <img className="ending-artwork-image" src="./assets/ending/ending-a.png" alt="結局 A：真相刊出。號外頭版揭露七－圖庫案、報社取得升等資格，鈴蘭與青木遭帶回調查，最後寫著你們得到了頭版，也失去了他們的自由。"/>
     </figure>
     <div className="ending-artwork-actions">
      <button type="button" onClick={home}>返回市役所</button>
      <button type="button" onClick={()=>choose('protect')}>查看結局 B</button>
      <button type="button" className="secondary" onClick={reset}>回到結局選擇</button>
     </div>
    </div>
   </section>}`;

const protectBlock = String.raw`   {choice==='protect'&&<section className="ending-experience ending-reveal ending-b-visual">
    <div className="ending-toolbar ending-toolbar-switch">
     <small>ENDING B / 不同意刊登</small>
     <div className="ending-switcher" aria-label="切換結局">
      <button type="button" onClick={()=>choose('publish')}>結局 A</button>
      <button type="button" className="is-active" onClick={()=>choose('protect')}>結局 B</button>
      <button type="button" onClick={reset}>重新選擇</button>
     </div>
    </div>
    <div className="ending-artwork-page ending-artwork-page-b">
     <figure className="ending-artwork-frame">
      <img className="ending-artwork-image" src="./assets/ending/ending-b.png" alt="結局 B：未刊出的名字。蘭寄來平安電報，小報社在深夜繼續排版地方新聞，最後寫著我們選擇成為值得信任的小報社。"/>
     </figure>
     <div className="ending-artwork-actions">
      <button type="button" onClick={home}>返回市役所</button>
      <button type="button" onClick={()=>choose('publish')}>查看結局 A</button>
      <button type="button" className="secondary" onClick={reset}>回到結局選擇</button>
     </div>
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
