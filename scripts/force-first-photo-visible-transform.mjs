export function forceFirstPhotoVisibleTransform(){
 return {
  name:'suzuran-force-first-photo-visible-transform',
  enforce:'post',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx')||!code.includes('function PhotoCheckinChallenge('))return null;

   let next=code;

   // 第一關改回「拍照打卡即完成」：不再需要後續選擇題。
   next=next.replace(
    "Object.assign(mainlineCases[0], {\n  direct: false,",
    "Object.assign(mainlineCases[0], {\n  direct: true,"
   );

   // 隊輔確認拍照後，同時完成第一關並解鎖工程圖資料。
   next=next.replace(
    "window.localStorage.setItem('suzuran-1916-photo-gate','1');\n  window.localStorage.setItem('suzuran-1916-photo-score',String(completedPhotoIds.length*2));",
    "window.localStorage.setItem('suzuran-1916-photo-gate','1');\n  window.localStorage.setItem(unlockKey,'1');\n  window.localStorage.setItem('suzuran-1916-photo-score',String(completedPhotoIds.length*2));\n  setSolved(true);\n  onSharedSolved?.(index);"
   );

   const fieldAnchor='function FieldJournal({item,index,unlockedCount,sharedSolved,onSharedSolved}){';
   const fieldStart=next.indexOf(fieldAnchor);
   if(fieldStart<0)return null;
   const fieldEnd=next.indexOf('\nfunction NewsroomEntry',fieldStart);
   if(fieldEnd<0)return null;

   let field=next.slice(fieldStart,fieldEnd);
   const render="{index===0&&<PhotoCheckinChallenge index={index} solved={solved} setSolved={setSolved} onSharedSolved={onSharedSolved}/>}";
   const variants=[
    render,
    "{item.direct&&index===0&&!solved&&<PhotoCheckinChallenge index={index} solved={solved} setSolved={setSolved} onSharedSolved={onSharedSolved}/>} ",
    "{index===0&&!photoGatePassed&&!solved&&<PhotoCheckinChallenge index={index} solved={solved} setSolved={setSolved} onSharedSolved={onSharedSolved}/>} "
   ];
   variants.forEach(v=>{field=field.replaceAll(v,'')});

   // 第一關拍照區固定顯示；通關前只有打卡，通關後才顯示工程圖／名冊。
   const queryAnchor='<section className="gazette-query">';
   const queryIndex=field.indexOf(queryAnchor);
   if(queryIndex<0)return null;
   field=field.slice(0,queryIndex)+render+'\n\n   '+field.slice(queryIndex);

   // 第一關完全移除「請選擇最值得追查的線索」與 A～D 選擇題。
   field=field.replaceAll(
    "{item.question&&(index!==0||photoGatePassed||solved)&&(\n",
    "{item.question&&index!==0&&(\n"
   );
   field=field.replaceAll(
    "{item.question&&(index!==0||photoGatePassed||solved)&&(",
    "{item.question&&index!==0&&(" 
   );

   next=next.slice(0,fieldStart)+field+next.slice(fieldEnd);
   return next===code?null:{code:next,map:null};
  }
 };
}
