// Phase 1 — everything that does not need the live node-attribute docs:
// colour styles, text styles (with real Inter selectors) and the Configurator3D
// code file. Idempotent: tries "create", falls back to "update".
import { readFileSync } from 'node:fs';

const URL_ = process.env.FRAMER_MCP_URL;
const DRY = process.argv.includes('--dry');

async function call(name, args) {
  if (DRY) return { ok: true, text: '(dry run)' };
  const res = await fetch(URL_, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method: 'tools/call', params: { name, arguments: args } }),
  });
  let text = await res.text();
  if (text.includes('\ndata:') || text.startsWith('event:')) {
    const frames = text.split('\n').filter(l => l.startsWith('data:')).map(l => l.slice(5).trim());
    text = frames.at(-1) || text;
  }
  const body = JSON.parse(text);
  if (body.error) return { ok: false, text: JSON.stringify(body.error) };
  const out = (body.result?.content ?? []).map(c => c.text ?? '').join('\n');
  const failed = body.result?.isError || /^Encountered an error/i.test(out);
  return { ok: !failed, text: out };
}

async function upsert(tool, stylePath, properties) {
  let r = await call(tool, { type: 'create', stylePath, properties });
  if (!r.ok && /exist|already|duplicate/i.test(r.text)) r = await call(tool, { type: 'update', stylePath, properties });
  return r;
}

// Abort early and clearly if the Framer-side plugin is not open.
if (!DRY) {
  const probe = await call('getProjectXml', {});
  if (!probe.ok) { console.log('NOT CONNECTED:', probe.text.slice(0, 300)); process.exit(3); }
  console.log('connected ✓');
}

// ---- resolve Inter weight selectors from Framer itself -------------------
let fonts = {};
if (!DRY) {
  const r = await call('searchFonts', { query: 'Inter' });
  const selectors = [...r.text.matchAll(/GF;Inter-[\w]+/g)].map(m => m[0]);
  const pick = (...want) => want.map(w => selectors.find(s => s.toLowerCase() === `gf;inter-${w}`)).find(Boolean);
  fonts = {
    700: pick('700', 'bold'),
    600: pick('600', 'semibold'),
    500: pick('500', 'medium'),
    400: pick('regular', '400'),
  };
  console.log('Inter selectors:', JSON.stringify(fonts));
}

const colors = [
  ['Ink', '#14181D', '#F7F8FA'], ['Muted', '#6B7480', '#9AA3AF'], ['Line', '#E3E7EC', '#2C323A'],
  ['Surface', '#FFFFFF', '#1C2128'], ['Canvas', '#F7F8FA', '#14181D'], ['Stage', '#ECEEF1', '#242A32'],
  ['Accent', '#14181D', '#F7F8FA'],
];
let ok = 0, bad = 0;
for (const [name, light, dark] of colors) {
  const r = await upsert('manageColorStyle', `/Atelier/${name}`, { light, dark });
  r.ok ? ok++ : (bad++, console.log(`  colour ${name} failed: ${r.text.slice(0, 160)}`));
}
console.log(`colour styles: ${ok} ok, ${bad} failed`);

const text = [
  ['Display', 'h1', '72px', '1.02em', '-0.03em', 700],
  ['H2', 'h2', '40px', '1.1em', '-0.025em', 700],
  ['H3', 'h3', '20px', '1.3em', '-0.015em', 600],
  ['Body L', 'p', '18px', '1.6em', '-0.005em', 400],
  ['Body', 'p', '16px', '1.65em', '0em', 400],
  ['Caption', 'p', '13px', '1.5em', '0.02em', 500, 'uppercase'],
];
ok = 0; bad = 0;
for (const [name, tag, fontSize, lineHeight, letterSpacing, weight, transform] of text) {
  const properties = { tag, fontSize, lineHeight, letterSpacing, color: '/Atelier/Ink' };
  if (fonts[weight]) properties.font = fonts[weight];
  if (transform) properties.transform = transform;
  let r = await upsert('manageTextStyle', `/Atelier/${name}`, properties);
  // Retry without the colour reference if the server wants a literal colour.
  if (!r.ok && /color/i.test(r.text)) { properties.color = '#14181D'; r = await upsert('manageTextStyle', `/Atelier/${name}`, properties); }
  r.ok ? ok++ : (bad++, console.log(`  text ${name} failed: ${r.text.slice(0, 160)}`));
}
console.log(`text styles: ${ok} ok, ${bad} failed`);

const source = readFileSync(process.argv[2], 'utf8');
const cf = await call('createCodeFile', { name: 'Configurator3D.tsx', content: source });
console.log(cf.ok ? 'code file: Configurator3D.tsx created ✓' : `code file: ${cf.text.slice(0, 240)}`);
