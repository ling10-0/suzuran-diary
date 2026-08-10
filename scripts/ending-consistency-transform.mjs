export function endingConsistencyTransform(){
 return {
  name:'suzuran-ending-consistency-transform',
  enforce:'pre',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   let next=code;
   if(!next.includes("import './ending-consistency.css';")&&next.includes("import './second-day-ending.css';")){
    next=next.replace("import './second-day-ending.css';","import './second-day-ending.css';\nimport './ending-consistency.css';");
   }
   next=next.replace('<div className="extra-masthead"><small>公正・真實・敢言</small><h2>中央報</h2><span>特別增刊・獨家報導</span></div>','<div className="extra-masthead"><small>公正・真實・敢言</small><h2>本社號外</h2><span>特別增刊・獨家報導</span></div>');
   next=next.replace('<h1 className="extra-headline">《七－圖庫案曝光！中央報社獨家揭密》</h1>','<h1 className="extra-headline">《七－圖庫案曝光！本社獨家揭密》</h1>');
   next=next.replace('<div className="promotion-levels"><b>地方小報</b><span>→</span><b>區域報社</b><span>→</span><b>中央報社</b></div>','<div className="promotion-score-note"><small>本次結局獎勵</small><b>發刊成功・取得報社升等資格</b><p>最終報社等級沿用活動原本的積分機制結算；本結局不另外改寫等級順序。</p></div>');
   next=next.replace('<p><span>報社等級</span><b>地方小報社</b></p><p><span>本月訂閱</span><b>沒有明顯增加</b></p>','<p><span>報社等級</span><b>維持原積分等級</b></p><p><span>本月訂閱</span><b>沒有明顯增加</b></p>');
   return next===code?null:{code:next,map:null};
  }
 };
}
