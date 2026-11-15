# GitHub and Netlify deployment for Tejas Enterprises

Create a dedicated Tejas Enterprises repository and Netlify site. Keep its D1 database and admin credentials separate from previous client websites.

## Deployment checklist

1. Complete [Cloudflare D1 setup](CLOUDFLARE_NETLIFY_SETUP.md) with a `tejas-website` database.
2. Push this project to the Tejas Enterprises repository, then import that repository into Netlify as a Next.js site.
3. Set `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, `CLOUDFLARE_D1_API_TOKEN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` as server-side environment variables.
4. Build with `npm run build`. Verify the homepage, contact links, admin save, photo upload and a test enquiry on the deployed URL.
5. Confirm that the Google Maps listing, public phone number and WhatsApp account belong to Tejas Enterprises before sharing the live site.

The new video belongs at `public/videos/tejas-shop.mp4` or can be configured with a public HTTPS URL in the admin dashboard.
