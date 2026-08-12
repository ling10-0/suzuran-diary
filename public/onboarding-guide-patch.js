(()=>{
  const groups=['蘭臺','見山','迴聲'];
  const registered=()=>localStorage.getItem('suzuran-name-system-version')==='2'&&Boolean(localStorage.getItem('suzuran-investigator-name'));
  const groupReady=()=>groups.includes(localStorage.getItem('suzuran-newsroom'));

  const patchedSlides=[
    {eyebrow:'STEP 01 / 你的身分',title:'你現在是一名見習記者',desc:'這不是單純的走讀，兩天裡，你們會跟著鈴蘭進入舊城、採集線索，替一樁被掩蓋的事件完成調查。',visual:'<div class="guide-role-badge">1938<br/>見習記者</div>'},
    {eyebrow:'STEP 02 / 每一站怎麼玩',title:'到站 → 找線索 → 解謎',desc:'抵達指定地點後，先閱讀網站上的資料，再觀察現地或照片。解出答案後輸入網站，答對才會開啟下一份資料。',visual:'<div class="guide-flow"><div class="guide-flow-item"><strong>① 到站</strong><span>跟著導覽移動<br/>確認目前站點</span></div><div class="guide-flow-item"><strong>② 查線索</strong><span>讀資料、看照片<br/>注意不合理之處</span></div><div class="guide-flow-item"><strong>③ 解謎</strong><span>小組討論答案<br/>輸入網站查核</span></div></div>'},
    {eyebrow:'STEP 03 / 為什麼要收手稿',title:'每一題，都是同一個故事的一塊碎片',desc:'答對後取得的手稿不是獎品，而是後面推理會用到的證據。看到人物、日期、地點或重複出現的字眼，記得把它們串起來。',visual:'<div class="guide-pages"><div class="guide-page"><b>人物</b><i></i><i></i><i></i></div><div class="guide-page"><b>日期</b><i></i><i></i><i></i></div><div class="guide-page"><b>地點</b><i></i><i></i><i></i></div></div>'},
    {eyebrow:'STEP 04 / 記者手記',title:'把你真正看見的東西留下來',desc:'畫面右下角的「記者手記」可以隨時開啟。每到一站，都能留下文字與照片；同一站之後也可以回來修改。這些內容會成為你自己的走讀紀錄。',visual:'<div class="guide-pages"><div class="guide-page"><b>文字</b><i></i><i></i><i></i></div><div class="guide-page"><b>照片</b><i></i><i></i><i></i></div><div class="guide-page"><b>我的紀錄</b><i></i><i></i><i></i></div></div>'},
    {eyebrow:'STEP 05 / 最後不是只有對錯',title:'你們最後要決定：這則新聞要不要刊？',desc:'當真相完整後，你們還要以報社的身分做一次選擇。公開真相，或保護事件中的人——你們的判斷會決定故事最後留下什麼。',visual:'<div class="guide-choice"><div class="guide-choice-card"><b>刊登</b><small>讓真相被看見<br/>也承擔公開的代價</small></div><div class="guide-choice-card"><b>不刊登</b><small>保護當事人<br/>也承擔沉默的重量</small></div></div>'}
  ];

  function boot(){
    const overlay=document.querySelector('.game-guide-overlay');
    if(!overlay||overlay.dataset.journalPatched==='1')return;
    overlay.dataset.journalPatched='1';
    const body=overlay.querySelector('.game-guide-body');
    const dots=overlay.querySelector('.game-guide-dots');
    const next=overlay.querySelector('[data-guide-next]');
    const prev=overlay.querySelector('[data-guide-prev]');
    if(!body||!dots||!next||!prev)return;

    body.innerHTML=patchedSlides.map((s,i)=>`<section class="game-guide-slide${i===0?' is-active':''}"><p class="game-guide-eyebrow">${s.eyebrow}</p><h2 class="game-guide-title">${s.title}</h2><p class="game-guide-desc">${s.desc}</p><div class="game-guide-visual">${s.visual}</div></section>`).join('');
    dots.innerHTML=patchedSlides.map((_,i)=>`<span class="game-guide-dot${i===0?' is-active':''}"></span>`).join('');

    let current=0;
    const render=()=>{
      overlay.querySelectorAll('.game-guide-slide').forEach((el,i)=>el.classList.toggle('is-active',i===current));
      overlay.querySelectorAll('.game-guide-dot').forEach((el,i)=>el.classList.toggle('is-active',i===current));
      prev.hidden=current===0;
      next.textContent=current===patchedSlides.length-1?'開始調查':'下一步';
    };
    const close=()=>{
      overlay.classList.remove('is-open');
      document.documentElement.style.overflow='';
      sessionStorage.setItem('suzuran-guide-seen','1');
    };

    overlay.addEventListener('click',event=>{
      const nextButton=event.target.closest('[data-guide-next]');
      const prevButton=event.target.closest('[data-guide-prev]');
      const closeButton=event.target.closest('[data-guide-close]');
      if(!nextButton&&!prevButton&&!closeButton)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if(closeButton){close();return;}
      if(prevButton){if(current>0){current--;render();}return;}
      if(current<patchedSlides.length-1){current++;render();}else close();
    },true);

    new MutationObserver(()=>{
      if(!overlay.classList.contains('is-open'))return;
      if(!registered()||!groupReady()){
        overlay.classList.remove('is-open');
        document.documentElement.style.overflow='';
        return;
      }
      current=0;
      render();
    }).observe(overlay,{attributes:true,attributeFilter:['class']});

    render();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});
  else setTimeout(boot,0);
})();
