export function readingGateTransform() {
  return {
    name: 'suzuran-reading-gate-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      let next = code;

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

      // 左欄只保留題目、證物與作答；內地人遊記移到右欄閱讀區。
      next = next.replace(/\n\s*<section className=\"gazette-travelogue\" aria-label=\"內地人遊記\">[\s\S]*?<\/section>\n\s*<\/section>\n\s*<section className=\"gazette-manuscript\">/, '\n   </section>\n    <section className="gazette-manuscript">');

      const manuscriptStart = '    <div className="manuscript-reader">';
      const manuscriptEnd = '      <div className="document-reader legacy-reader">';
      const startIndex = next.indexOf(manuscriptStart);
      const endIndex = next.indexOf(manuscriptEnd, startIndex);
      if (startIndex !== -1 && endIndex !== -1) {
        const replacement = `    <div className="manuscript-reader">
     <h3>{readingReady?'調查資料':'調查資料'}</h3>
     <div className="document-tabs reading-tabs" role="tablist" aria-label="調查資料選擇">
      <button role="tab" aria-selected={documentView==='travel'} className={documentView==='travel'?'active':''} onClick={()=>setDocumentView('travel')}>內地人遊記</button>
      <button role="tab" aria-selected={documentView==='mainland'} className={documentView==='mainland'?'active':''} disabled={!readingReady} onClick={()=>setDocumentView('mainland')}>{readingReady?'內地人手稿':'內地人手稿・封緘中'}</button>
      <button role="tab" aria-selected={documentView==='island'} className={documentView==='island'?'active':''} disabled={!readingReady} onClick={()=>setDocumentView('island')}>{readingReady?'本島人手稿':'本島人手稿・封緘中'}</button>
     </div>
     {documentView==='travel'
      ?<div className="document-copy travel" role="tabpanel">
        <small>{document.title}</small>
        <h4>內地人遊記</h4>
        {(document.travel||[]).map((paragraph,paragraphIndex)=><p key={paragraphIndex}>{paragraph}</p>)}
        {document.travelImage&&<img className="travel-document-image" src={document.travelImage} alt={document.title} onError={event=>{event.currentTarget.style.display='none'}}/>}
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

      // 舊 reader 完全不顯示，避免重複內容。
      next = next.replace(
        '      <div className="document-reader legacy-reader">',
        '      <div className="document-reader legacy-reader" hidden>',
      );

      return next === code ? null : {code: next, map: null};
    },
  };
}
