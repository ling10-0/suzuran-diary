export function scheduleMobileFixTransform(){
  return {
    name:'suzuran-schedule-mobile-fix-transform',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/main.jsx')) return null;
      if(code.includes("import './schedule-mobile-fix.css';")) return null;
      const anchor="import './newspaper.css';";
      if(!code.includes(anchor)) return null;
      return {code:code.replace(anchor,anchor+"\nimport './schedule-mobile-fix.css';"),map:null};
    }
  };
}
