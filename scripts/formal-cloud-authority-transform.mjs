export function formalCloudAuthorityTransform(){
  return {
    name:'suzuran-formal-cloud-authority-transform',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/main.jsx')) return null;

      const before=`const refreshProgress=async()=>{\n  try{\n   const remote=await loadNewsroomProgress(newsroom,syncContext);\n   const local=localProgress();\n   const missing=local.filter(progressId=>!remote.includes(progressId));\n   if(missing.length)await Promise.all(missing.map(progressId=>saveNewsroomProgress(newsroom,progressId,syncContext)));\n   setSharedProgress(Array.from(new Set([...remote,...local])));\n   setProgressError('');`;

      const after=`const refreshProgress=async()=>{\n  try{\n   const remote=await loadNewsroomProgress(newsroom,syncContext);\n   const local=localProgress();\n   if(testMode){\n    const missing=local.filter(progressId=>!remote.includes(progressId));\n    if(missing.length)await Promise.all(missing.map(progressId=>saveNewsroomProgress(newsroom,progressId,syncContext)));\n    setSharedProgress(Array.from(new Set([...remote,...local])));\n   }else{\n    setSharedProgress(remote);\n   }\n   setProgressError('');`;

      if(!code.includes(before)){
        console.warn('[formal-cloud-authority] refreshProgress pattern not found');
        return null;
      }

      return {code:code.replace(before,after),map:null};
    }
  };
}
