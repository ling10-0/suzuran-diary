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

   // 拍照至少三組＋隊輔確認後：每一組核發 2 分，再重新載入接著玩第一關案件題。
   next=next.replace(
    " const confirmByStaff=event=>{\n  event.preventDefault();\n  const normalizedCode=staffCode.trim().normalize('NFKC').toLowerCase();\n  const ok=normalizedCode==='okok';\n  setStaffError(!ok);\n  if(!ok)return;\n  window.localStorage.setItem(unlockKey,'1');\n  setSolved(true);\n  onSharedSolved?.(index);\n };",
    " const confirmByStaff=async event=>{\n  event.preventDefault();\n  const normalizedCode=staffCode.trim().normalize('NFKC').toLowerCase();\n  const ok=normalizedCode==='okok';\n  setStaffError(!ok);\n  if(!ok)return;\n  const completedPhotoIds=photoTasks.filter(task=>photoChecks[task.no]).map(task=>1030+task.no);\n  window.localStorage.setItem('suzuran-1916-photo-gate','1');\n  window.localStorage.setItem('suzuran-1916-photo-score',String(completedPhotoIds.length*2));\n  const newsroom=window.localStorage.getItem('suzuran-newsroom')||'';\n  try{if(newsroom)await Promise.all(completedPhotoIds.map(progressId=>saveNewsroomProgress(newsroom,progressId)))}catch{}\n  window.location.reload();\n };"
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

   // 計分：11 件案件各 10 分（110 分）＋10 個拍照點各 2 分（20 分），滿分 130。
   // 拍照只在隊輔確認後寫入 1031～1040，因此未確認的自拍不會加分。
   next=next.replaceAll(
    ".filter(id=>Number.isInteger(id)&&id>=0&&id<11).length",
    ".filter(id=>Number.isInteger(id)&&(id>=1050&&id<=1060)).length"
   );
   next=next.replaceAll(
    ".filter(id=>Number.isInteger(id)&&(id===1049||(id>=1050&&id<=1060))).length",
    ".filter(id=>Number.isInteger(id)&&(id>=1050&&id<=1060)).length"
   );

   // 將原本 count*10 的總分公式改成「案件分＋拍照分」。
   next=next.replaceAll(
    "const score=Math.min(110,count*10);",
    "const photoCount=(sharedProgress||[]).filter(id=>Number.isInteger(id)&&id>=1031&&id<=1040).length;const score=Math.min(130,count*10+photoCount*2);"
   );
   next=next.replaceAll(
    "const score=Math.min(120,count*10);",
    "const photoCount=(sharedProgress||[]).filter(id=>Number.isInteger(id)&&id>=1031&&id<=1040).length;const score=Math.min(130,count*10+photoCount*2);"
   );
   next=next.replaceAll(
    "const score=count===null?null:Math.min(110,count*10);",
    "const photoCount=count===null?null:(sharedProgress||[]).filter(id=>Number.isInteger(id)&&id>=1031&&id<=1040).length;const score=count===null?null:Math.min(130,count*10+photoCount*2);"
   );
   next=next.replaceAll(
    "const score=count===null?null:Math.min(120,count*10);",
    "const photoCount=count===null?null:(sharedProgress||[]).filter(id=>Number.isInteger(id)&&id>=1031&&id<=1040).length;const score=count===null?null:Math.min(130,count*10+photoCount*2);"
   );
   next=next.replaceAll(
    "const score=syncedCount===null?null:Math.min(110,syncedCount*10);",
    "const photoCount=syncedCount===null?null:(sharedProgress||[]).filter(id=>Number.isInteger(id)&&id>=1031&&id<=1040).length;const score=syncedCount===null?null:Math.min(130,syncedCount*10+photoCount*2);"
   );
   next=next.replaceAll(
    "const score=syncedCount===null?null:Math.min(120,syncedCount*10);",
    "const photoCount=syncedCount===null?null:(sharedProgress||[]).filter(id=>Number.isInteger(id)&&id>=1031&&id<=1040).length;const score=syncedCount===null?null:Math.min(130,syncedCount*10+photoCount*2);"
   );

   next=next.replaceAll("+'/110'","+'/130'");
   next=next.replaceAll("+'/120'","+'/130'");
   next=next.replaceAll("+' / 110'","+' / 130'");
   next=next.replaceAll("+' / 120'","+' / 130'");

   // 新級距：拍照 bonus 可以補分，但中央報社仍需要完成大部分主線。
   next=next.replaceAll("score>=90?'中央報社':score>=60?'全島報社':score>=30?'州級報社':'地方報社'","score>=100?'中央報社':score>=70?'全島報社':score>=40?'州級報社':'地方報社'");

   return next===code?null:{code:next,map:null};
  }
 };
}
