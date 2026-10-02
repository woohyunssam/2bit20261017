// Birthday keeps month/day only. February 29 is valid without collecting a year.
const BIRTHDAY_DAYS=[31,29,31,30,31,30,31,31,30,31,30,31];
const freshStage6=()=>({month:1,day:1,phase:'input',view:'bulbs'});
const birthdayBits=n=>n.toString(2).padStart(5,'0');
function restoreStage6(v){
  if(!v||!Number.isInteger(v.month)||v.month<1||v.month>12||!Number.isInteger(v.day)||v.day<1||v.day>BIRTHDAY_DAYS[v.month-1])return freshStage6();
  return {month:v.month,day:v.day,phase:['input','month','day','card','complete'].includes(v.phase)?v.phase:'input',view:v.view==='blocks'?'blocks':'bulbs'};
}
function birthdayBulbs(n){return `<div class="bulbs birthday-bulbs">${[...birthdayBits(n)].map((bit,i)=>`<div class="bulb weighted ${bit==='1'?'on':''}" aria-label="값 ${PLACE_VALUES[i]}, ${bit==='1'?'켜짐, 1':'꺼짐, 0'}"><span class="place-value">${PLACE_VALUES[i]}</span><span class="icon" aria-hidden="true">💡</span><span class="number" aria-hidden="true">${bit}</span></div>`).join('')}</div>`;}
function birthdayPattern(blocks=true){
  const a=state.stage6;
  return `<div class="birthday-pattern ${blocks?'block-view':'lamp-view'}" aria-label="위쪽은 월, 아래쪽은 일. 왼쪽부터 16, 8, 4, 2, 1 자리"><div class="pattern-values"><span></span>${PLACE_VALUES.map(v=>`<span>${v}</span>`).join('')}</div><div class="pattern-grid">${[a.month,a.day].map((n,row)=>`<div class="pattern-row"><strong class="row-label">${row===0?'월':'일'}<small>${n}${row===0?'월':'일'}</small></strong>${[...birthdayBits(n)].map((bit,i)=>`<div class="pattern-cell ${bit==='1'?'bit-one':'bit-zero'}" style="--cell:${row*5+i}" aria-label="${row===0?'월':'일'}, 값 ${PLACE_VALUES[i]}, ${bit}${blocks?bit==='1'?', 노란색':', 검정색':''}">${blocks?'<span class="block-hole" aria-hidden="true"></span>':`<span class="pattern-lamp" aria-hidden="true">💡</span>`}<span class="pattern-bit">${bit}</span></div>`).join('')}</div>`).join('')}</div></div>`;
}
function birthdayInstructions(){return '<section class="craft-instructions"><h2>이제 진짜 키링을 만들어 봅시다!</h2><ol><li>위쪽 줄은 태어난 <b>월</b></li><li>아래쪽 줄은 태어난 <b>일</b></li><li><b>1은 노란색</b>, <b>0은 검정색</b></li><li>앱 화면과 똑같이 디폼블록을 놓아요.</li></ol><p>왼쪽부터 그대로! 앞에 있는 0도 꼭 놓아요.</p></section>';}
function birthdayLegend(){return '<p class="block-legend"><span><i class="yellow-swatch"></i>1 = 노란색 디폼블록</span><span><i class="black-swatch"></i>0 = 검정색 디폼블록</span></p>';}
function stage6(){
  const a=state.stage6,name=escapeHTML(state.student.name),code=`${birthdayBits(a.month)} / ${birthdayBits(a.day)}`;
  const title=`${header()}<main class="lesson stage-six">${progress(6)}<div class="lesson-title"><h1>🎂 내 생일을 이진수로!</h1><p>마지막 미션! 내 생일을 입력하면 컴퓨터의 언어로 바꾸어 드려요.</p></div>`;
  if(a.phase==='input')return `${title}<section class="birthday-input lab"><h2>${name} 학생의 생일은<br>어떤 모습의 이진수가 될까요?</h2><form id="birthday-form"><fieldset><legend>나의 생일</legend><div class="date-selectors"><label><span class="sr">태어난 월</span><select name="month" aria-label="태어난 월">${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${a.month===i+1?'selected':''}>${i+1}</option>`).join('')}</select> 월</label><label><span class="sr">태어난 일</span><select name="day" aria-label="태어난 일">${Array.from({length:BIRTHDAY_DAYS[a.month-1]},(_,i)=>`<option value="${i+1}" ${a.day===i+1?'selected':''}>${i+1}</option>`).join('')}</select> 일</label></div></fieldset><button class="primary">✨ 내 생일 이진수 만들기</button></form><p class="footnote">생일의 월과 일만 이 브라우저에 저장해요.</p></section></main>`;
  if(a.phase==='month'||a.phase==='day'){
    const month=a.phase==='month',n=month?a.month:a.day;
    return `${title}<section class="lab birthday-conversion"><p class="eyebrow">${month?'먼저 태어난 월을 살펴봐요':'이번에는 태어난 일을 살펴봐요'}</p><h2>${month?'🎂':'🎁'} ${n}${month?'월':'일'}을 이진수로 바꾸면?</h2>${birthdayBulbs(n)}<p class="reading-equation">${makingTerms([...birthdayBits(n)].map(Number))} = ${n}</p><div class="finished-example">${n} = ${birthdayBits(n)}</div><button class="primary" data-birthday-action="${month?'day':'card'}">${month?'태어난 일도 확인하기':'내 생일 카드 보기'}</button></section></main>`;
  }
  if(a.phase==='complete')return `${title}<section class="complete birthday-complete"><h1>🎉 이진수 탐험 완료!</h1><p class="lead">${name} 학생만의<br>생일 암호가 완성되었습니다!</p><div class="student-birthday-card"><p>${escapeHTML(state.student.school)}</p><h2>${name}</h2><p>🎂 <b>${a.month}월 ${a.day}일</b></p><div class="birthday-code">${code}</div>${birthdayPattern(true)}</div>${birthdayLegend()}<div class="birthday-actions"><button class="primary" data-birthday-action="enlarge">🧩 키링 만들기 화면 크게 보기</button><button class="hint-button" data-birthday-action="different">🔄 다른 생일 만들어 보기</button></div><button class="text-button again" data-birthday-action="restart-all">처음부터 다시 체험하기</button></section></main>`;
  return `${title}<section class="lab birthday-card"><h2>🎉 ${name} 학생의 생일 이진수</h2><p class="birthday-date">${a.month}월 ${a.day}일</p><div class="birthday-code">${code}</div><div class="view-switch" role="group" aria-label="생일 카드 보기 방식"><button class="hint-button" data-birthday-action="bulbs" aria-pressed="${a.view==='bulbs'}">💡 전구로 보기</button><button class="hint-button" data-birthday-action="blocks" aria-pressed="${a.view==='blocks'}">🧩 키링으로 보기</button></div><h3>${a.view==='blocks'?'나의 생일 키링':'위쪽은 월, 아래쪽은 일'}</h3>${birthdayPattern(a.view==='blocks')}${a.view==='blocks'?`${birthdayLegend()}${birthdayInstructions()}<div class="birthday-actions"><button class="hint-button" data-birthday-action="enlarge">🧩 키링 만들기 화면 크게 보기</button><button class="primary" data-birthday-action="finish">🎉 내 생일 암호 완성!</button></div>`:'<button class="primary" data-birthday-action="blocks">🧩 키링 모양으로 바꿔 보기</button>'}</section></main>`;
}
function bindBirthdayForm(){
  const form=document.querySelector('#birthday-form');if(!form)return;
  form.addEventListener('change',()=>{
    const month=Number(form.elements.namedItem('month').value),day=Number(form.elements.namedItem('day').value),a=state.stage6;
    const changed=month!==a.month;a.month=month;a.day=Math.min(day,BIRTHDAY_DAYS[month-1]);save();
    if(changed){render();document.querySelector('[name="month"]').focus();}
  });
  form.addEventListener('submit',e=>{e.preventDefault();const a=state.stage6;a.month=Number(form.elements.namedItem('month').value);a.day=Number(form.elements.namedItem('day').value);state.stage6=restoreStage6({...a,phase:'month'});save();render();window.scrollTo(0,0);});
}
function handleBirthdayButton(button){
  const a=state.stage6;let focus;
  switch(button.dataset.birthdayAction){
    case 'day':a.phase='day';break;
    case 'card':a.phase='card';a.view='bulbs';break;
    case 'blocks':a.view='blocks';focus='[data-birthday-action="blocks"]';break;
    case 'bulbs':a.view='bulbs';focus='[data-birthday-action="bulbs"]';break;
    case 'finish':a.phase='complete';celebrate();break;
    case 'different':a.phase='input';a.view='bulbs';break;
    case 'enlarge':
      app.insertAdjacentHTML('beforeend',modal(`<h2 id="dialog-title">🧩 ${escapeHTML(state.student.name)} 학생의 생일 키링</h2><p class="birthday-date">${a.month}월 ${a.day}일</p><div class="birthday-code">${birthdayBits(a.month)} / ${birthdayBits(a.day)}</div>${birthdayPattern(true)}${birthdayLegend()}${birthdayInstructions()}<button class="primary" data-birthday-action="close">돌아가기</button>`));app.querySelector('.dialog').classList.add('craft-large');app.querySelector('main').inert=true;app.querySelector('header').inert=true;app.querySelector('.dialog').focus();return true;
    case 'close':focus='[data-birthday-action="enlarge"]';break;
    case 'restart-all':state.activity=freshActivity();state.stage2=freshStage2();state.stage3=freshStage3();state.stage4=freshStage4();state.stage5=freshStage5();state.stage6=freshStage6();state.screen='welcome';state.lastStage='stage1';break;
    default:return false;
  }
  save();render();if(focus)app.querySelector(focus)?.focus();else window.scrollTo(0,0);return true;
}
