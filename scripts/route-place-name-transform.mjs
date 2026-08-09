export function routePlaceNameTransform(){
  return {
    name:'suzuran-route-place-name-transform',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/main.jsx')) return null;
      let next=code;
      const replacements=[
        ["name:'敷島町市場（第三市場）＋榮記餅店'","name:'敷島町市場（第三市場）'"],
        ["name:'新盛橋通、櫻橋通（中山綠橋）＋進來涼冬瓜茶'","name:'新盛橋通、櫻橋通'"],
        ["name:'南園酒家'","name:'精養軒'"],
        ["name:'臺中州立圖書館（合作金庫）'","name:'臺中州立圖書館'"],
        ["name:'大正橋通（民權綠橋）'","name:'大正橋通'"],
        ["name:'柳川古道'","name:'柳川'"],
        ["name:'新富町市場（第二市場）＋鹿港阿甫師肉包'","name:'新富町市場（第二市場）'"],
        ["name:'綠空廊道'","name:'臺中驛鐵道路廊'"],
        ["duty:'追查市場遷址與地方餅店記憶'","duty:'查錄敷島町市場的交易與人流紀錄'"],
        ["duty:'辨認橋通變遷，採集街區飲食記錄'","duty:'辨認新盛橋通、櫻橋通的行走與橋梁線索'"],
        ["duty:'查錄宴飲接待與建築使用'","duty:'查錄精養軒的接待與建築使用紀錄'"],
        ["duty:'對照舊圖書館與現存立面'","duty:'翻查臺中州立圖書館的館藏與工程紀錄'"],
        ["duty:'辨認舊街道與橋梁名稱'","duty:'比對大正橋通的巡查時間與行走路線'"],
        ["duty:'沿水路前行，記錄河道與城市生活'","duty:'沿柳川比對送貨路線與巡查空檔'"],
        ["duty:'觀察六角樓、市場人流與地方飲食'","duty:'查閱新富町市場的寄放帳冊與取物紀錄'"],
        ["duty:'於舊鐵道路廊集中完成第二日解謎'","duty:'集中完成第二日工程圖碎片追查'"],
        ["<p className=\"document-intro\">臨時調查員之巡查地點，分兩日依左列次序辦理。各處並非競速通過之關卡；應就現場用途、人物生活及異動痕跡詳實記入調查簿。</p>",""]
      ];
      for(const [from,to] of replacements) next=next.split(from).join(to);
      return next===code?null:{code:next,map:null};
    }
  };
}
