export function forceFirstPhotoVisibleTransform(){
 return {
  name:'suzuran-force-first-photo-visible-transform',
  enforce:'post',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx')||!code.includes('function PhotoCheckinChallenge('))return null;

   let next=code;

   // 第一關只保留拍照打卡＋工程資料，不再有任何選擇題。
   next=next.replace(
    "Object.assign(mainlineCases[0], {\n  direct: false,",
    "Object.assign(mainlineCases[0], {\n  direct: true,"
   );

   const puzzleAnchor='const puzzles = mainlineCases;';
   if(next.includes(puzzleAnchor)&&!next.includes('suzuran-first-case-no-quiz')){
    next=next.replace(
     puzzleAnchor,
     "// suzuran-first-case-no-quiz\nObject.assign(mainlineCases[0],{direct:true,question:null,questionDetails:[],questionHint:'',options:[],inputLabel:''});\n"+puzzleAnchor
    );
   }

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

   // 第一關案件問題區一律不顯示。
   field=field.replace(/\{(?:index!==0&&)*item\.question&&/g,'{index!==0&&item.question&&');

   // 第一關所有作答表單一律不顯示，避免任何 A～D 與送交查核殘留。
   field=field.replace(/\{!item\.direct&&!item\.pending&&\(!solved\|\|replayMode\)&&<form/g,'{index!==0&&!item.direct&&!item.pending&&(!solved||replayMode)&&<form');
   field=field.replace(/\{!item\.direct&&!item\.pending&&!solved&&<form/g,'{index!==0&&!item.direct&&!item.pending&&!solved&&<form');
   field=field.replace(/\{!item\.direct&&!item\.pending&&!solved&&\(/g,'{index!==0&&!item.direct&&!item.pending&&!solved&&(');

   // 第一關工程圖／工程人員名冊只能在五項拍照完成且隊輔確認後開放。
   field=field.replace(/\{item\.evidenceDocuments\?\.length>0&&(?:\(index!==0\|\|photoGatePassed\|\|solved\)&&)?/g,'{item.evidenceDocuments?.length>0&&(index!==0||photoGatePassed)&&');

   next=next.slice(0,fieldStart)+field+next.slice(fieldEnd);
   return next===code?null:{code:next,map:null};
  }
 };
}
