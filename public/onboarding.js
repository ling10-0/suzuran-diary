(()=>{
  const slides=[
    {eyebrow:'STEP 01 / 你的身分',title:'你現在是一名見習記者',desc:'這不是單純的走讀，兩天裡，你們會跟著鈴蘭進入舊城、採集線索，替一樁被掩蓋的事件完成調查。',visual:`<div class="guide-role-badge">1938<br/>見習記者</div>`},
    {eyebrow:'STEP 02 / 每一站怎麼玩',title:'到站 → 找線索 → 解謎',desc:'抵達指定地點後，先閱讀網站上的資料，再觀察現地或照片。解出答案後輸入網站，答對才會開啟下一份資料。',visual:`<div class="guide-flow"><div class="guide-flow-item"><strong>① 到站</strong><span>跟著導覽移動<br/>確認目前站點</span></div><div class="guide-flow-item"><strong>② 查線索</strong><span>讀資料、看照片<br/>注意不合理之處</span></div><div class="guide-flow-item"><strong>③ 解謎</strong><span>小組討論答案<br/>輸入網站查核</span></div></div>`},
    {eyebrow:'STEP 03 / 為什麼要收手稿',title:'每一題，都是同一個故事的一塊碎片',desc:'答對後取得的手稿不是獎品，而是後面推理會用到的證據。看到人物、日期、地點或重複出現的字眼，記得把它們串起來。',visual:`<div class="guide-pages"><div class="guide-page"><b>人物</b><i></i><i></i><i></i></div><div class="guide-page"><b>日期</b><i></i><i></i><i></i></div><div class="guide-page"><b>地點</b><i></i><i></i><i></i></div></div>`},
    {eyebrow:'STEP 04 / 最後不是只有對錯',title:'你們最後要決定：這則新聞要不要刊？',desc:'當真相完整後，你們還要以報社的身分做一次選擇。公開真相，或保護事件中的人——你們的判斷會決定故事最後留下什麼。',visual:`<div class="guide-choice"><div class="guide-choice-card"><b>刊登</b><small>讓真相被看見<br/>也承擔公開的代價</small></div><div class="guide-choice-card"><b>不刊登</b><small>保護當事人<br/>也承擔沉默的重量</small></div></div>`}
  ];

  const storyLines=[
    {speaker:'市役所官員',side:'official',text:'你們就是今天前來報到的見習記者吧？'},
    {speaker:'市役所官員',side:'official',text:'最近，市役所收到了一項新的機密任務，現在，我要把它交給你們。'},
    {speaker:'市役所官員',side:'official',text:'三十年前，一支工程團隊竊走了帝國重要的工程圖，之後便集體失蹤，至今下落不明。'},
    {speaker:'市役所官員',side:'official',text:'從現在開始，你們要前往舊城各站展開調查，文件、帳本、照片，甚至現場不起眼的細節，都可能成為線索。'},
    {speaker:'市役所官員',side:'official',text:'這項任務屬於機密調查，切記低調行動，連帶領你們走訪舊城的導遊，也不能透露任務內容。'},
    {speaker:'見習記者',side:'reporter',text:'那……我們完成任務，有什麼好處嗎？'},
    {speaker:'市役所官員',side:'official',text:'當然少不了你們的，你們在調查中的表現，將決定最後能晉升到哪一級報社。'},
    {speaker:'見習記者',side:'reporter',text:'知道了，我們會好好表現。'},
    {speaker:'市役所官員',side:'official',text:'還有一件事，查到最後，真相要不要刊出去，也會由你們自己決定。'},
    {speaker:'見習記者',side:'reporter',text:'明白，那就從第一站開始吧。'}
  ];

  let current=0;
  let overlay;
  let storyOverlay;
  let storyIndex=0;
  let typingTimer=null;
  let typing=false;

  const render=()=>{
    overlay.querySelectorAll('.game-guide-slide').forEach((el,i)=>el.classList.toggle('is-active',i===current));
    overlay.querySelectorAll('.game-guide-dot').forEach((el,i)=>el.classList.toggle('is-active',i===current));
    const prev=overlay.querySelector('[data-guide-prev]');
    const next=overlay.querySelector('[data-guide-next]');
    prev.hidden=current===0;
    next.textContent=current===slides.length-1?'開始調查':'下一步';
  };

  const closeGuide=()=>{
    overlay.classList.remove('is-open');
    document.documentElement.style.overflow='';
    sessionStorage.setItem('suzuran-guide-seen','1');
  };

  const openGuide=()=>{
    current=0;
    render();
    overlay.classList.add('is-open');
    document.documentElement.style.overflow='hidden';
  };

  const finishStory=()=>{
    clearInterval(typingTimer);
    typing=false;
    storyOverlay.classList.remove('is-open');
    sessionStorage.setItem('suzuran-story-seen','1');
    setTimeout(openGuide,260);
  };

  const completeTyping=()=>{
    clearInterval(typingTimer);
    const line=storyLines[storyIndex];
    storyOverlay.querySelector('[data-story-text]').textContent=line.text;
    typing=false;
  };

  const renderStoryLine=()=>{
    const line=storyLines[storyIndex];
    const name=storyOverlay.querySelector('[data-story-name]');
    const text=storyOverlay.querySelector('[data-story-text]');
    const scene=storyOverlay.querySelector('.story-scene');
    const progress=storyOverlay.querySelector('[data-story-progress]');
    const next=storyOverlay.querySelector('[data-story-next]');
    clearInterval(typingTimer);
    name.textContent=line.speaker;
    text.textContent='';
    scene.dataset.speaker=line.side;
    progress.textContent=String(storyIndex+1).padStart(2,'0')+' / '+String(storyLines.length).padStart(2,'0');
    next.textContent=storyIndex===storyLines.length-1?'進入遊戲說明':'下一句';
    typing=true;
    let i=0;
    typingTimer=setInterval(()=>{
      text.textContent+=line.text[i]||'';
      i+=1;
      if(i>=line.text.length){clearInterval(typingTimer);typing=false;}
    },32);
  };

  const openStory=()=>{
    storyIndex=0;
    storyOverlay.classList.add('is-open');
    document.documentElement.style.overflow='hidden';
    renderStoryLine();
  };

  const boot=()=>{
    const slideHtml=slides.map((s,i)=>`<section class="game-guide-slide${i===0?' is-active':''}"><p class="game-guide-eyebrow">${s.eyebrow}</p><h2 class="game-guide-title">${s.title}</h2><p class="game-guide-desc">${s.desc}</p><div class="game-guide-visual">${s.visual}</div></section>`).join('');

    overlay=document.createElement('div');
    overlay.className='game-guide-overlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label','遊戲說明');
    overlay.innerHTML=`<div class="game-guide-card"><div class="game-guide-top"><span class="game-guide-kicker">翻閱 1938・遊戲說明</span><button class="game-guide-skip" type="button" data-guide-close>略過</button></div><div class="game-guide-body">${slideHtml}</div><div class="game-guide-footer"><div class="game-guide-dots">${slides.map((_,i)=>`<span class="game-guide-dot${i===0?' is-active':''}"></span>`).join('')}</div><div class="game-guide-actions"><button class="game-guide-btn secondary" type="button" data-guide-prev hidden>上一步</button><button class="game-guide-btn" type="button" data-guide-next>下一步</button></div></div></div>`;
    document.body.appendChild(overlay);

    storyOverlay=document.createElement('div');
    storyOverlay.className='story-intro-overlay';
    storyOverlay.setAttribute('role','dialog');
    storyOverlay.setAttribute('aria-modal','true');
    storyOverlay.setAttribute('aria-label','開場劇情');
    storyOverlay.innerHTML=`
      <div class="story-shell">
        <div class="story-scene" data-speaker="official">
          <div class="story-scene-bg" aria-hidden="true"></div>
          <div class="story-scene-shade" aria-hidden="true"></div>
          <div class="story-character-marker official" aria-hidden="true"><span>市役所官員</span></div>
          <div class="story-character-marker reporter" aria-hidden="true"><span>見習記者</span></div>
          <div class="story-era">1938・臺中市役所</div>
          <div class="story-dialogue">
            <div class="story-dialogue-meta"><strong data-story-name>市役所官員</strong><span data-story-progress>01 / 10</span></div>
            <p data-story-text></p>
            <div class="story-dialogue-actions">
              <button type="button" class="story-skip" data-story-skip>略過劇情</button>
              <button type="button" class="story-next" data-story-next>下一句</button>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(storyOverlay);

    window.addEventListener('suzuran:open-guide',openGuide);

    overlay.querySelector('[data-guide-close]').addEventListener('click',closeGuide);
    overlay.querySelector('[data-guide-prev]').addEventListener('click',()=>{if(current>0){current--;render();}});
    overlay.querySelector('[data-guide-next]').addEventListener('click',()=>{if(current<slides.length-1){current++;render();}else closeGuide();});
    overlay.addEventListener('click',e=>{if(e.target===overlay)closeGuide();});

    storyOverlay.querySelector('[data-story-skip]').addEventListener('click',finishStory);
    storyOverlay.querySelector('[data-story-next]').addEventListener('click',()=>{
      if(typing){completeTyping();return;}
      if(storyIndex<storyLines.length-1){storyIndex+=1;renderStoryLine();}
      else finishStory();
    });

    document.addEventListener('keydown',e=>{
      if(storyOverlay.classList.contains('is-open')){
        if(e.key==='Escape'){finishStory();return;}
        if(e.key==='Enter'||e.key==='ArrowRight')storyOverlay.querySelector('[data-story-next]').click();
        return;
      }
      if(!overlay.classList.contains('is-open'))return;
      if(e.key==='Escape')closeGuide();
      if(e.key==='ArrowRight'&&current<slides.length-1){current++;render();}
      if(e.key==='ArrowLeft'&&current>0){current--;render();}
    });

    const params=new URLSearchParams(location.search);
    const deepLink=['page','event','case','ending'].some(k=>params.has(k));
    const forceStory=params.get('story')==='1';
    const registered=localStorage.getItem('suzuran-name-system-version')==='2'&&Boolean(localStorage.getItem('suzuran-investigator-name'));
    const groupReady=['蘭臺','見山','迴聲'].includes(localStorage.getItem('suzuran-newsroom'));

    if(forceStory){setTimeout(openStory,250);return;}
    if(!deepLink&&registered&&groupReady&&!sessionStorage.getItem('suzuran-story-seen')){setTimeout(openStory,520);return;}
    if(!deepLink&&!sessionStorage.getItem('suzuran-guide-seen')&&!sessionStorage.getItem('suzuran-story-seen'))setTimeout(openGuide,520);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
