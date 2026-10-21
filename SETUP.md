# Wedding Site — Setup & Hosting

## 1. Fill in your real details

Open [index.html](index.html) and edit the `CONFIG` object near the top of the `<script>` tag (search for `EDIT THESE VALUES`):

```js
const CONFIG = {
  weddingDateISO: '2026-11-22T19:30:00', // wedding date + reception (קבלת פנים) start time
  receptionTime: '19:30',
  chuppahTime: '20:30',
  mapsQuery: 'מתחם בני דרום, אשדוד, ישראל',
  sheetsWebAppURL: 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'
};
```

Everything else (hero, section labels, etc.) is translated in the `I18N` object right below it — edit the English (`en`) and Hebrew (`he`) text there if you want to change any wording.

RSVPs are handled outside the site entirely (Diginet), so the only backend this site needs is for the song-request wall.

## 2. Connect song requests to a Google Sheet (free, no server)

The song wall is shared — every guest sees the same growing list, and suggesting a song that's already there just bumps its heart count instead of adding a duplicate. To wire this up:

1. Create a new Google Sheet (sheets.google.com → Blank).
2. In the sheet, go to **Extensions → Apps Script**.
3. Delete the placeholder code and paste in the contents of [google-apps-script.gs](google-apps-script.gs) from this folder.
4. Click **Deploy → New deployment**.
5. Click the gear icon next to "Select type" and choose **Web app**.
6. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
7. Click **Deploy**, authorize the permissions Google asks for (it's your own script, on your own sheet).
8. Copy the **Web app URL** it gives you (ends in `/exec`).
9. Paste that URL into `CONFIG.sheetsWebAppURL` in [index.html](index.html).

Once that's done, every song suggestion (name, artist, pasted link, who suggested it, and a running count) lives in the **Songs** tab of your sheet, and the site reads it back live for every visitor. You (and your DJ) can just open the sheet to see them.

**If you already had this deployed before and the script's code changed** (e.g. to add the shared/dedupe behavior), you must push the new version out: open the Apps Script project, paste in the updated `google-apps-script.gs` code, then **Deploy → Manage deployments → ✏️ Edit → New version → Deploy**. This keeps the same `/exec` URL working — a brand new deployment would give you a different URL and break the site.

## 3. Compressing note

`proposal.mp4` (the original 935MB file) is excluded from git via `.gitignore` — it's too large for GitHub anyway (100MB hard limit). The site actually uses two compressed versions already generated in this folder:

- `proposal-web.mp4` (~8MB) — served on screens wider than 820px
- `proposal-mobile.mp4` (~2.4MB) — served on phones (≤820px wide)

Keep both of those; you can delete or archive the original `proposal.mp4` elsewhere once you're happy with the quality.

## 4. Hosting on GitHub Pages (free)

1. Create a new **public** GitHub repository (e.g. `eliran-moral-wedding`).
2. From this folder, initialize and push:
   ```
   git init
   git add index.html .gitignore proposal-web.mp4 proposal-mobile.mp4 piano.mp3 google-apps-script.gs SETUP.md
   git commit -m "Wedding site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root)**.
4. Wait ~1 minute, then your site is live at:
   `https://<your-username>.github.io/<repo-name>/`
5. (Optional) Under **Settings → Pages** you can attach a custom domain if you buy one.

Every time you push a new commit to `main`, GitHub Pages redeploys automatically within a minute or two.
