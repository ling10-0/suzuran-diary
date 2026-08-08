export function customReplayTransform(){
 return {
  name:'suzuran-custom-replay-transform',
  enforce:'pre',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   let next=code;

   const oldMarketFlow="item.customFlow==='marketLocker'&&!solved?<MarketLockerFlow onComplete={()=>{setSolved(true);window.localStorage.setItem(unlockKey,'1');onSharedSolved?.(index)}}/>";
   const newMarketFlow="item.customFlow==='marketLocker'&&(!solved||replayMode)?<MarketLockerFlow onComplete={()=>{setSolved(true);setReplayMode(false);window.localStorage.setItem(unlockKey,'1');onSharedSolved?.(index)}}/>";
   if(next.includes(oldMarketFlow))next=next.replace(oldMarketFlow,newMarketFlow);

   const solvedMessage='<p className="gazette-approved">本件照合完了，准予閱覽本島人手稿。</p>';
   const replayControls=`${solvedMessage}{item.customFlow==='marketLocker'&&!replayMode&&<button type="button" className="case-replay-button" onClick={()=>{setValue('');setError(false);setSubStep(0);setReplayMode(true)}}>重新遊玩本題</button>}{item.customFlow==='marketLocker'&&replayMode&&<button type="button" className="case-replay-button" onClick={()=>{setReplayMode(false);setValue('');setError(false);setSubStep(0)}}>結束重新遊玩</button>}`;
   if(next.includes(solvedMessage)&&!next.includes('重新遊玩本題'))next=next.replace(solvedMessage,replayControls);

   return next===code?null:{code:next,map:null};
  }
 };
}
