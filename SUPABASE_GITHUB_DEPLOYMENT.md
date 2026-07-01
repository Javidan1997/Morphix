# Supabase Free + GitHub Pages Deployment

This project is configured to work on the Supabase Free plan.
No paid Supabase features are required for the current inquiry + ERPNext flow.

## Architecture

- Frontend hosting: GitHub Pages
- Backend data/API: Supabase (Postgres + Edge Functions)
- CRM target: ERPNext (via Supabase Edge Function `erpnext-sync`)
- Domain: `configuro.studio` (Namecheap DNS)

## What works on Supabase Free

- Postgres database for inquiry records
- Edge Functions for ERPNext sync logic
- Public function invocation using anon key
- CORS-enabled browser calls from GitHub Pages

## Environment Variables (frontend)

Set these in GitHub repository secrets/variables for build-time injection:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Optional override: `VITE_ERPNEXT_SYNC_URL`

Local template is in `.env.example`.

## Edge Function Secrets (Supabase project)

Set these in Supabase project secrets (not in frontend env):

- `ERPNEXT_BASE_URL`
- `ERPNEXT_API_KEY` and `ERPNEXT_API_SECRET`
- Or `ERPNEXT_API_TOKEN` (`key:secret`)
- `ERPNEXT_ENABLE_QUOTATION`
- `ERPNEXT_COMPANY`
- `ERPNEXT_QUOTATION_ITEM_CODE`
- `ERPNEXT_QUOTATION_ITEM_NAME`
- `ERPNEXT_QUOTATION_CURRENCY`
- `ERPNEXT_DEFAULT_RATE`

## Deploy Steps

1. Connect the repository to GitHub Pages.
2. Ensure Actions has permission to deploy pages.
3. Push to `main` or `master` (workflow supports both).
4. Deploy Supabase function:
   - `supabase functions deploy erpnext-sync`
5. Set Supabase function secrets.
6. Submit a test inquiry from the site and verify:
   - Inquiry appears in Supabase table
   - Lead appears in ERPNext

## Domain Setup (Namecheap)

`public/CNAME` already contains `configuro.studio`.

Add DNS records at Namecheap:

- Type `A` host `@` -> `185.199.108.153`
- Type `A` host `@` -> `185.199.109.153`
- Type `A` host `@` -> `185.199.110.153`
- Type `A` host `@` -> `185.199.111.153`
- Type `CNAME` host `www` -> `<your-github-username>.github.io`

## Free Plan Operational Notes

- Keep function payloads small and focused.
- Avoid long-running or heavy compute in edge functions.
- Use ERPNext sync as a single outbound API call path.
- Monitor Supabase usage dashboard monthly.

## Security Notes

- Never store ERP credentials in frontend variables.
- Keep ERP credentials only in Supabase function secrets.
- If any key was shared in chat/history, rotate it immediately.
