(()=>{
  if(!(window.__SUZURAN_TEST_MODE__ || new URLSearchParams(location.search).get('test')==='1')) return;

  const STORE='__journal_test_walk_journals_v3__';
  const groups=['蘭臺','見山','迴聲'];
  const stations=[['1','大正製酒株式會社'],['2','敷島町市場（第三市場）'],['3','新盛橋通、櫻橋通（中山綠橋）'],['4','南園酒家'],['5','臺中州立圖書館（合作金庫）'],['6','臺中市役所'],['7','大正橋通（民權綠橋）'],['8','中央書局'],['9','柳川古道'],['10','新富町市場（第二市場）']];
  const identity=()=>({newsroom:localStorage.getItem('suzuran-newsroom')||'',studentName:localStorage.getItem('suzuran-investigator-name')||''});

  function readAll(){
    try{
      const value=JSON.parse(localStorage.getItem(STORE)||'[]');
      return Array.isArray(value)?value:[];
    }catch{return [];}
  }
  function writeAll(rows){
    localStorage.setItem(STORE,JSON.stringify(rows));
  }
  function mine(){
    const {newsroom,studentName}=identity();
    return readAll().filter(r=>r.newsroom===newsroom&&r.student_name===studentName).sort((a,b)=>a.station_id-b.station_id);
  }
  function saveRow(stationId,content,photoUrl){
    const {newsroom,studentName}=identity();
    if(!groups.includes(newsroom)||!studentName.trim()) throw new Error('尚未取得玩家資料，請重新整理後再試。');
    const station=stations.find(([id])=>id===String(stationId));
    if(!station) throw new Error('站點資料無效');
    const all=readAll();
    const id=Number(stationId);
    const i=all.findIndex(r=>r.newsroom===newsroom&&r.student_name===studentName&&r.station_id===id);
    const now=new Date().toISOString();
    const prev=i>=0?all[i]:{};
    const row={...prev,newsroom,student_name:studentName,station_id:id,station_name:station[1],content:String(content||'').trim(),updated_at:now,created_at:prev.created_at||now};
    if(photoUrl!==undefined) row.photo_url=photoUrl||null;
    if(i>=0) all[i]=row; else all.push(row);
    writeAll(all);
  }
  const dataUrl=file=>new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(String(fr.result||''));fr.onerror=()=>reject(new Error('照片讀取失敗'));fr.readAsDataURL(file);});
  async function compress(file){
    if(!file) return undefined;
    const raw=await dataUrl(file);
    return new Promise(resolve=>{
      const img=new Image();
      img.onload=()=>{
        const max=1200,s=Math.min(1,max/Math.max(img.naturalWidth||1,img.naturalHeight||1));
        const c=document.createElement('canvas');
        c.width=Math.max(1,Math.round((img.naturalWidth||1)*s));
        c.height=Math.max(1,Math.round((img.naturalHeight||1)*s));
        c.getContext('2d').drawImage(img,0,0,c.width,c.height);
        resolve(c.toDataURL('image/jpeg',.72));
      };
      img.onerror=()=>resolve(raw);
      img.src=raw;
    });
  }

  function bind(body){
    if(!body || body.dataset.testSaveFix==='1') return;
    const sel=body.querySelector('[data-station]');
    const ta=body.querySelector('[data-content]');
    const save=body.querySelector('[data-save]');
    const input=body.querySelector('[data-photo]');
    const preview=body.querySelector('[data-preview]');
    if(!sel||!ta||!save) return;
    body.dataset.testSaveFix='1';

    const restore=()=>{
      const row=mine().find(r=>String(r.station_id)===sel.value);
      if(row){
        ta.value=row.content||'';
        ta.dispatchEvent(new Event('input',{bubbles:true}));
        if(row.photo_url && preview){
          const img=preview.querySelector('img');
          if(img){img.src=row.photo_url;preview.hidden=false;}
        }
      }
    };
    setTimeout(restore,50);
    sel.addEventListener('change',()=>setTimeout(restore,0));

    save.addEventListener('click',async e=>{
      e.preventDefault();
      e.stopImmediatePropagation();
      const status=body.querySelector('[data-status]');
      const text=ta.value.trim();
      const existing=mine().find(r=>String(r.station_id)===sel.value);
      const file=input?.files?.[0]||null;
      if(!text&&!file&&!existing?.photo_url){
        if(status) status.textContent='至少留下一句話或一張照片再保存。';
        return;
      }
      save.disabled=true;
      save.textContent='保存中…';
      try{
        let photo;
        if(file){
          if(status) status.textContent='正在整理照片…';
          photo=await compress(file);
        }
        saveRow(sel.value,text,photo);
        const list=mine();
        if(status) status.textContent=`已保存｜目前留下 ${list.length} / 10 站手記（測試模式）`;
        save.textContent='已保存 ✓';
        setTimeout(()=>{save.textContent='保存這篇手記';},1200);
      }catch(err){
        console.error(err);
        if(status) status.textContent='保存失敗：'+(err?.message||'請再試一次');
        save.textContent='重新保存';
      }finally{
        save.disabled=false;
      }
    },true);
  }

  const scan=()=>document.querySelectorAll('.reporter-journal-body').forEach(bind);
  new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scan,{once:true}); else scan();
})();