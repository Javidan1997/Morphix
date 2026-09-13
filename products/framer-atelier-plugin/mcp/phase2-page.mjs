// Phase 2 — builds the whole Atelier page, copy included, through updateXmlForNode.
// Usage: node phase2-page.mjs <desktopNodeId> <configuratorInsertUrl> [--dry]
//
// Written against the node-attribute docs getProjectXml returns. Two things
// learned from the live project: new frames default to a white background, so
// every frame sets one explicitly; and text colour can only come from a text
// style, which is why phase 1 creates Muted and White variants.

const URL_ = process.env.FRAMER_MCP_URL;
const [, , desktopId, configUrl] = process.argv;
const DRY = process.argv.includes('--dry');
if (!desktopId || !configUrl) { console.error('usage: phase2-page.mjs <desktopNodeId> <insertUrl>'); process.exit(2); }

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const CLEAR = 'rgba(0,0,0,0)';

const attrs = o => Object.entries(o).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
const frame = (name, a, ...kids) => `<Frame ${attrs({ name, backgroundColor: CLEAR, height: 'fit-content', ...a })}>${kids.join('')}</Frame>`;
const stack = (name, dir, a, ...kids) => frame(name, { layout: 'stack', stackDirection: dir, ...a }, ...kids);
const text = (style, body, name) => `<Text ${attrs({ name, inlineTextStyle: `/Atelier/${style}` })}>${esc(body)}</Text>`;
const section = (name, a, ...kids) => stack(name, 'vertical', { width: '100%', padding: '120px 40px 120px 40px', gap: '40px', ...a }, ...kids);
const rule = () => frame('Rule', { width: '100%', height: '1px', backgroundColor: '/Atelier/Line' });
const button = (label, dark = true) => stack('Button', 'horizontal', {
  width: 'fit-content', stackAlignment: 'center', padding: '14px 26px 14px 26px', borderRadius: '999px',
  backgroundColor: dark ? '/Atelier/Ink' : '/Atelier/Surface',
}, text(dark ? 'Button' : 'Button Ink', label));
const configurator = (name, props) => stack(name, 'vertical', {
  width: '100%', height: '560px', borderRadius: '16px', backgroundColor: '/Atelier/Stage', overflow: 'hidden',
}, `<ComponentInstance ${attrs({ name: 'Configurator 3D', insertUrl: configUrl, width: '100%', height: '100%', ...props })} />`);

// ---- sections --------------------------------------------------------------
const hero = section('Hero', { stackDirection: 'horizontal', stackAlignment: 'center', gap: '64px', padding: '96px 40px 120px 40px' },
  stack('Hero Copy', 'vertical', { width: '1fr', gap: '24px' },
    text('Caption Muted', 'Made to order'),
    text('Display', 'Built to your measure.'),
    text('Body L Muted', 'Turn it, change the finish, see it from every angle before you commit. Every piece is made to order in our workshop and shipped within four weeks.'),
    stack('Actions', 'horizontal', { width: 'fit-content', stackAlignment: 'center', gap: '20px' },
      button('Configure yours'), text('Button Ink', 'See specification →')),
    text('Caption Muted', 'From $480 · Free delivery · 10-year frame warranty'),
  ),
  stack('Hero Stage', 'vertical', { width: '1fr' },
    configurator('Configurator Frame', { transparent: true, autoRotate: true, rotateSpeed: 0.8, allowZoom: false, showSwatches: true }),
  ),
);

const trust = stack('Trust Strip', 'horizontal', {
  width: '100%', stackDistribution: 'space-between', stackAlignment: 'center', padding: '28px 40px 28px 40px',
  borderWidth: '1px 0px 1px 0px', borderStyle: 'solid', borderColor: '/Atelier/Line',
}, ...['As seen in Dwell', 'Wallpaper*', 'Kinfolk', 'Monocle', 'Design Milk'].map(n => text('Caption Muted', n)));

const featureItems = [
  ['Solid oak frame', 'Kiln-dried, mortise-and-tenon jointed, and finished by hand. No veneer, no particle board.'],
  ['Choose your textile', 'Twelve upholstery options from our Belgian mill, all rated for 40,000 rub cycles.'],
  ['Made to order', 'Built after you order, so nothing sits in a warehouse and nothing goes to landfill.'],
];
const features = section('Features', { stackAlignment: 'center', gap: '56px' },
  text('H2', 'Considered down to the joint.'),
  stack('Feature Row', 'horizontal', { width: '100%', gap: '40px', stackAlignment: 'start' },
    ...featureItems.map(([t, b], i) => stack(`Feature ${i + 1}`, 'vertical', {
      width: '1fr', gap: '12px', padding: '28px', borderRadius: '16px', backgroundColor: '/Atelier/Surface',
    }, text('Caption Muted', `0${i + 1}`), text('H3', t), text('Body Muted', b))),
  ),
);

const detailRows = [['Material', 'European oak, hand-oiled'], ['Upholstery', 'Wool blend, 12 colours'], ['Lead time', '4 weeks'], ['Delivery', 'Free, white-glove']];
const detail = section('Detail', { stackDirection: 'horizontal', stackAlignment: 'center', gap: '64px' },
  stack('Detail Stage', 'vertical', { width: '1fr' },
    configurator('Configurator Frame', { background: '#ECEEF1', zoom: 1.45, cameraHeight: 0.45, autoRotate: false, showSwatches: false, allowZoom: true }),
  ),
  stack('Detail Copy', 'vertical', { width: '1fr', gap: '28px' },
    text('H2', 'Every angle, before you buy.'),
    text('Body L Muted', 'Drag to turn it. Zoom into the joinery. What you see is what gets built.'),
    stack('Detail List', 'vertical', { width: '100%', gap: '0px' },
      ...detailRows.flatMap(([k, v]) => [rule(), stack('Row', 'horizontal', {
        width: '100%', stackDistribution: 'space-between', stackAlignment: 'center', padding: '16px 0px 16px 0px',
      }, text('Caption Muted', k), text('Body', v))])),
  ),
);

const specs = [
  ['Dimensions', 'W 72 × D 80 × H 96 cm'], ['Seat height', '42 cm'], ['Frame', 'Solid European oak'],
  ['Upholstery', 'Wool blend, 40,000 Martindale'], ['Weight', '18 kg'], ['Assembly', 'None required'],
  ['Lead time', '4 weeks'], ['Warranty', '10 years'],
];
const specCol = rows => stack('Spec Column', 'vertical', { width: '1fr', gap: '0px' },
  ...rows.flatMap(([k, v]) => [stack('Spec Row', 'horizontal', {
    width: '100%', stackDistribution: 'space-between', stackAlignment: 'center', padding: '18px 0px 18px 0px',
  }, text('Caption Muted', k), text('Body', v)), rule()]));
const specification = stack('Specification Wrap', 'vertical', { width: '100%', padding: '0px 40px 0px 40px' },
  section('Specification', { backgroundColor: '/Atelier/Surface', borderRadius: '16px', padding: '72px 56px 72px 56px' },
    text('H2', 'Specification.'),
    stack('Spec Grid', 'horizontal', { width: '100%', gap: '56px', stackAlignment: 'start' },
      specCol(specs.slice(0, 4)), specCol(specs.slice(4))),
  ));

const testimonial = section('Testimonial', { stackAlignment: 'center', gap: '20px' },
  stack('Quote', 'vertical', { width: '720px', stackAlignment: 'center', gap: '20px' },
    text('H2', '“It arrived looking exactly like the configurator. That never happens.”'),
    text('Caption Muted', 'Marta L. · Verified buyer'),
  ));

const faqs = [
  ['Can I see a fabric sample?', 'Yes — order up to four free swatches and we post them within two working days.'],
  ['How long does delivery take?', 'Four weeks from order. Every piece is made after you buy it, then delivered white-glove.'],
  ['What if it does not fit?', 'You have 30 days to return it. We collect it at no cost if it arrives damaged.'],
  ['Is it assembled?', 'It arrives fully assembled. Unwrap it and sit down.'],
  ['Do you ship internationally?', 'Across the EU, UK and US. Duties and delivery are quoted at checkout.'],
];
const faq = section('FAQ', { stackDirection: 'horizontal', stackAlignment: 'start', gap: '64px' },
  stack('FAQ Heading', 'vertical', { width: '1fr', gap: '16px' },
    text('H2', 'Questions.'), text('Body Muted', 'Anything else, write to hello@atelier.studio')),
  stack('FAQ Items', 'vertical', { width: '1.5fr', gap: '0px' },
    ...faqs.flatMap(([q, a]) => [rule(), stack('FAQ Item', 'vertical', { width: '100%', gap: '8px', padding: '22px 0px 22px 0px' },
      text('H3', q), text('Body Muted', a))]), rule()),
);

const cta = stack('Closing CTA Wrap', 'vertical', { width: '100%', padding: '0px 40px 120px 40px' },
  stack('Closing CTA', 'vertical', {
    width: '100%', stackAlignment: 'center', gap: '24px', padding: '112px 40px 112px 40px',
    borderRadius: '24px', backgroundColor: '/Atelier/Ink',
  }, text('H2 White', 'Start with the finish you like.'),
    text('Body White', 'Configure it in 3D, order it in minutes, and have it at your door in four weeks.'),
    button('Configure yours', false)));

const footer = stack('Footer', 'horizontal', {
  width: '100%', stackDistribution: 'space-between', stackAlignment: 'start', padding: '48px 40px 56px 40px',
  borderWidth: '1px 0px 0px 0px', borderStyle: 'solid', borderColor: '/Atelier/Line',
}, stack('Brand', 'vertical', { width: 'fit-content', gap: '10px' },
  text('Wordmark', 'Atelier'), text('Caption Muted', '© 2026 Atelier Studio')),
  ...[['Shop', ['Lounge chair', 'Swatches', 'Gift cards']], ['Company', ['About', 'Workshop', 'Journal']], ['Help', ['Delivery', 'Returns', 'Contact']]]
    .map(([h, items]) => stack(h, 'vertical', { width: 'fit-content', gap: '10px' }, text('Caption', h), ...items.map(i => text('Body Muted', i)))));

const xml = `<Desktop nodeId="${desktopId}">${[hero, trust, features, detail, specification, testimonial, faq, cta, footer].join('')}</Desktop>`;

if (DRY) { console.log(`xml ${xml.length} chars, ${(xml.match(/<Text /g) || []).length} text nodes, ${(xml.match(/<ComponentInstance /g) || []).length} configurators`); process.exit(0); }

const res = await fetch(URL_, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
  body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method: 'tools/call', params: { name: 'updateXmlForNode', arguments: { nodeId: desktopId, xml, zoomIntoView: false } } }),
});
let out = await res.text();
if (out.includes('\ndata:')) out = out.split('\n').filter(l => l.startsWith('data:')).at(-1).slice(5);
const body = JSON.parse(out);
const msg = (body.result?.content ?? []).map(c => c.text).join('\n') || JSON.stringify(body.error);
const created = (msg.match(/Created \w+ node/g) || []).length;
console.log(body.result?.isError || /error/i.test(msg.slice(0, 200)) ? `ERROR: ${msg.slice(0, 1500)}` : `ok — ${created} nodes created`);
