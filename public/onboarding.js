(()=>{
  const slides=[
    {eyebrow:'STEP 01 / 你的身分',title:'你現在是一名見習記者',desc:'這不是單純的走讀。兩天裡，你們會跟著鈴蘭進入舊城、採集線索，替一樁被掩蓋的事件完成調查。',visual:`<div class="guide-role-badge">1938<br/>見習記者<br/>PRESS</div>`},
    {eyebrow:'STEP 02 / 每一站怎麼玩',title:'到站 → 找線索 → 解謎',desc:'抵達指定地點後，先閱讀網站上的資料，再觀察現地或照片。解出答案後輸入網站，答對才會開啟下一份資料。',visual:`<div class="guide-flow"><div class="guide-flow-item"><strong>① 到站</strong><span>跟著導覽移動<br/>確認目前站點</span></div><div class="guide-flow-item"><strong>② 查線索</strong><span>讀資料、看照片<br/>注意不合理之處</span></div><div class="guide-flow-item"><strong>③ 解謎</strong><span>小組討論答案<br/>輸入網站查核</span></div></div>`},
    {eyebrow:'STEP 03 / 為什麼要收手稿',title:'每一題，都是同一個故事的一塊碎片',desc:'答對後取得的手稿不是獎品，而是後面推理會用到的證據。看到人物、日期、地點或重複出現的字眼，記得把它們串起來。',visual:`<div class="guide-pages"><div class="guide-page"><b>人物</b><i></i><i></i><i></i></div><div class="guide-page"><b>日期</b><i></i><i></i><i></i></div><div class="guide-page"><b>地點</b><i></i><i></i><i></i></div></div>`},
    {eyebrow:'STEP 04 / 最後不是只有對錯',title:'你們最後要決定：這則新聞要不要刊？',desc:'當真相完整後，你們還要以報社的身分做一次選擇。公開真相，或保護事件中的人——你們的判斷會決定故事最後留下什麼。',visual:`<div class="guide-choice"><div class="guide-choice-card"><b>刊登</b><small>讓真相被看見<br/>也承擔公開的代價</small></div><div class="guide-choice-card"><b>不刊登</b><small>保護當事人<br/>也承擔沉默的重量</small></div></div>`}
  ];
  let current=0;
  let overlay;
  const render=()=>{
    overlay.querySelectorAll('.game-guide-slide').forEach((el,i)=>el.classList.toggle('is-active',i===current));
    overlay.querySelectorAll('.game-guide-dot').forEach((el,i)=>el.classList.toggle('is-active',i===current));
    const prev=overlay.querySelector('[data-guide-prev]');
    const next=overlay.querySelector('[data-guide-next]');
    prev.hidden=current===0;
    next.textContent=current===slides.length-1?'開始調查':'下一步';
  };
  const close=()=>{overlay.classList.remove('is-open');document.documentElement.style.overflow='';sessionStorage.setItem('suzuran-guide-seen','1')};
  const open=()=>{current=0;render();overlay.classList.add('is-open');document.documentElement.style.overflow='hidden'};
  const boot=()=>{
    const slideHtml=slides.map((s,i)=>`<section class="game-guide-slide${i===0?' is-active':''}"><p class="game-guide-eyebrow">${s.eyebrow}</p><h2 class="game-guide-title">${s.title}</h2><p class="game-guide-desc">${s.desc}</p><div class="game-guide-visual">${s.visual}</div></section>`).join('');
    overlay=document.createElement('div');
    overlay.className='game-guide-overlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label','遊戲說明');
    overlay.innerHTML=`<div class="game-guide-card"><div class="game-guide-top"><span class="game-guide-kicker">翻閱 1938・遊戲說明</span><button class="game-guide-skip" type="button" data-guide-close>略過</button></div><div class="game-guide-body">${slideHtml}</div><div class="game-guide-footer"><div class="game-guide-dots">${slides.map((_,i)=>`<span class="game-guide-dot${i===0?' is-active':''}"></span>`).join('')}</div><div class="game-guide-actions"><button class="game-guide-btn secondary" type="button" data-guide-prev hidden>上一步</button><button class="game-guide-btn" type="button" data-guide-next>下一步</button></div></div></div>`;
    document.body.appendChild(overlay);
    const launcher=document.createElement('button');
    launcher.className='game-guide-launcher';
    launcher.type='button';
    launcher.textContent='？ 遊戲說明';
    launcher.addEventListener('click',open);
    document.body.appendChild(launcher);
    overlay.querySelector('[data-guide-close]').addEventListener('click',close);
    overlay.querySelector('[data-guide-prev]').addEventListener('click',()=>{if(current>0){current--;render()}});
    overlay.querySelector('[data-guide-next]').addEventListener('click',()=>{if(current<slides.length-1){current++;render()}else close()});
    overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
    document.addEventListener('keydown',e=>{if(!overlay.classList.contains('is-open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight'&&current<slides.length-1){current++;render()}if(e.key==='ArrowLeft'&&current>0){current--;render()}});
    const params=new URLSearchParams(location.search);
    const deepLink=['page','event','case','ending'].some(k=>params.has(k));
    if(!deepLink&&!sessionStorage.getItem('suzuran-guide-seen'))setTimeout(open,420);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();