// Cloudflare Worker: serve each concept demo on its own subdomain.
//
//   vela.configuro.studio/            → configuro.studio/shopify-templates/vela
//   vela.configuro.studio/shopify-templates/… → same path on configuro.studio (assets)
//   anything else on the subdomain    → 301 to the canonical demo URL
//
// Every demo page already carries <link rel="canonical"
// href="https://configuro.studio/shopify-templates/<slug>">, so search engines index
// one URL per demo and the subdomain is just a short link for Upwork messages.
//
// Route: *.configuro.studio/*   (see docs/templates/README.md → Subdomains)

const ORIGIN = "https://configuro.studio";
const SLUGS = new Set(["shadeline", "vela", "northgate", "linkcore", "aurel"]);

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const slug = url.hostname.split(".")[0];
    if (!SLUGS.has(slug)) return Response.redirect(`${ORIGIN}/shopify-templates`, 301);

    if (url.pathname === "/" || url.pathname === "") {
      const page = await fetch(`${ORIGIN}/shopify-templates/${slug}`, { headers: { Accept: "text/html" } });
      const headers = new Headers(page.headers);
      headers.set("Link", `<${ORIGIN}/shopify-templates/${slug}>; rel="canonical"`);
      headers.set("Cache-Control", "public, max-age=600");
      return new Response(page.body, { status: page.status, headers });
    }
    // Demo pages reference root-relative /shopify-templates/assets/… and favicons.
    if (url.pathname.startsWith("/shopify-templates/")) return fetch(`${ORIGIN}${url.pathname}${url.search}`, request);
    return Response.redirect(`${ORIGIN}/shopify-templates/${slug}`, 301);
  },
};
