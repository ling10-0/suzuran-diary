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
        `<span>所屬報社：{newsroom}<br/>解謎進度由同組共用</span>`,
        `<span>所屬組別：{newsroom}<br/>解謎進度由同組跨手機共用</span>`,
      );

      return next === code ? null : {code: next, map: null};
    },
  };
}
