export function syncTransform() {
  return {
    name: 'suzuran-sync-transform',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;

      const oldRefresh = ` const refreshProgress=async()=>{\n  try{setSharedProgress(await loadNewsroomProgress(newsroom));setProgressError('')}catch{setProgressError('共同進度暫時無法連線，已改以本機進度顯示。')}\n };`;

      const newRefresh = ` const refreshProgress=async()=>{\n  try{\n   const remote=await loadNewsroomProgress(newsroom);\n   const local=puzzles.map((_,index)=>window.localStorage.getItem('suzuran-main-v2-unlocked-'+index)==='1'?index:null).filter(Number.isInteger);\n   const missing=local.filter(progressId=>!remote.includes(progressId));\n   if(missing.length) await Promise.all(missing.map(progressId=>saveNewsroomProgress(newsroom,progressId)));\n   setSharedProgress(Array.from(new Set([...remote,...local])));\n   setProgressError('');\n  }catch{setProgressError('共同進度暫時無法連線，已改以本機進度顯示；網路恢復後會自動補同步。')}\n };`;

      let next = code.replace(oldRefresh, newRefresh);
      next = next.replace(" const mainProgressId=index=>1000+index;", " const mainProgressId=index=>index;");

      next = next.replace(
        " const [newsroom,setNewsroom]=useState(()=>window.localStorage.getItem('suzuran-newsroom')||'');",
        " const [newsroom,setNewsroom]=useState(()=>{const saved=window.localStorage.getItem('suzuran-newsroom')||'';return ['蘭臺','見山','迴聲'].includes(saved)?saved:''});",
      );

      next = next.replace(
        "  if(!next){setError('請填入領隊指定的報社名稱。');return}",
        "  if(!['蘭臺','見山','迴聲'].includes(next)){setError('請選擇蘭臺、見山或迴聲。');return}",
      );

      next = next.replace(
        '<h1>請報明所屬報社</h1>',
        '<h1>請選擇所屬組別</h1>',
      );
      next = next.replace(
        '<p>進入調查案件前，請填入同組共用的報社名稱。請全組使用完全相同的名稱，以便後續啟用共用紀錄。</p>',
        '<p>進入調查案件前，請選擇所屬組別。同組使用相同組別後，解謎進度會跨手機同步。</p>',
      );
      next = next.replace(
        '<label htmlFor="newsroom-name">報社／組別名稱</label>\n    <input id="newsroom-name" list="newsroom-list" value={newsroom} onChange={event=>{setNewsroom(event.target.value);setError(\'\')}} placeholder="請選擇或填入報社名稱" maxLength="30" autoFocus />\n    <datalist id="newsroom-list"><option value="臺中日日新報"/><option value="曉鐘通信社"/><option value="柳川新聞社"/><option value="鈴蘭報社"/></datalist>',
        '<label htmlFor="newsroom-name">組別名稱</label>\n    <select id="newsroom-name" value={newsroom} onChange={event=>{setNewsroom(event.target.value);setError(\'\')}} autoFocus><option value="">請選擇組別</option><option value="蘭臺">蘭臺</option><option value="見山">見山</option><option value="迴聲">迴聲</option></select>',
      );
      next = next.replace(
        '<footer>現階段的個人照片與文字仍僅保存於本機；跨手機共用紀錄將於資料庫啟用後開放。</footer>',
        '<footer>解謎進度會同步到同組裝置；個人照片與文字仍只保存在目前裝置。</footer>',
      );

      next = next.replace(
        `<span>所屬報社：{newsroom}<br/>解謎進度由同組共用</span>`,
        `<span>所屬組別：{newsroom}<br/>解謎進度由同組跨手機共用</span>`,
      );

      return next === code ? null : {code: next, map: null};
    },
  };
}
