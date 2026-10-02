// Mixed challenge: stars are derived from progress, never incremented by clicks.
const CHALLENGE_QUESTIONS=[
  {type:'read',bits:'00110',target:6,choices:[4,6,8,10]},
  {type:'make',bits:'01010',target:10},
  {type:'read',bits:'10011',target:19,choices:[17,18,19,21]},
  {type:'make',bits:'11001',target:25},
  {type:'read',bits:'11111',target:31,choices:[15,29,30,31]}
];
const freshStage5=()=>({index:0,phase:'play',bulbs:[0,0,0,0,0],mistakes:0,lastWrong:null,hint:false});
function restoreStage5(v){
  if(!v||!Number.isInteger(v.index)||v.index<0||v.index>4)return freshStage5();
  const q=CHALLENGE_QUESTIONS[v.index];
  const bulbs=Array.isArray(v.bulbs)&&v.bulbs.length===5&&v.bulbs.every(n=>n===0||n===1)?v.bulbs:[0,0,0,0,0];
  let phase=['play','correct','complete'].includes(v.phase)?v.phase:'play';
  if(phase==='complete'&&v.index!==4)phase='play';
  if(q.type==='make'&&phase==='correct'&&bulbTotal(bulbs)!==q.target)phase='play';
  return {index:v.index,phase,bulbs:[...bulbs],mistakes:Number.isInteger(v.mistakes)?Math.max(0,v.mistakes):0,lastWrong:q.choices?.includes(v.lastWrong)&&v.lastWrong!==q.target?v.lastWrong:null,hint:!!v.hint};
}
function challengeStars(a){return a.phase==='complete'?5:a.index+(a.phase==='correct'?1:0);}
function challengeFeedback(a,q){
  if(a.phase==='correct')return `<strong>🎉 정답! 별 하나를 얻었어요!</strong><p class="reading-equation">${makingTerms([...q.bits].map(Number))} = ${q.target}</p><div class="finished-example">${q.type==='read'?`${q.bits} = ${q.target}`:`${q.target} = ${q.bits}`}</div><p>켜진 자리의 값만 더했어요.</p>`;
  if(q.type==='read')return a.mistakes?`<strong>🤔 다시 한번 살펴볼까요?</strong><p>${a.mistakes===1?'1이 있는 자리를 다시 살펴보세요.':'켜진 전구의 숫자만 더해 볼까요?'}</p>`:'<p>켜진 자리의 값을 더해 답을 골라 보세요.</p>';
  const total=bulbTotal(a.bulbs);
  return `<p class="making-comparison">현재 <b>${total}</b> / 목표 <b>${q.target}</b></p><p class="reading-equation">${makingTerms(a.bulbs)} = ${total}</p><p>${total>q.target?'조금 커졌어요! 켜진 전구를 다시 눌러 꺼 볼까요?':'필요한 전구를 켜서 목표 숫자를 만들어 보세요.'}</p>`;
}
function stage5(){
  const a=state.stage5,q=CHALLENGE_QUESTIONS[a.index],stars=challengeStars(a),correct=a.phase==='correct';
  if(a.phase==='complete')return `${header()}<main class="lesson">${progress(5)}<section class="complete challenge-complete"><div class="challenge-stars" aria-label="별 5개 획득">⭐ ⭐ ⭐ ⭐ ⭐</div><h1>🎉 이진수 탐험대<br>미션 성공!</h1><p class="lead">이제 이진수를 읽을 수도 있고,<br>숫자를 이진수로 만들 수도 있어요!</p><div class="challenge-recap"><p><b>이진수</b> → 1인 자리의 값을 더하기 → <b>숫자</b></p><p><b>숫자</b> → 필요한 자릿값 찾기<br>→ 전구 켜기 → <b>이진수</b></p></div><section class="birthday-preview"><p>이제 마지막 미션입니다!</p><h2>세상에 하나뿐인<br>내 생일 이진수를 만들어 볼까요?</h2><button class="primary" data-challenge-action="next6">6단계: 내 생일 이진수 만들기 →</button></section><button class="text-button again" data-challenge-action="restart">5단계 다시 도전하기</button></section></main>`;
  const bits=q.type==='read'?[...q.bits].map(Number):a.bulbs;
  return `${header()}<main class="lesson stage-five">${progress(5)}<div class="lesson-title"><h1>🏆 이진수 탐험대 도전!</h1><p>이번에는 문제가 섞여 있어요.<br>이진수를 읽기도 하고, 직접 만들어 보기도 해요!</p></div><div class="challenge-progress"><span>${a.index+1} / 5 · ${a.index===4?'최종 도전':q.type==='read'?'이진수 읽기':'숫자 만들기'}</span><span class="challenge-stars" aria-label="별 ${stars}개 획득, 총 5개">${Array.from({length:5},(_,i)=>i<stars?'⭐':'☆').join(' ')}</span></div><section class="lab"><h2 class="reading-question">${q.type==='read'?`${q.bits}은 어떤 숫자일까요?`:`${q.target}을 이진수로 만들어 보세요.`}</h2><div class="bulbs reading-bulbs ${correct?'answered':''}">${bits.map((bit,i)=>{const tag=q.type==='make'?'button':'div';return `<${tag} class="bulb weighted ${bit?'on':''} ${a.mistakes&&!correct&&bit?'hint-pulse':''}" ${q.type==='make'?`data-challenge-bulb="${i}" aria-pressed="${!!bit}" ${correct?'disabled':''}`:''} aria-label="값 ${PLACE_VALUES[i]}, ${bit?'켜짐, 1':'꺼짐, 0'}"><span class="place-value">${PLACE_VALUES[i]}</span><span class="icon" aria-hidden="true">💡</span><span class="number" aria-hidden="true">${bit}</span></${tag}>`;}).join('')}</div>${q.type==='read'&&!correct?`<div class="answer-choices" aria-label="답 선택">${q.choices.map(n=>`<button class="answer-choice ${a.lastWrong===n?'wrong':''}" data-challenge-answer="${n}" aria-label="답 ${n}">${n}</button>`).join('')}</div>`:''}<section class="reading-feedback ${correct?'right':''}" role="status" aria-atomic="true">${challengeFeedback(a,q)}</section>${correct?`<button class="primary reading-next" data-challenge-action="advance">${a.index===4?'도전 결과 보기':'계산 확인! 다음 문제 →'}</button>`:q.type==='make'?`<div class="making-help"><button class="hint-button" data-challenge-action="hint">💡 힌트 보기</button><p role="status">${a.hint?'목표 숫자보다 크지 않은 가장 큰 값을 먼저 찾아보세요.':''}</p></div>`:''}</section></main>`;
}
function handleChallengeButton(button){
  const a=state.stage5,q=CHALLENGE_QUESTIONS[a.index];let focus,won=false;
  if(button.hasAttribute('data-challenge-answer')){
    if(a.phase!=='play'||q.type!=='read')return true;
    const answer=Number(button.dataset.challengeAnswer);if(!q.choices.includes(answer))return true;
    if(answer===q.target)won=true;else{a.mistakes++;a.lastWrong=answer;focus=`[data-challenge-answer="${answer}"]`;}
  }else if(button.hasAttribute('data-challenge-bulb')){
    if(a.phase!=='play'||q.type!=='make')return true;
    const i=Number(button.dataset.challengeBulb);if(!Number.isInteger(i)||i<0||i>4)return true;
    a.bulbs[i]=1-a.bulbs[i];won=bulbTotal(a.bulbs)===q.target;focus=`[data-challenge-bulb="${i}"]`;
  }else switch(button.dataset.challengeAction){
    case 'hint':if(a.phase!=='play')return true;a.hint=true;focus='[data-challenge-action="hint"]';break;
    case 'advance':if(a.phase!=='correct')return true;if(a.index===4)a.phase='complete';else state.stage5={...freshStage5(),index:a.index+1};break;
    case 'restart':state.stage5=freshStage5();break;
    case 'next6':if(a.phase!=='complete')return true;state.screen='stage6';state.lastStage='stage6';save();render();window.scrollTo(0,0);return true;
    case 'close6':focus='[data-challenge-action="next6"]';break;
    default:return false;
  }
  if(won){a.phase='correct';a.lastWrong=null;celebrate();announce(`정답! 별 ${challengeStars(a)}개를 모았어요.`);focus='[data-challenge-action="advance"]';}
  save();render();if(focus)app.querySelector(focus)?.focus();return true;
}
