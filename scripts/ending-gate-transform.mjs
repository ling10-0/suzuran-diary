export function endingGateTransform(){
 return {
  name:'suzuran-ending-gate-transform',
  enforce:'pre',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   let next=code;
   if(!next.includes("import './ending-gate.css';")&&next.includes("import './ending-consistency.css';")){
    next=next.replace("import './ending-consistency.css';","import './ending-consistency.css';\nimport './ending-gate.css';");
   }
   const stateAnchor=" const day2Ready=window.localStorage.getItem('suzuran-ending-ready')==='1';";
   if(next.includes(stateAnchor)&&!next.includes("const [endingUnlocked")){
    next=next.replace(stateAnchor,stateAnchor+"\n const [endingUnlocked,setEndingUnlocked]=useState(false);\n const [endingPassword,setEndingPassword]=useState('');\n const [endingPasswordError,setEndingPasswordError]=useState('');");
   }
   const chooseAnchor=" const choose=next=>{";
   if(next.includes(chooseAnchor)&&!next.includes('const unlockEnding=')){
    const unlock=` const unlockEnding=event=>{\n  event.preventDefault();\n  if(endingPassword.trim()==='0813'){setEndingUnlocked(true);setEndingPassword('');setEndingPasswordError('');window.scrollTo({top:0,behavior:'smooth'});return}\n  setEndingPasswordError('密碼不正確，請再確認一次。');\n };\n`;
    next=next.replace(chooseAnchor,unlock+chooseAnchor);
   }
   const mainAnchor='  <main className="ending-main">';
   if(next.includes(mainAnchor)&&!next.includes('FINAL ACCESS / 結局查核')){
    const gate=`\n   {!endingUnlocked&&<section className="ending-choice-hub ending-password-gate">\n    <div className="ending-choice-head"><small>FINAL ACCESS / 結局查核</small><h1>最終發刊決定</h1><p>此頁為最終結局關卡。請向工作人員取得四位數密碼後開啟。</p></div>\n    <form className="ending-password-form" onSubmit={unlockEnding}>\n     <label htmlFor="ending-password">結局密碼</label>\n     <div className="ending-password-row"><input id="ending-password" type="password" inputMode="numeric" maxLength="4" value={endingPassword} onChange={event=>{setEndingPassword(event.target.value);setEndingPasswordError('')}} placeholder="請輸入四位數密碼"/><button type="submit">開啟結局</button></div>\n     {endingPasswordError&&<p className="ending-password-error">{endingPasswordError}</p>}\n    </form>\n   </section>}\n`;
    next=next.replace(mainAnchor,mainAnchor+gate);
   }
   next=next.replace('{!choice&&<section className="ending-choice-hub">','{endingUnlocked&&!choice&&<section className="ending-choice-hub">');
   next=next.replace("{choice==='publish'&&<section className=\"ending-experience ending-reveal\">","{endingUnlocked&&choice==='publish'&&<section className=\"ending-experience ending-reveal\">");
   next=next.replace("{choice==='protect'&&<section className=\"ending-experience ending-reveal\">","{endingUnlocked&&choice==='protect'&&<section className=\"ending-experience ending-reveal\">");
   const oldNoodle='<div className="noodle-cup"><b>泡麵</b><span>今晚的編輯晚餐</span></div>';
   const pixelNoodle='<div className="noodle-cup"><div className="pixel-ramen" aria-hidden="true"><i className="ramen-steam steam-one"></i><i className="ramen-steam steam-two"></i><i className="ramen-steam steam-three"></i><div className="ramen-top"><span className="ramen-egg"></span><span className="ramen-green green-one"></span><span className="ramen-green green-two"></span><span className="ramen-noodle noodle-one"></span><span className="ramen-noodle noodle-two"></span><span className="ramen-noodle noodle-three"></span></div><div className="ramen-bowl"><b>麵</b></div></div><b>泡麵</b><span>今晚的編輯晚餐</span></div>';
   if(next.includes(oldNoodle)&&!next.includes('pixel-ramen'))next=next.replace(oldNoodle,pixelNoodle);
   next=next.replace('我們沒有變得更大，但我們選擇成為<strong>值得信任的小報社</strong>。','我們選擇成為<strong>值得信任的小報社</strong>。');
   return next===code?null:{code:next,map:null};
  }
 };
}
