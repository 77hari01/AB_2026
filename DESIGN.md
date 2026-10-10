# You & Me — React Digital Diary

A complete React long-scroll website inspired by the supplied scrapbook reference. The visual language brings together sunset photography, tactile cream paper, loose Polaroids, handwritten English accents, Tamil typography, muted blush/lilac details, and a contrasting midnight-blue night section. It is one connected page, with the vertical timeline as the final section.

## Build phases

### Phase 1 — React foundation
- Vite + React entry point with reusable section components and data-driven gallery, moment, and timeline content.
- Responsive navigation anchors to each part of the same long page.

### Phase 2 — Cinematic home
- Full-height hero with the supplied local portrait at `public/assets/home.jpeg`, an atmospheric image overlay, handwritten English heading, Tamil support text, and a discreet scroll call to action.

### Phase 3 — Scrapbook memories
- Filterable Polaroid collage with sample photographs, paper tape, captions, and hand-drawn flourishes.
- A featured "A Scrapbook of Us" panel uses the supplied scrapbook artwork at `public/assets/scrapbook-cover.jpg`.
- The All filter shows only the nine scrapbook cards, loading `memories-1.jpg` through `memories-9.jpg` from `public/assets/memories/` with each numbered poem from `memories.txt` shown on the matching card. Keep each poem on a line beginning with its number and a period (for example, `1. poem text`); continuation lines belong to that poem. The `Us`, `Special Days`, and `Random Moments` filters show all photos in their matching folders in a scattered, responsive Polaroid layout. Select any photo to open the large photo viewer; close it with the close button, backdrop, or Escape.

### Phase 4 — Midnight moments and paper poems
- Six minimal cards on the starry dark section transition into cream-paper poetry notes.
- Tamil text is marked with `lang="ta"` and uses the Noto Serif Tamil typeface. Update the numbered memory poems in `public/assets/memories/memories.txt`.
- The "Open When You Miss Me" discovery card links to a website in a new tab; edit `missYouWebsiteUrl` in `src/App.jsx` to change its destination.

### Phase 5 — Personal discoveries
- Functional random-memory rotation, secret-message reveal, and an accessible miss-you letter overlay.
- Song card is wired for a local audio file. Add `our-song.mp3` to `public/assets/our-song.mp3`; the card will play it from the existing path. Update its title/artwork in `SongCard` and `.song-art`.

### Phase 6 — Vertical timeline and conclusion
- The final section loads its introduction and numbered events from `public/assets/Timeline/TimeLine.txt`. Put each event on a line beginning with its number and a period (for example, `10. First trip`); following lines become that event's description until the next numbered event.
- Add a matching image in `public/assets/Timeline/` with the same number followed by a period (for example, `10. First trip.jpg`). JPEG, PNG, WebP, and AVIF images are supported. Events alternate sides automatically; events without a matching image show as text-only cards.
- The final marker leads to “To Be Continued...” and the closing Tamil line.

## Project files

- `src/App.jsx` — React page and interactive section components.
- `src/main.jsx` — React entry point.
- `src/styles.css` — color/type tokens, paper/night surfaces, responsive layouts, and interactions.
- `vite.config.js` — generates a timeline photo manifest from numbered images in the public timeline folder for development and production builds.
- `index.html` — Vite document shell, metadata, and web fonts.

## Run

Install dependencies with `npm install`, then start the local site with `npm run dev`. `npm run build` creates the production site in `dist/`. Sample Unsplash images and Google Fonts need an internet connection.
