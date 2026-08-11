const publishBlock = String.raw`   {choice==='publish'&&<section className="ending-experience ending-poster-result ending-poster-result-a">
    <div className="ending-poster-shell">
     <div className="ending-poster-kicker"><span>ENDING A</span><b>同意刊登</b></div>
     <figure className="ending-poster-frame">
      <img className="ending-poster-image" src="./assets/ending/ending-a.png" alt="結局 A：真相刊出。"/>
     </figure>
     <div className="ending-poster-footer">
      <span>最終決定已記錄，無法重新選擇。</span>
      <button type="button" onClick={home}>返回市役所</button>
     </div>
    </div>
   </section>}`;

const protectBlock = String.raw`   {choice==='protect'&&<section className="ending-experience ending-poster-result ending-poster-result-b">
    <div className="ending-poster-shell">
     <div className="ending-poster-kicker"><span>ENDING B</span><b>不同意刊登</b></div>
     <figure className="ending-poster-frame">
      <img className="ending-poster-image" src="./assets/ending/ending-b.png" alt="結局 B：未刊出的名字。"/>
     </figure>
     <div className="ending-poster-footer">
      <span>最終決定已記錄，無法重新選擇。</span>
      <button type="button" onClick={home}>返回市役所</button>
     </div>
    </div>
   </section>}`;

export function endingVisualRedesignTransform(){
 return {
  name:'suzuran-ending-visual-redesign-transform',
  enforce:'post',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   let next=code;

   if(!next.includes("import './ending-visual-redesign.css';")){
    if(next.includes("import './ending-consistency.css';")){
     next=next.replace("import './ending-consistency.css';","import './ending-consistency.css';\nimport './ending-visual-redesign.css';");
    }else if(next.includes("import './second-day-ending.css';")){
     next=next.replace("import './second-day-ending.css';","import './second-day-ending.css';\nimport './ending-visual-redesign.css';");
    }
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

   // 最終選擇一旦寫入 localStorage 就不再提供重選入口。
   next=next.replace(
    " const choose=next=>{\n  window.localStorage.setItem('suzuran-final-choice',next);\n  setChoice(next);\n  setReveal(1);\n  window.scrollTo({top:0,behavior:'smooth'});\n };",
    " const choose=next=>{\n  const locked=window.localStorage.getItem('suzuran-final-choice');\n  if(locked)return;\n  window.localStorage.setItem('suzuran-final-choice',next);\n  setChoice(next);\n  setReveal(1);\n  window.scrollTo({top:0,behavior:'smooth'});\n };"
   );

   return next===code?null:{code:next,map:null};
  }
 };
}
