const photoComponent = `
function PhotoCheckinChallenge({index,solved,setSolved,onSharedSolved}){
 const photoTasks=[
  {no:1,place:'./assets/puzzles/1916/place1.jpg',pose:'./assets/puzzles/1916/pose1.png'},
  {no:2,place:'./assets/puzzles/1916/place2.jpg',pose:'./assets/puzzles/1916/pose2.jpg'},
  {no:3,place:'./assets/puzzles/1916/place3.jpg',pose:'./assets/puzzles/1916/pose3.jpg'},
  {no:4,place:'./assets/puzzles/1916/place4.jpg',pose:'./assets/puzzles/1916/pose4.jpg'},
  {no:5,place:'./assets/puzzles/1916/place5.jpg',pose:'./assets/puzzles/1916/pose5.jpg'},
  {no:6,place:'./assets/puzzles/1916/place6.jpg',pose:'./assets/puzzles/1916/pose6.jpg'},
  {no:7,place:'./assets/puzzles/1916/place7.jpg',pose:'./assets/puzzles/1916/pose7.jpg'},
  {no:8,place:'./assets/puzzles/1916/place8.jpg',pose:'./assets/puzzles/1916/pose8.jpg'},
  {no:9,place:'./assets/puzzles/1916/place9.jpg',pose:'./assets/puzzles/1916/pose9.webp'},
  {no:10,place:'./assets/puzzles/1916/place10.jpg',pose:'./assets/puzzles/1916/pose10.jpg'}
 ];
 const [photoChecks,setPhotoChecks]=useState(()=>Object.fromEntries(photoTasks.map(task=>[task.no,window.localStorage.getItem('suzuran-1916-photo-place'+task.no)==='1'])));
 const [staffCode,setStaffCode]=useState('');
 const [staffError,setStaffError]=useState(false);
 if(index!==0)return null;
 const unlockKey='suzuran-main-v3-unlocked-'+index;
 const completedCount=photoTasks.filter(task=>photoChecks[task.no]).length;
 const minimumDone=completedCount>=4;
 const markDone=no=>{
  setPhotoChecks(prev=>({...prev,[no]:true}));
  window.localStorage.setItem('suzuran-1916-photo-place'+no,'1');
 };
 const confirmByStaff=event=>{
  event.preventDefault();
  const normalizedCode=staffCode.trim().normalize('NFKC').toLowerCase();
  const ok=normalizedCode==='okok';
  setStaffError(!ok);
  if(!ok)return;
  window.localStorage.setItem(unlockKey,'1');
  setSolved(true);
  onSharedSolved?.(index);
 };
 return <section className="photo-checkin-challenge" aria-label="拍照打卡關卡">
  <header className="photo-checkin-head">
   <small>CHECK-IN / 拍照打卡</small>
   <h4>拍照打卡</h4>
   <p>請在大正製酒株式會社園區內，從下方十組指定地點與姿勢中任選四組完成拍照。完成四組後，請交由隊輔確認；隊輔輸入通關密碼後，即可開放本關手稿與案件查核資料。</p>
  </header>
  <div className="photo-checkin-grid">
   {photoTasks.map(task=>{
    const done=!!photoChecks[task.no];
    const label=String(task.no).padStart(2,'0');
    return <article key={task.no} className={'photo-checkin-card '+(done?'is-done':'')}>
     <div className="photo-checkin-number">{label}</div>
     <div className="photo-reference-pair">
      <figure><img src={task.place} alt={'第'+task.no+'個指定拍照地點'} loading="lazy"/><figcaption>指定地點 {task.no}</figcaption></figure>
      <figure><img src={task.pose} alt={'第'+task.no+'個指定拍照姿勢'} loading="lazy"/><figcaption>指定姿勢 {task.no}</figcaption></figure>
     </div>
     <p>找到「指定地點 {task.no}」，並模仿「指定姿勢 {task.no}」拍下一張照片。</p>
     <button type="button" onClick={()=>markDone(task.no)} disabled={done}>{done?'✓ 第'+task.no+'組已完成':'我已完成第'+task.no+'組拍照'}</button>
    </article>;
   })}
  </div>
  <div className="photo-checkin-submit">
   {!minimumDone&&<p>目前完成 {completedCount} / 4 組。再完成 {4-completedCount} 組即可交由隊輔確認。</p>}
   {minimumDone&&!solved&&(
    <form className="photo-staff-gate" onSubmit={confirmByStaff}>
     <div className="photo-staff-gate-copy">
      <small>STAFF CONFIRM / 隊輔確認</small>
      <strong>已完成至少四組拍照。請隊輔確認其中四組皆符合指定地點與姿勢，再輸入隊輔通關密碼。</strong>
     </div>
     <label htmlFor={'photo-staff-code-'+index}>隊輔通關密碼</label>
     <div className="photo-staff-gate-row">
      <input id={'photo-staff-code-'+index} type="password" autoComplete="off" value={staffCode} onChange={event=>{setStaffCode(event.target.value);setStaffError(false)}} placeholder="僅由隊輔輸入" />
      <button type="submit" className="photo-pass-button">確認並通關</button>
     </div>
     {staffError&&<p className="photo-staff-error">密碼不正確，請由隊輔重新確認。</p>}
    </form>
   )}
  </div>
 </section>
}
`;

export function photoCheckinTransform(){
 return {
  name:'suzuran-photo-checkin-transform',
  enforce:'pre',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   let next=code;

   if(!next.includes("import './photo-checkin.css';")){
    next=next.replace("import './newspaper.css';","import './newspaper.css';\nimport './photo-checkin.css';");
   }

   /* 第一關雖為 direct 案件，但必須等拍照＋隊輔密碼後才算 solved。 */
   next=next.replace(
    "()=>item.direct||sharedSolved||window.localStorage.getItem(unlockKey)==='1'",
    "()=>((item.direct&&index!==0)||sharedSolved||window.localStorage.getItem(unlockKey)==='1')"
   );
   next=next.replace(
    "const islandManuscriptReady=item.direct||solved;",
    "const islandManuscriptReady=(item.direct&&index!==0)||solved;"
   );
   next=next.replace(
    "item.direct\n       ?'公開'",
    "item.direct&&index!==0\n       ?'公開'\n       :item.direct&&index===0\n        ?(solved?'受理済':'待隊輔確認')"
   );

   /* 1916 的案件查核資料要在拍照＋隊輔確認後才開示。 */
   next=next.replace(
    "{item.question&&(\n",
    "{item.question&&(!(item.direct&&index===0)||solved)&&(\n"
   );

   /* 案件目錄與 sharedSolved 原本把所有 direct 案件直接視為通關，
      會讓 1916 一進頁面就被標成 solved，導致密碼欄永遠不出現。 */
   next=next.replace(
    "const isSolved=index=>puzzles[index]?.direct||(sharedProgress?.includes(mainProgressId(index))??false)||window.localStorage.getItem('suzuran-main-v3-unlocked-'+index)==='1';",
    "const isSolved=index=>(puzzles[index]?.direct&&index!==0)||(sharedProgress?.includes(mainProgressId(index))??false)||window.localStorage.getItem('suzuran-main-v3-unlocked-'+index)==='1';"
   );
   next=next.replace(
    "const status=item.direct?'直接閱覽':item.pending?'題目待發':solved?'已解鎖':'未查核';",
    "const status=item.direct&&item.index===0?(solved?'已解鎖':'待隊輔確認'):item.direct?'直接閱覽':item.pending?'題目待發':solved?'已解鎖':'未查核';"
   );

   const fieldStart='function FieldJournal({item,index,unlockedCount,sharedSolved,onSharedSolved}){';
   if(!next.includes('function PhotoCheckinChallenge(')&&next.includes(fieldStart)){
    next=next.replace(fieldStart,photoComponent+'\n'+fieldStart);
   }

   if(!next.includes('<PhotoCheckinChallenge index={index}')){
    const directBlock=/\{\/\*\s*直接閱覽案件\s*\*\/\}[\s\S]*?\{item\.direct&&\([\s\S]*?<p className="gazette-approved">[\s\S]*?本件無須輸入答案，可直接對照兩種城市記錄。\s*<\/p>[\s\S]*?\)\}/;
    const replacement=`{/* 直接閱覽案件 */}\n\n    {item.direct&&index!==0&&(\n     <p className="gazette-approved">\n      本件無須輸入答案，可直接對照兩種城市記錄。\n     </p>\n    )}\n    {item.direct&&index===0&&!solved&&<PhotoCheckinChallenge index={index} solved={solved} setSolved={setSolved} onSharedSolved={onSharedSolved}/>} `;
    next=next.replace(directBlock,replacement);
   }

   return next===code?null:{code:next,map:null};
  }
 };
}
