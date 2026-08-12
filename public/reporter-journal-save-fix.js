(()=>{
  const PREFIX='suzuran-journal-backup:';
  const escKey=v=>encodeURIComponent(String(v||'').trim());
  const identity=()=>({
    newsroom:localStorage.getItem('suzuran-newsroom')||'',
    studentName:localStorage.getItem('suzuran-investigator-name')||''
  });
  const keyFor=station=>{const x=identity();return PREFIX+[escKey(x.newsroom),escKey(x.studentName),String(station||'')].join(':');};
  const read=station=>{try{return JSON.parse(localStorage.getItem(keyFor(station))||'null')}catch{return null}};
  const write=(station,content)=>{try{localStorage.setItem(keyFor(station),JSON.stringify({content:String(content||''),updatedAt:new Date().toISOString()}));return true}catch{return false}};

  function bind(root=document){
    root.querySelectorAll?.('.reporter-journal-body').forEach(body=>{
      if(body.dataset.saveFixBound==='1')return;
      const sel=body.querySelector('[data-station]');
      const ta=body.querySelector('[data-content]');
      const save=body.querySelector('[data-save]');
      if(!sel||!ta||!save)return;
      body.dataset.saveFixBound='1';

      const restore=()=>{
        const backup=read(sel.value);
        if(backup?.content && !ta.value.trim()){
          ta.value=backup.content;
          ta.dispatchEvent(new Event('input',{bubbles:true}));
        }
      };
      setTimeout(restore,250);
      sel.addEventListener('change',()=>setTimeout(restore,80));
      ta.addEventListener('input',()=>write(sel.value,ta.value));
      save.addEventListener('click',()=>{
        const ok=write(sel.value,ta.value);
        if(!ok)return;
        const status=body.querySelector('[data-status]');
        setTimeout(()=>{
          if(status && /失敗|錯誤|無法/.test(status.textContent||'')){
            status.textContent='已先保存在這台裝置；請重新整理後再試一次雲端同步。';
          }
        },900);
      },true);
    });
  }
  new MutationObserver(()=>bind()).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>bind(),{once:true});else bind();
})();