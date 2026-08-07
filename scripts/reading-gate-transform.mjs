export function readingGateTransform() {
  return {
    name: 'suzuran-reading-gate-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      let next = code;

      if (!next.includes("import './reading-gate.css';")) {
        next = next.replace("import './first-puzzle.css';", "import './first-puzzle.css';\nimport './reading-gate.css';");
      }

      next = next.replace(
        " const [documentView,setDocumentView]=useState('mainland');",
        " const [documentView,setDocumentView]=useState('travel');",
      );
      next = next.replace(
        " const islandManuscriptReady=item.direct||solved;",
        " const readingReady=solved;\n const islandManuscriptReady=readingReady;",
      );
      next = next.replace(
        " const activeManuscript=documentView==='mainland'?mainlandManuscript:(item.island||[]);",
        " const activeManuscript=documentView==='travel'?(item.travel||[]):documentView==='mainland'?mainlandManuscript:(item.island||[]);",
      );

      next = next.replace(/\n\s*<section className=\"gazette-travelogue\" aria-label=\"內地人遊記\">[\s\S]*?<\/section>\n\s*<\/section>\n\s*<section className=\"gazette-manuscript\">/, '\n   </section>\n    <section className="gazette-manuscript">');

      const manuscriptStart = '    <div className="manuscript-reader">';
      const manuscriptEnd = '      <div className="document-reader legacy-reader">';
      const startIndex = next.indexOf(manuscriptStart);
      const endIndex = next.indexOf(manuscriptEnd, startIndex);
      if (startIndex !== -1 && endIndex !== -1) {
        const replacement = `    <div className="manuscript-reader">
     <h3>調查資料</h3>
     <div className="document-tabs reading-tabs four-reading-tabs" role="tablist" aria-label="調查資料選擇">
      <button type="button" role="tab" aria-selected={documentView==='travel'} className={documentView==='travel'?'active':''} onClick={()=>setDocumentView('travel')}>內地人遊記</button>
      <button type="button" role="tab" aria-selected={documentView==='journal'} className={documentView==='journal'?'active':''} onClick={()=>setDocumentView('journal')}>我的走讀紀錄</button>
      <button type="button" role="tab" aria-selected={documentView==='mainland'} className={documentView==='mainland'?'active':''} disabled={!readingReady} onClick={()=>setDocumentView('mainland')}>{readingReady?'內地人手稿':'內地人手稿・封緘中'}</button>
      <button type="button" role="tab" aria-selected={documentView==='island'} className={documentView==='island'?'active':''} disabled={!readingReady} onClick={()=>setDocumentView('island')}>{readingReady?'本島人手稿':'本島人手稿・封緘中'}</button>
     </div>
     {documentView==='travel'
      ?<div className="document-copy travel" role="tabpanel">
        <small>{document.title}</small>
        <h4>內地人遊記</h4>
        {(document.travel||[]).map((paragraph,paragraphIndex)=><p key={paragraphIndex}>{paragraph}</p>)}
        {document.travelImage&&<img className="travel-document-image" src={document.travelImage} alt={document.title} onError={event=>{event.currentTarget.style.display='none'}}/>}
       </div>
      :documentView==='journal'
       ?<div className="embedded-field-record" role="tabpanel">
        <div className="field-record-heading"><div><small>FIELD NOTE / 私人附箋</small><h3>我的走讀紀錄</h3></div><span>本欄僅保存於目前裝置</span></div>
        <div className="field-record-grid">
         <div className="photo-entry">
          {record.photo?<img src={record.photo} alt={'第 '+(index+1)+' 號走讀記錄'}/>:<div><b>寫真貼付欄</b><span>可放入現場照片、街景或小組合照</span></div>}
          <label><input type="file" accept="image/*" onChange={addPhoto}/>{record.photo?'更換寫真':'選擇寫真'}</label>
          {record.photo&&<button type="button" onClick={()=>saveRecord({...record,photo:''})}>移除</button>}
          {photoError&&<small>{photoError}</small>}
         </div>
         <div className="reflection-entry">
          <label htmlFor={'reflection-tab-'+index}>調查後記</label>
          <textarea id={'reflection-tab-'+index} value={record.reflection} onChange={event=>saveRecord({...record,reflection:event.target.value,ending:''})} placeholder="今天哪個人、地方、聲音或味道讓你停下來？"/>
          <button type="button" onClick={createEnding}>編製我的結語 <ArrowUpRight size={16}/></button>
         </div>
        </div>
        {record.ending&&<div className="personal-ending"><small>個人調查結語・編製済</small><p>{record.ending}</p><i>閱</i></div>}
       </div>
      :readingReady
       ?<div className={'document-copy '+documentView} role="tabpanel">
        <small>{document.title}</small>
        <h4>{documentView==='mainland'?'內地人手稿':'本島人手稿'}</h4>
        {activeManuscript.map((paragraph,paragraphIndex)=><p key={paragraphIndex}>{paragraph}</p>)}
       </div>
       :<div className="gazette-sealed reading-sealed"><LockKeyhole/><strong>完成本關謎題後開放</strong><p>內地人手稿與本島人手稿將於查核完成後開封。</p></div>}
    </div>
`;
        next = next.slice(0, startIndex) + replacement + next.slice(endIndex);
      }

      next = next.replace(
        '      <div className="document-reader legacy-reader">',
        '      <div className="document-reader legacy-reader" hidden>',
      );

      next = next.replace(/\n\s*<section className=\"field-record\">[\s\S]*?<\/section>\n\s*<\/article>/, '\n </article>');

      return next === code ? null : {code: next, map: null};
    },
  };
}
