import { useState } from 'react';

function Arrow(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7"/></svg>;}
const root='/pergola-configurators/';

// One icon per entry in marketing.capabilityList, in the same order.
const CAPABILITY_ICONS=[
  <><path d="M12 3 4 7.2v9.6L12 21l8-4.2V7.2z"/><path d="M4 7.2 12 11.5l8-4.3M12 11.5V21"/></>,
  <><circle cx="9" cy="12" r="3.6"/><path d="M9 4.5V3m0 18v-1.5M3 12H1.5m15 0H15m-9.7-6.3L4.2 4.6m9.6 14.8-1.1-1.1m0-12.6 1.1-1.1M4.2 19.4l1.1-1.1"/><path d="M21.5 15.4a5.4 5.4 0 0 1-6.9-6.9 5.7 5.7 0 1 0 6.9 6.9Z"/></>,
  <><path d="M3 19h18M3 19l5.5-7 3.5 4.2L15.5 11 21 19"/><circle cx="8" cy="7" r="2"/></>,
  <><path d="M3.5 9.5h17a1.5 1.5 0 0 1 1.5 1.5v3.6a1.5 1.5 0 0 1-1.5 1.5h-3.3a2 2 0 0 1-1.6-.8L14 13.7h-4l-1.6 1.6a2 2 0 0 1-1.6.8H3.5A1.5 1.5 0 0 1 2 14.6V11a1.5 1.5 0 0 1 1.5-1.5Z"/></>,
  <><path d="M10 13.8a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2"/><path d="M14 10.2a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2"/></>,
  <><path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z"/><path d="M13.5 3v5.5H19M9 13h6m-6 3.5h4"/></>,
  <><rect x="3" y="4.5" width="18" height="15" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m3.5 17 5-4.5 3.7 3.3 3-2.6 5.3 4.3"/></>,
  <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z"/></>,
  <><path d="M3 5h2.2l2.3 10.5h9.6L19 8H6"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="16.5" cy="19" r="1.4"/></>,
];
export function CapabilityIcon({index}){
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{CAPABILITY_ICONS[index%CAPABILITY_ICONS.length]}</svg>;
}

export function CommercialHero({m,t,onOffer,onTry}){
  return <section className="pcg-hero">
    <img className="pcg-hero-image" src={`${root}hero-morning.png`} alt="" fetchPriority="high" width="1536" height="1024"/>
    <div className="pcg-hero-copy"><h1><span className="pcg-line"><span>{m.headline[0]}</span></span><span className="pcg-line"><span>{m.headline[1]}</span></span></h1><p>{m.description}</p><div className="pcg-hero-actions"><a className="pcg-primary" href="#packages">{m.try}<Arrow/></a><button className="pcg-secondary" onClick={onOffer}>{m.offer}</button></div><small>{m.priceLine}</small></div>
    <div className="pcg-hero-panel"><strong>{t.controls}</strong><ul><li>{t.finish}<span>03</span></li><li>{t.roof}<span>0–90°</span></li><li>{t.glass}<span>+</span></li><li>{t.led}<span>+</span></li></ul><button className="pcg-primary" onClick={()=>onTry('studio','morning')}>{t.live}<Arrow/></button></div>
    <span className="pcg-concept-caption">{m.preview}</span>
  </section>;
}

export function CommercialBenefits({m}){
  return <section className="pcg-benefits"><div className="pcg-center-heading" data-reveal><h2>{m.brand}</h2><p>{m.audience}</p></div><div className="pcg-benefit-columns">{m.benefits.map(([title,description],i)=><article key={title} data-reveal style={{'--d':`${i*90}ms`}}><span>0{i+1}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>;
}

export function CommercialFeatures({m,t,onTry}){
  const [night,setNight]=useState(false);
  return <>
    <section id="features" className="pcg-feature-story"><div className="pcg-feature-copy"><h2 data-reveal>{m.features}</h2><p data-reveal>{m.featuresText}</p><ol>{m.featureList.map(([title,description],i)=><li key={title} data-reveal style={{'--d':`${i*90}ms`}}><span>0{i+1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol></div><figure data-reveal><img src={`${root}detail.png`} alt={m.features} loading="lazy" width="1024" height="1024"/><figcaption>{m.preview}</figcaption></figure></section>
    <section className="pcg-experience-grid" aria-label={t.environment}><div className={`pcg-atmosphere ${night?'is-night':''}`} data-reveal><img src={`${root}${night?'hero-night':'hero-morning'}.png`} alt="" loading="lazy" width="1536" height="1024"/><div className="pcg-atmosphere-copy"><h2>{m.sceneTitle}</h2><p>{m.sceneText}</p><button className="pcg-link-button" onClick={()=>onTry('pool',night?'night':'morning')}>{m.sceneTry}<Arrow/></button></div><div className="pcg-atmosphere-bottom"><div className="pcg-mood-tabs" role="group" aria-label={t.time}><button aria-pressed={!night} onClick={()=>setNight(false)}>{t.morning}</button><button aria-pressed={night} onClick={()=>setNight(true)}>{t.night}</button></div><small>{m.preview}</small></div></div><div className="pcg-vr-story" data-reveal style={{'--d':'110ms'}}><h2>{m.vrTitle}</h2><p>{m.vrText}</p><div className="pcg-spatial-mark" aria-hidden="true"><svg viewBox="0 0 250 180" fill="none" stroke="currentColor" strokeWidth="1.3"><ellipse cx="125" cy="136" rx="111" ry="30" stroke="#b8c6d5"/><path d="M55 140V54l89-22 55 25v84M55 54l56 27 88-24M111 81v84M144 32v86M55 68l56 27 88-24M67 52l57 26m-42-30 57 26m-42-30 57 26m-42-30 57 26"/><circle cx="226" cy="124" r="5" fill="#0071e3" stroke="none"/></svg><span>360°</span></div><button className="pcg-link-button" onClick={()=>onTry('rooftop','morning',true)}>{m.vrTry}<Arrow/></button></div></section>
    <div className="pcg-scene-shortcuts" data-reveal><span>{m.sceneLabel}</span>{['patio','pool','deck','rooftop'].map((env,i)=><button key={env} onClick={()=>onTry(env,'morning')}>{t.environments[i+1]}<Arrow/></button>)}</div>
  </>;
}

export function CommercialPricing({m,t,onOffer,onPackage}){
  return <>
    <section id="pricing" className="pcg-commercial-pricing"><div className="pcg-pricing-intro" data-reveal><h2>{m.pricing}</h2><p>{m.pricingText}</p></div><div className="pcg-service-cards">{m.services.map(([name,price,description,features],i)=><article className={i===0?'pcg-featured-price':''} key={name} data-reveal style={{'--d':`${i*90}ms`}}><h3>{name}</h3><strong className="pcg-service-price">{price}</strong><small>{m.starting}</small><p>{description}</p><ul>{features.map(feature=><li key={feature}>{feature}</li>)}</ul><button className={i===0?'pcg-primary':'pcg-secondary'} onClick={()=>onOffer(name)}>{m.offer}<Arrow/></button></article>)}</div><p className="pcg-scope-note">{m.scopeNote}</p></section>
    <section className="pcg-comparison"><div className="pcg-section-heading" data-reveal><h2>{m.compare}</h2><p>{m.compareText}</p></div><div className="pcg-comparison-scroll" tabIndex="0" role="region" aria-label={m.compare} data-reveal><table><thead><tr><th scope="col">{t.packages}</th>{t.names.map((name,i)=><th scope="col" key={name}><button onClick={()=>onPackage(i)}>{name}<Arrow/></button></th>)}</tr></thead><tbody>{m.rows.map(([name,...values])=><tr key={name}><th scope="row">{name}</th>{values.map((value,i)=><td key={i}>{value}</td>)}</tr>)}</tbody></table></div></section>
  </>;
}

export function CommercialClosing({m,onOffer}){
  return <>
    <section id="delivery" className="pcg-delivery"><div className="pcg-delivery-heading" data-reveal><h2>{m.delivery}<br/><span>{m.month}</span></h2><p>{m.deliveryText}</p></div><ol className="pcg-timeline">{m.weeks.map(([name,description],i)=><li key={name} data-reveal style={{'--d':`${i*100}ms`}}><span className="pcg-week-number">0{i+1}</span><small>{m.week} {i+1}</small><h3>{name}</h3><p>{description}</p></li>)}</ol><p className="pcg-inputs" data-reveal>{m.inputs}</p></section>
    <section className="pcg-faq"><h2 data-reveal>{m.faq}</h2><div data-reveal>{m.faqs.map(([question,answer])=><details key={question}><summary>{question}<svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.7" aria-hidden="true"><path d="m5 9 7 7 7-7"/></svg></summary><p>{answer}</p></details>)}</div></section>
    <section className="pcg-final-cta" data-reveal><h2>{m.final}</h2><p>{m.finalText}</p><button className="pcg-primary" onClick={onOffer}>{m.offer}<Arrow/></button><span>{m.priceLine}</span></section>
  </>;
}
