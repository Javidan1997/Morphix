# Configuro Deployment And Google Indexing Checklist

## Current App Status

- The admin panel is intentionally simple: Forms, Statistics, and Interactions.
- Public pages are prerendered during `npm run build`, so Google receives crawlable HTML for the main routes.
- `public/robots.txt` allows public pages and blocks `/admin` and `/portal`.
- `public/sitemap.xml` already points to `https://configuro.studio/sitemap.xml`.

## Local Build

```bash
npm install
npm run build
```

The production files are created in `dist/`.

## Supabase Setup

Use Supabase for production form storage, file storage, and future admin APIs. The site now keeps its browser-storage fallback and also inserts new form submissions into Supabase when the public env vars are configured.

1. Create a Supabase project.
2. Go to SQL Editor and run the migration in `supabase/migrations/20260701000000_configuro_inquiries.sql`.
3. Create your admin user in Supabase Auth.
4. Copy that user's UUID and run the final `insert into public.configuro_admins` statement from the migration comments.
5. Do not add anonymous `select` or `update` policies for this table. Leads contain private contact details.
6. Add the public values to your build environment:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ADMIN_EMAIL=admin@configuro.studio
VITE_ADMIN_PASSWORD=replace-with-a-long-password
```

7. Rebuild after adding env values:

```bash
npm run build
```

At this point, public submissions will insert into Supabase. A future admin-auth pass can replace the temporary client-side admin login with Supabase Auth so the admin panel can read and update Supabase rows directly.

## GHL Pages And Namecheap DNS

Recommended domain setup for `configuro.studio`:

1. In GHL, go to the sub-account settings and open Domains / URL Redirects.
2. Connect `configuro.studio` as the website/funnel domain.
3. In Namecheap DNS, add the record GHL gives you. Current GHL docs support either:
   - Root domain: `A` record, host `@`, value `162.159.140.166`.
   - Subdomain: `CNAME` record, host `www`, value `sites.ludicrous.cloud`.
4. Do not create both an `A` and `CNAME` for the same host.
5. Remove conflicting old records for `@` or `www`.
6. Let GHL verify the domain and issue SSL.
7. Set the default GHL page for the domain.

If GHL is the main page builder, recreate the public landing pages there and connect forms to Supabase or GHL workflows. If this exact React build must run inside GHL, host the `dist/assets` files on a static asset host or GHL media/custom-code setup, then mount the built `index.html` in a blank GHL page. Test every route after that, because SPA routing depends on the host serving the app for each URL.

## Google Indexing

1. Verify `https://configuro.studio` in Google Search Console with the DNS TXT record Google gives you.
2. Confirm these URLs load after deployment:
   - `https://configuro.studio/robots.txt`
   - `https://configuro.studio/sitemap.xml`
   - `https://configuro.studio/`
   - `https://configuro.studio/services`
   - `https://configuro.studio/work`
   - `https://configuro.studio/contact`
3. Submit `https://configuro.studio/sitemap.xml` in Search Console.
4. Use URL Inspection for the home page and your highest-value pages, then request indexing.
5. Make sure `/admin` remains blocked and `noindex`.
6. Build ranking signals after launch:
   - Add specific service pages for 3D configurators, interactive product demos, real estate visualization, and web configurators.
   - Publish case studies with original images, project details, and internal links to Contact.
   - Add backlinks from LinkedIn, Behance, partner sites, client credits, and local business profiles.
   - Keep page titles specific to Configuro and the service/location you want to rank for.

Google indexing can be requested, but first-page ranking is earned over time through technical health, useful content, authority, and links.
