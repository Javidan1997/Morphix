import { FINISHES, PRESETS, SIZES } from '../../data/pergolaPackages';

export function dimension(value, units) {
  if(units==='metric')return `${Number(value.toFixed(2))} m`;
  const inches=Math.round(value/.0254), feet=Math.floor(inches/12), rest=inches%12;
  return `${feet}′${rest ? ` ${rest}″` : ''}`;
}
function Range({name,label,value,min,max,step=1,onChange,display}) {
  return <label className="pcg-range" htmlFor={`pcg-${name}`}><span>{label}<output>{display||`${value}°`}</output></span><input id={`pcg-${name}`} type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}/></label>;
}
function Toggle({name,label,checked,onChange}) {
  return <label className="pcg-toggle"><span>{label}</span><input type="checkbox" name={name} checked={checked} onChange={e=>onChange(e.target.checked)}/><span className="pcg-switch" aria-hidden="true"/></label>;
}
// A preset is "active" when every key it sets already matches the design.
const matches=(config,patch)=>Object.entries(patch).every(([key,value])=>config[key]===value);

export default function DemoControls({id,config,update,units,text:t}) {
  const presets=PRESETS[id]||[];
  return <>
    <h2>{t.controls}</h2>
    {presets.length>0 && <div className="pcg-presets"><span className="pcg-presets-label">{t.presets}</span><div className="pcg-preset-row">{presets.map((patch,i)=><button type="button" key={i} className="pcg-preset" aria-pressed={matches(config,patch)} onClick={()=>update(patch)}>{t.presetNames[i]}</button>)}</div></div>}
    {id==='custom' ? <div className="pcg-measurements">{[['width',3,6],['depth',3,5],['height',2.3,3.2]].map(([key,min,max])=><Range key={key} name={key} label={t[key]} min={min} max={max} step={.1} value={config[key]} onChange={v=>update(key,v)} display={dimension(config[key],units)}/>)}</div> : <fieldset><legend>{t.size}</legend><div className="pcg-size-options">{SIZES.map(([w,d])=><button type="button" key={w+d} aria-pressed={Math.abs(config.width-w)<.001&&Math.abs(config.depth-d)<.001} onClick={()=>update({width:w,depth:d})}>{units==='imperial'?`${Math.round(w/.3048)} × ${Math.round(d/.3048)} ft`:`${w.toFixed(1)} × ${d.toFixed(1)} m`}</button>)}</div></fieldset>}
    <fieldset><legend>{t.finish}</legend><div className="pcg-swatches">{Object.entries(FINISHES).map(([key,color],i)=><button type="button" key={key} aria-label={t.colors[i]} aria-pressed={config.finish===key} onClick={()=>update('finish',key)}><span style={{background:color}}/><small>{t.colors[i]}</small></button>)}</div></fieldset>
    <div><Range name="roof" label={t.roof} min={0} max={90} value={config.roof} onChange={v=>update('roof',v)}/><div className="pcg-range-ends"><span>{t.closed} (0°)</span><span>{t.open} (90°)</span></div></div>
    {id!=='essential' && <>
      <fieldset><legend>{t.mount}</legend><div className="pcg-size-options pcg-two">{[false,true].map((value,i)=><button key={String(value)} type="button" aria-pressed={config.attached===value} onClick={()=>update('attached',value)}>{t.mounts[i]}</button>)}</div></fieldset>
      <div className="pcg-addons"><Toggle name="glass" label={t.glass} checked={config.glass} onChange={v=>update('glass',v)}/>{config.glass && <Range name="glassOpen" label={t.glassOpening} min={0} max={100} value={config.glassOpen} display={`${config.glassOpen}%`} onChange={v=>update('glassOpen',v)}/>}
      <Toggle name="screen" label={t.screen} checked={config.screen} onChange={v=>update('screen',v)}/>{config.screen && <Range name="screenOpen" label={t.screenOpening} min={0} max={100} value={config.screenOpen} display={`${config.screenOpen}%`} onChange={v=>update('screenOpen',v)}/>}
      <Toggle name="led" label={t.led} checked={config.led} onChange={v=>update('led',v)}/></div>
    </>}
  </>;
}
