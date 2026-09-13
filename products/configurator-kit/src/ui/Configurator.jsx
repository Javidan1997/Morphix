import { useCallback, useEffect, useRef, useState } from 'react';
import { createConfigurator } from '../core/engine.js';
import Controls from './Controls.jsx';
import './configurator.css';

/**
 * Drop-in React configurator.
 *
 * <Configurator config={myConfig} onChange={(state, price) => ...} />
 *
 * The engine owns the Three.js scene and is created once; React only mirrors
 * its state for the controls, so option changes never re-render the canvas.
 */
export default function Configurator({
  config,
  onChange,
  showPrice = true,
  showViews = true,
  showTools = true,
  className = '',
  children,
}) {
  const hostRef = useRef(null);
  const engineRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [status, setStatus] = useState('loading');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [state, setState] = useState(null);
  const [price, setPrice] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let engine = null;
    setStatus('loading');
    setProgress(0);

    createConfigurator({
      container: hostRef.current,
      config,
      onProgress: value => { if (!cancelled) setProgress(value); },
      onChange: (nextState, nextPrice) => {
        if (cancelled) return;
        setState(nextState);
        setPrice(nextPrice);
        onChangeRef.current?.(nextState, nextPrice);
      },
    })
      .then(created => {
        if (cancelled) { created.dispose(); return; }
        engine = created;
        engineRef.current = created;
        setState(created.getState());
        setPrice(created.price());
        setAutoRotate(created.autoRotate);
        setStatus('ready');
      })
      .catch(err => {
        if (cancelled) return;
        console.error('[configurator]', err);
        setError(err.message || 'Could not start the configurator.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
      engine?.dispose();
      engineRef.current = null;
    };
  }, [config]);

  const set = useCallback((id, value) => {
    engineRef.current?.set(id, value);
    setState(engineRef.current?.getState() ?? null);
  }, []);

  const toggleRotate = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.setAutoRotate(!engine.autoRotate);
    setAutoRotate(engine.autoRotate);
  }, []);

  const views = config.views ? Object.keys(config.views) : [];
  const currency = config.price?.currency || 'USD';

  return (
    <div className={`cfg ${className}`.trim()}>
      <div className="cfg-stage">
        <div className="cfg-canvas" ref={hostRef} />

        {status === 'loading' && (
          <div className="cfg-overlay" role="status">
            <div className="cfg-spinner" aria-hidden="true" />
            <p>Loading {config.name || 'model'}…</p>
            <div className="cfg-progress"><span style={{ transform: `scaleX(${Math.max(0.05, progress)})` }} /></div>
          </div>
        )}

        {status === 'error' && (
          <div className="cfg-overlay cfg-overlay-error" role="alert">
            <p>{error}</p>
            <small>Check the model URL and that the file is reachable.</small>
          </div>
        )}

        {status === 'ready' && showViews && views.length > 0 && (
          <div className="cfg-views" role="group" aria-label="Camera views">
            {views.map(name => (
              <button key={name} type="button" onClick={() => engineRef.current?.setView(name)}>{name}</button>
            ))}
          </div>
        )}

        {status === 'ready' && showTools && (
          <div className="cfg-tools">
            <button type="button" aria-pressed={autoRotate} onClick={toggleRotate} title="Auto-rotate">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3a9 9 0 1 1-8.5 6" /><path d="M3 3v5h5" /></svg>
              <span className="cfg-sr">Auto-rotate</span>
            </button>
            <button type="button" onClick={() => engineRef.current?.snapshot()} title="Save image">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 8h3l2-2h8l2 2h3v11H3z" /><circle cx="12" cy="13" r="3.4" /></svg>
              <span className="cfg-sr">Save image</span>
            </button>
          </div>
        )}
      </div>

      <aside className="cfg-panel">
        {state && (
          <Controls options={config.options} state={state} onChange={set} />
        )}

        {showPrice && price !== null && (
          <div className="cfg-price">
            <span>Total</span>
            <strong>{new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)}</strong>
          </div>
        )}

        {children}
      </aside>
    </div>
  );
}
