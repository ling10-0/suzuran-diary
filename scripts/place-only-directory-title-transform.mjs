const placeOnlyTitles = `
[
  '大正製酒株式會社',
  '敷島町市場＋榮記餅店',
  '新盛橋通、櫻橋通（中山綠橋）＋進來涼',
  '精養軒',
  '臺中州立圖書館',
  '臺中市役所',
  '大正橋通',
  '中央書局',
  '柳川古道',
  '新富町市場＋鹿港阿甫師肉包',
  '臺中驛鐵道路廊'
].forEach((title,index)=>{
  if(mainlineCases[index]) mainlineCases[index].directoryTitle=title;
});
`;

export function placeOnlyDirectoryTitleTransform(){
  return {
    name:'suzuran-place-only-directory-title-transform',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/main.jsx')) return null;
      const anchor='const puzzles = mainlineCases;';
      if(!code.includes(anchor)||code.includes("'臺中驛鐵道路廊'\n].forEach((title,index)")) return null;
      const next=code.replace(anchor,placeOnlyTitles+'\n'+anchor);
      return {code:next,map:null};
    }
  };
}
