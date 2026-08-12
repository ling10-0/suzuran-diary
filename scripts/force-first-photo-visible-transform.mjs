export function forceFirstPhotoVisibleTransform(){
 return {
  name:'suzuran-force-first-photo-visible-transform',
  enforce:'post',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx')||!code.includes('function PhotoCheckinChallenge('))return null;

   let next=code;

   // 第一關為「拍照打卡即完成」：通關後直接看工程圖／名冊，不再作答。
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

   // 第一關拍照區固定顯示。
   const queryAnchor='<section className="gazette-query">';
   const queryIndex=field.indexOf(queryAnchor);
   if(queryIndex<0)return null;
   field=field.slice(0,queryIndex)+render+'\n\n   '+field.slice(queryIndex);

   // 第一關完全不顯示案件問題說明。
   field=field.replaceAll('{item.question&&(', '{index!==0&&item.question&&(');
   field=field.replaceAll('{item.question&&', '{index!==0&&item.question&&');

   // 第一關完全不顯示任何作答 form（包含 A～D 選擇題與「送交查核」）。
   field=field.replaceAll('{!item.direct&&!item.pending&&(!solved||replayMode)&&<form', '{index!==0&&!item.direct&&!item.pending&&(!solved||replayMode)&&<form');
   field=field.replaceAll('{!item.direct&&!item.pending&&!solved&&<form', '{index!==0&&!item.direct&&!item.pending&&!solved&&<form');
   field=field.replaceAll('{!item.direct&&!item.pending&&!solved&&(', '{index!==0&&!item.direct&&!item.pending&&!solved&&(');

   // 第一關工程文件只有在拍照門檻通過後才出現。
   field=field.replaceAll('{item.evidenceDocuments?.length>0&&', '{item.evidenceDocuments?.length>0&&(index!==0||photoGatePassed||solved)&&');

   next=next.slice(0,fieldStart)+field+next.slice(fieldEnd);
   return next===code?null:{code:next,map:null};
  }
 };
}
