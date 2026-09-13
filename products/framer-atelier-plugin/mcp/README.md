# Driving Framer through MCP

Scripts that build the Atelier template through the community Framer MCP
server, calling it directly over HTTP JSON-RPC.

The MCP route can do more than the plugin API in `../src`: its
`updateXmlForNode` tool creates nested nodes **with text**, and
`createCodeFile` installs the Configurator3D component. It cannot create a
project — it works on whichever project has the MCP plugin open.

## Setup

1. In Framer, open the project you want to fill
2. `Ctrl+K` (`Cmd+K` on macOS) → search **MCP** → open **MCP: AI Plugin**, and
   leave it open. Every call fails with "Framer plugin not connected" otherwise
3. Put your server URL in the environment — never in a file you commit:

```bash
export FRAMER_MCP_URL="https://mcp.unframer.co/mcp?id=…&secret=…"
```

## Run

```bash
# colour + text styles (Inter resolved via searchFonts) and the component
node phase1-styles-and-component.mjs ../../framer-3d-template/Configurator3D.tsx

# add --dry to see the plan without touching Framer

# any single tool
node call.mjs getProjectXml
node call.mjs getNodeXml '{"nodeId":"…"}'
```

Phase 1 probes the connection first and exits before changing anything if the
Framer plugin is not open, so a failed run never leaves a half-built project.
Styles are create-or-update, so re-running is safe.

Phase 2 (the page itself) is written against the node-attribute documentation
that `getProjectXml` returns from the live project, rather than a guessed XML
schema.
