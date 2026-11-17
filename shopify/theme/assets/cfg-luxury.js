import { cart, emit, formatMoney } from 'cfg-core';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let cleanup;

function initLuxury() {
  cleanup?.();
  const controller = new AbortController();
  const { signal } = controller;
  const root = document.documentElement;
  const motionButton = document.querySelector('[data-lx-motion]');
  let paused = false;
  let frame = 0;
  let previous = 0;
  let currentY = scrollY;
  let targetY = scrollY;
  let effects = [];
  let scenes = [];
  let wordGroups = [];
  const clamp = (value, min=0, max=1) => Math.min(max, Math.max(min, value));
  const smooth = value => value * value * (3 - 2 * value);
  const moving = () => !paused && !reduced.matches;
  const words = [...document.querySelectorAll('[data-lx-words]')];
  words.forEach(el => {
    if (el.dataset.wordsReady) return;
    el.dataset.wordsReady = 'true';
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    const fragment = document.createDocumentFragment();
    text.split(/\s+/).forEach((word, index) => {
      if (index) fragment.append(' ');
      const span = document.createElement('span');
      span.className = 'lx-word';
      span.textContent = word;
      span.setAttribute('aria-hidden', 'true');
      fragment.append(span);
    });
    el.replaceChildren(fragment);
  });
  function measure() {
    effects = [...document.querySelectorAll('[data-lx-parallax], [data-lx-drift]')].map(el => {
      const box = el.parentElement.getBoundingClientRect();
      return { el, top: box.top + scrollY, height: box.height, speed: Number(el.dataset.lxParallax || 0), drift: Number(el.dataset.lxDrift || 0) };
    });
    scenes = [...document.querySelectorAll('[data-lx-chapters]')].map(el => ({el, top:el.getBoundingClientRect().top+scrollY,height:el.offsetHeight,layers:[...el.querySelectorAll('[data-lx-chapter]')],dots:[...el.querySelectorAll('[data-lx-chapter-jump]')]}));
    wordGroups = words.map(el=>({el,top:el.getBoundingClientRect().top+scrollY,height:el.offsetHeight,spans:[...el.querySelectorAll('.lx-word')]}));
    request();
  }
  function paint(time) {
    frame = 0;
    const dt = previous ? Math.min(48, time-previous) : 16;
    previous = time;
    currentY += (targetY-currentY) * (1-Math.exp(-dt/75));
    if (Math.abs(targetY-currentY) < .1) currentY=targetY;
    if (moving()) {
      effects.forEach(({el,top,height,speed,drift}) => {
        if (top > currentY+innerHeight*1.3 || top+height < currentY-innerHeight*.3) return;
        const distance=currentY+innerHeight*.5-top-height*.5;
        if (drift) el.style.transform=`translate3d(${clamp(distance*.1,-100,100)*drift}px,0,0)`;
        else el.style.transform=`translate3d(0,${clamp(distance*speed,-innerHeight*.12,innerHeight*.12)}px,0)`;
      });
      scenes.forEach(({el,top,height,layers,dots})=>{
        const progress=clamp((currentY-top)/Math.max(1,height-innerHeight));
        if (top > currentY+innerHeight || top+height < currentY) return;
        layers.forEach((layer,index)=>{
          const p=index===0?1:smooth(clamp(progress*(layers.length-1)-(index-1)));
          layer.style.clipPath=`inset(${(1-p)*100}% 0 0 0)`;
          const image=layer.querySelector('.lx-chapter__image');
          image.style.transform=`translate3d(0,${(1-p)*35}px,0) scale(${1.06-(p*.06)})`;
        });
        const selected=Math.round(progress*(layers.length-1));
        dots.forEach((dot,index)=>dot.setAttribute('aria-current',String(index===selected)));
      });
      wordGroups.forEach(({top,height,spans})=>{
        if(top>currentY+innerHeight || top+height<currentY)return;
        const p=clamp((currentY+innerHeight*.9-top)/(innerHeight*.6));
        spans.forEach((span,index)=>{span.style.opacity=String(.22+.78*clamp(p*1.5-index/Math.max(1,spans.length)));});
      });
    }
    if (moving() && Math.abs(targetY-currentY)>.1) request();
  }
  function request() { if (!frame && !document.hidden) frame=requestAnimationFrame(paint); }
  function setMode() {
    root.classList.toggle('lx-animated',moving());
    root.classList.toggle('lx-paused',!moving());
    if(motionButton){motionButton.textContent=moving()?motionButton.dataset.pause:motionButton.dataset.resume;motionButton.setAttribute('aria-pressed',String(!moving()));motionButton.hidden=reduced.matches;}
    document.querySelectorAll('.lx-hero video').forEach(video=>{if(moving())video.play().catch(()=>{});else video.pause();});
    document.querySelectorAll('[data-lx-chapter],.lx-chapter__image').forEach(el=>{el.style.clipPath='';el.style.transform='';});
    words.forEach(el=>el.querySelectorAll('.lx-word').forEach(span=>span.style.opacity='1'));
    currentY=targetY=scrollY;
    measure();
  }
  motionButton?.addEventListener('click',()=>{paused=!paused;setMode();},{signal});
  reduced.addEventListener('change',setMode,{signal});
  const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
    if(isIntersecting){target.classList.add('is-revealed');observer.unobserve(target);}
  }),{threshold:.04,rootMargin:'0px 0px -3% 0px'});
  document.querySelectorAll('[data-lx-reveal]').forEach(el=>{el.classList.add('lx-reveal-armed');observer.observe(el);});
  addEventListener('scroll',()=>{targetY=scrollY;root.classList.toggle('is-scrolled',scrollY>80);request();},{passive:true,signal});
  addEventListener('resize',measure,{passive:true,signal});
  addEventListener('load',measure,{once:true,signal});
  document.fonts.ready.then(()=>{if(!signal.aborted)measure();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){currentY=targetY=scrollY;request();}},{signal});
  document.querySelectorAll('[data-lx-chapter-jump]').forEach(button=>button.addEventListener('click',()=>{
    const scene=scenes.find(s=>s.el.contains(button));if(!scene)return;
    const ratio=Number(button.dataset.lxChapterJump)/Math.max(1,scene.layers.length-1);
    scrollTo({top:scene.top+ratio*(scene.height-innerHeight),behavior:moving()?'smooth':'instant'});
  },{signal}));
  const menu=document.querySelector('#LuxuryMenu');
  document.querySelector('[data-lx-menu]')?.addEventListener('click',event=>{menu.showModal();root.classList.add('cfg-lock');event.currentTarget.setAttribute('aria-expanded','true');},{signal});
  document.querySelector('[data-lx-menu-close]')?.addEventListener('click',()=>menu.close(),{signal});
  menu?.addEventListener('close',()=>{root.classList.remove('cfg-lock');document.querySelector('[data-lx-menu]').setAttribute('aria-expanded','false');},{signal});
  const sizeDialog=document.querySelector('#LuxurySize');
  document.querySelector('[data-lx-size-open]')?.addEventListener('click',()=>{sizeDialog.showModal();root.classList.add('cfg-lock');},{signal});
  sizeDialog?.addEventListener('close',()=>root.classList.remove('cfg-lock'),{signal});
  document.querySelector('[data-lx-size-close]')?.addEventListener('click',()=>sizeDialog.close(),{signal});
  document.querySelectorAll('[data-lx-photo]').forEach(button=>button.addEventListener('click',()=>{
    const campaign=button.dataset.lxPhoto==='campaign';
    document.querySelector('[data-lx-main-image]').hidden=campaign;
    document.querySelector('[data-lx-lifestyle]').hidden=!campaign;
    document.querySelectorAll('[data-lx-photo]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  },{signal}));
  document.querySelector('[data-lx-variant]')?.addEventListener('change',event=>{
    const price=Number(event.target.selectedOptions[0].dataset.price);
    document.querySelector('[data-lx-price]').textContent=formatMoney(price);
  },{signal});
  document.querySelectorAll('[data-lx-quantity]').forEach(button=>button.addEventListener('click',()=>{
    const input=document.querySelector('#LuxuryQuantity');input.value=String(clamp(Number(input.value||1)+Number(button.dataset.lxQuantity),1,10));
  },{signal}));
  const catalog=document.querySelector('[data-lx-catalog]');
  if(catalog){
    const cards=[...catalog.querySelectorAll('.lx-card')];
    document.querySelectorAll('[data-lx-filter]').forEach(button=>button.addEventListener('click',()=>{
      document.querySelectorAll('[data-lx-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      let count=0;cards.forEach(card=>{card.hidden=button.dataset.lxFilter!=='all'&&card.dataset.category!==button.dataset.lxFilter;if(!card.hidden)count++;});
      document.querySelector('[data-lx-count]').textContent=`${count} ${document.querySelector('[data-lx-count]').dataset.label}`;
      measure();
    },{signal}));
    document.querySelector('[data-lx-sort]')?.addEventListener('change',event=>{
      const type=event.target.value;
      const sorted=[...cards].sort((a,b)=>type==='price-asc'?Number(a.dataset.price)-Number(b.dataset.price):type==='price-desc'?Number(b.dataset.price)-Number(a.dataset.price):type==='name'?a.dataset.title.localeCompare(b.dataset.title):cards.indexOf(a)-cards.indexOf(b));
      catalog.append(...sorted);measure();
    },{signal});
  }
  cart.get().then(state=>{if(!signal.aborted)emit('cfg:cart',state);}).catch(()=>{});
  setMode();
  root.classList.toggle('is-scrolled',scrollY>80);
  cleanup=()=>{controller.abort();observer.disconnect();cancelAnimationFrame(frame);};
}
initLuxury();
document.addEventListener('shopify:section:load',initLuxury);
document.addEventListener('shopify:section:unload',initLuxury);
