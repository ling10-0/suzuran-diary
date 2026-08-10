const charadesStage = String.raw`
  {stage===5&&<section className="market-stage market-charades-stage">
   <p className="market-kicker">第六階段｜無聲傳訊</p>
   <h4>先完成五個比手畫腳，再把答案寫回鈴蘭留下的訊息</h4>
   <div className="market-charades-note">
    <b>現場任務</b>
    <p>由隊輔依序出示五張關鍵字卡。每題 40 秒，表演者不能說話、寫字、比字數或使用嘴型提示；同組成員猜中後，才能進行下一張。</p>
    <p>五個答案都猜完後，依照剛才的順序，把它們放回下面這段話。</p>
   </div>
   <p className="market-charades-frame">「我發現有人在後面＿＿，便先向父親＿＿；我們隨即＿＿行動，把工程圖先＿＿，之後再設法保持＿＿。」</p>
   <label className="market-charades-input">請輸入完整句子
    <textarea value={charadeText} onChange={event=>{setCharadeText(event.target.value);setError('')}} placeholder="把五個比手畫腳答案依序放進句子中，再輸入完整的一句話。" rows="4" />
   </label>
   <small className="market-charades-hint">系統會確認五個關鍵字是否都出現，而且順序正確；標點與其他文字可以不同。</small>
   {error&&<small className="market-error">{error}</small>}
   <button className="market-next" type="button" onClick={checkCharades}>完成無聲傳訊</button>
  </section>}
`;

export function tenthCharadesTransform(){
 return {
  name:'suzuran-tenth-charades-transform',
  enforce:'pre',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx')||!code.includes('function MarketLockerFlow({onComplete})'))return null;
   let next=code;
   if(!next.includes("const [charadeText,setCharadeText]=useState('');")){
    next=next.replace(" const [finalTwo,setFinalTwo]=useState('');\n const [ready,setReady]=useState(false);"," const [finalTwo,setFinalTwo]=useState('');\n const [charadeText,setCharadeText]=useState('');\n const [ready,setReady]=useState(false);");
   }
   if(!next.includes('const checkCharades=()=>{')){
    next=next.replace(" const checkPairs=()=>{\n  const ok=pairs.p1==='E1'&&pairs.p2==='E2'&&pairs.p3==='E3'&&pairs.p4==='E4';\n  if(ok){setError('');setStage(5)}else setError('證據配對仍有一處不符，請回頭比對識字簿、紙封與今日便條。')\n };",
` const checkPairs=()=>{
  const ok=pairs.p1==='E1'&&pairs.p2==='E2'&&pairs.p3==='E3'&&pairs.p4==='E4';
  if(ok){setError('');setStage(5)}else setError('證據配對仍有一處不符，請回頭比對識字簿、紙封與今日便條。')
 };
 const checkCharades=()=>{
  const normalized=charadeText.normalize('NFKC').replace(/\\s+/g,'');
  const words=['跟蹤','示警','分開','藏起','聯絡'];
  const positions=words.map(word=>normalized.indexOf(word));
  const ok=positions.every(position=>position>=0)&&positions.every((position,index)=>index===0||position>positions[index-1]);
  if(ok){setError('');setStage(6)}else setError('句子裡還缺少比手畫腳得到的關鍵字，或五個詞的順序不正確。請依現場猜出的順序重新整理。')
 };`);
   }
   next=next.replace("<header className=\"market-progress\"><small>SHINTOMICHO LOCKER FILE</small><b>第 {Math.min(stage+1,6)}／6 階段</b></header>","<header className=\"market-progress\"><small>SHINTOMICHO LOCKER FILE</small><b>第 {Math.min(stage+1,7)}／7 階段</b></header>");
   if(!next.includes('market-charades-stage')){
    const finalAnchor='  {stage===5&&<section className="market-stage">\n   <p className="market-kicker">第六階段｜最後判斷</p>';
    if(next.includes(finalAnchor)){
     next=next.replace(finalAnchor,charadesStage+'\n  {stage===6&&<section className="market-stage">\n   <p className="market-kicker">第七階段｜最後判斷</p>');
    }
   }
   return next===code?null:{code:next,map:null};
  }
 };
}
