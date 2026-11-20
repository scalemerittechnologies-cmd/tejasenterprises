# Tejas Enterprises Solar Website

Next.js website for Tejas Enterprises in Phaphamau, Prayagraj.

## Local development

Install dependencies with `npm install`, copy `.env.example` to `.env.local` and configure private values, then run `npm run dev`.

## Checks

Run `npm run typecheck`, `npm run lint`, and `npm run build`.

## Brand and contact

The logo and office photos supplied by Tejas Enterprises are in `public/images/tejas/`. The address and public phone number are based on the provided [Google Maps listing](https://maps.app.goo.gl/HsmWbS4ATT2376pb7?g_st=aw). The same number is currently used for WhatsApp links; confirm that it accepts WhatsApp messages before launch.

The video section plays the supplied Tejas reel from `public/videos/tejas-shop.mp4` with a matching portrait poster. The previous video is preserved in `archive/previous-shop.mp4` and is not published on the website.

The admin dashboard publishes content and optimized photos to Cloudflare D1, so updates appear without a new Vercel build. GitHub publishing remains an optional fallback. Quote forms open WhatsApp directly and do not store enquiries. See [the Cloudflare and Vercel setup](docs/CLOUDFLARE_VERCEL_SETUP.md).
