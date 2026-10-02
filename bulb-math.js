// Shared equation viewer. Fixed question patterns are inspected, never toggled.
function installBulbMath(){
  app.querySelectorAll('.bulbs').forEach(group=>{
    if(!group.querySelector('.bulb'))return;
    const panel=document.createElement('div');panel.className='bulb-math';panel.setAttribute('role','status');panel.setAttribute('aria-live','polite');
    group.after(panel);panel.innerHTML='🤖 비트 · 전구를 누르면 더하는 과정을 보여 줄게!';
    group.querySelectorAll('.bulb').forEach((bulb,i)=>{
      bulb.dataset.mathPosition=i;
      if(bulb.tagName!=='BUTTON'||bulb.disabled){
        bulb.dataset.mathInspect='true';bulb.removeAttribute('disabled');bulb.setAttribute('role','button');bulb.tabIndex=0;
        bulb.setAttribute('aria-label',`${PLACE_VALUES[i]} 자리 전구, ${bulb.classList.contains('on')?'켜짐. 누르면 덧셈 보기':'꺼짐. 더하지 않는 자리'}`);
      }
    });
  });
  app.querySelectorAll('.lamp-view .pattern-row').forEach(row=>{
    row.querySelectorAll('.pattern-cell').forEach((cell,i)=>{cell.dataset.mathPosition=i;cell.dataset.mathInspect='true';cell.tabIndex=0;cell.setAttribute('role','button');});
  });
}
function updateBulbMath(group,chosen=-1){
  const bulbs=[...group.querySelectorAll('.bulb')],panel=group.nextElementSibling;
  if(!panel?.classList.contains('bulb-math'))return;
  // Stage 1 teaches states only; its equation counts lit bulbs, not binary values.
  const introductory=state.screen==='stage1';
  const values=bulbs.flatMap((b,i)=>b.classList.contains('on')?[{v:introductory?1:PLACE_VALUES[i],i}]:[]);
  let sum=0;
  const steps=values.map(({v,i},j)=>{const before=sum;sum+=v;return `<span class="sum-step ${i===chosen?'sum-picked':''}">${j?`${before} + ${v} = ${sum}`:`${v}`}</span>`;});
  panel.innerHTML=`<strong>🤖 비트 · ${introductory?'켜진 전구는 몇 개일까?':'켜진 자리만 차례로 더해 봐!'}</strong><div class="sum-expression">${values.length?values.map(({v,i})=>`<span class="${i===chosen?'sum-picked':''}">${v}</span>`).join(' + '):'0'} = <b>${sum}</b>${introductory?'개':''}</div><div class="sum-steps">${steps.join('<span aria-hidden="true"> → </span>')}</div><p>${introductory?'전구 개수를 세어 봤어! 꺼진 전구는 세지 않아.':'줄이 그어진 자리는 더하지 않아.'}</p>`;
}
document.getElementById('app').addEventListener('click',event=>{
  const bulb=event.target.closest('.bulb,.lamp-view .pattern-cell');if(!bulb)return;
  const oldGroup=bulb.closest('.bulbs'),position=Number(bulb.dataset.mathPosition);
  const groupIndex=[...app.querySelectorAll('.bulbs')].indexOf(oldGroup);
  const oldScreen=state.screen;
  setTimeout(()=>{
  if(state.screen!==oldScreen)return;
  const group=oldGroup?.isConnected?oldGroup:app.querySelectorAll('.bulbs')[groupIndex];
  if(group&&group.isConnected){updateBulbMath(group,position);return;}
  if(bulb.matches('.pattern-cell')){
    const row=bulb.closest('.pattern-row');let panel=row.closest('.birthday-pattern').querySelector('.birthday-sum');
    if(!panel){panel=document.createElement('div');panel.className='birthday-sum bulb-math';panel.setAttribute('role','status');row.closest('.birthday-pattern').append(panel);}
    const cells=[...row.querySelectorAll('.pattern-cell')],values=cells.flatMap((c,i)=>c.classList.contains('bit-one')?[PLACE_VALUES[i]]:[]);let sum=0;
    panel.innerHTML=`<strong>🤖 비트 · ${row.querySelector('.row-label').textContent}</strong><div class="sum-expression">${values.join(' + ')} = ${values.reduce((s,v)=>s+v,0)}</div><div class="sum-steps">${values.map((v,i)=>{const before=sum;sum+=v;return i?`${before} + ${v} = ${sum}`:`${v}`;}).join(' → ')}</div>`;
  }
  },0);
});
document.getElementById('app').addEventListener('keydown',event=>{const target=event.target.closest('[data-math-inspect]');if(target&&target.tagName!=='BUTTON'&&['Enter',' '].includes(event.key)){event.preventDefault();target.click();}});



