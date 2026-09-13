// Minimal JSON-RPC client for the Framer MCP server.
// Usage: node fmcp.mjs <toolName> [argsJsonFile|'{"inline":"json"}'] [--raw]
import { readFileSync, existsSync, writeFileSync } from 'node:fs';

const URL_ = process.env.FRAMER_MCP_URL;
if (!URL_) { console.error('FRAMER_MCP_URL not set'); process.exit(2); }

const [, , name, argSpec = '{}', ...flags] = process.argv;
const args = existsSync(argSpec) ? JSON.parse(readFileSync(argSpec, 'utf8')) : JSON.parse(argSpec);

const res = await fetch(URL_, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
  body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method: 'tools/call', params: { name, arguments: args } }),
});
let text = await res.text();

// Streamable HTTP may answer as SSE; take the last data frame.
if (text.startsWith('event:') || text.includes('\ndata:')) {
  const frames = text.split('\n').filter(l => l.startsWith('data:')).map(l => l.slice(5).trim());
  text = frames[frames.length - 1] || text;
}

let body;
try { body = JSON.parse(text); } catch { console.log(`[HTTP ${res.status}] ${text.slice(0, 2000)}`); process.exit(1); }

if (body.error) { console.log('RPC ERROR:', JSON.stringify(body.error)); process.exit(1); }
const content = body.result?.content ?? [];
const out = content.map(c => (c.type === 'text' ? c.text : JSON.stringify(c))).join('\n');
if (body.result?.isError) console.log('TOOL ERROR:');

const saveIdx = flags.indexOf('--save');
if (saveIdx >= 0) { writeFileSync(flags[saveIdx + 1], out); console.log(`saved ${out.length} chars -> ${flags[saveIdx + 1]}`); }
else console.log(flags.includes('--raw') ? out : out.slice(0, 6000));
