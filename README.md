# Upgrade Atlas

A standalone, responsive reference for building upgrades from E3 to E5, with earlier Church and production stages. No dependencies, backend, API keys, external fonts, or network services are required by the site.

## Publish on GitHub Pages

1. Create a GitHub repository named `upgrade-atlas` (or any name you prefer), with `main` as its default branch.
2. Upload **the contents of this folder** to the repository root. `index.html` must be at the root, beside `assets`, `data`, `scripts`, `tests` and `.github`. Include the hidden `.github` directory and `.nojekyll` file. Do not upload the ZIP itself or an extra outer `upgrade-atlas` folder.
3. In the repository, open **Settings → Pages** and select **GitHub Actions** as the source.
4. Open **Actions → Deploy Upgrade Atlas to GitHub Pages → Run workflow** on `main`. Future pushes to `main` deploy automatically.
5. Open the deployed URL shown by the successful workflow, usually `https://YOUR-USERNAME.github.io/upgrade-atlas/`.

GitHub's official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

You can alternatively select **Deploy from a branch**, choose `main` and `/ (root)` in Pages settings, and disable the included Actions workflow. No site build is needed for branch deployment.

## Open locally

Open `index.html` directly in a browser. All assets and data are local and use relative paths. For a local web server, with Node.js 22 or newer:

```sh
npm start
```

Open `http://127.0.0.1:8080`. There is no `npm install` step.

## Included

- 151 entries: 93 original video observations plus shared-building requirements and user-supplied additions.
- Cubes, each basic-resource amount, base and boosted times, building prerequisites, original notes and timestamps.
- Original source frames, including the final Silver Mine screenshot. Repeated frames are deduplicated into local JPEG assets.
- Cube-table reference and conflicts with video readings.
- Shared camp and production-building rules, final production costs, earlier Church stages and furniture notes.
- Search, range and metric controls, source-evidence drawer, keyboard focus handling and downloadable JSON.

The original MP4 files were source material, not embedded in the report, and are not included. Their filenames, extracted frames and timestamps are preserved. No assets depend on the original computer or temporary folders.

## Responsive layout

- **Phones, 640px and below:** starts at E3 → E4, with one upgrade column beside building names; step buttons provide access to every stage. Search and metric controls stack, and details use the full screen width.
- **Tablets:** controls wrap; the comparison table scrolls inside its own container with fixed building labels and stage headers.
- **Desktop:** full E3 → E5 comparison, with narrower range options available.
- Touch targets, mobile safe-area spacing, reduced-motion preferences and keyboard navigation are supported.

## Files and updates

- `index.html`: page structure.
- `assets/styles.css`: styling and responsive breakpoints.
- `assets/app.js`: table rendering and interactions.
- `data/requirements.json`: complete canonical dataset, including source-image paths and provenance.
- `assets/data.js`: generated copy of the dataset for browser use, allowing direct local-file opening.
- `data/video_upgrade_requirements.json`: the detailed extraction and shared/supplied additions before display enrichment.
- `data/cube_reference_supplied.json`: original supplied cube table and recorded discrepancies.
- `assets/evidence/`: all displayed source frames.
- `.github/workflows/pages.yml`: GitHub Pages deployment workflow.

Edit `data/requirements.json`, then run:

```sh
npm run build:data
npm test
```

Commit the changed JSON and `assets/data.js`. The deployment workflow regenerates browser data as well. Edit CSS or app JavaScript directly; there is no bundler.

`†` means a hidden basic-resource amount was inferred equal using the user's rule. A dash means no readable panel was captured. Costs are kept as observed, including account bonuses; conflicting supplied cube values are displayed without replacing readable video costs. Production and camp requirements shared between buildings are labeled in source notes. Unspecified prerequisites remain unfilled.

## Validation

`npm test` checks dataset integrity, local source assets, all range and metric renderings, search, conflict details, shared requirements and mobile stage selection. These are code-level tests; visual cross-browser/device review is still recommended. The site is ready to upload, but has not been published to a GitHub repository by this task.
