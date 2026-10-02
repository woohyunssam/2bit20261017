// Stage 2: weighted bulbs. No server or framework required.
const PLACE_VALUES = [16, 8, 4, 2, 1];
const freshStage2 = () => ({bulbs:[0,0,0,0,0],phase:'explore',touches:0,ruleSeen:false});
function bulbTotal(bits) { return bits.reduce((sum,bit,i)=>sum+bit*PLACE_VALUES[i],0); }
function weightedBulbs() {
  return state.stage2.bulbs.map((bit,i)=>`<button class="bulb weighted ${bit?'on':''}" data-weighted="${i}" aria-label="값 ${PLACE_VALUES[i]} 전구, ${bit?'켜짐, 1':'꺼짐, 0'}" aria-pressed="${!!bit}"><span class="place-value">${PLACE_VALUES[i]}</span><span class="icon" aria-hidden="true">💡</span><span class="number" aria-hidden="true">${bit}</span></button>`).join('');
}
function calculation() {
  const bits=state.stage2.bulbs, values=PLACE_VALUES.filter((_,i)=>bits[i]),total=bulbTotal(bits);
  return `<p class="equation">${values.length>1?`${values.join(' + ')} = ${total}`:`켜진 전구의 값 = ${total}`}</p><p class="current-number">지금 만든 숫자: <b>${total}</b></p><div class="binary-result"><span><small>이진수</small>${bits.join('')}</span><span class="equals">=</span><span><small>우리가 쓰는 숫자</small>${total}</span></div>${!values.length?'<p class="muted">모두 꺼져 있으면 0이에요.</p>':''}`;
}
function stage2() {
  const a=state.stage2;
  if(a.phase==='complete')return `${header()}<main class="lesson">${progress(2)}<section class="complete"><div style="font-size:56px">⭐</div><h1>2단계 완료!</h1><p class="lead">전구에는 각각 값이 있고,<br>켜진 전구의 값만 더하면 숫자를 만들 수 있어요.</p><div class="finished-example">00111 = 7</div><h2>다음은 내가 이진수를 읽어 볼 차례!</h2><button class="primary" data-action="next3">3단계로 이동 →</button><button class="text-button again" data-action="again2">2단계 다시 해 보기</button></section></main>`;
  const mission=['mission','success'].includes(a.phase);
  return `${header()}<main class="lesson stage-two">${progress(2)}<div class="lesson-title"><h1>💡 전구마다 값이 달라!</h1><p>이번에는 전구 위에 있는 숫자를 살펴보세요.</p></div>${mission?'<section class="mission"><h2>🎯 미션 · 숫자 7을 만들어 보세요!</h2><span class="pill">켜진 전구의 값을 더해 봐요</span></section>':''}<section class="lab"><div class="lab-heading"><p>${escapeHTML(state.student.name)} 학생, ${mission?'어떤 전구를 켜면 될까요?':'전구를 켜서 숫자를 만들어 볼까요?'}</p><span class="pill">켜진 자리만 더해요</span></div><div class="bulbs">${weightedBulbs()}</div><section class="calculation" aria-live="polite" aria-atomic="true">${calculation()}</section></section>${!mission?`<section class="explore-next">${a.ruleSeen?'<p>다른 모양도 만들어 보세요. 숫자가 어떻게 바뀌나요?</p><button class="primary" data-action="secret2">⭐ 이진수의 비밀 확인하기</button>':`<p>${a.touches<5?'전구를 하나씩 켜 보며 값이 어떻게 바뀌는지 살펴봐요.':'🔍 전구 위의 숫자를 살펴볼까요?'}</p><button class="primary" data-action="rule2" ${a.touches<5?'disabled':''}>자릿값의 규칙 발견하기</button>`}</section>`:'<div class="lesson-bottom"><span class="muted">숫자 7을 만들면 자동으로 성공해요.</span><button class="primary" disabled>3단계로 이동 →</button></div>'}</main>${a.phase==='rule'?doublingCard():a.phase==='summary'?secretCard():a.phase==='success'?modal('<div style="font-size:60px">🎉</div><h2 id="dialog-title">맞았어요!</h2><p class="lead">4 + 2 + 1 = 7</p><div class="finished-example">00111 = 7</div><p class="lead">1인 자리의 숫자만 더하면 돼요!</p><button class="primary" data-action="complete2">2단계 완료하기 ⭐</button>'):''}`;
}
function doublingCard(){
  return modal(`<h2 id="dialog-title">🔍 전구 위의 숫자를 살펴볼까요?</h2><p class="lead">오른쪽부터 하나씩!</p><div class="doubling-values" aria-label="오른쪽부터 1, 2, 4, 8, 16">${PLACE_VALUES.map((v,i)=>`<span style="--order:${4-i}">${v}</span>`).join('')}</div><div class="doubling-equations">${[1,2,4,8].map((v,i)=>`<p style="--order:${i}">${v} × 2 = ${v*2}</p>`).join('')}</div><p class="lead"><b>왼쪽으로 갈수록 값이 2배가 돼요!</b></p><button class="primary" data-action="explore2">알겠어요! 더 눌러 볼래요</button>`);
}
function secretCard(){
  return modal(`<h2 id="dialog-title">⭐ 이진수의 비밀</h2><p class="lead"><b>1이 있는 자리의 숫자만 더해요!</b></p><div class="secret-bulbs">${PLACE_VALUES.map((v,i)=>`<div class="${i%2===0?'included':'excluded'}"><strong>${v}</strong><span aria-hidden="true">💡</span><b>${i%2===0?1:0}</b></div>`).join('')}</div><p class="muted">회색인 0 자리는 더하지 않아요.</p><p class="lead">16 + 4 + 1 = 21</p><div class="finished-example">10101 = 21</div><button class="primary" data-action="mission2">숫자 만들기 미션 도전!</button>`);
}
function stage2Action(action){
  const a=state.stage2;
  switch(action){
    case 'rule2': if(a.touches<5)return true; a.phase='rule';break;
    case 'explore2':a.phase='explore';a.ruleSeen=true;break;
    case 'secret2':a.phase='summary';break;
    case 'mission2':a.phase='mission';a.bulbs=[0,0,0,0,0];break;
    case 'complete2':if(a.phase!=='success')return true;a.phase='complete';break;
    case 'again2':state.stage2=freshStage2();break;
    case 'next3':
      if(a.phase!=='complete')return true;
      state.screen='stage3';state.lastStage='stage3';save();render();window.scrollTo(0,0);return true;
    case 'close3':render();app.querySelector('[data-action="next3"]').focus();return true;
    default:return false;
  }
  save();render();return true;
}
function toggleWeighted(i){
  const a=state.stage2;if(!['explore','mission'].includes(a.phase))return;
  a.bulbs[i]=1-a.bulbs[i];if(a.phase==='explore')a.touches++;
  const b=app.querySelector(`[data-weighted="${i}"]`),bit=a.bulbs[i];
  b.classList.toggle('on',!!bit);b.classList.remove('popped');void b.offsetWidth;b.classList.add('popped');b.setAttribute('aria-pressed',!!bit);b.setAttribute('aria-label',`값 ${PLACE_VALUES[i]} 전구, ${bit?'켜짐, 1':'꺼짐, 0'}`);b.querySelector('.number').textContent=bit;
  app.querySelector('.calculation').innerHTML=calculation();
  if(a.phase==='explore'&&!a.ruleSeen&&a.touches>=5){const next=app.querySelector('.explore-next');next.querySelector('p').textContent='🔍 전구 위의 숫자를 살펴볼까요?';next.querySelector('button').disabled=false;}
  if(a.phase==='mission'&&bulbTotal(a.bulbs)===7){a.phase='success';render();celebrate();announce('맞았어요! 00111 = 7. 1인 자리의 숫자만 더하면 돼요!');}
  save();
}
