export function liuchuanEvidenceImagesTransform(){
  return {
    name:'suzuran-liuchuan-evidence-images-transform',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/main.jsx')) return null;
      if(!code.includes('function LiuchuanFlow(')) return null;
      let next=code;

      if(!next.includes("import './liuchuan-evidence-images.css';")){
        next=next.replace("import './ninth-puzzle.css';","import './ninth-puzzle.css';\nimport './liuchuan-evidence-images.css';");
      }

      const oldMap=`<div className="liuchuan-map" aria-label="柳川簡化舊地圖">\n    <div className="river-line"></div>\n    {Object.entries(points).map(([code,name])=><article className={'map-point point-'+code.toLowerCase()} key={code}><b>{code}</b><span>{name}</span></article>)}\n   </div>`;
      const sourceMap=`<figure className="liuchuan-source-document liuchuan-primary-map"><figcaption>資料一｜柳川舊地圖 <span>點圖放大 ↗</span></figcaption><a href="./assets/puzzles/liuchuan/liuchuan-map.png" target="_blank" rel="noreferrer"><img src="./assets/puzzles/liuchuan/liuchuan-map.png" alt="柳川舊地圖，標示四個調查點與河岸路線。" loading="lazy"/></a></figure>`;
      if(next.includes(oldMap)&&!next.includes('liuchuan-primary-map')){
        next=next.replace(oldMap,sourceMap);
      }

      const testimonyAnchor='<blockquote>那名外地男子從北側橋口走來，手中抱著一支長紙筒。';
      if(next.includes(testimonyAnchor)&&!next.includes('resident-testimony.png')){
        next=next.replace(testimonyAnchor,`<figure className="liuchuan-source-document"><figcaption>資料二｜居民證詞 <span>點圖放大 ↗</span></figcaption><a href="./assets/puzzles/liuchuan/resident-testimony.png" target="_blank" rel="noreferrer"><img src="./assets/puzzles/liuchuan/resident-testimony.png" alt="柳川居民證詞，記錄攜帶長紙筒男子的移動路線。" loading="lazy"/></a></figure>\n   ${testimonyAnchor}`);
      }

      const deliveryAnchor='<div className="delivery-records">';
      if(next.includes(deliveryAnchor)&&!next.includes('delivery-receipt-1.png')){
        next=next.replace(deliveryAnchor,`<div className="liuchuan-source-grid" aria-label="柳川送貨收據原始資料">{[1,2,3,4].map(no=><figure className="liuchuan-source-document" key={no}><figcaption>資料三-{no}｜送貨收據 <span>點圖放大 ↗</span></figcaption><a href={'./assets/puzzles/liuchuan/delivery-receipt-'+no+'.png'} target="_blank" rel="noreferrer"><img src={'./assets/puzzles/liuchuan/delivery-receipt-'+no+'.png'} alt={'柳川送貨收據第'+no+'張'} loading="lazy"/></a></figure>)}</div>\n   ${deliveryAnchor}`);
      }

      const patrolAnchor='<div className="patrol-table">';
      if(next.includes(patrolAnchor)&&!next.includes('puzzles/liuchuan/patrol-record.png')){
        next=next.replace(patrolAnchor,`<figure className="liuchuan-source-document"><figcaption>資料四｜警備隊巡查表 <span>點圖放大 ↗</span></figcaption><a href="./assets/puzzles/liuchuan/patrol-record.png" target="_blank" rel="noreferrer"><img src="./assets/puzzles/liuchuan/patrol-record.png" alt="柳川警備隊巡查紀錄，標示各區段巡查時間。" loading="lazy"/></a></figure>\n   ${patrolAnchor}`);
      }

      return next===code?null:{code:next,map:null};
    }
  };
}
