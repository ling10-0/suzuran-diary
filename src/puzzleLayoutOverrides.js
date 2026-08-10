import {saveNewsroomProgress} from './sharedProgress.js';

const caseMeta = {
  3:{label:'新盛橋通、櫻橋通',code:'巡查第〇三號',task:'新盛橋通、櫻橋通',hint:'先完成橋上觀察；確認現場線索後，再比對茶攤帳本與橋邊紀錄。'},
  4:{label:'精養軒',code:'商工第〇四號',task:'精養軒',hint:'先確認建築後來的機構用途；完成後，再比對當晚留下的接待、廚房與值班紀錄。'},
  5:{label:'臺中州立圖書館',code:'典藏第〇五號',task:'臺中州立圖書館',hint:'第四站留下的四位數是館藏搜尋的入口。輸入正確後，請比較四筆年報的年份、登錄日期、館藏位置與狀態。'},
  6:{label:'臺中市役所',code:'警務第〇六號',task:'臺中市役所',hint:'兩份文件記錄的是同一批技術人員，但用詞、日期與追查範圍並不完全相同。請先看原始文書，再判斷哪一處變化最值得追查。'},
  7:{label:'大正橋通',code:'巡查第〇七號',task:'大正橋通',hint:'先查看兩份橋邊紀錄，核對巡查時間、路線與居民口述，再判斷「無異常」是否足以成立。'},
  8:{label:'中央書局',code:'文教第〇八號',task:'中央書局',hint:'依序閱讀匿名文章、退稿紀錄與最後殘頁，交叉比對三份資料後完成中央書局查核。'},
  9:{label:'柳川古道',code:'河岸第〇九號',task:'柳川古道',hint:'沿柳川舊地圖依序還原青木與「蘭」的移動路線，再比對巡查空檔與兩人的行動模式。'},
  10:{label:'新富町市場',code:'市場第〇十號',task:'新富町市場',hint:'從舊寄放帳冊找出青先生與阿蘭共同使用的置物箱，再整理箱內不同年代的物件，判斷兩人的關係。'}
};

const bookstoreImages = [
  {src:'/suzuran-diary/assets/puzzles/central-bookstore/anonymous-article.png',title:'資料一｜匿名文章'},
  {src:'/suzuran-diary/assets/puzzles/central-bookstore/rejection-record.png',title:'資料二｜退稿紀錄'},
  {src:'/suzuran-diary/assets/puzzles/central-bookstore/final-fragment.png',title:'資料三｜最後殘頁'}
];

const liuchuanAssets = {
  map:'/suzuran-diary/assets/puzzles/liuchuan/liuchuan-map.png',
  testimony:'/suzuran-diary/assets/puzzles/liuchuan/resident-testimony.png',
  patrol:'/suzuran-diary/assets/puzzles/liuchuan/patrol-record.png',
  receipts:[1,2,3,4].map(no=>'/suzuran-diary/assets/puzzles/liuchuan/delivery-receipt-'+no+'.png')
};

const liuchuanPoints = {
  A:{title:'A｜北側橋口',desc:'警備人員最容易看見行人的位置。'},
  B:{title:'B｜河岸階梯',desc:'可以從道路下降至河岸步道。'},
  C:{title:'C｜步道轉折處',desc:'道路視線受到橋體與植栽遮擋，適合短暫停留。'},
  D:{title:'D｜南側送貨點',desc:'舊送貨收據中經常出現的位置。'}
};

function getCaseNumber(){
  const issue=document.querySelector('.gazette-case-head .gazette-issue b');
  const issueMatch=issue?.textContent.match(/(\d+)/);
  if(issueMatch)return Number(issueMatch[1]);
  const pager=document.querySelector('.case-pager span');
  const pagerMatch=pager?.textContent.match(/第\s*(\d+)/);
  return pagerMatch?Number(pagerMatch[1]):null;
}

function setText(node,text){
  if(node&&node.textContent.trim()!==text)node.textContent=text;
}

function updateDirectory(){
  document.querySelectorAll('.case-file').forEach(card=>{
    const no=Number(card.querySelector(':scope > span')?.textContent.trim());
    const meta=caseMeta[no];
    if(!meta)return;
    setText(card.querySelector('small'),meta.code);
    setText(card.querySelector('h3'),meta.label);
    setText(card.querySelector('p'),meta.hint);
  });
}

function updateCaseHeader(caseNumber){
  const meta=caseMeta[caseNumber];
  if(!meta)return;
  const header=document.querySelector('.gazette-case-head');
  if(header){
    setText(header.querySelector(':scope > div:nth-child(2) p'),meta.code+'・第 '+(caseNumber<=8?'1':'2')+' 日調查記錄');
    setText(header.querySelector(':scope > div:nth-child(2) h2'),meta.label);
  }
  const query=document.querySelector('.gazette-query');
  if(query){
    setText(query.querySelector(':scope > h3'),meta.task);
    setText(query.querySelector(':scope > p'),meta.hint);
  }
}

function makeBookstoreSheet(sheet){
  if(sheet.dataset.layoutOverride==='bookstore')return;
  sheet.dataset.layoutOverride='bookstore';
  sheet.innerHTML='';

  const small=document.createElement('small');
  small.textContent='案件查核資料';
  const title=document.createElement('h4');
  title.textContent='中央書局｜三份舊檔交叉查核';
  const intro=document.createElement('p');
  intro.textContent='請依序查看三份資料。先辨認匿名文章留下的文字線索，再對照退稿紀錄，最後用殘頁確認前後內容是否能互相接合。';
  const note=document.createElement('p');
  note.className='puzzle-inline-note';
  note.textContent='閱讀順序：匿名文章 → 退稿紀錄 → 最後殘頁。三張圖皆可直接在網站上查看，不需另外索取實體文件。';
  const grid=document.createElement('div');
  grid.className='central-bookstore-puzzle-grid';

  bookstoreImages.forEach((item,index)=>{
    const figure=document.createElement('figure');
    const caption=document.createElement('figcaption');
    caption.innerHTML='<span>'+String(index+1).padStart(2,'0')+'</span><b>'+item.title+'</b>';
    const img=document.createElement('img');
    img.src=item.src;
    img.alt=item.title;
    img.loading='lazy';
    figure.append(caption,img);
    grid.appendChild(figure);
  });

  sheet.append(small,title,intro,note,grid);
}

function optionalImage(src,alt,className='liuchuan-document-image'){
  const img=document.createElement('img');
  img.src=src;
  img.alt=alt;
  img.className=className;
  img.loading='lazy';
  img.onerror=()=>img.remove();
  return img;
}

function createLiuchuanMap(showAoki=false,showLan=false){
  const wrap=document.createElement('div');
  wrap.className='liuchuan-map-wrap';
  const image=optionalImage(liuchuanAssets.map,'柳川舊地圖','liuchuan-map-image');
  wrap.appendChild(image);

  const diagram=document.createElement('div');
  diagram.className='liuchuan-map-diagram';
  diagram.innerHTML=`
    <div class="liuchuan-river"></div>
    <div class="liuchuan-bridge bridge-top"></div>
    <div class="liuchuan-bridge bridge-bottom"></div>
    <span class="liuchuan-point point-a"><b>A</b><small>北側橋口</small></span>
    <span class="liuchuan-point point-b"><b>B</b><small>河岸階梯</small></span>
    <span class="liuchuan-point point-c"><b>C</b><small>步道轉折處</small></span>
    <span class="liuchuan-point point-d"><b>D</b><small>南側送貨點</small></span>
  `;
  if(showAoki){
    const route=document.createElement('div');
    route.className='liuchuan-route route-aoki';
    route.innerHTML='<span>A</span><i>→</i><span>B</span><i>→</i><span>C</span><i>→</i><span>D</span>';
    diagram.appendChild(route);
  }
  if(showLan){
    const route=document.createElement('div');
    route.className='liuchuan-route route-lan';
    route.innerHTML='<span>D</span><i>→</i><span>A</span><i>→</i><span>B</span><i>→</i><span>C</span>';
    diagram.appendChild(route);
  }
  wrap.appendChild(diagram);
  return wrap;
}

function createRouteBuilder(labels,correct,onCorrect,feedbackText){
  const wrap=document.createElement('div');
  wrap.className='liuchuan-route-builder';
  const chosen=[];

  const pool=document.createElement('div');
  pool.className='liuchuan-card-pool';
  const slots=document.createElement('div');
  slots.className='liuchuan-route-slots';
  const feedback=document.createElement('p');
  feedback.className='liuchuan-answer-feedback';

  const render=()=>{
    pool.innerHTML='';
    slots.innerHTML='';
    labels.forEach(code=>{
      if(chosen.includes(code))return;
      const button=document.createElement('button');
      button.type='button';
      button.draggable=true;
      button.dataset.code=code;
      button.innerHTML='<b>'+code+'</b><span>'+liuchuanPoints[code].title.split('｜')[1]+'</span>';
      button.addEventListener('click',()=>{chosen.push(code);render();});
      button.addEventListener('dragstart',event=>event.dataTransfer.setData('text/plain',code));
      pool.appendChild(button);
    });

    for(let index=0;index<4;index+=1){
      const slot=document.createElement('div');
      slot.className='liuchuan-route-slot '+(chosen[index]?'filled':'');
      slot.dataset.index=index;
      if(chosen[index]){
        slot.innerHTML='<small>'+String(index+1).padStart(2,'0')+'</small><b>'+chosen[index]+'</b><span>'+liuchuanPoints[chosen[index]].title.split('｜')[1]+'</span>';
        slot.addEventListener('click',()=>{chosen.splice(index,1);feedback.textContent='';render();});
      }else{
        slot.innerHTML='<small>'+String(index+1).padStart(2,'0')+'</small><span>拖曳或點選位置</span>';
      }
      slot.addEventListener('dragover',event=>event.preventDefault());
      slot.addEventListener('drop',event=>{
        event.preventDefault();
        const code=event.dataTransfer.getData('text/plain');
        if(!code||chosen.includes(code))return;
        chosen.splice(index,0,code);
        if(chosen.length>4)chosen.pop();
        feedback.textContent='';
        render();
      });
      slots.appendChild(slot);
    }
  };

  const check=document.createElement('button');
  check.type='button';
  check.className='liuchuan-primary-button';
  check.textContent='確認路線';
  check.addEventListener('click',()=>{
    if(chosen.length!==4){feedback.textContent='請先排完四個位置。';feedback.dataset.ok='false';return;}
    if(chosen.join('')!==correct.join('')){feedback.textContent='路線仍有矛盾，請重新比對時間與證詞。';feedback.dataset.ok='false';return;}
    feedback.textContent=feedbackText;
    feedback.dataset.ok='true';
    check.disabled=true;
    pool.querySelectorAll('button').forEach(button=>button.disabled=true);
    onCorrect?.();
  });

  render();
  wrap.append(pool,slots,check,feedback);
  return wrap;
}

function makeLiuchuanSheet(sheet){
  if(sheet.dataset.layoutOverride==='liuchuan-v2')return;
  sheet.dataset.layoutOverride='liuchuan-v2';
  sheet.innerHTML='';

  const query=sheet.closest('.gazette-query');
  query?.querySelectorAll(':scope > form, :scope > .gazette-approved').forEach(node=>node.style.display='none');

  const small=document.createElement('small');
  small.textContent='案件查核資料・第九號';
  const title=document.createElement('h4');
  title.textContent='柳川古道｜秘密聯絡路線';
  const intro=document.createElement('div');
  intro.className='liuchuan-story-intro';
  intro.innerHTML=`
    <h5>故事嵌入</h5>
    <p>沿著柳川整理舊送貨紀錄時，工作人員發現幾張沒有寫完整姓名的收據。其中一張只留下「蘭」字，背面還有熟悉的藍綠色記號。</p>
    <p>附近居民回憶，早年曾有一名外地男子抱著紙筒沿河行走；幾年後，又有一名年輕女子固定沿著相似路線送藥、食物和信件。她不會直接走到目的地，常在橋邊折返或繞路。</p>
    <p class="puzzle-inline-note">請依橋梁、石階、送貨位置與巡查時間，還原兩人的行走路線，並判斷這名留下「蘭」字的女子，是否可能與青木長期保持聯絡。</p>
    <p>本關全程在網站上進行；A～D 四個位置只存在於關卡地圖中，不對應現場需要尋找的真實物件。</p>
  `;

  const progress=document.createElement('div');
  progress.className='liuchuan-stage-progress';
  progress.innerHTML=Array.from({length:6},(_,i)=>'<span data-step="'+(i+1)+'">0'+(i+1)+'</span>').join('');
  const stage=document.createElement('section');
  stage.className='liuchuan-stage';
  let currentStep=1;

  const setStep=next=>{
    currentStep=next;
    progress.querySelectorAll('span').forEach(node=>{
      const no=Number(node.dataset.step);
      node.classList.toggle('active',no===next);
      node.classList.toggle('done',no<next);
    });
    renderStage();
    stage.scrollIntoView({behavior:'smooth',block:'start'});
  };

  const nextButton=(label,next)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='liuchuan-primary-button';
    button.textContent=label;
    button.addEventListener('click',()=>setStep(next));
    return button;
  };

  const renderStage=()=>{
    stage.innerHTML='';

    if(currentStep===1){
      stage.innerHTML='<header><small>第一階段</small><h5>閱讀柳川舊地圖</h5><p>先熟悉四個虛構調查點，再開始閱讀人物紀錄。</p></header>';
      stage.appendChild(createLiuchuanMap());
      const pointGrid=document.createElement('div');
      pointGrid.className='liuchuan-point-grid';
      Object.values(liuchuanPoints).forEach(point=>{
        const article=document.createElement('article');
        article.innerHTML='<b>'+point.title+'</b><p>'+point.desc+'</p>';
        pointGrid.appendChild(article);
      });
      stage.append(pointGrid,nextButton('查看第一份紀錄',2));
    }

    if(currentStep===2){
      stage.innerHTML=`<header><small>第二階段</small><h5>還原青木的行走路線</h5></header>`;
      const evidence=document.createElement('div');
      evidence.className='liuchuan-evidence-card';
      evidence.appendChild(optionalImage(liuchuanAssets.testimony,'居民證詞'));
      const text=document.createElement('div');
      text.innerHTML='<small>居民證詞</small><p>「那名外地男子從北側橋口走來，手中抱著一支長紙筒。他看見巡查人員後沒有繼續向前，而是折返回河岸階梯。後來有人在南側看見他離開，但他手上的紙筒已經不見了。」</p>';
      evidence.appendChild(text);
      stage.appendChild(evidence);
      const builder=createRouteBuilder(['C','A','D','B'],['A','B','C','D'],()=>{
        const map=createLiuchuanMap(true,false);
        map.classList.add('liuchuan-result-map');
        stage.append(map,nextButton('查看送貨紀錄',3));
      },'青木可能在步道轉折處停留，將長紙筒藏起或交給其他人，之後才從南側離開。');
      stage.appendChild(builder);
    }

    if(currentStep===3){
      stage.innerHTML='<header><small>第三階段</small><h5>還原年輕女子的送貨路線</h5><p>四張紀錄背面都出現相同的藍綠色記號。請依時間先後排列。</p></header>';
      const receipts=[
        ['下午六時零八分','退燒藥','南側送貨點','簽收：蘭'],
        ['下午六時十一分','—','走向北側橋口',''],
        ['下午六時十四分','—','由河岸階梯下行',''],
        ['下午六時十七分','信件與乾糧','放置於步道轉折處','']
      ];
      const grid=document.createElement('div');
      grid.className='liuchuan-receipt-grid';
      receipts.forEach((row,index)=>{
        const article=document.createElement('article');
        article.appendChild(optionalImage(liuchuanAssets.receipts[index],'送貨紀錄 '+(index+1)));
        const copy=document.createElement('div');
        copy.innerHTML='<small>送貨紀錄 '+String(index+1).padStart(2,'0')+'</small><b>'+row[0]+'</b><p>物品：'+row[1]+'<br/>紀錄：'+row[2]+(row[3]?'<br/>'+row[3]:'')+'</p><i>藍綠記號</i>';
        article.appendChild(copy);
        grid.appendChild(article);
      });
      stage.appendChild(grid);
      const builder=createRouteBuilder(['B','D','C','A'],['D','A','B','C'],()=>{
        const map=createLiuchuanMap(false,true);
        map.classList.add('liuchuan-result-map');
        stage.append(map,nextButton('比對警備隊巡查表',4));
      },'女子沒有直接前往物品放置處，而是先走向北側橋口，再折返回河岸階梯。這種繞行方式可能是為了確認自己是否被跟蹤。');
      stage.appendChild(builder);
    }

    if(currentStep===4){
      stage.innerHTML='<header><small>第四階段</small><h5>找出巡查空檔</h5></header>';
      stage.appendChild(optionalImage(liuchuanAssets.patrol,'警備隊巡查表'));
      const table=document.createElement('table');
      table.className='liuchuan-patrol-table';
      table.innerHTML=`<thead><tr><th>區域</th><th>巡查時間</th></tr></thead><tbody>
        <tr><td>北側橋口</td><td>下午五時三十分至五時四十五分</td></tr>
        <tr><td>河岸主要步道</td><td>下午五時四十六分至六時零五分</td></tr>
        <tr><td>南側道路</td><td>下午六時二十分至六時三十五分</td></tr>
        <tr><td>河岸階梯與步道轉折處</td><td>無固定巡查</td></tr>
      </tbody>`;
      stage.appendChild(table);
      const form=document.createElement('div');
      form.className='liuchuan-choice-form';
      form.innerHTML=`
        <fieldset><legend>題目一｜哪一段時間最可能是巡查空檔？</legend>
          <label><input type="radio" name="gap" value="A"/> A. 下午五時三十分至五時四十五分</label>
          <label><input type="radio" name="gap" value="B"/> B. 下午五時四十六分至六時零五分</label>
          <label><input type="radio" name="gap" value="C"/> C. 下午六時零六分至六時十九分</label>
          <label><input type="radio" name="gap" value="D"/> D. 下午六時二十分至六時三十五分</label>
        </fieldset>
        <fieldset><legend>題目二｜四張送貨紀錄是否都位於這段時間內？</legend>
          <label><input type="radio" name="inside" value="yes"/> 是</label>
          <label><input type="radio" name="inside" value="no"/> 否</label>
        </fieldset>`;
      const button=document.createElement('button');
      button.type='button';button.className='liuchuan-primary-button';button.textContent='確認巡查空檔';
      const feedback=document.createElement('p');feedback.className='liuchuan-answer-feedback';
      button.addEventListener('click',()=>{
        const gap=form.querySelector('input[name="gap"]:checked')?.value;
        const inside=form.querySelector('input[name="inside"]:checked')?.value;
        if(gap==='C'&&inside==='yes'){
          feedback.textContent='女子知道巡查人員在不同區域之間移動的時間，並固定利用下午六時零六分至六時十九分完成送貨。';
          feedback.dataset.ok='true';button.disabled=true;stage.appendChild(nextButton('比較兩條路線',5));
        }else{
          feedback.textContent='請重新對照四張送貨紀錄的時間與巡查表。';feedback.dataset.ok='false';
        }
      });
      stage.append(form,button,feedback);
    }

    if(currentStep===5){
      stage.innerHTML='<header><small>第五階段</small><h5>比較兩條路線</h5><p>青木：A → B → C → D　／　女子：D → A → B → C</p></header>';
      stage.appendChild(createLiuchuanMap(true,true));
      const form=document.createElement('div');
      form.className='liuchuan-choice-form';
      const options=[
        ['A','都使用河岸階梯避開主要道路'],['B','都在步道轉折處停留'],['C','都使用藍綠色記號'],['D','都在同一天抵達柳川'],['E','都搭乘相同交通工具'],['F','都會先繞行，再前往真正的目的地']
      ];
      const fieldset=document.createElement('fieldset');
      fieldset.innerHTML='<legend>兩人的行動有哪些相似之處？請選出三項。</legend>';
      options.forEach(([value,label])=>{
        const node=document.createElement('label');
        node.innerHTML='<input type="checkbox" value="'+value+'"/> '+value+'. '+label;
        fieldset.appendChild(node);
      });
      form.appendChild(fieldset);
      const button=document.createElement('button');button.type='button';button.className='liuchuan-primary-button';button.textContent='確認共同點';
      const feedback=document.createElement('p');feedback.className='liuchuan-answer-feedback';
      button.addEventListener('click',()=>{
        const selected=[...form.querySelectorAll('input:checked')].map(input=>input.value).sort().join('');
        if(selected==='ABF'){
          feedback.textContent='兩人都利用河岸階梯與步道轉折處，並透過繞行來避開直接暴露真正目的地。藍綠色記號仍只是另一項文件線索，不能直接證明青木本人曾畫下記號。';
          feedback.dataset.ok='true';button.disabled=true;stage.appendChild(nextButton('判斷兩人的關係',6));
        }else{
          feedback.textContent='有一項證據被過度推論了。請只選居民證詞與路線本身可以支持的共同點。';feedback.dataset.ok='false';
        }
      });
      stage.append(form,button,feedback);
    }

    if(currentStep===6){
      stage.innerHTML='<header><small>第六階段</small><h5>判斷兩人的關係</h5></header>';
      const form=document.createElement('div');
      form.className='liuchuan-choice-form';
      form.innerHTML=`<fieldset><legend>留下「蘭」字的女子，是否可能長期與青木保持聯絡？</legend>
        <label><input type="radio" name="relation" value="A"/> A. 不可能，兩人的行走方向不同</label>
        <label><input type="radio" name="relation" value="B"/> B. 可能，女子持續使用青木曾經使用的隱密路線</label>
        <label><input type="radio" name="relation" value="C"/> C. 可以完全確認女子就是鈴蘭</label>
        <label><input type="radio" name="relation" value="D"/> D. 女子只是普通送貨員</label>
      </fieldset>`;
      const button=document.createElement('button');button.type='button';button.className='liuchuan-primary-button';button.textContent='完成柳川查核';
      const feedback=document.createElement('p');feedback.className='liuchuan-answer-feedback';
      button.addEventListener('click',async()=>{
        const value=form.querySelector('input[name="relation"]:checked')?.value;
        if(value!=='B'){
          feedback.textContent='「蘭」字不足以完全證明身分，但路線與巡查空檔顯示她並非偶然經過。';feedback.dataset.ok='false';return;
        }
        feedback.textContent='判斷成立：女子可能長期與青木保持聯絡。';feedback.dataset.ok='true';button.disabled=true;
        window.localStorage.setItem('suzuran-main-v3-unlocked-8','1');
        document.querySelector('.gazette-status')?.replaceChildren(document.createTextNode('受理済'));
        const newsroom=window.localStorage.getItem('suzuran-newsroom');
        if(newsroom){try{await saveNewsroomProgress(newsroom,1058);}catch{} }
        const result=document.createElement('div');
        result.className='liuchuan-final-evidence';
        result.innerHTML=`
          <h5>完成回饋</h5>
          <p>「蘭」字還不足以完全證明女子的身分。但是，她知道河岸階梯、步道轉折處與巡查空檔，也長期將藥物、食物和信件送往同一位置。</p>
          <p>這表示她不是偶然經過柳川，而是在使用一條早已安排好的秘密聯絡路線。</p>
          <h5>本站取得的證據｜《沒有完整姓名的送貨紀錄》</h5>
          <ul><li>收件紀錄上留下「蘭」字</li><li>女子長期運送藥物、乾糧與信件</li><li>女子知道警備隊的巡查空檔</li><li>女子與青木使用相同的河岸階梯和步道轉折處</li><li>女子會刻意繞路，確認是否有人跟蹤</li><li>女子可能透過固定位置與青木聯絡，但本站尚不能完全確認她就是鈴蘭</li></ul>
          <h5>本站推進</h5>
          <p>玩家開始懷疑：鈴蘭不是單純的地陪；她可能長期替青木送藥、食物與訊息；青木可能仍藏在臺中；鈴蘭知道父親目前的部分行蹤。</p>`;
        stage.appendChild(result);
      });
      stage.append(form,button,feedback);
    }
  };

  sheet.append(small,title,intro,progress,stage);
  setStep(1);
}

function updateQuestionSheet(caseNumber){
  const sheet=document.querySelector('.case-question-sheet');
  if(!sheet)return;
  if(caseNumber===8)makeBookstoreSheet(sheet);
  if(caseNumber===9)makeLiuchuanSheet(sheet);
}

function installStyle(){
  if(document.getElementById('puzzle-layout-override-style'))return;
  const style=document.createElement('style');
  style.id='puzzle-layout-override-style';
  style.textContent=`
    .case-question-sheet h5{margin:24px 0 10px;padding-top:14px;border-top:1px solid var(--gazette-rule);font-size:15px;letter-spacing:.08em}
    .case-question-sheet ul{margin:10px 0 18px;padding-left:1.4em;font-size:13px;line-height:2}
    .puzzle-inline-note{padding:13px 15px;border-left:4px solid var(--gazette-red);background:rgba(143,37,29,.055)}
    .central-bookstore-puzzle-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:20px}
    .central-bookstore-puzzle-grid figure{margin:0;border:1px solid var(--gazette-rule);background:rgba(255,255,255,.12)}
    .central-bookstore-puzzle-grid figure:last-child{grid-column:1/-1;width:min(68%,640px);justify-self:center}
    .central-bookstore-puzzle-grid figcaption{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid var(--gazette-rule);font-size:12px}
    .central-bookstore-puzzle-grid figcaption span{font:10px 'DM Mono';color:var(--gazette-red)}
    .central-bookstore-puzzle-grid img{display:block;width:100%;height:auto;max-height:620px;object-fit:contain;background:rgba(255,255,255,.18)}
    .liuchuan-stage-progress{display:grid;grid-template-columns:repeat(6,1fr);border:1px solid var(--gazette-rule);margin:22px 0 10px}
    .liuchuan-stage-progress span{padding:9px;text-align:center;border-right:1px solid var(--gazette-rule);font:11px 'DM Mono';opacity:.45}
    .liuchuan-stage-progress span:last-child{border-right:0}.liuchuan-stage-progress span.active{background:var(--gazette-ink);color:var(--gazette-paper);opacity:1}.liuchuan-stage-progress span.done{color:var(--gazette-red);opacity:1}
    .liuchuan-stage{scroll-margin-top:18px;padding-top:8px}.liuchuan-stage>header{margin-bottom:16px}.liuchuan-stage>header small{color:var(--gazette-red);font:11px 'DM Mono'}.liuchuan-stage>header h5{margin:6px 0 8px;padding:0;border:0;font-size:19px}
    .liuchuan-map-wrap{position:relative;min-height:360px;margin:16px 0;border:1px solid var(--gazette-rule);overflow:hidden;background:rgba(255,255,255,.14)}
    .liuchuan-map-image{display:block;width:100%;height:auto;max-height:560px;object-fit:contain}.liuchuan-map-image+.liuchuan-map-diagram{display:none}
    .liuchuan-map-diagram{position:relative;min-height:360px;background:linear-gradient(90deg,rgba(255,255,255,.1),rgba(255,255,255,.22))}
    .liuchuan-river{position:absolute;left:45%;top:-10%;width:13%;height:120%;background:rgba(54,102,102,.15);transform:rotate(3deg);border-left:1px solid rgba(54,102,102,.35);border-right:1px solid rgba(54,102,102,.35)}
    .liuchuan-bridge{position:absolute;left:30%;width:42%;height:13px;background:rgba(80,56,38,.22);border-top:1px solid var(--gazette-rule);border-bottom:1px solid var(--gazette-rule)}.bridge-top{top:22%}.bridge-bottom{bottom:18%}
    .liuchuan-point{position:absolute;display:grid;place-items:center;width:72px;height:72px;border:1px solid var(--gazette-red);border-radius:50%;background:var(--gazette-paper);text-align:center;z-index:2}.liuchuan-point b{font:18px 'DM Mono';color:var(--gazette-red)}.liuchuan-point small{font-size:10px}.point-a{left:18%;top:9%}.point-b{left:58%;top:34%}.point-c{left:31%;top:56%}.point-d{right:10%;bottom:7%}
    .liuchuan-route{position:absolute;left:8%;right:8%;display:flex;align-items:center;justify-content:center;gap:8px;padding:9px 12px;border:1px dashed currentColor;background:rgba(245,232,193,.92);font:12px 'DM Mono';z-index:3}.route-aoki{bottom:58px;color:#3b756f}.route-lan{bottom:14px;color:#9a5139}.liuchuan-route i{font-style:normal;opacity:.7}
    .liuchuan-point-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0 18px}.liuchuan-point-grid article{padding:12px;border:1px solid var(--gazette-rule);background:rgba(255,255,255,.11)}.liuchuan-point-grid b{color:var(--gazette-red)}.liuchuan-point-grid p{margin:5px 0 0;font-size:12px}
    .liuchuan-primary-button{display:inline-flex;align-items:center;justify-content:center;margin:12px 0;padding:10px 16px;border:1px solid var(--gazette-ink);background:var(--gazette-ink);color:var(--gazette-paper);font:inherit;cursor:pointer}.liuchuan-primary-button:disabled{opacity:.48;cursor:default}
    .liuchuan-evidence-card{display:grid;grid-template-columns:minmax(180px,.75fr) 1.25fr;gap:16px;align-items:start;padding:14px;border:1px solid var(--gazette-rule);background:rgba(255,255,255,.11);margin-bottom:16px}.liuchuan-document-image{display:block;width:100%;max-height:520px;object-fit:contain}.liuchuan-evidence-card small,.liuchuan-receipt-grid small{color:var(--gazette-red);font:10px 'DM Mono'}
    .liuchuan-card-pool{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.liuchuan-card-pool button{min-width:130px;padding:10px;border:1px solid var(--gazette-rule);background:rgba(255,255,255,.16);text-align:left;cursor:grab}.liuchuan-card-pool button b{display:inline-block;margin-right:7px;color:var(--gazette-red)}
    .liuchuan-route-slots{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0}.liuchuan-route-slot{min-height:78px;padding:9px;border:1px dashed var(--gazette-rule);display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}.liuchuan-route-slot.filled{border-style:solid;background:rgba(255,255,255,.12);cursor:pointer}.liuchuan-route-slot small{font:9px 'DM Mono';opacity:.6}.liuchuan-route-slot b{font:18px 'DM Mono';color:var(--gazette-red)}.liuchuan-route-slot span{font-size:11px}
    .liuchuan-answer-feedback{min-height:22px;margin:8px 0 16px;font-size:12px}.liuchuan-answer-feedback[data-ok="true"]{padding:12px 14px;border-left:4px solid #49756f;background:rgba(73,117,111,.08)}.liuchuan-answer-feedback[data-ok="false"]{color:var(--gazette-red)}
    .liuchuan-receipt-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:14px 0}.liuchuan-receipt-grid article{display:grid;grid-template-columns:minmax(110px,.7fr) 1.3fr;gap:10px;padding:12px;border:1px solid var(--gazette-rule);background:rgba(255,255,255,.12)}.liuchuan-receipt-grid article>div>i{display:inline-block;margin-top:8px;padding:3px 7px;border:1px solid #4e7d75;color:#3b756f;font-size:10px;font-style:normal}
    .liuchuan-patrol-table{width:100%;border-collapse:collapse;margin:12px 0 18px;font-size:12px}.liuchuan-patrol-table th,.liuchuan-patrol-table td{border:1px solid var(--gazette-rule);padding:9px;text-align:left}.liuchuan-patrol-table th{background:rgba(255,255,255,.13)}
    .liuchuan-choice-form fieldset{margin:14px 0;padding:13px;border:1px solid var(--gazette-rule)}.liuchuan-choice-form legend{padding:0 7px;font-weight:700}.liuchuan-choice-form label{display:block;padding:7px 3px;font-size:12px;line-height:1.5}.liuchuan-choice-form input{margin-right:7px}
    .liuchuan-final-evidence{margin-top:18px;padding:16px;border:2px double var(--gazette-rule);background:rgba(255,255,255,.12)}.liuchuan-final-evidence h5:first-child{margin-top:0;padding-top:0;border-top:0}.liuchuan-result-map{margin-top:18px}
    @media(max-width:800px){
      .central-bookstore-puzzle-grid{grid-template-columns:1fr}.central-bookstore-puzzle-grid figure:last-child{grid-column:auto;width:100%}.central-bookstore-puzzle-grid img{max-height:none}
      .liuchuan-stage-progress{grid-template-columns:repeat(3,1fr)}.liuchuan-stage-progress span:nth-child(3){border-right:0}.liuchuan-stage-progress span:nth-child(-n+3){border-bottom:1px solid var(--gazette-rule)}
      .liuchuan-point-grid,.liuchuan-receipt-grid{grid-template-columns:1fr}.liuchuan-evidence-card,.liuchuan-receipt-grid article{grid-template-columns:1fr}.liuchuan-route-slots{grid-template-columns:repeat(2,1fr)}.liuchuan-map-wrap,.liuchuan-map-diagram{min-height:330px}.liuchuan-point{width:62px;height:62px}.point-a{left:8%}.point-b{left:60%}.point-c{left:21%}.point-d{right:5%}
    }
  `;
  document.head.appendChild(style);
}

function applyOverrides(){
  installStyle();
  updateDirectory();
  const caseNumber=getCaseNumber();
  if(caseNumber){
    updateCaseHeader(caseNumber);
    updateQuestionSheet(caseNumber);
  }
}

const observer=new MutationObserver(()=>window.requestAnimationFrame(applyOverrides));
observer.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',()=>window.setTimeout(applyOverrides,0));
window.addEventListener('popstate',applyOverrides);
window.addEventListener('hashchange',applyOverrides);
applyOverrides();
