(()=>{
  const clean=()=>{
    document.querySelectorAll('[data-booklet]').forEach(btn=>btn.remove());
    document.querySelectorAll('[data-status]').forEach(el=>{
      if(el.textContent.includes('回憶特刊')) el.textContent='每一站都可以回來修改；文字與照片都會替你保存。';
    });
  };
  new MutationObserver(clean).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean,{once:true});else clean();
})();