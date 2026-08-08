const thirdPuzzleSetup = `
Object.assign(mainlineCases[2], {
  direct: false,
  pending: false,
  type: 'investigation',
  code: '巡查第〇三號',
  taskTitle: '新盛橋通、櫻橋通（中山綠橋）＋進來涼冬瓜茶',
  label: '新盛橋通、櫻橋通（中山綠橋）＋進來涼冬瓜茶',
  inputLabel: '請選擇橋上圖案的組成方式',
  hint: '先在新盛橋上找到象徵臺灣的圖案，再比對茶擔帳本與橋邊巡查紀錄。',
  question: '新盛橋上有一個象徵臺灣的圖案。請找出它，並回答這個圖案由幾個什麼形狀組成。',
  questionDetails: [
    '店家聽說玩家正在追查「青木仙」後，想起他曾固定在傍晚來買冬瓜茶。青木通常會帶著一只長紙筒，買完後從茶攤前往中山綠橋，再由橋東方向離開。',
    '某一天，青木走到橋邊後突然折返，轉入橋西側巷道。沒過多久，幾名陌生男子來到茶攤，詢問一名攜帶長紙筒的男子去了哪裡。',
    '事後，店家發現當晚其中一筆帳目曾被撕下後重新黏回，黏貼處下方仍隱約留有原本的時間與方向字跡。請比對茶擔帳本、橋邊巡查紀錄與店家營業紀錄。',
    '資料二｜中山綠橋巡查紀錄：下午五時五十五分，一名攜帶長紙筒的男子由茶擔方向來到中山綠橋；原先朝橋東方向行走，途中多次回頭察看；看見後方有兩名男子接近後，立即折返，進入橋西側巷道；男子離開時仍攜帶長紙筒，未見與他人接觸；下午六時五分，兩名陌生男子來到橋邊，向附近店家詢問該男子去向。',
    '資料三｜店家營業紀錄：茶擔每日午後六時收攤，收攤後不再記錄新的飲品帳目。'
  ],
  questionHint: '先觀察橋上的圖樣，不必從文字資料猜答案。',
  options: [
    {value: 'A', label: 'A. 1 個三角形'},
    {value: 'B', label: 'B. 2 個三角形'},
    {value: 'C', label: 'C. 2 個圓形'},
    {value: 'D', label: 'D. 3 個三角形'}
  ],
  hashes: ['179eea91584636de026b4ed8405300e00d0175e85f58f08697dbf2e4c4d5c9d6']
});`;

export function thirdPuzzleTransform() {
  return {
    name: 'suzuran-third-puzzle-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      const anchor = 'const puzzles = mainlineCases;';
      if (!code.includes(anchor)) return null;
      let next = code;
      next = next.replace(/\n?Object\.assign\(mainlineCases\[2\],[\s\S]*?\n\}\);\n?/g, '\n');
      next = next.replace(anchor, thirdPuzzleSetup + '\n\n' + anchor);
      return {code: next, map:null};
    }
  };
}
