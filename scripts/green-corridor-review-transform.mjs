export function greenCorridorReviewTransform(){
 return {
  name:'suzuran-green-corridor-review-transform',
  enforce:'pre',
  transform(code,id){
   if(!id.endsWith('/src/main.jsx'))return null;
   let next=code;
   if(!next.includes("import './green-corridor-review.css';")&&next.includes("import './second-day.css';")){
    next=next.replace("import './second-day.css';","import './second-day.css';\nimport './green-corridor-review.css';");
   }
   const stateAnchor=" const [error,setError]=useState('');\n const [received,setReceived]=useState({2:false,3:false,4:false,5:false});";
   if(next.includes(stateAnchor)&&!next.includes('const [reviewQuestion,setReviewQuestion]')){
    next=next.replace(stateAnchor," const [error,setError]=useState('');\n const [reviewQuestion,setReviewQuestion]=useState(null);\n const [received,setReceived]=useState({2:false,3:false,4:false,5:false});");
   }
   const questionAnchor='{stage<8&&stage%2===0&&current&&<section className="day2-stage"><p className="day2-kicker">Q{current.no}｜碎片追查</p>';
   if(next.includes(questionAnchor)&&!next.includes('day2-review-tools')){
    const replacement='{stage<8&&stage%2===0&&current&&<section className="day2-stage">{current.no>1&&<div className="day2-review-tools"><button type="button" onClick={()=>setReviewQuestion(reviewQuestion?null:questions[current.no-2])}>{reviewQuestion?\'收起上一題\':\'← 查看上一題\'}</button></div>}{reviewQuestion&&<article className="day2-previous-question"><small>上一題｜Q{reviewQuestion.no}</small><h5>{reviewQuestion.title}</h5><p>{reviewQuestion.prompt}</p>{reviewQuestion.options&&<div className="day2-previous-options">{reviewQuestion.options.map(([value,label])=><p key={value} className={value===reviewQuestion.correct?\'is-correct\':\'\'}><b>{value}.</b> {label}</p>)}</div>}{reviewQuestion.charades&&<><p className="day2-charades-frame">「{reviewQuestion.frame}」</p><p className="day2-previous-answer">關鍵字：{reviewQuestion.keywords.join(\' → \')}</p></>}<p className="day2-previous-result"><b>上一題查核結果：</b>{reviewQuestion.result}</p></article>}<p className="day2-kicker">Q{current.no}｜碎片追查</p>';
    next=next.replace(questionAnchor,replacement);
   }
   return next===code?null:{code:next,map:null};
  }
 };
}
