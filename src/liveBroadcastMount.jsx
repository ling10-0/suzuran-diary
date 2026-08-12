import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './live-broadcast.css';

const supabaseUrl='https://unyntuezvovodpklishf.supabase.co';
const publishableKey='sb_publishable_V-bPAyQBvzHTdRIPlDtbWQ_QYd3Jn1G';
const endpoint=supabaseUrl+'/rest/v1/live_broadcasts';

function LiveBroadcast(){
 const [notice,setNotice]=useState(null);
 const [open,setOpen]=useState(false);
 const lastId=useRef(Number(sessionStorage.getItem('suzuran-live-broadcast-id')||0));
 useEffect(()=>{
  let stopped=false;
  const check=async()=>{
   try{
    const q=new URLSearchParams({select:'id,title,body,detail,created_at',active:'eq.true',expires_at:'gt.'+new Date().toISOString(),order:'id.desc',limit:'1'});
    const res=await fetch(endpoint+'?'+q,{headers:{apikey:publishableKey,Accept:'application/json'},cache:'no-store'});
    if(!res.ok)return;
    const rows=await res.json(); const next=rows[0];
    if(!stopped&&next&&Number(next.id)>lastId.current){
     lastId.current=Number(next.id); sessionStorage.setItem('suzuran-live-broadcast-id',String(next.id));
     setNotice(next); setOpen(false);
     if(navigator.vibrate) navigator.vibrate([180,80,180]);
    }
   }catch{}
  };
  check(); const timer=setInterval(check,3000);
  return()=>{stopped=true;clearInterval(timer)};
 },[]);
 if(!notice)return null;
 return <>
  <div className="live-notice" role="alert" onClick={()=>setOpen(true)}>
   <div className="live-notice-icon">急</div><div className="live-notice-copy"><small>{notice.title}</small><b>{notice.body}</b><span>點擊查看通報</span></div>
   <button aria-label="關閉" onClick={e=>{e.stopPropagation();setNotice(null)}}>×</button>
  </div>
  {open&&<div className="live-modal-backdrop" onClick={()=>setOpen(false)}><article className="live-modal" onClick={e=>e.stopPropagation()}>
   <div className="live-modal-stamp">至急</div><small>{notice.title}</small><h2>{notice.body}</h2><div className="live-modal-rule"/>
   <p>{notice.detail||'相關情況仍在確認中。請各位調查員留意後續消息。'}</p>
   <button onClick={()=>setOpen(false)}>我知道了</button>
  </article></div>}
 </>;
}

const host=document.createElement('div'); host.id='suzuran-live-broadcast'; document.body.appendChild(host); createRoot(host).render(<LiveBroadcast/>);
