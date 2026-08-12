(()=>{
  const SUPABASE_URL='https://unyntuezvovodpklishf.supabase.co';
  const KEY='sb_publishable_V-bPAyQBvzHTdRIPlDtbWQ_QYd3Jn1G';
  const ENDPOINT=SUPABASE_URL+'/rest/v1/walk_journals';
  const groups=['蘭臺','見山','迴聲'];
  const stations=[
    ['1','大正製酒株式會社'],
    ['2','敷島町市場（第三市場）'],
    ['3','新盛橋通、櫻橋通（中山綠橋）'],
    ['4','南園酒家'],
    ['5','臺中州立圖書館（合作金庫）'],
    ['6','臺中市役所'],
    ['7','大正橋通（民權綠橋）'],
    ['8','中央書局'],
    ['9','柳川古道'],
    ['10','新富町市場（第二市場）']
  ];
  const isTest=new URLSearchParams(location.search).get('test')==='1';
  const testKey='suzuran-test-walk-journals';

  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getIdentity=()=>({
    newsroom:localStorage.getItem('suzuran-newsroom')||'',
    studentName:localStorage.getItem('suzuran-investigator-name')||''
  });
  const ready=()=>{const x=getIdentity();return groups.includes(x.newsroom)&&Boolean(x.studentName.trim());};
  const headers={apikey:KEY,Accept:'application/json'};

  async function fetchRows(){
    const {newsroom,studentName}=getIdentity();
    if(isTest){
      const all=JSON.parse(localStorage.getItem(testKey)||'[]');
      return all.filter(r=>r.newsroom===newsroom&&r.student_name===studentName).sort((a,b)=>a.station_id-b.station_id);
    }
    const q=new URLSearchParams({
      select:'id,newsroom,student_name,station_id,station_name,content,created_at,updated_at',
      newsroom:'eq.'+newsroom,
      student_name:'eq.'+studentName,
      order:'station_id.asc'
    });
    const r=await fetch(ENDPOINT+'?'+q.toString(),{headers});
    if(!r.ok)throw new Error('讀取手記失敗');
    return r.json();
  }

  async function saveRow(stationId,content){
    const {newsroom,studentName}=getIdentity();
    const station=stations.find(([id])=>id===String(stationId));
    if(!station)throw new Error('站點資料無效');
    const body={newsroom,student_name:studentName,station_id:Number(stationId),station_name:station[1],content:content.trim(),updated_at:new Date().toISOString()};
    if(isTest){
      const all=JSON.parse(localStorage.getItem(testKey)||'[]');
      const idx=all.findIndex(r=>r.newsroom===newsroom&&r.student_name===studentName&&r.station_id===Number(stationId));
      if(idx>=0)all[idx]={...all[idx],...body};else all.push({...body,created_at:new Date().toISOString()});
      localStorage.setItem(testKey,JSON.stringify(all));
      return;
    }
    const q=new URLSearchParams({on_conflict:'newsroom,student_name,station_id'});
    const r=await fetch(ENDPOINT+'?'+q.toString(),{
      method:'POST',
      headers:{...headers,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},
      body:JSON.stringify(body)
    });
    if(!r.ok){const t=await r.text().catch(()=> '');throw new Error('儲存手記失敗'+(t?'：'+t:''));}
  }

  let overlay,launcher;
  const open=()=>{if(!ready())return;overlay.classList.add('is-open');document.documentElement.classList.add('reporter-journal-open');showEditor();};
  const close=()=>{overlay.classList.remove('is-open');document.documentElement.classList.remove('reporter-journal-open');};

  async function showEditor(){
    const {newsroom,studentName}=getIdentity();
    overlay.querySelector('[data-journal-title]').textContent='記者手記';
    overlay.querySelector('[data-journal-sub]').textContent=`${studentName}・${newsroom}調查小隊`;
    overlay.querySelector('[data-journal-body]').innerHTML=`
      <div class="journal-editor-grid">
        <label class="journal-field"><span>今天記錄哪一站？</span><select data-journal-station>${stations.map(([id,name])=>`<option value="${id}">${id.padStart(2,'0')}｜${esc(name)}</option>`).join('')}</select></label>
        <label class="journal-field journal-note-field"><span>今天在這裡，你最想記住什麼？</span><textarea data-journal-content maxlength="1200" placeholder="可以寫看到的細節、找到的線索、你的推測，或只是今天最想留下的一句話。"></textarea><small><b data-journal-count>0</b> / 1200</small></label>
      </div>
      <div class="journal-status" data-journal-status>每一站都可以回來修改；至少留下 3 篇，就能讓你的回憶特刊更完整。</div>
      <div class="journal-actions"><button type="button" class="journal-secondary" data-open-booklet>查看我的特刊</button><button type="button" class="journal-primary" data-save-journal>保存這篇手記</button></div>`;
    const select=overlay.querySelector('[data-journal-station]');
    const textarea=overlay.querySelector('[data-journal-content]');
    const count=overlay.querySelector('[data-journal-count]');
    let rows=[];
    try{rows=await fetchRows();}catch(e){overlay.querySelector('[data-journal-status]').textContent=e.message;}
    const loadCurrent=()=>{const row=rows.find(r=>String(r.station_id)===select.value);textarea.value=row?.content||'';count.textContent=textarea.value.length;};
    select.addEventListener('change',loadCurrent);
    textarea.addEventListener('input',()=>count.textContent=textarea.value.length);
    loadCurrent();
    overlay.querySelector('[data-open-booklet]').addEventListener('click',showBooklet);
    overlay.querySelector('[data-save-journal]').addEventListener('click',async e=>{
      const btn=e.currentTarget;const text=textarea.value.trim();const status=overlay.querySelector('[data-journal-status]');
      if(!text){status.textContent='先留下一句話再保存。';textarea.focus();return;}
      btn.disabled=true;btn.textContent='保存中…';
      try{await saveRow(select.value,text);rows=await fetchRows();status.textContent=`已保存｜目前留下 ${rows.length} / 10 站手記`;btn.textContent='已保存 ✓';setTimeout(()=>btn.textContent='保存這篇手記',1200);}catch(err){status.textContent=err.message;btn.textContent='重新保存';}finally{btn.disabled=false;}
    });
  }

  async function showBooklet(){
    const body=overlay.querySelector('[data-journal-body]');
    overlay.querySelector('[data-journal-title]').textContent='我的調查記者特刊';
    const {newsroom,studentName}=getIdentity();
    overlay.querySelector('[data-journal-sub]').textContent=`翻閱 1938・${studentName}・${newsroom}`;
    body.innerHTML='<div class="journal-loading">正在整理你的調查手記……</div>';
    try{
      const rows=await fetchRows();
      const choice=localStorage.getItem('suzuran-final-choice')||'';
      const ending=choice==='publish'?'同意刊登・真相刊出':choice==='protect'?'不同意刊登・保護名字':'尚未做出最終發刊決定';
      body.innerHTML=`
        <article class="memory-booklet" id="memory-booklet-print">
          <header class="memory-cover"><small>TAICHUNG OLD CITY INVESTIGATION / 1938</small><h2>翻閱 1938</h2><p>調查記者紀念特刊</p><div class="memory-id"><b>${esc(studentName)}</b><span>${esc(newsroom)}調查小隊</span></div></header>
          <section class="memory-summary"><div><b>${rows.length}</b><span>留下的走讀手記</span></div><div><b>10</b><span>舊城調查站點</span></div><div><b>${esc(ending)}</b><span>最終選擇</span></div></section>
          <section class="memory-notes"><h3>我的舊城調查手記</h3>${rows.length?rows.map(row=>`<article class="memory-note"><small>STATION ${String(row.station_id).padStart(2,'0')}</small><h4>${esc(row.station_name)}</h4><p>${esc(row.content).replace(/\n/g,'<br>')}</p></article>`).join(''):'<div class="memory-empty">還沒有留下手記。回到各站寫下一兩句，這裡就會慢慢長成你的回憶特刊。</div>'}</section>
          <footer class="memory-ending"><small>FINAL DECISION</small><strong>${esc(ending)}</strong><p>這份記錄保存的是你在舊城裡親自看見、推理與選擇過的痕跡。</p></footer>
        </article>
        <div class="journal-actions no-print"><button type="button" class="journal-secondary" data-back-editor>繼續寫手記</button><button type="button" class="journal-primary" data-print-booklet>列印／存成 PDF</button></div>`;
      body.querySelector('[data-back-editor]').addEventListener('click',showEditor);
      body.querySelector('[data-print-booklet]').addEventListener('click',()=>window.print());
    }catch(err){body.innerHTML=`<div class="journal-error">${esc(err.message)}</div><div class="journal-actions"><button class="journal-secondary" data-back-editor>返回手記</button></div>`;body.querySelector('[data-back-editor]').addEventListener('click',showEditor);}
  }

  function boot(){
    overlay=document.createElement('div');overlay.className='reporter-journal-overlay';overlay.innerHTML=`<section class="reporter-journal-card" role="dialog" aria-modal="true"><header><div><small>REPORTER'S NOTEBOOK / 走讀紀錄</small><h2 data-journal-title>記者手記</h2><p data-journal-sub></p></div><button type="button" class="journal-close" data-journal-close aria-label="關閉">×</button></header><div class="reporter-journal-body" data-journal-body></div></section>`;document.body.appendChild(overlay);
    launcher=document.createElement('button');launcher.type='button';launcher.className='reporter-journal-launcher';launcher.innerHTML='<span>✎</span> 記者手記';launcher.addEventListener('click',open);document.body.appendChild(launcher);
    overlay.querySelector('[data-journal-close]').addEventListener('click',close);overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
    const refresh=()=>launcher.hidden=!ready();refresh();addEventListener('storage',refresh);new MutationObserver(refresh).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();