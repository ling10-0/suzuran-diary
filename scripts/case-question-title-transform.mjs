const questionTitleSetup = `
[
  '消失在名冊上的人',
  '貨單裡對不上的名字',
  '茶攤遺留的線索',
  '接待簿上的青先生',
  '被錯放的年報',
  '紙上少掉的一筆',
  '橋邊留下的去向',
  '書頁之間的暗記',
  '沿河留下的足跡',
  '市場裡的最後拼圖'
].forEach((title,index)=>{
  if(mainlineCases[index]) mainlineCases[index].question=title;
});
`;

export function caseQuestionTitleTransform(){
  return {
    name:'suzuran-case-question-title-transform',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/main.jsx')) return null;
      const anchor='const puzzles = mainlineCases;';
      if(!code.includes(anchor)||code.includes("'茶攤遺留的線索'")) return null;
      const next=code.replace(anchor,questionTitleSetup+'\n'+anchor);
      return {code:next,map:null};
    }
  };
}
