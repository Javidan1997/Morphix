import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PACKAGE_IDS, DEFAULTS, ENVIRONMENTS, copy, readDemoSearch, demoSearch, normalizeConfiguration, demoPrice, createCartItem } from '../data/pergolaPackages';
import DemoControls, { dimension } from '../components/pergola/DemoControls';
import { marketing } from '../data/pergolaMarketing';
import { CommercialHero, CommercialBenefits, CommercialFeatures, CommercialPricing, CommercialClosing, CapabilityIcon } from '../components/pergola/CommercialSections';
import { useReveal, useScrolled } from '../components/pergola/motion';
import BriefForm from '../components/pergola/BriefForm';
import '../pergola-campaign.css';
import '../pergola-commercial.css';
import '../pergola-motion.css';

const PergolaScene=lazy(()=>import('../components/pergola/PergolaScene'));
const views=['perspective','front','top'];
function Arrow(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7"/></svg>;}
function Modal({open,onClose,label,children}) {
  const ref=useRef(null);
  useEffect(()=>{if(open)ref.current?.showModal();else ref.current?.close();},[open]);
  return <dialog className="pcg-dialog" ref={ref} aria-label={label} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><button type="button" className="pcg-close" aria-label={label} onClick={onClose}>×</button>{children}</dialog>;
}
export default function PergolaConfigurators() {
  const [initial]=useState(()=>readDemoSearch(window.location.search));
  const [id,setId]=useState(initial.id), [lang,setLang]=useState(initial.lang);
  const [designs,setDesigns]=useState(()=>({...Object.fromEntries(PACKAGE_IDS.map(key=>[key,normalizeConfiguration(key,DEFAULTS[key])])),[initial.id]:initial.config}));
  const [units,setUnits]=useState(initial.lang==='en'?'imperial':'metric');
  const [view,setView]=useState('perspective'), [resetKey,setResetKey]=useState(0);
  const [cart,setCart]=useState([]), [notice,setNotice]=useState(''), [shareFallback,setShareFallback]=useState('');
  const [briefOpen,setBriefOpen]=useState(false);
  const [service,setService]=useState('');
  const t=copy[lang], index=PACKAGE_IDS.indexOf(id), config=designs[id];
  const m=marketing[lang];
  const scrolled=useScrolled(30);
  useReveal([lang,id]);
  const serviceLabel=service||t.names[index], servicePrice=m.services.find(item=>item[0]===service)?.[1]||(id==='essential'?t.from:t.customQuote);
  const price=demoPrice(config), money=value=>new Intl.NumberFormat(lang==='en'?'en-US':lang==='tr'?'tr-TR':'az-AZ',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
  const spec=()=>[
    `Configuro — ${t.software}: ${t.names[index]}`, service||t.type,
    `${t.spec} (${t.note})`,
    `${t.size}: ${[config.width,config.depth,config.height].map(v=>dimension(v,units)).join(' × ')}`,
    `${t.finish}: ${t.colors[['black','white','sand'].indexOf(config.finish)]}`,
    `${t.roof}: ${config.roof}°`,`${t.mount}: ${t.mounts[Number(config.attached)]}`,
    `${t.glass}: ${config.glass?'✓':'—'}${config.glass?` / ${t.open}: ${config.glassOpen}%`:''}`,
    `${t.screen}: ${config.screen?'✓':'—'}${config.screen?` / ${t.open}: ${config.screenOpen}%`:''}`,
    `${t.led}: ${config.led?'✓':'—'}`,
    `${t.environment}: ${t.environments[ENVIRONMENTS.indexOf(config.environment)]}`, `${t.time}: ${config.time==='night'?t.night:t.morning}`,
    id==='commerce'?`${t.estimate}: ${money(price)}. ${t.estimateNote}`:'',
    `${t.software}: ${servicePrice}`,t.delivery,
  ].filter(Boolean).join('\n');

  useEffect(()=>{
    const url=new URL(window.location.href), state=new URLSearchParams(demoSearch(id,config,lang));
    for(const [k,v] of state)url.searchParams.set(k,v);
    window.history.replaceState(window.history.state,'',url);
  },[id,config,lang]);
  useEffect(()=>{
    const oldLang=document.documentElement.lang;
    document.documentElement.lang=lang;
    document.title=`${m.headline.join(' ')} | Configuro`;
    const description=document.querySelector('meta[name="description"]');
    description?.setAttribute('content',`${m.description} ${t.detail}`);
    const canonical=document.querySelector('link[rel="canonical"]');canonical?.setAttribute('href','https://configuro.studio/pergola-configurators');
    for(const name of ['og:title','twitter:title'])document.querySelector(`meta[property="${name}"],meta[name="${name}"]`)?.setAttribute('content',document.title);
    for(const name of ['og:description','twitter:description'])document.querySelector(`meta[property="${name}"],meta[name="${name}"]`)?.setAttribute('content',t.intro);
    return()=>{document.documentElement.lang=oldLang;};
  },[lang,t]);
  useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),4500);return()=>clearTimeout(timer);},[notice]);

  function update(key,value){const patch=typeof key==='object'?key:{[key]:value};setDesigns(old=>({...old,[id]:normalizeConfiguration(id,{...old[id],...patch})}));}
  function selectPackage(next){setId(next);setView('perspective');setResetKey(n=>n+1);setNotice('');setShareFallback('');}
  function showOffer(selected=''){setService(typeof selected==='string'?selected:'');setBriefOpen(true);}
  function tryExperience(environment,time,inside=false){
    setDesigns(old=>({...old,commerce:normalizeConfiguration('commerce',{...old.commerce,environment,time,led:time==='night'||old.commerce.led})}));
    setId('commerce');setView(inside?'inside':'perspective');setResetKey(n=>n+1);
    document.getElementById('packages')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  function reset(){setDesigns(old=>({...old,[id]:normalizeConfiguration(id,DEFAULTS[id])}));setView('perspective');setResetKey(n=>n+1);setNotice(t.resetNotice);}
  async function share(){const url=new URL(window.location.href);url.search=demoSearch(id,config,lang);url.hash='';try{await navigator.clipboard.writeText(url.href);setNotice(t.copied);}catch{setShareFallback(url.href);}}
  function download(){const blob=new Blob([spec()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`configuro-${id}-${lang}.txt`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice(t.saved);}

  return <div className="pcg-page">
    <header className="pcg-header" data-scrolled={scrolled?'':undefined}><div className="pcg-container pcg-nav"><Link className="pcg-logo" to="/" aria-label={t.root}>configuro<span>.</span></Link><nav aria-label="Navigation"><a href="#packages">{t.live}</a><a href="#features">{m.what}</a><a href="#pricing">{m.prices}</a><a href="#examples">{t.examples}</a></nav><label className="pcg-language"><span className="pcg-sr">Language</span><select value={lang} onChange={e=>{setLang(e.target.value);setUnits(e.target.value==='en'?'imperial':'metric');setNotice('');setService('');}}><option value="en">EN</option><option value="tr">TR</option><option value="az">AZ</option></select></label><button className="pcg-primary pcg-nav-cta" onClick={()=>showOffer()}>{t.offer}</button></div></header>
    <CommercialHero m={m} t={t} onOffer={()=>showOffer()} onTry={tryExperience}/>
    <main className="pcg-container">
      <CommercialBenefits m={m}/>
      <section id="packages" aria-label={t.packages}>
        <div className="pcg-demo-heading" data-reveal><h2>{m.live}</h2><p>{m.liveText}</p></div>
        <div className="pcg-packages">{PACKAGE_IDS.map((key,i)=><button type="button" className="pcg-package" key={key} aria-pressed={id===key} onClick={()=>selectPackage(key)} data-reveal style={{'--d':`${i*70}ms`}}><span className="pcg-number">0{i+1}</span><span className="pcg-package-info"><strong>{t.names[i]}</strong><span>{t.subtitles[i]}</span></span><span className="pcg-package-price">{i===0?t.from:t.customQuote}</span></button>)}</div>
        <div className={`pcg-workspace pcg-version-${id}`}>
          <div className={`pcg-stage pcg-time-${config.time}`}><div className="pcg-stage-top"><span><strong>{t.names[index]}</strong> / {t.live}</span><div className="pcg-camera" role="group" aria-label={t.angles}>{views.map((v,i)=><button key={v} aria-pressed={view===v} onClick={()=>setView(v)}>{t.views[i]}</button>)}<button aria-pressed={view==='inside'} onClick={()=>setView(view==='inside'?'perspective':'inside')}>{view==='inside'?t.orbit:t.immersive}</button></div></div>
            <Suspense fallback={<div className="pcg-viewer-status">{t.loading}</div>}><PergolaScene configuration={config} packageId={id} view={view} resetKey={resetKey} text={t} onSnapshot={()=>setNotice(t.snapshotSaved)}/></Suspense>
            <div className="pcg-stage-bottom"><span>{t.hint}</span><span className="pcg-dimension-label">{dimension(config.width,units)} × {dimension(config.depth,units)}</span></div>
          </div>
          <aside className="pcg-controls" aria-label={`${t.names[index]} ${t.controls}`}><div className="pcg-unit-bar"><label>{t.units}<select value={units} onChange={e=>setUnits(e.target.value)}><option value="imperial">{t.imperial}</option><option value="metric">{t.metric}</option></select></label></div>
            <div className="pcg-environment-controls"><label>{t.environment}<select value={config.environment} onChange={e=>update('environment',e.target.value)}>{ENVIRONMENTS.map((env,i)=><option key={env} value={env}>{t.environments[i]}</option>)}</select></label><div className="pcg-time-control" role="group" aria-label={t.time}>{['morning','night'].map(time=><button key={time} aria-pressed={config.time===time} onClick={()=>update('time',time)}>{t[time]}</button>)}</div></div>
            <DemoControls id={id} config={config} update={update} units={units} text={t}/>
            {id==='commerce' && <div className="pcg-estimate"><span>{t.estimate}</span><strong>{money(price)}</strong><small>{t.estimateNote}</small><button className="pcg-primary" onClick={()=>{setCart(items=>[...items,createCartItem(config)]);setNotice(t.added);}}>{t.add}<Arrow/></button></div>}
            <div className="pcg-control-footer"><button className="pcg-text-button" onClick={reset}>{t.reset}</button><button className="pcg-primary" onClick={()=>showOffer()}>{t.get}<Arrow/></button><small>{t.note}</small></div>
          </aside>
        </div>
        <div className="pcg-demo-tools"><p>{t.included[index]}</p><div><button onClick={share}>{t.share}</button><button onClick={download}>{t.download}</button></div></div>
        {shareFallback && <label className="pcg-share-fallback">{t.copyFail}<input aria-label={t.link} readOnly value={shareFallback} onFocus={e=>e.target.select()}/></label>}
        <div className="pcg-notice" role="status" aria-live="polite">{notice}</div>
        {id==='commerce' && <section className="pcg-cart" aria-label={t.cart}><div><h2>{t.cart} <span>({cart.length})</span></h2><p>{t.noOrder}</p></div>{!cart.length?<p>{t.empty}</p>:<><ul>{cart.map((item,i)=><li key={item.id}><div><strong>Commerce · {dimension(item.configuration.width,units)} × {dimension(item.configuration.depth,units)}</strong><span>{t.colors[['black','white','sand'].indexOf(item.configuration.finish)]} · {t.roof}: {item.configuration.roof}°{item.configuration.glass?` · ${t.glass}`:''}{item.configuration.screen?` · ${t.screen}`:''}{item.configuration.led?` · ${t.led}`:''}</span></div><strong>{money(item.price)}</strong><button aria-label={`${t.remove} ${i+1}`} onClick={()=>setCart(items=>items.filter(entry=>entry.id!==item.id))}>{t.remove}</button></li>)}</ul><div className="pcg-cart-total">{t.total}<strong>{money(cart.reduce((sum,item)=>sum+item.price,0))}</strong></div></>}</section>}
      </section>
      <CommercialFeatures m={m} t={t} onTry={tryExperience}/>
      <CommercialPricing m={m} t={t} onOffer={showOffer} onPackage={i=>{selectPackage(PACKAGE_IDS[i]);document.getElementById('packages')?.scrollIntoView({behavior:'smooth'});}}/>
      <section id="examples" className="pcg-evidence">
        <div className="pcg-section-heading" data-reveal><h2>{t.evidence}</h2><p>{t.evidenceText}</p></div>
        <ul className="pcg-capabilities">{m.capabilityList.map(([title,description],i)=><li key={title} data-reveal style={{'--d':`${(i%3)*80}ms`}}><span className="pcg-capability-icon" aria-hidden="true"><CapabilityIcon index={i}/></span><h3>{title}</h3><p>{description}</p></li>)}</ul>
        <div className="pcg-capability-cta" data-reveal><button className="pcg-secondary" onClick={()=>{selectPackage('commerce');document.getElementById('packages')?.scrollIntoView({behavior:'smooth'});}}>{m.try}<Arrow/></button></div>
      </section>
      <CommercialClosing m={m} onOffer={()=>showOffer()}/>
    </main>
    <footer className="pcg-container pcg-footer"><Link className="pcg-logo" to="/">configuro<span>.</span></Link><a href="#packages">{t.live}</a><a href="#pricing">{m.prices}</a><a href="#delivery">{m.workflow}</a><a href="mailto:hello@configuro.studio">hello@configuro.studio</a><span>© {new Date().getFullYear()} Configuro</span></footer>
    <Modal open={briefOpen} onClose={()=>setBriefOpen(false)} label={t.closeDetails}><div className="pcg-brief"><h2>{t.inquiry}</h2><p>{t.inquiryText}</p><div className="pcg-brief-package"><span>{t.selected}</span><strong>{serviceLabel} · {servicePrice}</strong></div><details className="pcg-brief-spec"><summary>{t.spec}</summary><pre>{spec()}</pre></details><BriefForm t={t} lang={lang} packageName={serviceLabel} servicePrice={servicePrice} spec={spec()} configuration={config} packageId={id} onDownload={download}/></div></Modal>
  </div>;
}
