import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './live-broadcast.css';

const supabaseUrl='https://unyntuezvovodpklishf.supabase.co';
const publishableKey='sb_publishable_V-bPAyQBvzHTdRIPlDtbWQ_QYd3Jn1G';
const endpoint=supabaseUrl+'/rest/v1/live_broadcasts';

function isTestMode(){
 const p=new URLSearchParams(location.search);
 return p.get('test')==='1'||p.get('testMode')==='1'||localStorage.getItem('suzuran-test-mode')==='true'||localStorage.getItem('testMode')==='true'||document.body.innerText.includes('測試模式・不寫入 Supabase');
}
function LiveBroadcast(){
 const [notice,setNotice]=useState(null); const [open,setOpen]=useState(false);
 const audience=isTestMode()?'test':'live';
 const lastId=useRef(Number(sessionStorage.getItem('suzuran-live-broadcast-id-'+audience)||0));
 useEffect(()=>{let stopped=false; const check=async()=>{try{
  const q=new URLSearchParams({select:'id,title,body,detail,created_at,audience',active:'eq.true',expires_at:'gt.'+new Date().toISOString(),audience:'eq.'+audience,order:'id.desc',limit:'1'});
  const res=await fetch(endpoint+'?'+q,{headers:{apikey:publishableKey,Accept:'application/json'},cache:'no-store'}); if(!res.ok)return;
  const rows=await res.json(),next=rows[0]; if(!stopped&&next&&Number(next.id)>lastId.current){lastId.current=Number(next.id);sessionStorage.setItem('suzuran-live-broadcast-id-'+audience,String(next.id));setNotice(next);setOpen(false);if(navigator.vibrate)navigator.vibrate([180,80,180]);}
 }catch{}}; check();const timer=setInterval(check,3000);return()=>{stopped=true;clearInterval(timer)}},[audience]);
 if(!notice)return null; return <><div className="live-notice" role="alert" onClick={()=>setOpen(true)}><div className="live-notice-icon">急</div><div className="live-notice-copy"><small>{notice.title}{audience==='test'?'｜測試':''}</small><b>{notice.body}</b><span>點擊查看通報</span></div><button aria-label="關閉" onClick={e=>{e.stopPropagation();setNotice(null)}}>×</button></div>{open&&<div className="live-modal-backdrop" onClick={()=>setOpen(false)}><article className="live-modal" onClick={e=>e.stopPropagation()}><div className="live-modal-stamp">至急</div><small>{notice.title}</small><h2>{notice.body}</h2><div className="live-modal-rule"/><p>{notice.detail||'相關情況仍在確認中。請各位調查員留意後續消息。'}</p><button onClick={()=>setOpen(false)}>我知道了</button></article></div>}</>;
}
const host=document.createElement('div');host.id='suzuran-live-broadcast';document.body.appendChild(host);createRoot(host).render(<LiveBroadcast/>);
