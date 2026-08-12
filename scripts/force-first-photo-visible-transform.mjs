export function forceFirstPhotoVisibleTransform(){
 return {
  name:'suzuran-force-first-photo-visible-transform',
  enforce:'post',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx')||!code.includes('function PhotoCheckinChallenge('))return null;

   let next=code;

   const fieldAnchor='function FieldJournal({item,index,unlockedCount,sharedSolved,onSharedSolved}){';
   const fieldStart=next.indexOf(fieldAnchor);
   if(fieldStart<0)return null;
   const fieldEnd=next.indexOf('\nfunction NewsroomEntry',fieldStart);
   if(fieldEnd<0)return null;

   // 重要：第一關資料會被多個 transform 反覆 Object.assign。
   // 所以不能在 const puzzles 前覆寫，必須在所有案件設定都完成後、FieldJournal 宣告前做最後一次 runtime override。
   if(!next.includes('suzuran-first-case-final-runtime-override')){
    const runtimeOverride=`// suzuran-first-case-final-runtime-override
const suzuranFirstPhotoGateReady=window.localStorage.getItem('suzuran-1916-photo-gate')==='1';
Object.assign(mainlineCases[0],{
 direct:true,
 pending:false,
 question:null,
 questionDetails:[],
 questionHint:'',
 options:[],
 inputLabel:'',
 evidenceDocuments:suzuranFirstPhotoGateReady?(mainlineCases[0].evidenceDocuments||[]):[]
});
`;
    next=next.slice(0,fieldStart)+runtimeOverride+next.slice(fieldStart);
   }

   // runtime override 插入後重新抓 FieldJournal 範圍。
   const actualFieldStart=next.indexOf(fieldAnchor);
   const actualFieldEnd=next.indexOf('\nfunction NewsroomEntry',actualFieldStart);
   let field=next.slice(actualFieldStart,actualFieldEnd);

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

   // 雙重保險：第一關案件問題與作答表單一律不顯示。
   field=field.replace(/\{(?:index!==0&&)*item\.question&&/g,'{index!==0&&item.question&&');
   field=field.replace(/\{!item\.direct&&!item\.pending&&\(!solved\|\|replayMode\)&&<form/g,'{index!==0&&!item.direct&&!item.pending&&(!solved||replayMode)&&<form');
   field=field.replace(/\{!item\.direct&&!item\.pending&&!solved&&<form/g,'{index!==0&&!item.direct&&!item.pending&&!solved&&<form');
   field=field.replace(/\{!item\.direct&&!item\.pending&&!solved&&\(/g,'{index!==0&&!item.direct&&!item.pending&&!solved&&(');

   // 工程圖／工程人員名冊只有 photo gate 成功後才會保留在 item 中。
   // 這裡不再依 solved 狀態放行，避免舊進度提前看到資料。
   field=field.replace(/\{item\.evidenceDocuments\?\.length>0&&(?:\(index!==0\|\|photoGatePassed\|\|solved\)&&)?/g,'{item.evidenceDocuments?.length>0&&(index!==0||photoGatePassed)&&');

   next=next.slice(0,actualFieldStart)+field+next.slice(actualFieldEnd);
   return next===code?null:{code:next,map:null};
  }
 };
}
