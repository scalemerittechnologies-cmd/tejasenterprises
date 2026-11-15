# GitHub and Netlify deployment for Tejas Enterprises

Create a dedicated Tejas Enterprises repository and Netlify site. Admin content and photos are committed to this repository, which triggers one deployment automatically.

## Deployment checklist

1. Push this project to the Tejas Enterprises repository, then import that repository into Netlify as a Next.js site.
2. Create a fine-grained GitHub token for this repository only, with **Contents: Read and write**. Store it only in the hosting environment as `GITHUB_CONTENT_TOKEN`.
3. Set `GITHUB_CONTENT_OWNER=scalemerittechnologies-cmd`, `GITHUB_CONTENT_REPO=tejasenterprises`, `GITHUB_CONTENT_BRANCH=main`, `GITHUB_CONTENT_TOKEN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` as server-side environment variables.
4. In Netlify, set `SECRETS_SCAN_OMIT_KEYS=ADMIN_USERNAME`. This is a narrow false-positive exception for the public admin name; keep the password, session secret and GitHub token marked as secrets.
5. Build with `npm run build`. Verify the homepage, admin save and photo upload. A dashboard save creates one GitHub commit; Netlify then deploys it automatically.
6. Confirm that the Google Maps listing, public phone number and WhatsApp account belong to Tejas Enterprises before sharing the live site.

Quote forms open WhatsApp directly and do not save customer enquiry data to a database. The new video belongs at `public/videos/tejas-shop.mp4` or can be configured with a public HTTPS URL in the admin dashboard.
