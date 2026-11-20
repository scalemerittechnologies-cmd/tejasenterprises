# Admin dashboard setup

The private dashboard is available at `/admin/login`. It uses one administrator account supplied through server-only environment variables. This workspace has a generated local account in the ignored `.env.local` file; never commit that file. New installations must choose their own credentials.

For this workspace, the local admin account is already configured in `.env.local`. Restart the Next.js server and open `/admin/login` to use it. For a new installation, copy `.env.example` to `.env.local`, set a private `ADMIN_USERNAME`, choose a unique `ADMIN_PASSWORD` of at least 16 characters, and generate `ADMIN_SESSION_SECRET` with `openssl rand -base64 48`.

The dashboard lets the administrator edit the public homepage copy, storefront and hero photos, solution cards, products, store contact details and the assumptions used by the solar-cost estimate. Image uploads accept JPEG, PNG, WebP and AVIF up to 8 MB; uploads are resized and stored as WebP. Click **Save & publish** after uploading or editing.

## Persistent storage on Vercel

Cloudflare D1 stores published content, uploaded photos and enquiry settings. Set `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID` and `CLOUDFLARE_D1_API_TOKEN` as server-only environment variables. Follow [the Cloudflare and Vercel setup](docs/CLOUDFLARE_VERCEL_SETUP.md) to initialize the database and configure Vercel before deploying. Never commit the token or prefix it with `NEXT_PUBLIC_`.

Without Cloudflare variables, local development stores content and uploads in `data/`. That directory is ignored by Git and is not persistent on a serverless host. Admin photos are resized to fit D1's free tier row limit.

The login cookie is HTTP-only, same-site strict and expires after eight hours. Configure HTTPS in production. Login attempts are rate-limited per server process; use an upstream rate limit as well when running multiple instances.
