export function liuchuanPlayerCleanupTransform(){
  return {
    name:'suzuran-liuchuan-player-cleanup-transform',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/puzzleLayoutOverrides.js'))return null;
      let next=code;

      // Route cards and answer slots use the same two-column width.
      next=next.replace(
        ".liuchuan-card-pool{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.liuchuan-card-pool button{min-width:130px;padding:10px;border:1px solid var(--gazette-rule);background:rgba(255,255,255,.16);text-align:left;cursor:grab}.liuchuan-card-pool button b{display:inline-block;margin-right:7px;color:var(--gazette-red)}",
        ".liuchuan-card-pool{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0}.liuchuan-card-pool button{width:100%;min-width:0;box-sizing:border-box;padding:10px;border:1px solid var(--gazette-rule);background:rgba(255,255,255,.16);text-align:left;cursor:grab}.liuchuan-card-pool button b{display:inline-block;margin-right:7px;color:var(--gazette-red)}"
      );
      next=next.replace(
        ".liuchuan-route-slots{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0}",
        ".liuchuan-route-slots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0}"
      );

      // Q5 correct: remove the teal explanatory success box; keep only the next-step button.
      next=next.replace(
        "feedback.textContent='兩人都利用河岸階梯與步道轉折處，並透過繞行來避開直接暴露真正目的地。藍綠色記號仍只是另一項文件線索，不能直接證明青木本人曾畫下記號。';\n          feedback.dataset.ok='true';button.disabled=true;stage.appendChild(nextButton('判斷兩人的關係',6));",
        "feedback.textContent='';\n          feedback.removeAttribute('data-ok');button.disabled=true;stage.appendChild(nextButton('判斷兩人的關係',6));"
      );

      // Q6 correct: remove the teal success box and the editor-only completion/evidence page.
      next=next.replace(
        "feedback.textContent='判斷成立：女子可能長期與青木保持聯絡。';feedback.dataset.ok='true';button.disabled=true;",
        "feedback.textContent='';feedback.removeAttribute('data-ok');button.disabled=true;button.textContent='柳川查核完成';"
      );
      next=next.replace(/\n        const result=document\.createElement\('div'\);[\s\S]*?\n        stage\.appendChild\(result\);/,
        ''
      );

      return next===code?null:{code:next,map:null};
    }
  };
}
