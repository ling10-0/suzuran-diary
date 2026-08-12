const bridgePhotoGateComponent = String.raw`
function GreenBridgePhotoGate(){
 const [code,setCode]=useState('');
 const [error,setError]=useState(false);
 const submit=event=>{
  event.preventDefault();
  const normalized=code.trim().normalize('NFKC').toLowerCase();
  if(normalized!=='okok'){
   setError(true);
   return;
  }
  window.localStorage.setItem('suzuran-green-bridge-photo-gate','1');
  window.location.reload();
 };
 return <section className="photo-checkin-challenge green-bridge-photo-gate" aria-label="新盛橋拍照打卡任務">
  <header className="photo-checkin-head">
   <small>CHECK-IN / 新盛橋拍照任務</small>
   <h4>先完成新盛橋打卡，再開始案件查核</h4>
   <p>請先找到下方指定地點，模仿指定姿勢完成一張合照。完成後，由隊輔確認照片，再輸入通關密碼，即可開啟新盛橋的解謎內容。</p>
  </header>
  <div className="photo-checkin-grid">
   <article className="photo-checkin-card">
    <div className="photo-checkin-number">PHOTO / 01</div>
    <div className="photo-reference-pair">
     <figure>
      <img src="./assets/puzzles/green-bridge/place1.jpg" alt="新盛橋指定拍照地點" loading="lazy"/>
      <figcaption>指定地點</figcaption>
     </figure>
     <figure>
      <img src="./assets/puzzles/green-bridge/pose1.jpg" alt="新盛橋指定拍照姿勢" loading="lazy"/>
      <figcaption>指定姿勢</figcaption>
     </figure>
    </div>
    <p>找到照片中的位置，依照右側姿勢完成拍照。拍完後請直接交給隊輔確認。</p>
   </article>
  </div>
  <div className="photo-checkin-submit">
   <form className="photo-staff-gate" onSubmit={submit}>
    <div className="photo-staff-gate-copy">
     <small>STAFF CONFIRM / 隊輔確認</small>
     <strong>照片確認完成後，輸入通關密碼即可進入新盛橋案件解謎。</strong>
    </div>
    <label htmlFor="green-bridge-photo-code">通關密碼</label>
    <div className="photo-staff-gate-row">
     <input id="green-bridge-photo-code" type="password" autoComplete="off" value={code} onChange={event=>{setCode(event.target.value);setError(false)}} placeholder="請由隊輔輸入" />
     <button type="submit" className="photo-pass-button">確認並開始解謎</button>
    </div>
    {error&&<p className="photo-staff-error">密碼不正確，請重新確認。</p>}
   </form>
  </div>
 </section>;
}
`;

export function greenBridgePhotoGateTransform(){
 return {
  name:'suzuran-green-bridge-photo-gate-transform',
  enforce:'pre',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   let next=code;
   const fieldStart='function FieldJournal({item,index,unlockedCount,sharedSolved,onSharedSolved}){';
   if(next.includes(fieldStart)&&!next.includes('function GreenBridgePhotoGate(')){
    next=next.replace(fieldStart,bridgePhotoGateComponent+'\n'+fieldStart);
   }

   const gatedQuestion="{item.question&&(!(item.direct&&index===0)||solved)&&(index!==2||window.localStorage.getItem('suzuran-green-bridge-photo-gate')==='1')&&(";
   const currentQuestion="{item.question&&(!(item.direct&&index===0)||solved)&&(";
   if(next.includes(currentQuestion)){
    next=next.replace(currentQuestion,"{index===2&&window.localStorage.getItem('suzuran-green-bridge-photo-gate')!=='1'&&<GreenBridgePhotoGate/>}\n    "+gatedQuestion);
   } else if(!next.includes('suzuran-green-bridge-photo-gate') && next.includes('{item.question&&(')){
    next=next.replace('{item.question&&(',"{index===2&&window.localStorage.getItem('suzuran-green-bridge-photo-gate')!=='1'&&<GreenBridgePhotoGate/>}\n    {item.question&&(index!==2||window.localStorage.getItem('suzuran-green-bridge-photo-gate')==='1')&&(");
   }

   return next===code?null:{code:next,map:null};
  }
 };
}
