export function firstPhotoScoringFlowTransform(){
 return {
  name:'suzuran-first-photo-scoring-flow-transform',
  enforce:'post',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   let next=code;

   // 第一關不再由拍照直接完成案件：拍照只解鎖後續查核題。
   next=next.replace(
    "Object.assign(mainlineCases[0], {\n  direct: true,",
    "Object.assign(mainlineCases[0], {\n  direct: false,"
   );

   const fieldAnchor='function FieldJournal({item,index,unlockedCount,sharedSolved,onSharedSolved}){';
   const fieldIndex=next.indexOf(fieldAnchor);
   if(fieldIndex>=0){
    const before=next.slice(0,fieldIndex);
    let after=next.slice(fieldIndex);
    if(!after.includes("const photoGatePassed=window.localStorage.getItem('suzuran-1916-photo-gate')==='1';")){
     after=after.replace(
      " const [error,setError]=useState(false);",
      " const [error,setError]=useState(false);\n const photoGatePassed=window.localStorage.getItem('suzuran-1916-photo-gate')==='1';"
     );
    }
    next=before+after;
   }

   // 拍照四組＋隊輔確認後：記錄拍照任務 10 分，重新載入後接著玩第一關案件題。
   next=next.replace(
    " const confirmByStaff=event=>{\n  event.preventDefault();\n  const normalizedCode=staffCode.trim().normalize('NFKC').toLowerCase();\n  const ok=normalizedCode==='okok';\n  setStaffError(!ok);\n  if(!ok)return;\n  window.localStorage.setItem(unlockKey,'1');\n  setSolved(true);\n  onSharedSolved?.(index);\n };",
    " const confirmByStaff=async event=>{\n  event.preventDefault();\n  const normalizedCode=staffCode.trim().normalize('NFKC').toLowerCase();\n  const ok=normalizedCode==='okok';\n  setStaffError(!ok);\n  if(!ok)return;\n  window.localStorage.setItem('suzuran-1916-photo-gate','1');\n  window.localStorage.setItem('suzuran-1916-photo-score','1');\n  const newsroom=window.localStorage.getItem('suzuran-newsroom')||'';\n  try{if(newsroom)await saveNewsroomProgress(newsroom,1049)}catch{}\n  window.location.reload();\n };"
   );

   // 拍照關卡只在尚未通過隊輔確認時顯示。
   next=next.replace(
    "{item.direct&&index===0&&!solved&&<PhotoCheckinChallenge index={index} solved={solved} setSolved={setSolved} onSharedSolved={onSharedSolved}/>} ",
    "{index===0&&!photoGatePassed&&!solved&&<PhotoCheckinChallenge index={index} solved={solved} setSolved={setSolved} onSharedSolved={onSharedSolved}/>} "
   );

   // 通過拍照前，不提前顯示第一關的案件題、證物與作答區。
   next=next.replace(
    "{item.question&&(!(item.direct&&index===0)||solved)&&(\n",
    "{item.question&&(index!==0||photoGatePassed||solved)&&(\n"
   );
   next=next.replace(
    "{item.evidenceDocuments?.length>0&&",
    "{item.evidenceDocuments?.length>0&&(index!==0||photoGatePassed||solved)&&"
   );
   next=next.replace(
    "{!item.direct&&!item.pending&&(!solved||replayMode)&&<form",
    "{!item.direct&&!item.pending&&(index!==0||photoGatePassed||solved)&&(!solved||replayMode)&&<form"
   );

   // 計分：第一關拍照任務 10 分 + 11 件案件各 10 分，滿分改為 120。
   next=next.replaceAll(
    ".filter(id=>Number.isInteger(id)&&id>=0&&id<11).length",
    ".filter(id=>Number.isInteger(id)&&(id===1049||(id>=1050&&id<=1060))).length"
   );
   next=next.replaceAll('Math.min(110,count*10)','Math.min(120,count*10)');
   next=next.replaceAll('Math.min(110,syncedCount*10)','Math.min(120,syncedCount*10)');
   next=next.replaceAll("+'/110'","+'/120'");
   next=next.replaceAll("+' / 110'","+' / 120'");

   return next===code?null:{code:next,map:null};
  }
 };
}
