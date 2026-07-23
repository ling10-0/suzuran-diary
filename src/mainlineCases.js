import {documentUpdates} from './stationDocuments.js';

const southGarden = {
  title:'第三章｜精養軒舊址：阿春的托盤',
  travel:[
    '此處木造建築位於臺中驛附近繁盛街區，日治時期曾為西洋料理店「精養軒」，其後亦曾作為台拓出張所使用，建築保有日式木構架與樓層空間，從臨街位置及室內格局，可想見當年車站周邊商務往來與宴飲接待之盛。',
    '酒家不僅供應餐食，亦是商談、聚會及招待賓客之所。席間講究桌次、菜色先後與服務節奏；遊客除觀察前場陳設，也可留意廚房、樓梯與送菜動線，今日所見「南園酒家」之名為戰後沿用與再生的記憶。',
    '進行1938年遊戲時，應以精養軒及當時建築用途為主要時代背景。'
  ],
  island:[
    '阿春在樓下整理桌椅時，廚房已經升火，今天樓上有一桌商人宴客，跑堂先把桌次抄給後場，提醒哪一位不吃魚、哪一桌要先上湯，阿春剛來時只會端茶，現在已能記住一整桌的先後。',
    '客人入席後，前場不能顯得慌，有人臨時加座，有人催菜，跑堂仍要笑著應答，再轉身快步走進廚房，樓梯窄，端熱湯的人先走，空手下樓的人要貼著牆讓路，這些規矩沒有寫在菜單上。',
    '晚上最忙時，阿春聞得到每道菜的味道，卻沒有時間吃，後場會把工作餐留在一旁，等第一輪宴席稍歇，大家輪流扒幾口，師傅總說先吃的人不要把菜夾光，樓上還有人沒下來。',
    '客人離開後，桌上的菜名和帳單一起收走，阿春擦完最後一張桌子，只記得自己那天端了十幾趟樓梯，以及工作餐裡剩下的半塊豆腐。'
  ],
  dialogue:[['記者','這道菜名寫得這麼漂亮，吃完會比較會寫稿嗎？'],['鈴蘭','不會，只會比較不餓。'],['跑堂','前桌看菜名，後場看火候。記者若再問下去，廚房要先看你幾時讓路。']]
};

const postOffice = {
  title:'第五章｜郵局：寫給柳川邊的信',
  travel:[
    '郵便制度連結臺中市街、島內各地與日本內地，信件依地址、郵資、郵戳及投遞區域分類，包裹與匯款亦有各自窗口，使消息與物品得以更迅速地往返。',
    '旅客可留意郵筒、戳記、地址書寫及分揀方法。新式町名使投遞較為整齊，然而舊地名、街坊稱呼與巷弄位置仍廣為使用，郵差對地方的熟悉亦不可少。'
  ],
  island:[
    '哥哥在郵局做投遞，早上先把信件按區域分開，寫著新式町名和門牌的放一邊，地址不全的另放一疊，等大家一起辨認。',
    '有一封信只寫著「柳川邊修傘的林先生」，新來的職員說資料不足，哥哥卻記得橋邊第二條巷子有一戶人家，門口常掛著補好的雨傘，他把信放進自己的郵袋，打算走到那一帶再問。',
    '送信並不只是照地址走，店家搬過一次、巷子有兩個相同姓氏，或收件人平日不在家，都得靠鄰居和商號幫忙，有人不會寫日文地址，請代書照舊地名寫；哥哥便要把紙上的舊稱換回腳下的街道。',
    '傍晚，那封信果然送到了，林先生說寫信的人多年沒來臺中，不知道現在的町名，哥哥回郵局後只在簿上記「投遞完了」，沒有寫他問了三家店才找到那扇門。'
  ],
  dialogue:[['記者','只寫「柳川邊會修傘的阿伯」，也送得到？'],['郵差','你們報社地址寫得很完整，信還不是常常送錯人。'],['鈴蘭','他說得有道理。'],['記者','妳應該站在委託人這邊。'],['鈴蘭','我站在信能送到的那邊。']]
};

const cooperativeBank = {
  title:'第四章｜合作金庫舊址：書架還在門牌以前',
  travel:[
    '臺中州立圖書館新館落成於昭和四年（1929），館內設有書庫、一般閱覽室、婦人閱覽室、兒童閱覽室及新聞雜誌閱覽室，可供市民閱讀報刊與圖書。入館者依閱覽規則取用資料，館內保持安靜，讀畢後將報刊放回原處。',
    '圖書館除收藏書籍外，也推廣地方圖書館事業與社會教育活動。旅客行經市街時，可由館舍立面與往來讀者看見臺中文教設施的發展；若遇雨天，更適合入內閱報、休息與查詢各地消息。'
  ],
  island:[
    '我常在圖書館的閱覽室裡抄報上的消息；館員不讓我們把書桌搬到窗邊，說那裡留給讀得更久的人。',
    '傍晚收館前，借閱證和報紙都要歸回原位。我把今天沒抄完的題目記在紙角，明天再來找答案。'
  ],
  dialogue:[['記者','這裡的書這麼多，能不能把一整排都借回報社？'],['鈴蘭','可以。只要你先找到一間比報社還大的書房。'],['館員','還有一個願意替你搬書的人。'],['記者','那我先借一張椅子。'],['鈴蘭','椅子可以，別把閱覽室的安靜也借走。']]
};

const secondMarket = {
  title:'第八章｜第二市場：最後留下的一碗湯',
  travel:[
    '第二市場位於臺中市街核心，市場建築採集中式配置，肉類、魚貨、蔬菜、雜貨與熟食分區販售。其位置鄰近商業街與行政區，顧客除附近居民，亦有商人、職員及往來旅客。',
    '市場內外飲食選擇豐富，適合午間或傍晚探訪。除營業時的熱鬧景象，亦可觀察開市前備料、午後補貨及收攤清點；市場的一日，遠比旅客用餐的片刻更長。'
  ],
  island:[
    '姨母在第二市場賣湯，天還沒亮，她先到攤位升火，把前一晚備好的材料放進鍋裡，我負責洗碗和提水，等第一批客人進市場，湯已經滾了很久。',
    '午間最多的是附近職員和做工的人，他們坐不久，吃完便走，姨母記得誰不要蔥、誰月底才結帳，也記得有個搬貨工總在別人吃完以後才來。',
    '下午收攤前，她會留下最後一碗，那個人有時加班，根本沒有出現，我問湯賣不掉怎麼辦，她說自己喝掉就好，反正忙了一天也還沒正經吃飯。',
    '姨母從不把這件事說成照顧誰，她只是看到那個空位，便知道有人還在工作，市場的鐵門慢慢關上時，她仍會讓鍋子多熱一會兒。'
  ],
  dialogue:[['記者','如果那個人今天沒來，這碗湯怎麼辦？'],['老闆娘','我喝掉。'],['記者','那妳不是每天都要多煮一碗？'],['老闆娘','對啊，不然怎麼知道他今天有沒有好好下工？']]
};

export const mainlineCases = [
  {...documentUpdates[1],day:1,type:'craft',code:'庶務秘第〇一號',taskTitle:'拾光琉璃',inputLabel:'無須查核',hint:'完成琉璃手作後，可直接翻閱兩種城市記錄。',label:'1916工坊',direct:true},
  {...documentUpdates[0],travelImage:'/suzuran-diary/assets/travel/third.jpg',day:1,type:'market',code:'商工第〇二號',taskTitle:'第三市場',inputLabel:'現場答案',label:'第三市場',pending:true},
  {...southGarden,travelImage:'/suzuran-diary/assets/travel/change.jpg',day:1,type:'food',code:'商工第〇三號',taskTitle:'精養軒舊址',inputLabel:'現場答案',label:'南園酒家／精養軒舊址',pending:true},
  {...documentUpdates[4],travelImage:'/suzuran-diary/assets/travel/shiyakusho.jpg',day:1,type:'office',code:'庶務秘第〇四號',taskTitle:'市役所',inputLabel:'現場答案',label:'臺中市役所',pending:true},
  {...postOffice,travelImage:'/suzuran-diary/assets/travel/post.jpg',day:1,type:'postal',code:'郵便第〇五號',taskTitle:'郵局',inputLabel:'現場答案',label:'臺中郵局',pending:true},
  {...cooperativeBank,travelImage:'/suzuran-diary/assets/travel/library.jpg',day:1,type:'commerce',code:'商工第〇六號',taskTitle:'合作金庫舊址',inputLabel:'現場答案',label:'合作金庫舊址',pending:true},
  {...documentUpdates[6],travelImage:'/suzuran-diary/assets/travel/yanagawa.jpg',day:1,type:'river',code:'河川第〇七號',taskTitle:'柳川古道',inputLabel:'現場答案',label:'柳川古道',pending:true},
  {...secondMarket,travelImage:'/suzuran-diary/assets/travel/second.jpg',day:1,type:'market',code:'商工第〇八號',taskTitle:'第二市場',inputLabel:'無須查核',label:'第二市場',direct:true},
  {...documentUpdates[8],travelImage:'/suzuran-diary/assets/travel/bridge.jpg',day:2,type:'bridge',code:'土木第〇九號',taskTitle:'中山綠橋',inputLabel:'現場答案',hint:'中山綠橋跨越哪一條水道？',hashes:['369435c8f8c8d6ee2d1a650bcacb0a3ccb09c51294761874daf6675fb69c7d83'],label:'中山綠橋',pending:false},
  {...documentUpdates[10],travelImage:'/suzuran-diary/assets/travel/bookstore.jpg',day:2,type:'book',code:'文教第〇十號',taskTitle:'中央書局',inputLabel:'現場答案',hint:'中央書局供應哪一種出版品？可輸入「報紙」或「雜誌」。',hashes:['78d80cd2d39e7c63eaf36b511461e5359fefb6e78e50f2aa108e5c26a68b6e40','056a44f8c974afee13bca915c8b5ff7f909ac74da1c50f326f7b3f1bc2164f6a'],label:'中央書局',pending:false}
];
