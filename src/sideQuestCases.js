import {sideQuests as sourceSideQuests} from './stationDocuments.js';

const fusionQuestion = {
  question:'富興工廠英文名稱「Fusion Space」中的「Fusion」最符合哪一項理念？',
  options:[
    {value:'a',label:'保存歷史建築原貌，不做任何改變。'},
    {value:'b',label:'將不同領域與創意融合，共同創造新的空間與價值。'},
    {value:'c',label:'將老工廠恢復成原本的生產工廠。'},
    {value:'d',label:'將舊建築改建成住宅與商業大樓。'}
  ],
  answerHashes:['179eea91584636de026b4ed8405300e00d0175e85f58f08697dbf2e4c4d5c9d6']
};

export const sideQuests = sourceSideQuests.map((quest,index)=>({
  ...quest,
  id:301+index,
  ...(index===0?fusionQuestion:{pending:true})
}));
