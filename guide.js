// Shared, child-friendly navigation and guide across all six stages.
const BIT_GUIDES={
  stage1:'안녕! 나는 로봇 친구 비트야. 전구를 톡 눌러 봐! 켜지면 1, 다시 눌러 끄면 0이 돼.',
  stage2:'전구 위의 숫자가 보이지? 켜진 전구의 숫자만 더해 봐! 줄이 그어진 숫자는 더하지 않아.',
  stage3:'먼저 1이 있는 자리를 찾아봐. 그 위에 있는 숫자만 더하면 답이 나와! 천천히 해도 괜찮아.',
  stage4:'만들 숫자보다 크지 않은 전구를 켜 봐! 지금 만든 수가 너무 크면, 전구를 다시 눌러 끄면 돼.',
  stage5:'읽기 문제는 켜진 자리만 더해 봐. 만들기 문제는 전구를 직접 켜 봐! 한 문제씩 풀며 별을 모으자.',
  stage6:'생일의 월과 일을 골라 줘! 키링은 위쪽이 월, 아래쪽이 일이야. 1은 노란색, 0은 검정색으로 놓으면 돼.'
};
function decorateStage(){
  if(!BIT_GUIDES[state.screen])return;
  const main=app.querySelector('main'),n=Number(state.screen.slice(5));if(!main)return;
  const navigation=document.createElement('nav');navigation.className='stage-navigation';navigation.setAttribute('aria-label','단계 이동');
  navigation.innerHTML=`<button class="previous-stage" data-guide-action="previous">← ${n===1?'시작 화면으로':'이전 단계로'}</button><span>${n===1?'학교와 이름을 입력하는 화면':`${n-1}단계로 돌아가서 다시 살펴봐요`}</span>`;
  main.prepend(navigation);
  const guide=document.createElement('aside');guide.className='bit-guide';guide.setAttribute('aria-label','로봇 친구 비트의 도움말');
  guide.innerHTML=`<div class="bit-character"><span aria-hidden="true">🤖</span><b>비트</b></div><div class="bit-speech"><strong>비트가 알려 줄게!</strong><p>${BIT_GUIDES[state.screen]}</p></div>`;
  const title=main.querySelector('.lesson-title');if(title)title.after(guide);else navigation.after(guide);
  // The same character speaks the activity's changing hints and explanations.
  app.querySelectorAll('.discovery,.reading-feedback,.making-guide,.making-help,.explore-next').forEach(el=>el.classList.add('bit-hint'));
  const dialog=app.querySelector('.dialog');
  if(dialog){
    dialog.insertAdjacentHTML('afterbegin','<p class="modal-bit">🤖 비트와 함께 살펴봐!</p>');
    dialog.insertAdjacentHTML('beforeend',`<button class="text-button again" data-guide-action="previous">← ${n===1?'시작 화면으로':'이전 단계로'}</button>`);
  }
}
function previousStage(){
  if(!BIT_GUIDES[state.screen])return;
  clearTimeout(discoveryTimer);
  const n=Number(state.screen.slice(5));state.screen=n===1?'welcome':`stage${n-1}`;
  state.lastStage=n===1?'stage1':state.screen;save();render();window.scrollTo(0,0);
  app.querySelector('h1, h2')?.setAttribute('tabindex','-1');app.querySelector('h1, h2')?.focus({preventScroll:true});
}
