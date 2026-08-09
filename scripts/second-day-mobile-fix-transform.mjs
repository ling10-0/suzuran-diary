export function secondDayMobileFixTransform(){
  return {
    name:'suzuran-second-day-mobile-fix-transform',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/main.jsx'))return null;
      if(code.includes("import './second-day-mobile-fix.css';"))return null;
      const anchor="import './second-day.css';";
      if(!code.includes(anchor))return null;
      return {code:code.replace(anchor,anchor+"\nimport './second-day-mobile-fix.css';"),map:null};
    }
  };
}
