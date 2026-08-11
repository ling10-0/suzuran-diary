const publishBlock = String.raw`   {choice==='publish'&&<section className="ending-experience ending-poster-result ending-poster-result-a">
    <div className="ending-poster-shell">
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
  enforce:'pre',
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

   const publishRe=/\s*\{choice==='publish'&&<section[\s\S]*?(?=\n\s*\{choice==='protect'&&<section)/;
   const protectRe=/\s*\{choice==='protect'&&<section[\s\S]*?(?=\n\s*<\/main>)/;

   if(publishRe.test(next)) next=next.replace(publishRe,'\n'+publishBlock+'\n');
   if(protectRe.test(next)) next=next.replace(protectRe,'\n'+protectBlock+'\n');

   next=next.replace(
    / const choose=next=>\{[\s\S]*?window\.scrollTo\(\{top:0,behavior:'smooth'\}\);\n \};/,
    " const choose=next=>{\n  const locked=window.localStorage.getItem('suzuran-final-choice');\n  if(locked)return;\n  window.localStorage.setItem('suzuran-final-choice',next);\n  setChoice(next);\n  setReveal(1);\n  window.scrollTo({top:0,behavior:'smooth'});\n };"
   );

   if(next.includes('function EndingChoicePage(')){
    if(!next.includes('./assets/ending/ending-a.png')||!next.includes('./assets/ending/ending-b.png')){
     throw new Error('Ending artwork transform failed: ending-a.png / ending-b.png were not injected.');
    }
    if(next.includes('報社晉升證章')||next.includes('三個月後……')){
     throw new Error('Ending artwork transform failed: legacy ending markup is still present.');
    }
   }

   return next===code?null:{code:next,map:null};
  }
 };
}
