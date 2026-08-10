const photoStateSetup = `
 const [photoCheck1,setPhotoCheck1]=useState(()=>window.localStorage.getItem('suzuran-1916-photo-place1')==='1');
 const [photoCheck2,setPhotoCheck2]=useState(()=>window.localStorage.getItem('suzuran-1916-photo-place2')==='1');`;

const photoChallengeMarkup = `{item.direct&&index===0&&<section className="photo-checkin-challenge" aria-label="拍照打卡關卡">
      <header className="photo-checkin-head">
       <small>CHECK-IN / 拍照打卡</small>
       <h4>拍照打卡</h4>
       <p>請在大正製酒株式會社園區內找到下方兩個指定位置，並在各地點模仿對應姿勢完成拍照。兩組都完成後，才可完成本關。</p>
      </header>
      <div className="photo-checkin-grid">
       <article className={'photo-checkin-card '+(photoCheck1?'is-done':'')}>
        <div className="photo-checkin-number">01</div>
        <div className="photo-reference-pair">
         <figure><img src="./assets/puzzles/1916/place1.jpg" alt="第一個指定拍照地點" loading="lazy"/><figcaption>指定地點 1</figcaption></figure>
         <figure><img src="./assets/puzzles/1916/pose1.png" alt="第一個指定拍照姿勢" loading="lazy"/><figcaption>指定姿勢 1</figcaption></figure>
        </div>
        <p>找到「指定地點 1」，並模仿「指定姿勢 1」拍下一張照片。</p>
        <button type="button" onClick={()=>{setPhotoCheck1(true);window.localStorage.setItem('suzuran-1916-photo-place1','1')}} disabled={photoCheck1}>{photoCheck1?'✓ 第一組已完成':'我已完成第一組拍照'}</button>
       </article>
       <article className={'photo-checkin-card '+(photoCheck2?'is-done':'')}>
        <div className="photo-checkin-number">02</div>
        <div className="photo-reference-pair">
         <figure><img src="./assets/puzzles/1916/place2.jpg" alt="第二個指定拍照地點" loading="lazy"/><figcaption>指定地點 2</figcaption></figure>
         <figure><img src="./assets/puzzles/1916/pose2.png" alt="第二個指定拍照姿勢" loading="lazy"/><figcaption>指定姿勢 2</figcaption></figure>
        </div>
        <p>找到「指定地點 2」，並模仿「指定姿勢 2」拍下一張照片。</p>
        <button type="button" onClick={()=>{setPhotoCheck2(true);window.localStorage.setItem('suzuran-1916-photo-place2','1')}} disabled={photoCheck2}>{photoCheck2?'✓ 第二組已完成':'我已完成第二組拍照'}</button>
       </article>
      </div>
      <div className="photo-checkin-submit">
       {photoCheck1&&photoCheck2
        ?<button type="button" className="photo-pass-button" onClick={()=>{window.localStorage.setItem(unlockKey,'1');setSolved(true);onSharedSolved?.(index)}} disabled={solved}>{solved?'✓ 拍照打卡完成・本關已通過':'兩組皆完成・送出通關'}</button>
        :<p>尚未完成兩組指定拍照。</p>}
      </div>
     </section>}`;

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

   const fieldStart='function FieldJournal({item,index,unlockedCount,sharedSolved,onSharedSolved}){';
   const fieldIndex=next.indexOf(fieldStart);
   if(fieldIndex>=0){
    const before=next.slice(0,fieldIndex);
    let after=next.slice(fieldIndex);
    if(!after.includes("suzuran-1916-photo-place1")){
     const replayState=' const [replayMode,setReplayMode]=useState(false);';
     if(after.includes(replayState))after=after.replace(replayState,replayState+photoStateSetup);
     else {
      const errorState=' const [error,setError]=useState(false);';
      if(after.includes(errorState))after=after.replace(errorState,errorState+photoStateSetup);
     }
    }
    next=before+after;
   }

   if(!next.includes('aria-label="拍照打卡關卡"')){
    const directAnchor='{item.direct&&<p className="gazette-approved">本件無須輸入答案，可直接對照兩種城市記錄。</p>}';
    if(next.includes(directAnchor)){
     next=next.replace(directAnchor,`{item.direct&&index!==0&&<p className="gazette-approved">本件無須輸入答案，可直接對照兩種城市記錄。</p>}\n    ${photoChallengeMarkup}`);
    }
   }

   return next===code?null:{code:next,map:null};
  }
 };
}
