// Reading binary: one guided question, then three independent questions.
const READING_QUESTIONS = [
  {bits:'00101',answer:5,choices:[3,5,7,9]},
  {bits:'01011',answer:11,choices:[9,10,11,12]},
  {bits:'10010',answer:18,choices:[16,17,18,20]},
  {bits:'10110',answer:22,choices:[18,20,22,24]}
];
const freshStage3=()=>({index:0,phase:'find',selected:[],mistakes:0,lastWrong:null,findHint:false});
function restoreStage3(value){
  if(!value||!Number.isInteger(value.index)||value.index<0||value.index>=READING_QUESTIONS.length)return freshStage3();
  const q=READING_QUESTIONS[value.index];
  const selected=Array.isArray(value.selected)?[...new Set(value.selected.filter(i=>Number.isInteger(i)&&q.bits[i]==='1'))]:[];
  let phase=['find','answer','correct','complete'].includes(value.phase)?value.phase:'answer';
  if(value.index>0&&phase==='find')phase='answer';
  if(phase==='complete'&&value.index!==3)phase='answer';
  return {index:value.index,phase,selected,mistakes:Number.isInteger(value.mistakes)?Math.max(0,value.mistakes):0,lastWrong:q.choices.includes(value.lastWrong)&&value.lastWrong!==q.answer?value.lastWrong:null,findHint:!!value.findHint};
}
function readingValues(q){return PLACE_VALUES.filter((_,i)=>q.bits[i]==='1');}
function readingFeedback(a,q){
  if(a.phase==='correct')return `<strong>🎉 정답! ${q.bits} = ${q.answer}</strong><p class="reading-equation">${readingValues(q).join(' + ')} = ${q.answer}</p>`;
  if(a.phase==='find')return a.findHint?'<strong>이 자리는 0이에요. 켜진 전구의 숫자를 찾아보세요.</strong>':`<p>찾은 자리 ${a.selected.length} / ${readingValues(q).length}</p>`;
  if(!a.mistakes)return '<p>켜진 자리의 숫자를 더해서 답을 골라 보세요.</p>';
  const hint=a.mistakes===1?'1이 있는 자리만 찾아보세요.':a.mistakes===2?`${readingValues(q).join('와 ')}이 켜져 있어요.`:`${readingValues(q).join(' + ')} = ${q.answer}`;
  return `<strong>🤔 다시 한번 살펴볼까요?</strong><p>${hint}</p>${a.mistakes>=3?'<p>계산을 따라 해 보고, 답을 다시 골라 보세요.</p>':''}`;
}
function stage3(){
  const a=state.stage3,q=READING_QUESTIONS[a.index];
  if(a.phase==='complete')return `${header()}<main class="lesson">${progress(3)}<section class="complete"><h1>🏆 3단계 성공!</h1><h2>이진수를 읽는 방법</h2><ol class="reading-rules"><li>1이 있는 자리를 찾는다.</li><li>그 자리의 숫자를 더한다.</li><li>우리가 사용하는 숫자로 나타낸다.</li></ol><div class="finished-example reading-final">10110 <span>→ 16 + 4 + 2 →</span> 22</div><p><b>1이 있는 자리만 더하면 된다!</b></p><h2>이제 반대로 해볼까요?</h2><p>다음에는 <b>22 → 10110</b>을 만들어 봐요.</p><button class="primary" data-reading-action="next4">4단계로 이동 →</button><button class="text-button again" data-reading-action="restart">3단계 다시 해 보기</button></section></main>`;
  const find=a.phase==='find',correct=a.phase==='correct';
  return `${header()}<main class="lesson stage-three">${progress(3)}<div class="lesson-title"><h1>🔍 이진수를 숫자로 바꿔 봐!</h1><p>전구가 켜진 자리를 찾아 숫자를 더해 보세요.</p></div><div class="question-progress" aria-label="총 4문제 중 ${a.index+1}번째${correct?', 정답 완료':''}"><span>${a.index===0?'함께 연습':a.index===3?'도전!':'스스로 풀기'} · ${a.index+1} / 4</span><span aria-hidden="true">${READING_QUESTIONS.map((_,i)=>`<i class="${i<a.index||i===a.index&&correct?'done':i===a.index?'current':''}"></i>`).join('')}</span></div><section class="lab"><div class="bulbs reading-bulbs ${correct?'answered':''}">${[...q.bits].map((bit,i)=>{const on=bit==='1',selected=a.selected.includes(i),tag=find?'button':'div';return `<${tag} class="bulb weighted ${on?'on':''} ${selected?'picked':''} ${a.mistakes&&!correct&&on?'hint-pulse':''}" ${find?`data-place="${i}" aria-pressed="${selected}"`:''} aria-label="값 ${PLACE_VALUES[i]}, ${on?'켜짐, 1':'꺼짐, 0'}${selected?', 찾았어요':''}"><span class="place-value">${PLACE_VALUES[i]}</span><span class="icon" aria-hidden="true">💡</span><span class="number" aria-hidden="true">${bit}</span>${selected&&find?'<span class="found-mark" aria-hidden="true">✓</span>':''}</${tag}>`;}).join('')}</div><h2 class="reading-question">${q.bits}은 어떤 숫자일까요?</h2>${find?'<p class="find-instruction">1이 있는 자리를 찾아보세요.<br><small>켜진 전구 위의 숫자를 눌러요.</small></p>':`${a.index===0&&!correct?`<p class="reading-equation">${readingValues(q).join(' + ')} = ?</p>`:''}${!correct?`<div class="answer-choices" aria-label="답 선택">${q.choices.map(v=>`<button class="answer-choice ${a.lastWrong===v?'wrong':''}" data-answer="${v}" aria-label="답 ${v}">${v}</button>`).join('')}</div>`:''}`}<div class="reading-feedback ${correct?'right':''}" role="status">${readingFeedback(a,q)}</div>${correct?`<button class="primary reading-next" data-reading-action="advance">${a.index===3?'3단계 마무리하기':'다음 문제 →'}</button>`:''}</section></main>`;
}
function handleReadingButton(button){
  const a=state.stage3,q=READING_QUESTIONS[a.index];
  let focusSelector;
  if(button.hasAttribute('data-place')){
    if(a.phase!=='find')return true;
    const i=Number(button.dataset.place);
    if(q.bits[i]==='1'){if(!a.selected.includes(i))a.selected.push(i);a.findHint=false;}else a.findHint=true;
    if(a.selected.length===readingValues(q).length){a.phase='answer';focusSelector='.answer-choice';}else focusSelector=`[data-place="${i}"]`;
  }else if(button.hasAttribute('data-answer')){
    if(a.phase!=='answer')return true;
    const answer=Number(button.dataset.answer);
    if(answer===q.answer){a.phase='correct';a.lastWrong=null;celebrate();focusSelector='[data-reading-action="advance"]';}
    else{a.mistakes++;a.lastWrong=answer;focusSelector=`[data-answer="${answer}"]`;}
  }else switch(button.dataset.readingAction){
    case 'advance':if(a.phase!=='correct')return true;if(a.index===3)a.phase='complete';else state.stage3={...freshStage3(),index:a.index+1,phase:'answer'};break;
    case 'restart':state.stage3=freshStage3();break;
    case 'next4':if(a.phase!=='complete')return true;state.screen='stage4';state.lastStage='stage4';save();render();window.scrollTo(0,0);return true;
    case 'close4':focusSelector='[data-reading-action="next4"]';break;
    default:return false;
  }
  save();render();if(focusSelector)app.querySelector(focusSelector)?.focus();return true;
}
