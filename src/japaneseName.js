const surnameRules = {
  陳:['穎川','松谷','山本','峰山','高島','松田','田川','中里','永川','東野','東川','東間','安東','成田','永田','津田','澤田','竹田','金田','乃木田','元田','東田','東山','東'],
  林:['神田','高林','小林','長林','林田','大林','竹林','森川','三木實','三木'],
  張:['長田','長本','豐田','清河','弓長','長谷川','長村','長岡'],
  黃:['廣內','廣田','橋本','陸本','橫山','廣上','岡田'],
  李:['中村','岩里','宮原','松本','樺島','井下'],
  吳:['梅村','安藤','朝光','梅里','吳正','矢口'],
  劉:['金子','泉川','中山','金岡','金本'],
  蔡:['吉本','齋藤','神田','佐井','豐田'],
  何:['河本','和田','河村','河元','川村'],
  蔣:['松井','石岡','石田'],
  謝:['天川','大倉','市村'],
  鄭:['平島','平戶','大木'],
  呂:['宮本','宮下','宮田'],
  郭:['大原','賀來','香久'],
  江:['江本','江田','江戶'],
  高:['高山','高野','高島'],
  賴:['瀨本','廣瀨','瀨上'],
  蘇:['安田','和同','安武'],
  紀:['飯村','安村'],
  孫:['中山','石黑'],
  許:['大山','小西'],
  彭:['吉江','古川'],
  柯:['松野','青山'],
  曾:['八田','增田'],
  沈:['青海'],
  凌:['鈴原'],
  莊:['本庄'],
  朱:['福田'],
  盧:['南鄉'],
  簡:['竹內','竹間'],
  徐:['福山'],
  范:['高原'],
  宋:['梅本'],
  汪:['汪元'],
  柳:['柳村'],
  王:['王野'],
  方:['松方','練方'],
  丘:['岡本','岡村','岡田'],
  邱:['岡本','岡村','岡田'],
  田:['田村','原田','本田','坂田'],
  古:['古井','古原','古木'],
  石:['石橋','石原','石井','大石'],
  周:['武岡','武光','吉田','吉本','吉岡'],
  施:['施本'],
  唐:['唐澤','唐田'],
  連:['連沼','連本','金重'],
  顏:['彥山'],
  葉:['稻葉','葉室','葉山'],
  楊:['楊川','柳生','柳村']
};

const compoundSurnames = ['歐陽','司馬','上官','諸葛'];

function stableIndex(text,length){
  let hash=2166136261;
  for(const character of text){
    hash^=character.codePointAt(0);
    hash=Math.imul(hash,16777619);
  }
  return (hash>>>0)%length;
}

export function createJapaneseName(rawName){
  const realName=rawName.normalize('NFKC').replace(/[\s・·]+/g,'').slice(0,20);
  if(realName.length<2)return {error:'請輸入完整的真實姓名。'};
  const originalSurname=compoundSurnames.find(surname=>realName.startsWith(surname))||realName[0];
  const givenName=realName.slice(originalSurname.length);
  const candidates=surnameRules[originalSurname];
  if(!candidates){
    return {realName,originalSurname,givenName,japaneseSurname:originalSurname,japaneseName:realName,matched:false};
  }
  const japaneseSurname=candidates[stableIndex(realName,candidates.length)];
  return {realName,originalSurname,givenName,japaneseSurname,japaneseName:japaneseSurname+givenName,matched:true};
}

export {surnameRules};
