export function routeMobileFixTransform(){
  return {
    name:'suzuran-route-mobile-fix-transform',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/main.jsx')) return null;
      if(code.includes("import './route-mobile-fix.css';")) return null;
      const anchor="import './newspaper.css';";
      if(!code.includes(anchor)) return null;
      return {code:code.replace(anchor,anchor+"\nimport './route-mobile-fix.css';"),map:null};
    }
  };
}
