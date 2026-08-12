export function forceFirstPhotoVisibleTransform(){
 return {
  name:'suzuran-force-first-photo-visible-transform',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx')||!code.includes('function PhotoCheckinChallenge('))return null;

   let next=code;

   // 這支 transform 必須在 React JSX 編譯前執行；不能使用 enforce:'post'，
   // 否則 FieldJournal 已被轉成 jsx() 呼叫，下面的 JSX/函式錨點全部對不到。

   // 第一關固定至少完成五組拍照才可交由隊輔確認。
   next=next.replaceAll('const minimumDone=completedCount>=3;','const minimumDone=completedCount>=5;');

   // 案件目錄只顯示地點；合作店名只留在案件內標題。
   next=next.replaceAll('"新盛橋通、櫻橋通（中山綠橋）＋進來涼"','"新盛橋通、櫻橋通（中山綠橋）"');
   next=next.replaceAll('"新富町市場＋鹿港阿甫師肉包"','"新富町市場（第二市場）"');

   const fieldAnchor='function FieldJournal({item,index,unlockedCount,sharedSolved,onSharedSolved}){';
   const fieldStart=next.indexOf(fieldAnchor);
   if(fieldStart<0)return null;

   if(!next.includes('suzuran-first-case-final-runtime-override')){
    const runtimeOverride=`// suzuran-first-case-final-runtime-override
// 第一關只保留拍照打卡流程；完全移除舊選擇題。
// 工程資料本身仍保留在案件資料中，但現有 FieldJournal 會等 solved=true 才顯示；
// solved 只會在完成至少五組拍照並由隊輔輸入密碼後成立。
Object.assign(mainlineCases[0],{
 direct:true,
 pending:false,
 question:null,
 questionDetails:[],
 questionHint:'',
 options:[],
 hashes:[],
 inputLabel:''
});

// 003／010：目錄純地點名，點進案件後才顯示合作店家。
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

   return next===code?null:{code:next,map:null};
  }
 };
}
