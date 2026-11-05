(()=>{
  'use strict';
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const phone='5535999050218';
  const nav=$('#nav'),menu=$('#menuButton');
  const closeMenu=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu')};
  menu.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')});
  $$('#nav a').forEach(el=>el.addEventListener('click',closeMenu));
  document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

  // Destaques visuais; botões e indicadores permanecem navegáveis.
  const slides=$$('[data-slide]'),dots=$$('[data-slide-to]');
  let current=0;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function showSlide(i){current=(i+slides.length)%slides.length;slides.forEach((el,k)=>{const active=k===current;el.classList.toggle('active',active);el.setAttribute('aria-hidden',String(!active));el.inert=!active});dots.forEach((el,k)=>{const active=k===current;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active))});$('#slideNumber').textContent=String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0')}
  showSlide(0);
  $('#slidePrev').addEventListener('click',()=>{showSlide(current-1);restartAuto()});
  $('#slideNext').addEventListener('click',()=>{showSlide(current+1);restartAuto()});
  dots.forEach((el,k)=>el.addEventListener('click',()=>{showSlide(k);restartAuto()}));
  let interval=null;
  function stopAuto(){if(interval!==null){clearInterval(interval);interval=null}}
  function restartAuto(){stopAuto();if(!reduced&&!document.hidden)interval=setInterval(()=>showSlide(current+1),6500)}
  const slider=$('#slider');
  slider.addEventListener('mouseenter',stopAuto);slider.addEventListener('mouseleave',restartAuto);
  slider.addEventListener('focusin',stopAuto);slider.addEventListener('focusout',e=>{if(!slider.contains(e.relatedTarget))restartAuto()});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAuto();else restartAuto()});
  restartAuto();

  // Lightbox para imagens locais.
  const dialog=$('#lightbox'),img=$('#lightboxImage'),caption=$('#lightboxCaption');let lastFocus=null;
  function openPhoto(button){lastFocus=button;img.src=button.dataset.image;img.alt=button.dataset.caption||'Imagem ampliada';caption.textContent=img.alt;dialog.showModal();document.body.style.overflow='hidden'}
  function closePhoto(){if(dialog.open)dialog.close()}
  $$('[data-image]').forEach(el=>el.addEventListener('click',()=>openPhoto(el)));
  $('#lightboxClose').addEventListener('click',closePhoto);
  dialog.addEventListener('click',e=>{if(e.target===dialog)closePhoto()});
  dialog.addEventListener('close',()=>{document.body.style.overflow='';if(lastFocus?.isConnected)lastFocus.focus()});

  function todayLocal(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  const today=todayLocal();$('#data').min=today;$('#year').textContent=String(new Date().getFullYear());
  function validDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T12:00:00');return !Number.isNaN(d.getTime())&&todayParts(d)===s}
  function todayParts(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function fail(msg,el){$('#formError').textContent=msg;el.focus()}
  $('#bookingForm').addEventListener('submit',e=>{
    e.preventDefault();$('#formError').textContent='';
    const name=$('#nome').value.trim().replace(/\s+/g,' '),number=$('#telefone').value.trim(),digits=number.replace(/\D/g,''),date=$('#data').value,people=$('#pessoas').value,notes=$('#observacoes').value.trim();
    if(name.length<3)return fail('Informe seu nome completo.',$('#nome'));
    if(digits.length<10||digits.length>13)return fail('Informe um telefone com DDD válido.',$('#telefone'));
    if(!validDate(date)||date<todayLocal())return fail('Escolha uma data válida a partir de hoje.',$('#data'));
    const msg=['Olá! Gostaria de consultar um passeio na *Sapucaí Adventure*.','','*SOLICITAÇÃO DE PASSEIO*',`*Nome:* ${name}`,`*WhatsApp:* ${number}`,`*Data:* ${date.split('-').reverse().join('/')}`,`*Pessoas:* ${people}`,notes?`*Observações:* ${notes}`:'','','Sujeito à confirmação de horários, disponibilidade, valores e condições pela equipe.'].filter(Boolean).join('\n');
    const url=`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    const opened=window.open(url,'_blank','noopener,noreferrer');if(!opened)window.location.href=url;
  });
})();
