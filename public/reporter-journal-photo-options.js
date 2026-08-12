(()=>{
  function enhance(){
    document.querySelectorAll('.journal-photo-field').forEach(section=>{
      if(section.dataset.photoOptionsReady==='1')return;
      const original=section.querySelector('input[data-photo]');
      const originalLabel=original?.closest('label');
      if(!original||!originalLabel)return;
      section.dataset.photoOptionsReady='1';
      originalLabel.querySelector('span').textContent='📷 直接拍照';
      const uploadLabel=document.createElement('label');
      uploadLabel.className=originalLabel.className;
      uploadLabel.innerHTML='<input type="file" accept="image/*" data-photo-upload><span>🖼️ 從手機上傳</span>';
      originalLabel.insertAdjacentElement('afterend',uploadLabel);
      const upload=uploadLabel.querySelector('[data-photo-upload]');
      upload.addEventListener('change',()=>{
        const file=upload.files?.[0];
        if(!file)return;
        try{
          const dt=new DataTransfer();
          dt.items.add(file);
          original.files=dt.files;
          original.dispatchEvent(new Event('change',{bubbles:true}));
        }catch{
          const preview=section.querySelector('[data-preview]');
          const img=preview?.querySelector('img');
          if(img){img.src=URL.createObjectURL(file);preview.hidden=false;}
          window.__SUZURAN_PENDING_UPLOAD_FILE__=file;
        }
      });
    });
  }
  new MutationObserver(enhance).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});else enhance();
})();
