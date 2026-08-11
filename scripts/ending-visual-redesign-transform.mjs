const publishBlock = String.raw`   {choice==='publish'&&<section className="ending-experience ending-reveal ending-artwork-result ending-artwork-result-a">
    <div className="ending-result-shell">
     <div className="ending-result-kicker"><span>FINAL RESULT</span><b>ENDING A · 同意刊登</b></div>
     <figure className="ending-result-poster">
      <img src="./assets/ending/ending-a.png" alt="結局 A：真相刊出。號外頭版揭露七－圖庫案，報社取得升等資格，而鈴蘭與青木遭帶回調查。"/>
     </figure>
     <footer className="ending-result-footer">
      <span>最終選擇已確定</span>
      <button type="button" onClick={home}>返回市役所</button>
     </footer>
    </div>
   </section>}`;

const protectBlock = String.raw`   {choice==='protect'&&<section className="ending-experience ending-reveal ending-artwork-result ending-artwork-result-b">
    <div className="ending-result-shell">
     <div className="ending-result-kicker"><span>FINAL RESULT</span><b>ENDING B · 不同意刊登</b></div>
     <figure className="ending-result-poster">
      <img src="./assets/ending/ending-b.png" alt="結局 B：未刊出的名字。蘭寄來平安電報，小報社繼續記錄地方生活。"/>
     </figure>
     <footer className="ending-result-footer">
      <span>最終選擇已確定</span>
      <button type="button" onClick={home}>返回市役所</button>
     </footer>
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

   // 最終選擇一旦寫入 localStorage 就鎖定，不能再從結局頁改選。
   next=next.replace(
    " const choose=next=>{\n  window.localStorage.setItem('suzuran-final-choice',next);",
    " const choose=next=>{\n  if(window.localStorage.getItem('suzuran-final-choice'))return;\n  window.localStorage.setItem('suzuran-final-choice',next);"
   );

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
