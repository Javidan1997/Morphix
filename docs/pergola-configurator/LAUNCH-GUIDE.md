# /pergola-configurator launch guide

## 1. Hosting facts

- Production is **GitHub Pages** (`.github/workflows/deploy-pages.yml`, triggered by pushes to `main`). `vercel.json` has matching rules in case the site moves to Vercel.
- `/pergola-configurator` is served from `dist/pergola-configurator.html` with a 200, fully prerendered.
- `/pergola-configurators` gets a host 301 to `/pergola-configurators/`, then a redirect page that forwards instantly with the query string kept (JavaScript, with a meta refresh as fallback) and a canonical pointing to the new URL. GitHub Pages cannot send a custom 301; Google treats an instant redirect as permanent.

## 2. Supabase and the admin inbox

- Production database: Supabase project **Morphix** (`slis…`). Both migrations are applied; no new migration is required. New lead data (design code and link, interest, UTM and click IDs) is stored in `configuro_inquiries.metadata`.
- `.env.production` holds the public URL and anon key used by CI builds. GitHub Actions secrets with the same names override them.
- The local `supabase/config.toml` is linked to a different project (Mimo Robot). Before running `supabase db push`, run `npx supabase link --project-ref <Morphix ref>`.
- **Admin sign-in** at `/admin/login` now uses Supabase Auth. The admin account is the confirmed user listed in `configuro_admins` (`ad…@configuro.studio`). It has never signed in: set its password in Supabase Dashboard → Authentication → Users → the user → "Send password recovery", or set it directly.
- Submitted leads also sync to ERPNext through the deployed `erpnext-sync` Edge Function.

## 3. Google Search Console

1. Add the property `https://configuro.studio` (a Domain property via DNS TXT is best).
2. Sitemaps → submit `https://configuro.studio/sitemap.xml`. It now lists `/pergola-configurator`.
3. URL Inspection → `https://configuro.studio/pergola-configurator` → Test live URL. Confirm "Page can be indexed", a canonical of itself, and rendered HTML containing the H1. Then Request indexing.
4. URL Inspection → `https://configuro.studio/pergola-configurators/` should report "Page with redirect". No action is needed.
5. Check Enhancements and Rich results for Breadcrumb, FAQ and Organization parsing. Google shows FAQ rich results only for some sites, so treat the markup as supporting information.
6. Over the following weeks, watch Pages → "Why pages aren't indexed" and Performance → queries containing "pergola configurator".
7. Build internal links and backlinks. The homepage footer, the `/insights/pergola-configurator-sketch-to-sold` guide, and LinkedIn or partner posts help. Indexing and ranking are not guaranteed.

## 4. Analytics and Google Ads (not active until IDs exist)

Nothing loads until an ID is configured **and** the visitor accepts the consent banner. Consent Mode v2 defaults to denied.

1. Create the GA4 property and, optionally, a GTM container and a Google Ads account.
2. In GitHub → Settings → Secrets and variables → Actions, add any of:
   - `VITE_GTM_ID` (for example `GTM-XXXXXXX`), or
   - `VITE_GA4_ID` (`G-XXXXXXXXXX`)
   - `VITE_GOOGLE_ADS_ID` (`AW-XXXXXXXXX`) and `VITE_GOOGLE_ADS_LEAD_LABEL` (from the Ads conversion action)
3. Re-run the deploy workflow.
4. In Google Ads → Goals → Conversions, create a "Submit lead form" website action and copy the label. The site fires it only after Supabase confirms the insert, once per lead, with `transaction_id` set to the lead id.
5. In GA4, mark `generate_lead` as a key event. Other events: `configurator_start`, `configuration_share`, `screenshot_export`, `spec_export`, `quote_start`, `quote_submit`, `environment_explore`, `environment_interest`, `example_design_load`, `compare_interaction`, `feature_hotspot`, `guided_demo_start`, `guided_demo_complete`. No personal data is sent.
6. Ad landing URL: `https://configuro.studio/pergola-configurator?utm_source=google&utm_medium=cpc&utm_campaign=<name>`. Auto-tagging `gclid` is kept through the page and saved with the lead, which the admin inbox shows.
7. Review the privacy text on the page before running EU-targeted campaigns.

## 5. Re-running checks

```bash
npm run build
npm run check:pergola
node scripts/serve-pages.mjs 4173 &
node scripts/verify-pergola.mjs verify-output
```
