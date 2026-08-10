const caseMeta = {
  3:{label:'新盛橋通、櫻橋通',code:'巡查第〇三號',task:'新盛橋通、櫻橋通',hint:'先完成橋上觀察；確認現場線索後，再比對茶攤帳本與橋邊紀錄。'},
  4:{label:'精養軒',code:'商工第〇四號',task:'精養軒',hint:'先確認建築後來的機構用途；完成後，再比對當晚留下的接待、廚房與值班紀錄。'},
  5:{label:'臺中州立圖書館',code:'典藏第〇五號',task:'臺中州立圖書館',hint:'第四站留下的四位數是館藏搜尋的入口。輸入正確後，請比較四筆年報的年份、登錄日期、館藏位置與狀態。'},
  6:{label:'臺中市役所',code:'警務第〇六號',task:'臺中市役所',hint:'兩份文件記錄的是同一批技術人員，但用詞、日期與追查範圍並不完全相同。請先看原始文書，再判斷哪一處變化最值得追查。'},
  7:{label:'大正橋通',code:'巡查第〇七號',task:'大正橋通',hint:'先查看兩份橋邊紀錄，核對巡查時間、路線與居民口述，再判斷「無異常」是否足以成立。'},
  8:{label:'中央書局',code:'文教第〇八號',task:'中央書局',hint:'依序閱讀匿名文章、退稿紀錄與最後殘頁，交叉比對三份資料後完成中央書局查核。'},
  9:{label:'柳川古道',code:'河岸第〇九號',task:'柳川古道',hint:'沿柳川舊地圖依序還原青木與「蘭」的移動路線，再比對巡查空檔與兩人的行動模式。'},
  10:{label:'新富町市場',code:'市場第〇十號',task:'新富町市場',hint:'從舊寄放帳冊找出青先生與阿蘭共同使用的置物箱，再整理箱內不同年代的物件，判斷兩人的關係。'}
};

const bookstoreImages = [
  {src:'/suzuran-diary/assets/puzzles/central-bookstore/anonymous-article.png',title:'資料一｜匿名文章'},
  {src:'/suzuran-diary/assets/puzzles/central-bookstore/rejection-record.png',title:'資料二｜退稿紀錄'},
  {src:'/suzuran-diary/assets/puzzles/central-bookstore/final-fragment.png',title:'資料三｜最後殘頁'}
];

function getCaseNumber(){
  const issue=document.querySelector('.gazette-case-head .gazette-issue b');
  const issueMatch=issue?.textContent.match(/(\d+)/);
  if(issueMatch)return Number(issueMatch[1]);
  const pager=document.querySelector('.case-pager span');
  const pagerMatch=pager?.textContent.match(/第\s*(\d+)/);
  return pagerMatch?Number(pagerMatch[1]):null;
}

function setText(node,text){
  if(node&&node.textContent.trim()!==text)node.textContent=text;
}

function updateDirectory(){
  document.querySelectorAll('.case-file').forEach(card=>{
    const no=Number(card.querySelector(':scope > span')?.textContent.trim());
    const meta=caseMeta[no];
    if(!meta)return;
    setText(card.querySelector('small'),meta.code);
    setText(card.querySelector('h3'),meta.label);
    setText(card.querySelector('p'),meta.hint);
  });
}

function updateCaseHeader(caseNumber){
  const meta=caseMeta[caseNumber];
  if(!meta)return;
  const header=document.querySelector('.gazette-case-head');
  if(header){
    setText(header.querySelector(':scope > div:nth-child(2) p'),meta.code+'・第 '+(caseNumber<=8?'1':'2')+' 日調查記錄');
    setText(header.querySelector(':scope > div:nth-child(2) h2'),meta.label);
  }
  const query=document.querySelector('.gazette-query');
  if(query){
    setText(query.querySelector(':scope > h3'),meta.task);
    setText(query.querySelector(':scope > p'),meta.hint);
  }
}

function makeBookstoreSheet(sheet){
  if(sheet.dataset.layoutOverride==='bookstore')return;
  sheet.dataset.layoutOverride='bookstore';
  sheet.innerHTML='';

  const small=document.createElement('small');
  small.textContent='案件查核資料';
  const title=document.createElement('h4');
  title.textContent='中央書局｜三份舊檔交叉查核';
  const intro=document.createElement('p');
  intro.textContent='請依序查看三份資料。先辨認匿名文章留下的文字線索，再對照退稿紀錄，最後用殘頁確認前後內容是否能互相接合。';
  const note=document.createElement('p');
  note.className='puzzle-inline-note';
  note.textContent='閱讀順序：匿名文章 → 退稿紀錄 → 最後殘頁。三張圖皆可直接在網站上查看，不需另外索取實體文件。';
  const grid=document.createElement('div');
  grid.className='central-bookstore-puzzle-grid';

  bookstoreImages.forEach((item,index)=>{
    const figure=document.createElement('figure');
    const caption=document.createElement('figcaption');
    caption.innerHTML='<span>'+String(index+1).padStart(2,'0')+'</span><b>'+item.title+'</b>';
    const img=document.createElement('img');
    img.src=item.src;
    img.alt=item.title;
    img.loading='lazy';
    figure.append(caption,img);
    grid.appendChild(figure);
  });

  sheet.append(small,title,intro,note,grid);
}

function makeLiuchuanSheet(sheet){
  if(sheet.dataset.layoutOverride==='liuchuan')return;
  sheet.dataset.layoutOverride='liuchuan';
  sheet.innerHTML='';

  const small=document.createElement('small');
  small.textContent='案件查核資料';
  const title=document.createElement('h4');
  title.textContent='柳川古道｜還原青木與「蘭」的移動路線';
  const storyTitle=document.createElement('h5');
  storyTitle.textContent='故事嵌入';
  const p1=document.createElement('p');
  p1.textContent='沿著柳川整理舊送貨紀錄時，工作人員發現幾張沒有寫完整姓名的收據。其中一張只留下「蘭」字，背面還有熟悉的藍綠色記號。';
  const p2=document.createElement('p');
  p2.textContent='附近居民回憶，早年曾有一名外地男子抱著紙筒沿河行走；幾年後，又有一名年輕女子固定沿著相似路線送藥、食物和信件。她不會直接走到目的地，常在橋邊折返或繞路。';
  const p3=document.createElement('p');
  p3.className='puzzle-inline-note';
  p3.textContent='請依橋梁、石階、送貨位置與巡查時間，還原兩人的行走路線，並判斷這名留下「蘭」字的女子，是否可能與青木長期保持聯絡。';
  const formTitle=document.createElement('h5');
  formTitle.textContent='關卡形式';
  const f1=document.createElement('p');
  f1.textContent='本關全程在網站上進行，不使用實體文件，也不要求玩家在現場尋找特定橋梁、石階或藏匿位置。';
  const f2=document.createElement('p');
  f2.textContent='掃描柳川關卡 QR Code 後，網站會顯示一張經過簡化的柳川舊地圖，地圖上標示四個虛構調查點：';
  const list=document.createElement('ul');
  ['A｜北側橋口','B｜河岸階梯','C｜步道轉折處','D｜南側送貨點'].forEach(text=>{
    const li=document.createElement('li');li.textContent=text;list.appendChild(li);
  });
  const f3=document.createElement('p');
  f3.textContent='這四個位置只存在於關卡地圖中，不對應玩家現場需要尋找的真實物件。';
  const f4=document.createElement('p');
  f4.textContent='玩家會依序解鎖居民證詞、舊送貨收據與警備隊巡查表，並將人物、時間與路線拖曳到地圖上，還原青木與年輕女子曾經使用的移動方式。';

  sheet.append(small,title,storyTitle,p1,p2,p3,formTitle,f1,f2,list,f3,f4);
}

function updateQuestionSheet(caseNumber){
  const sheet=document.querySelector('.case-question-sheet');
  if(!sheet)return;
  if(caseNumber===8)makeBookstoreSheet(sheet);
  if(caseNumber===9)makeLiuchuanSheet(sheet);
}

function installStyle(){
  if(document.getElementById('puzzle-layout-override-style'))return;
  const style=document.createElement('style');
  style.id='puzzle-layout-override-style';
  style.textContent=`
    .case-question-sheet h5{margin:24px 0 10px;padding-top:14px;border-top:1px solid var(--gazette-rule);font-size:15px;letter-spacing:.08em}
    .case-question-sheet ul{margin:10px 0 18px;padding-left:1.4em;font-size:13px;line-height:2}
    .puzzle-inline-note{padding:13px 15px;border-left:4px solid var(--gazette-red);background:rgba(143,37,29,.055)}
    .central-bookstore-puzzle-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:20px}
    .central-bookstore-puzzle-grid figure{margin:0;border:1px solid var(--gazette-rule);background:rgba(255,255,255,.12)}
    .central-bookstore-puzzle-grid figure:last-child{grid-column:1/-1;width:min(68%,640px);justify-self:center}
    .central-bookstore-puzzle-grid figcaption{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid var(--gazette-rule);font-size:12px}
    .central-bookstore-puzzle-grid figcaption span{font:10px 'DM Mono';color:var(--gazette-red)}
    .central-bookstore-puzzle-grid img{display:block;width:100%;height:auto;max-height:620px;object-fit:contain;background:rgba(255,255,255,.18)}
    @media(max-width:800px){
      .central-bookstore-puzzle-grid{grid-template-columns:1fr}
      .central-bookstore-puzzle-grid figure:last-child{grid-column:auto;width:100%}
      .central-bookstore-puzzle-grid img{max-height:none}
    }
  `;
  document.head.appendChild(style);
}

function applyOverrides(){
  installStyle();
  updateDirectory();
  const caseNumber=getCaseNumber();
  if(caseNumber){
    updateCaseHeader(caseNumber);
    updateQuestionSheet(caseNumber);
  }
}

const observer=new MutationObserver(()=>window.requestAnimationFrame(applyOverrides));
observer.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',()=>window.setTimeout(applyOverrides,0));
window.addEventListener('popstate',applyOverrides);
window.addEventListener('hashchange',applyOverrides);
applyOverrides();
