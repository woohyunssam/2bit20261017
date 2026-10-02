// Decimal to binary: guided greedy decomposition, then open exploration.
const MAKING_TARGETS=[5,9,13,22];
const freshStage4=()=>({index:0,bulbs:[0,0,0,0,0],phase:'play',hint:0});
function restoreStage4(value){
  if(!value||!Number.isInteger(value.index)||value.index<0||value.index>3||!Array.isArray(value.bulbs)||value.bulbs.length!==5||!value.bulbs.every(v=>v===0||v===1))return freshStage4();
  const correct=bulbTotal(value.bulbs)===MAKING_TARGETS[value.index];
  const phase=value.phase==='complete'&&value.index===3&&correct?'complete':correct?'correct':'play';
  return {index:value.index,bulbs:[...value.bulbs],phase,hint:Number.isInteger(value.hint)?Math.min(3,Math.max(0,value.hint)):0};
}
function makingTerms(bits){return PLACE_VALUES.filter((_,i)=>bits[i]).join(' + ')||'0';}
function makingGuidance(a){
  const target=MAKING_TARGETS[a.index],total=bulbTotal(a.bulbs),remaining=target-total;
  if(total>target)return `조금 커졌어요! ${target}보다 작은 값으로 다시 만들어 볼까요? 켜진 전구를 다시 누르면 꺼져요.`;
  if(a.index!==0)return remaining?`${remaining}이 더 필요해요. 어떤 전구를 바꾸면 될까요?`:'';
  if(!total)return `${target}보다 작거나 같은 가장 큰 수는 무엇일까요?`;
  const terms=PLACE_VALUES.filter((_,i)=>a.bulbs[i]);
  const ordered=terms.every((v,i)=>v<=(target-terms.slice(0,i).reduce((s,n)=>s+n,0)));
  let rest=target;
  const steps=ordered?terms.map(v=>{const line=`${rest} - ${v} = ${rest-v}`;rest-=v;return line;}).join(' · '):'';
  return `${steps}<br>${remaining}을 만들려면 어떤 수가 더 필요할까요?`;
}
function makingHint(a){
  if(!a.hint)return '';
  if(a.hint===1)return '목표 숫자보다 크지 않은 가장 큰 값을 찾아보세요.';
  if(a.hint===2)return `${PLACE_VALUES.find(v=>v<=MAKING_TARGETS[a.index])}부터 시작해 볼까요?`;
  return '필요한 자리가 반짝여요. 켜거나 끌 전구를 살펴보세요.';
}
function stage4(){
  const a=state.stage4,target=MAKING_TARGETS[a.index],total=bulbTotal(a.bulbs),correct=a.phase==='correct';
  if(a.phase==='complete')return `${header()}<main class="lesson">${progress(4)}<section class="complete"><h1>⭐ 4단계 완료!</h1><p class="lead">숫자를 보고 어떤 전구를 켜야 하는지<br>찾을 수 있어요!</p><p>숫자 → 필요한 자릿값 찾기<br>→ 전구 켜기 → 이진수 완성</p><div class="finished-example reading-final">22 <span>→ 16 + 4 + 2 →</span> 10110</div><h2>이제 읽기도 하고,<br>만들기도 할 수 있겠죠?</h2><button class="primary" data-making-action="next5">5단계 도전하기 →</button><button class="text-button again" data-making-action="restart">4단계 다시 해 보기</button></section></main>`;
  return `${header()}<main class="lesson stage-four">${progress(4)}<div class="lesson-title"><h1>💡 숫자를 이진수로 만들어 봐!</h1><p>이번에는 숫자를 보고 필요한 전구를 직접 켜 보세요.</p></div><div class="question-progress" aria-label="총 4문제 중 ${a.index+1}번째"><span>${a.index===0?'함께 풀기':a.index===3?'도전!':'스스로 만들기'} · ${a.index+1} / 4</span><span aria-hidden="true">${MAKING_TARGETS.map((_,i)=>`<i class="${i<a.index||i===a.index&&correct?'done':i===a.index?'current':''}"></i>`).join('')}</span></div><section class="lab"><div class="bulbs reading-bulbs ${correct?'answered':''}">${a.bulbs.map((bit,i)=>`<button class="bulb weighted ${bit?'on':''} ${a.hint===3&&!correct&&(target&PLACE_VALUES[i])?'hint-pulse':''}" data-make-bulb="${i}" aria-label="값 ${PLACE_VALUES[i]} 전구, ${bit?'켜짐, 1':'꺼짐, 0'}" aria-pressed="${!!bit}" ${correct?'disabled':''}><span class="place-value">${PLACE_VALUES[i]}</span><span class="icon" aria-hidden="true">💡</span><span class="number" aria-hidden="true">${bit}</span></button>`).join('')}</div><h2 class="reading-question">🎯 ${target}을 만들어 보세요!</h2><section class="making-status ${total>target?'over':''}" role="status" aria-atomic="true"><p class="making-comparison">현재 <b>${total}</b> / 목표 <b>${target}</b></p><p class="reading-equation">${makingTerms(a.bulbs)} = ${total}</p>${correct?`<strong>🎉 성공!</strong><div class="finished-example">${target} = ${a.bulbs.join('')}</div>`:`<p class="making-guide">${makingGuidance(a)}</p>`}</section>${correct?`<button class="primary reading-next" data-making-action="advance">${a.index===3?'4단계 마무리하기':'다음 문제 →'}</button>`:`<div class="making-help"><button class="hint-button" data-making-action="hint">💡 ${a.hint===3?'힌트 다시 보기':'힌트 보기'}${a.hint?` · ${a.hint}/3`:''}</button><p role="status">${makingHint(a)}</p></div>`}</section></main>`;
}
function handleMakingButton(button){
  const a=state.stage4;let focus;
  if(button.hasAttribute('data-make-bulb')){
    if(a.phase!=='play')return true;
    const i=Number(button.dataset.makeBulb);if(!Number.isInteger(i)||i<0||i>4)return true;
    a.bulbs[i]=1-a.bulbs[i];focus=`[data-make-bulb="${i}"]`;
    if(bulbTotal(a.bulbs)===MAKING_TARGETS[a.index]){a.phase='correct';focus='[data-making-action="advance"]';celebrate();announce(`성공! ${MAKING_TARGETS[a.index]} = ${a.bulbs.join('')}`);}
  }else switch(button.dataset.makingAction){
    case 'hint':if(a.phase!=='play')return true;a.hint=Math.min(3,a.hint+1);focus='[data-making-action="hint"]';break;
    case 'advance':if(a.phase!=='correct')return true;if(a.index===3)a.phase='complete';else state.stage4={...freshStage4(),index:a.index+1};break;
    case 'restart':state.stage4=freshStage4();break;
    case 'next5':if(a.phase!=='complete')return true;state.screen='stage5';state.lastStage='stage5';save();render();window.scrollTo(0,0);return true;
    case 'close5':focus='[data-making-action="next5"]';break;
    default:return false;
  }
  save();render();if(focus)app.querySelector(focus)?.focus();return true;
}
