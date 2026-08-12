(()=>{
  const SUPABASE_URL='https://unyntuezvovodpklishf.supabase.co';
  const PHOTO_BUCKET='walk-journal-photos';
  const groups=['蘭臺','見山','迴聲'];
  const stations=[['1','大正製酒株式會社'],['2','敷島町市場（第三市場）'],['3','新盛橋通、櫻橋通（中山綠橋）'],['4','南園酒家'],['5','臺中州立圖書館（合作金庫）'],['6','臺中市役所'],['7','大正橋通（民權綠橋）'],['8','中央書局'],['9','柳川古道'],['10','新富町市場（第二市場）']];
  const isTest=new URLSearchParams(location.search).get('test')==='1';
  const testKey='suzuran-test-walk-journals';
  let KEY='';
  let ENDPOINT='';
  let overlay,launcher;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const identity=()=>({newsroom:localStorage.getItem('suzuran-newsroom')||'',studentName:localStorage.getItem('suzuran-investigator-name')||''});
  const ready=()=>{const x=identity();return groups.includes(x.newsroom)&&Boolean(x.studentName.trim());};
  async function getKey(){
    const src=await fetch('./reporter-journal.js',{cache:'no-store'}).then(r=>r.text());
    const m=src.match(/const KEY='([^']+)'/);
    if(!m)throw new Error('無法載入資料連線設定');
    KEY=m[1];ENDPOINT=SUPABASE_URL+'/rest/v1/walk_journals';
  }
  const headers=()=>({apikey:KEY,Accept:'application/json'});
  async function rows(){
    const {newsroom,studentName}=identity();
    if(isTest){const all=JSON.parse(localStorage.getItem(testKey)||'[]');return all.filter(r=>r.newsroom===newsroom&&r.student_name===studentName).sort((a,b)=>a.station_id-b.station_id);}
    const q=new URLSearchParams({select:'id,newsroom,student_name,station_id,station_name,content,photo_url,created_at,updated_at',newsroom:'eq.'+newsroom,student_name:'eq.'+studentName,order:'station_id.asc'});
    const r=await fetch(ENDPOINT+'?'+q,{headers:headers()});if(!r.ok)throw new Error('讀取手記失敗');return r.json();
  }
  const dataUrl=file=>new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(String(fr.result||''));fr.onerror=()=>reject(new Error('照片讀取失敗'));fr.readAsDataURL(file);});
  async function compress(file){
    if(file.size>8*1024*1024)throw new Error('照片太大，請選擇 8MB 以下圖片。');
    const raw=await dataUrl(file);
    return new Promise(resolve=>{const img=new Image();img.onload=()=>{const max=1600,s=Math.min(1,max/Math.max(img.naturalWidth||1,img.naturalHeight||1)),w=Math.max(1,Math.round(img.naturalWidth*s)),h=Math.max(1,Math.round(img.naturalHeight*s)),c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);c.toBlob(b=>resolve(b||file),'image/jpeg',.82);};img.onerror=()=>resolve(file);img.src=raw;});
  }
  async function uploadPhoto(stationId,file){
    const prepared=await compress(file);if(isTest)return dataUrl(prepared);
    const {newsroom,studentName}=identity(),safe=s=>encodeURIComponent(String(s).trim().replace(/\s+/g,'-')),path=[safe(newsroom),safe(studentName),'station-'+stationId+'.jpg'].join('/');
    const r=await fetch(SUPABASE_URL+'/storage/v1/object/'+PHOTO_BUCKET+'/'+path,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'image/jpeg','x-upsert':'true'},body:prepared});
    if(!r.ok)throw new Error('照片上傳失敗');
    return SUPABASE_URL+'/storage/v1/object/public/'+PHOTO_BUCKET+'/'+path+'?v='+Date.now();
  }
  async function save(stationId,content,photoUrl){
    const {newsroom,studentName}=identity(),station=stations.find(([id])=>id===String(stationId));if(!station)throw new Error('站點資料無效');
    const body={newsroom,student_name:studentName,station_id:Number(stationId),station_name:station[1],content:content.trim(),updated_at:new Date().toISOString()};if(photoUrl!==undefined)body.photo_url=photoUrl||null;
    if(isTest){const all=JSON.parse(localStorage.getItem(testKey)||'[]'),i=all.findIndex(r=>r.newsroom===newsroom&&r.student_name===studentName&&r.station_id===Number(stationId));if(i>=0)all[i]={...all[i],...body};else all.push({...body,created_at:new Date().toISOString()});try{localStorage.setItem(testKey,JSON.stringify(all));}catch{throw new Error('測試照片太大，請換一張較小照片。');}return;}
    const q=new URLSearchParams({on_conflict:'newsroom,student_name,station_id'}),r=await fetch(ENDPOINT+'?'+q,{method:'POST',headers:{...headers(),'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});if(!r.ok)throw new Error('儲存手記失敗');
  }
  const close=()=>{overlay.classList.remove('is-open');document.documentElement.classList.remove('reporter-journal-open');};
  const open=()=>{if(!ready())return;overlay.classList.add('is-open');document.documentElement.classList.add('reporter-journal-open');showEditor();};
  async function showEditor(){
    const {newsroom,studentName}=identity();overlay.querySelector('[data-journal-title]').textContent='記者手記';overlay.querySelector('[data-journal-sub]').textContent=`${studentName}・${newsroom}調查小隊`;
    const body=overlay.querySelector('[data-journal-body]');body.innerHTML=`<div class="journal-editor-grid"><label class="journal-field"><span>今天記錄哪一站？</span><select data-station>${stations.map(([id,n])=>`<option value="${id}">${id.padStart(2,'0')}｜${esc(n)}</option>`).join('')}</select></label><label class="journal-field journal-note-field"><span>今天在這裡，你最想記住什麼？</span><textarea data-content maxlength="1200" placeholder="可以寫看到的細節、找到的線索、你的推測，或只是今天最想留下的一句話。"></textarea><small><b data-count>0</b> / 1200</small></label><section class="journal-photo-field"><div class="journal-photo-head"><b>留下一張照片</b><small>選填・站點、街景或小組合照都可以</small></div><label class="journal-photo-picker"><input type="file" accept="image/*" capture="environment" data-photo><span>＋ 拍照／選擇照片</span></label><div class="journal-photo-preview" data-preview hidden><img alt="手記照片預覽"><button type="button" data-remove>移除照片</button></div></section></div><div class="journal-status" data-status>每一站都可以回來修改；至少留下 3 篇，就能讓你的回憶特刊更完整。</div><div class="journal-actions"><button class="journal-secondary" data-booklet>查看我的特刊</button><button class="journal-primary" data-save>保存這篇手記</button></div>`;
    const sel=body.querySelector('[data-station]'),ta=body.querySelector('[data-content]'),count=body.querySelector('[data-count]'),input=body.querySelector('[data-photo]'),preview=body.querySelector('[data-preview]'),img=preview.querySelector('img');let list=[],pending=null,remove=false;
    try{list=await rows();}catch(e){body.querySelector('[data-status]').textContent=e.message;}
    const setPreview=url=>{if(url){img.src=url;preview.hidden=false;}else{img.removeAttribute('src');preview.hidden=true;}};
    const load=()=>{const r=list.find(x=>String(x.station_id)===sel.value);ta.value=r?.content||'';count.textContent=ta.value.length;pending=null;remove=false;input.value='';setPreview(r?.photo_url||'');};
    sel.onchange=load;ta.oninput=()=>count.textContent=ta.value.length;input.onchange=()=>{pending=input.files?.[0]||null;remove=false;if(pending)setPreview(URL.createObjectURL(pending));};preview.querySelector('[data-remove]').onclick=()=>{pending=null;remove=true;input.value='';setPreview('');};load();body.querySelector('[data-booklet]').onclick=showBooklet;
    body.querySelector('[data-save]').onclick=async e=>{const btn=e.currentTarget,status=body.querySelector('[data-status]'),text=ta.value.trim(),existing=list.find(x=>String(x.station_id)===sel.value);if(!text&&!pending&&!existing?.photo_url){status.textContent='至少留下一句話或一張照片再保存。';return;}btn.disabled=true;btn.textContent='保存中…';try{let photo;if(pending){status.textContent='正在整理並上傳照片…';photo=await uploadPhoto(sel.value,pending);}else if(remove)photo=null;await save(sel.value,text,photo);list=await rows();status.textContent=`已保存｜目前留下 ${list.length} / 10 站手記`;btn.textContent='已保存 ✓';setTimeout(()=>btn.textContent='保存這篇手記',1200);}catch(err){status.textContent=err.message;btn.textContent='重新保存';}finally{btn.disabled=false;}};
  }
  async function showBooklet(){
    const body=overlay.querySelector('[data-journal-body]'),{newsroom,studentName}=identity();overlay.querySelector('[data-journal-title]').textContent='我的調查記者特刊';overlay.querySelector('[data-journal-sub]').textContent=`翻閱 1938・${studentName}・${newsroom}`;body.innerHTML='<div class="journal-loading">正在整理你的調查手記……</div>';
    try{const list=await rows(),choice=localStorage.getItem('suzuran-final-choice')||'',ending=choice==='publish'?'同意刊登・真相刊出':choice==='protect'?'不同意刊登・保護名字':'尚未做出最終發刊決定';body.innerHTML=`<article class="memory-booklet"><header class="memory-cover"><small>TAICHUNG OLD CITY INVESTIGATION / 1938</small><h2>翻閱 1938</h2><p>調查記者紀念特刊</p><div class="memory-id"><b>${esc(studentName)}</b><span>${esc(newsroom)}調查小隊</span></div></header><section class="memory-summary"><div><b>${list.length}</b><span>留下的走讀手記</span></div><div><b>${list.filter(r=>r.photo_url).length}</b><span>保存的現場照片</span></div><div><b>${esc(ending)}</b><span>最終選擇</span></div></section><section class="memory-notes"><h3>我的舊城調查手記</h3>${list.length?list.map(r=>`<article class="memory-note"><small>STATION ${String(r.station_id).padStart(2,'0')}</small><h4>${esc(r.station_name)}</h4>${r.photo_url?`<img class="memory-note-photo" src="${esc(r.photo_url)}" alt="走讀照片">`:''}${r.content?`<p>${esc(r.content).replace(/\n/g,'<br>')}</p>`:''}</article>`).join(''):'<div class="memory-empty">還沒有留下手記。寫下一兩句或留下一張照片，這裡就會慢慢長成你的回憶特刊。</div>'}</section><footer class="memory-ending"><small>FINAL DECISION</small><strong>${esc(ending)}</strong><p>這份記錄保存的是你在舊城裡親自看見、推理與選擇過的痕跡。</p></footer></article><div class="journal-actions no-print"><button class="journal-secondary" data-back>繼續寫手記</button><button class="journal-primary" data-print>列印／存成 PDF</button></div>`;body.querySelector('[data-back]').onclick=showEditor;body.querySelector('[data-print]').onclick=()=>window.print();}catch(e){body.innerHTML=`<div class="journal-error">${esc(e.message)}</div>`;}
  }
  async function boot(){
    try{await getKey();}catch(e){console.error(e);return;}
    overlay=document.createElement('div');overlay.className='reporter-journal-overlay';overlay.innerHTML=`<section class="reporter-journal-card" role="dialog" aria-modal="true"><header><div><small>REPORTER'S NOTEBOOK / 走讀紀錄</small><h2 data-journal-title>記者手記</h2><p data-journal-sub></p></div><button class="journal-close" data-close aria-label="關閉">×</button></header><div class="reporter-journal-body" data-journal-body></div></section>`;document.body.appendChild(overlay);launcher=document.createElement('button');launcher.className='reporter-journal-launcher';launcher.innerHTML='<span>✎</span> 記者手記';launcher.onclick=open;document.body.appendChild(launcher);overlay.querySelector('[data-close]').onclick=close;overlay.onclick=e=>{if(e.target===overlay)close();};const refresh=()=>launcher.hidden=!ready();refresh();addEventListener('storage',refresh);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();