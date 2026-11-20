# Cloudflare D1 with Vercel deployment

The Next.js app runs on Vercel. Cloudflare D1 is the primary runtime store for website content, admin enquiry settings and optimized dashboard photos. Admin changes become visible immediately and do not require a Git commit or a new deployment.

The browser accepts JPEG, PNG, WebP and AVIF images and the server converts them to WebP. Each stored image is capped at 1.25 MB so its base64 representation remains below D1's 2 MB row and string limit. This design is suitable for the current low-volume storefront gallery. Move media to R2 if the gallery grows substantially.

## Cloudflare resources

- Account ID: copy it from the Cloudflare account overview.
- D1 database: create one named `tejas-website`.
- API token: create a dedicated token restricted to the Tejas Cloudflare account with only **D1 Read** and **D1 Edit** permissions. Vercel functions do not have a fixed outbound IP, so do not add an IP restriction.

Keep the token private. Do not use a Global API Key and never prefix these variables with `NEXT_PUBLIC_`.

## Local initialization

Add the following values to the ignored `.env.local` file:

```dotenv
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_D1_DATABASE_ID=...
CLOUDFLARE_D1_API_TOKEN=...
```

Initialize the schema and seed the tracked website content:

```bash
npm run cloudflare:setup
```

The command is idempotent. Existing D1 content is preserved, missing tables are created, and the required tables are verified before it exits.

## Vercel project

1. Import `scalemerittechnologies-cmd/tejasenterprises` in Vercel using the Next.js preset.
2. Under **Project Settings → Environment Variables**, add these six private variables for Production:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_D1_DATABASE_ID`
   - `CLOUDFLARE_D1_API_TOKEN`
3. For Preview deployments, use a separate D1 database if editors may test writes. Otherwise omit the Cloudflare variables so previews stay read-only and use tracked content.
4. Deploy with the default `npm run build` command. Environment-variable changes apply only to new deployments, so redeploy after changing them.

## Verification

1. Open `/admin/login` and confirm the sign-in form appears instead of the setup warning.
2. Change a harmless heading and click **Save & publish**. Refresh the public page and confirm the change persists without a new deployment.
3. Upload a photo and confirm its `/api/media/...` URL loads after refresh.
4. In Cloudflare D1, verify the `site_content` and `media` tables contain the new records.

## Custom domain

Add the custom domain to Vercel first and follow the DNS records Vercel supplies. If Cloudflare manages the domain, keep the record DNS-only unless there is a specific need for another proxy layer; Vercel already provides its own CDN, TLS and firewall. This avoids stacked-proxy certificate and caching problems.

