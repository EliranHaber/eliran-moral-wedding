# Eliran & Moral's Wedding Site

A mobile-first, bilingual (Hebrew/English) wedding website.

**Live site:** https://eliranhaber.github.io/eliran-moral-wedding/

## Features

- Hero section with a looping background video (piano audio plays on desktop only)
- Our Story, countdown to the wedding day, and event details
- Waze / Google Maps buttons for directions to the venue
- RSVP via Diginet
- Guest song-request wall for the DJ (song name, artist, or a pasted Spotify/YouTube link)
- Hebrew (default) / English toggle with full RTL support

## Structure

- `index.html` — the entire site (HTML/CSS/JS, no build step)
- `proposal-web.mp4` / `proposal-mobile.mp4` — background video, compressed for desktop and mobile
- `piano.mp3` — background audio (desktop only)
- `google-apps-script.gs` — backend script for collecting song requests into a Google Sheet
- `SETUP.md` — how to configure the date/links and deploy the Google Sheet backend
- `waze.webp` — Waze icon used in the top navigation button

## Editing

Everything site-specific (wedding date, Diginet link, venue address, all Hebrew/English text) lives in the `CONFIG` and `I18N` objects near the top of the `<script>` tag in `index.html`. See [SETUP.md](SETUP.md) for full setup steps.

Pushing to `master` redeploys the live site automatically via GitHub Pages within a minute or two.
