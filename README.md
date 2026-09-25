# Abhroneel Mukherjee — Portfolio

A professional portfolio with Home, Experience, CV, and a live public GitHub dashboard at
`quantroninblue.github.io`. Home's professional copy comes from `public/cv.pdf` and verified public project READMEs;
dashboard metadata comes directly from GitHub's public API. The CV is kept
intact and served at `/cv.pdf`.

## Local development

Use Node.js 22.12 or newer (Node 22 LTS recommended).

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

```sh
npm run check   # TypeScript and ESLint
npm test        # GitHub service/cache/calendar tests (Node's test runner)
npm run build   # TypeScript and optimized production output
npm run preview # Serve the production build locally
```

## Structure

```text
public/                 Unprocessed static assets, including the original CV
src/
  components/           Header, hero, vector figure, project preview, footer
  data/profile.ts       CV-derived professional content and verified links
  data/navigation.ts    Navigation destinations for this release
  data/resume.ts        Complete CV content shared by Experience and CV
  hooks/useEntrance.ts  Reduced-motion-aware GSAP entrance, with cleanup
  features/github/     Public API service, cache, calendar, dashboard components
  features/workbench/  Interactive project studies and editable field notes
  features/environment/ Persistent canvas renderer, motion controls, section states
  features/resume/      Experience entries and full HTML CV presentation
  App.tsx               Home / Experience / CV / GitHub hash routes and shared shell
  main.tsx              React entry and locally bundled Latin fonts
  styles.css            Tailwind theme, visual system, responsive layouts
```

The visual system uses charcoal, warm ivory, and muted copper. Barlow
Condensed provides the editorial display type, Manrope the reading type,
and IBM Plex Mono the metadata. Fonts are self-hosted, with no third-party
font requests. Existing typography, navigation, hero, and the GitHub dashboard
remain intact. A persistent computational environment sits underneath the UI.

## Personal engineering environment

`Environment` is mounted once in `App`, outside the route content. Its canvas
retains its phase through Home/GitHub navigation. The renderer draws an ordered,
deformable height-field mesh, with a local damped response to the cursor and
bounded scroll/click input. It has no particles, external assets, or graphics
engine. These are visual states, not live machine or GitHub telemetry.

- Home is calm; About/Field Notes slow the field; Projects/Workbench introduce
  more structure; GitHub adds an ordered scanning band; the footer quiets it.
  Experience uses the structured field and the HTML CV uses the minimal mode.
  The PDF remains available as a download; Contact still uses email.
- Desktop targets at most 30 drawn frames/second, mobile 20 with a coarser mesh.
  Pixel ratio is capped at 1.5 (1 on mobile), vertex buffers are reused, and
  expensive frames reduce the target rate. There are no per-frame React renders.
- Hidden tabs stop the animation loop. Reduced motion renders a static field
  and ignores pointer disturbances. The always-available pause button stores a
  session preference and survives navigation. Canvas failure leaves all content
  and interactions usable.

The new Workbench replaces the former domain diagram with three project objects:

- **Hephaestus assembly:** an adjustable exploded drawing, with design,
  validation, and simulation notes from the CV and public project.
- **Odysseus navigation:** a scrub-controlled illustrative route and notes on
  perception, candidate planning, failure reasoning, and spatial memory.
- **Procedural volatility:** a deterministic layered-noise surface with a
  roughness control and seed changes, linked to the public terrain-inspired
  volatility generator and related Vol Engine work.

The studies are original explanatory graphics, clearly labeled as illustrative.
They are not exported CAD, a real robotics simulation, live inference, or market
data. Project buttons and stage controls work with Enter/Space; sliders use
native keyboard controls. On mobile the objects become a compact shelf above
one enlarged study. Nothing depends on hover or dragging alone.

`features/workbench/artifacts.ts` contains project context; `content.ts` contains
three editable notebook prompts grounded in those projects. They are not
attributed personal quotes or claims of new research. No dependencies were added.

Project sources: [Hephaestus](https://github.com/quantroninblue/Hephaestus),
[Odysseus](https://github.com/quantroninblue/Odysseus),
[procedural volatility](https://github.com/quantroninblue/minecraft-vol-surface-generator),
and [Vol Engine](https://github.com/quantroninblue/vol_engine).

## Scope and navigation

Home, `#experience`, `#cv`, and the `#github` dashboard are implemented.
Experience presents the CV's professional roles and open-source engineering;
CV presents all document sections as semantic HTML, including contact details,
summary, skills, experience, open-source engineering, and education. Both pages
share `data/resume.ts` and `ExperienceEntries`. Counts and package versions are
preserved as stated in the source CV, rather than represented as live metrics.

The navigation's Experience and CV links, Home's View CV action, and the selected
work Read in CV links open internal pages. PDF links are download actions only.
About still links to the Home statement, Projects to the selected-work preview,
and Contact opens an email. LinkedIn is included as the display name supplied
in the CV, without inventing a profile URL. Phone and email are directly usable.

Hash routes support direct links and refresh on GitHub Pages without server
rewrites. Resume content is lazy-loaded. The shared environment stays mounted
through all routes; current navigation, document titles, and heading focus update
when navigating. Future About, Projects, and Contact pages can reuse the shell.

## Live GitHub integration

Open `http://localhost:5173/#github` during development. The dashboard retrieves
public profile data, all owned public repositories, on-demand language
distributions, and a year of indexed public commits directly from GitHub.
Repos refresh after 15 minutes, commits after 30; changes need no deployment.
The calendar explicitly counts **public commits**, not GitHub's full profile
contribution total. Partial search results are labeled. No token or backend
is used. `VITE_*` values are public and must never contain credentials.

See [GitHub integration architecture](docs/github-integration.md) for API
sources, caching, privacy boundaries, limitations, and the authenticated
GraphQL option for future full contribution-calendar support.

## GitHub Pages deployment

This is a user site, so Vite's `base` is `/`. The public address is
`https://quantroninblue.github.io/`. The deployment workflow is
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Before the first deployment, set the repository's **Settings → Pages → Build
and deployment → Source** to **GitHub Actions**. The previous branch-based
source does not build this Vite application.

To publish an update, commit the source and push to `main`.
The workflow installs the locked dependencies with Node 22, checks TypeScript
and lint, runs tests, builds the site, uploads only `dist/`, and deploys it to
Pages. A manual run is also available in Actions. Deployments are restricted
to `main`; subsequent pushes there automatically update the site.

Actions are pinned to verified release commits. Deployment uses GitHub's
built-in workflow token and OIDC; no personal access token or frontend secret
is needed. `node_modules`, `dist`, local environment files, and browser test
artifacts remain ignored. `public/cv.pdf` is copied unchanged by Vite.

Monitor the workflow in the repository’s Actions tab and verify the public site
after a successful deployment. See the [Vite Pages guide](https://vite.dev/guide/static-deploy#github-pages).

## Browser verification checklist

- Desktop, laptop, tablet, and 320–430px mobile: no overflow or clipped text.
- Mobile menu opens/closes, exposes `aria-expanded`, closes on Escape, and
  returns focus to its toggle; links remain reachable by keyboard.
- Skip link, visible focus, usable touch targets, and semantic landmarks.
- Project anchor, HTML Experience/CV routes, PDF download, email, and GitHub destinations.
- Reduced-motion rendering remains fully visible and static.
- Workbench object selection, stage controls, sliders, reseeding, and mobile touch.
- Field Notes work with Enter/Space and visible focus.
- The same canvas survives navigation; pause and reduced motion freeze it.
- Hidden tabs stop rendering; section changes adjust the environment state.
- Production console is error-free and all assets load locally.
- `sha256sum public/cv.pdf dist/cv.pdf` matches the original document.
