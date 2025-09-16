How to add and preview skins

- Add PNG skin files to `public/skins/` (file names like `my-skin.png`).
- Update `data/skins.json` entries to point `skinUrl` to `/skins/my-skin.png` or to an absolute URL.
- Start the dev server and open `/skins` to preview.

Install skinview3d:

- npm install skinview3d

Then run:

- npm run dev

Notes:
- The demo ships two tiny placeholder PNGs (`sample1.png`, `sample2.png`) so the page shows previews out of the box. Replace them with full Minecraft skin PNGs for realistic rendering.
- Discord OAuth is not implemented; user management is file-based under `data/` for future endpoints.
