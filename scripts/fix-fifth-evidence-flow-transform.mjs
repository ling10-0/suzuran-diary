export function fixFifthEvidenceFlowTransform(){
  return {
    name:'suzuran-fix-fifth-evidence-flow-transform',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/main.jsx')) return null;
      const oldCondition="(!item.evidenceAfterCorrectChoice||(value.split('|||')[1]||'')===item.subQuestions?.[1]?.correctValue)";
      if(!code.includes(oldCondition)) return null;
      const next=code.split(oldCondition).join('(!item.evidenceAfterCorrectChoice||solved)');
      return {code:next,map:null};
    }
  };
}
