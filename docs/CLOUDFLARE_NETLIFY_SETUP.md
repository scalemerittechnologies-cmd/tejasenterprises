# Cloudflare D1 with Netlify deployment

The Next.js app runs on Netlify Free. Cloudflare D1 stores website content, admin enquiry settings, customer enquiries, and photos uploaded through the dashboard. Uploaded WebP photos are served through `/api/media/[filename]`. R2 is not needed, so the site can stay on Cloudflare's free D1 plan without R2 overage billing. Netlify Free has a hard monthly credit limit; the site pauses until the next cycle if it is exhausted.

The browser accepts photos up to 8 MB and compresses large selections before upload. The server further resizes each photo to at most 1.25 MB. D1's maximum row/string size is 2 MB, and base64 storage adds about one third to the image size. The free D1 plan also has a 500 MB limit per database and daily query limits; the app will return an error if these hard limits are reached.

## 1. Create the D1 database

1. In the Cloudflare dashboard, create a **D1 database** named `tejas-website`. Copy its database ID and your 32-character account ID.
2. Create a Cloudflare API token with **D1 Read** and **D1 Write** access for this account. Do not use the global API key.

Cloudflare documentation: [D1 API](https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/), [D1 limits](https://developers.cloudflare.com/d1/platform/limits/), [free-tier behavior](https://developers.cloudflare.com/d1/reference/faq/).

## 2. Add local environment variables

Add these private values to `.env.local` in the project root:

```dotenv
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_D1_DATABASE_ID=...
CLOUDFLARE_D1_API_TOKEN=...
```

Keep `.env.local` private. These variables have no `NEXT_PUBLIC_` prefix.

## 3. Initialize and migrate

From the project root, run:

```bash
node --env-file=.env.local scripts/setup-cloudflare.mjs
```

This creates the D1 tables from `cloudflare/schema.sql`, copies the current `data/site-content.json` and optional `data/enquiry-settings.json` and `data/leads.json`, and copies any existing `data/uploads/*.webp` photos to D1. Existing D1 content is left untouched. Run it **before the first Netlify deployment**, because the local `data/` folder is intentionally excluded from Git.

## 4. Connect GitHub to Netlify

1. Import the Tejas Enterprises Git repository as a **Next.js** project in Netlify. Netlify's Git integration builds on pushes and makes preview deployments for pull requests.
2. In **Project configuration → Environment variables**, add the three `CLOUDFLARE_*` variables above and `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`. Set them for runtime Functions and builds. For deploy previews, use separate D1 credentials if you want to keep test edits away from live data.
3. Deploy after the migration script succeeds. The build command is `npm run build`.

Netlify documentation: [Next.js support](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/), [environment variables](https://docs.netlify.com/build/environment-variables/overview/), [Free plan hard limit](https://www.netlify.com/pricing/).

## 5. Verify after deployment

Sign in at `/admin/login`, change a project title, and click **Save & publish**. Refresh the live website to confirm it persists. Upload a photo, refresh, and open its image URL to confirm D1 reads. Submit a test enquiry and check the `leads` table in D1.

The Google Form and Sheet links in **Admin → Enquiries** are saved as settings in D1. A link alone does not deliver website enquiries to Google Sheets. For that, set up the separate Apps Script webhook in [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md). D1 remains the primary enquiry record even when Sheets sync is enabled.

## Local development

Without Cloudflare variables, `npm run dev` continues to read/write local `data/` files. With the variables in `.env.local`, local development uses D1. The production deployment requires Cloudflare credentials and initialized D1 tables.
