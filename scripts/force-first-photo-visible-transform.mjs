export function forceFirstPhotoVisibleTransform(){
 return {
  name:'suzuran-force-first-photo-visible-transform',
  enforce:'post',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx')||!code.includes('function PhotoCheckinChallenge('))return null;

   let next=code;

   // 第一關固定以「至少完成五組拍照」作為工程資料的解鎖門檻。
   // 即使前面其他 transform 留有舊門檻，這裡也在最後階段統一修正為五組。
   next=next.replaceAll('const minimumDone=completedCount>=3;','const minimumDone=completedCount>=5;');

   // 案件目錄只顯示地點名；店名只留在點進案件後的標題。
   // directory-title-transform 使用 JSON.stringify，因此這裡精準修改雙引號版本，不碰案件內的單引號標題設定。
   next=next.replaceAll('"新盛橋通、櫻橋通（中山綠橋）＋進來涼"','"新盛橋通、櫻橋通（中山綠橋）"');
   next=next.replaceAll('"新富町市場＋鹿港阿甫師肉包"','"新富町市場（第二市場）"');

   const fieldAnchor='function FieldJournal({item,index,unlockedCount,sharedSolved,onSharedSolved}){';
   const fieldStart=next.indexOf(fieldAnchor);
   if(fieldStart<0)return null;
   const fieldEnd=next.indexOf('\nfunction NewsroomEntry',fieldStart);
   if(fieldEnd<0)return null;

   // 重要：案件資料會被多個 transform 反覆 Object.assign。
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
 hashes:[],
 inputLabel:'',
 evidenceDocuments:suzuranFirstPhotoGateReady?(mainlineCases[0].evidenceDocuments||[]):[]
});

// 003／010：案件目錄維持純地點名，進入案件後才顯示合作店家名稱。
if(mainlineCases[2]) Object.assign(mainlineCases[2],{
 taskTitle:'新盛橋通、櫻橋通（中山綠橋）＋進來涼',
 directoryTitle:'新盛橋通、櫻橋通（中山綠橋）',
 label:'新盛橋通、櫻橋通（中山綠橋）＋進來涼',
 title:'新盛橋通、櫻橋通（中山綠橋）＋進來涼'
});
if(mainlineCases[9]) Object.assign(mainlineCases[9],{
 taskTitle:'新富町市場（第二市場）＋鹿港肉包',
 directoryTitle:'新富町市場（第二市場）',
 label:'新富町市場（第二市場）＋鹿港肉包',
 title:'新富町市場（第二市場）＋鹿港肉包'
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

   // 第一關拍照區固定顯示：工程圖解鎖後，尚未完成的第 6～10 組仍可繼續操作。
   const queryAnchor='<section className="gazette-query">';
   const queryIndex=field.indexOf(queryAnchor);
   if(queryIndex<0)return null;
   field=field.slice(0,queryIndex)+render+'\n\n   '+field.slice(queryIndex);

   // 第一關不再有選擇題：案件問題與作答表單一律不顯示。
   field=field.replace(/\{(?:index!==0&&)*item\.question&&/g,'{index!==0&&item.question&&');
   field=field.replace(/\{!item\.direct&&!item\.pending&&\(!solved\|\|replayMode\)&&<form/g,'{index!==0&&!item.direct&&!item.pending&&(!solved||replayMode)&&<form');
   field=field.replace(/\{!item\.direct&&!item\.pending&&!solved&&<form/g,'{index!==0&&!item.direct&&!item.pending&&!solved&&<form');
   field=field.replace(/\{!item\.direct&&!item\.pending&&!solved&&\(/g,'{index!==0&&!item.direct&&!item.pending&&!solved&&(');

   // 工程圖／工程人員名冊只有完成至少五組拍照並通過隊輔確認後才會保留在 item 中。
   // 解鎖後只開放工程資料，不移除拍照區，因此其餘拍照關卡仍可繼續玩。
   field=field.replace(/\{item\.evidenceDocuments\?\.length>0&&(?:\(index!==0\|\|photoGatePassed\|\|solved\)&&)?/g,'{item.evidenceDocuments?.length>0&&(index!==0||photoGatePassed)&&');

   next=next.slice(0,actualFieldStart)+field+next.slice(actualFieldEnd);
   return next===code?null:{code:next,map:null};
  }
 };
}
