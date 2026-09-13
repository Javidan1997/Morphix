import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Configurator from './ui/Configurator.jsx';
import chairConfig from '../examples/chair.config.js';
import './demo.css';

/**
 * Demo harness. Everything below the <Configurator> is scaffolding to show the
 * integration points — in your own site you would keep the component and drop
 * the rest.
 */
function Demo() {
  const [summary, setSummary] = useState(null);
  const [price, setPrice] = useState(null);
  const config = useMemo(() => chairConfig, []);

  return (
    <main className="demo">
      <header className="demo-head">
        <div>
          <p className="demo-eyebrow">3D Product Configurator Kit</p>
          <h1>{config.name}</h1>
          <p className="demo-sub">
            Every control on the right is generated from <code>examples/chair.config.js</code>.
            Add an option there and it appears here — no component code to write.
          </p>
        </div>
      </header>

      <Configurator
        config={config}
        onChange={(state, nextPrice) => { setSummary(state); setPrice(nextPrice); }}
      />

      <section className="demo-output">
        <h2>What you send to your cart or CRM</h2>
        <p>
          This is <code>onChange</code> firing on every selection. Post it as line item
          properties, a draft order, or straight into your own backend.
        </p>
        <pre>{JSON.stringify({ price, configuration: summary }, null, 2)}</pre>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
