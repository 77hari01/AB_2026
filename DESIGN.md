# You & Me — React Digital Diary

A complete React long-scroll website inspired by the supplied scrapbook reference. The visual language brings together sunset photography, tactile cream paper, loose Polaroids, handwritten English accents, Tamil typography, muted blush/lilac details, and a contrasting midnight-blue night section. It is one connected page, with the vertical timeline as the final section.

## Build phases

### Phase 1 — React foundation
- Vite + React entry point with reusable section components and data-driven gallery, moment, and timeline content.
- Responsive navigation anchors to each part of the same long page.

### Phase 2 — Cinematic home
- Full-height sunset hero, atmospheric image overlay, handwritten English heading, Tamil support text, and a discreet scroll call to action.
- Hero image is currently a sample Unsplash photograph.

### Phase 3 — Scrapbook memories
- Filterable Polaroid collage with sample photographs, paper tape, captions, and hand-drawn flourishes.
- A featured "A Scrapbook of Us" panel uses the supplied pink scrapbook artwork at `public/assets/scrapbook-cover.png`.
- Replace image IDs in the `photos` array in `src/App.jsx` with your own image IDs or local image paths. Keep each item’s `category` to preserve filtering.

### Phase 4 — Midnight moments and paper poems
- Six minimal cards on the starry dark section transition into cream-paper poetry notes.
- Tamil text is marked with `lang="ta"` and uses the Noto Serif Tamil typeface. Replace the example lines directly in `src/App.jsx`.

### Phase 5 — Personal discoveries
- Functional random-memory rotation, secret-message reveal, and an accessible miss-you letter overlay.
- Song card is wired for a local audio file. Add `our-song.mp3` to `public/assets/our-song.mp3`; the card will play it from the existing path. Update its title/artwork in `SongCard` and `.song-art`.

### Phase 6 — Vertical timeline and conclusion
- The final section uses one straight central vertical rail and circular markers; events alternate left and right.
- The final marker leads to “To Be Continued...” and the closing Tamil line. Update dates, copy, or optional first-meet photo in `timelineEvents` in `src/App.jsx`.

## Project files

- `src/App.jsx` — React page and interactive section components.
- `src/main.jsx` — React entry point.
- `src/styles.css` — color/type tokens, paper/night surfaces, responsive layouts, and interactions.
- `index.html` — Vite document shell, metadata, and web fonts.

## Run

Install dependencies with `npm install`, then start the local site with `npm run dev`. `npm run build` creates the production site in `dist/`. Sample Unsplash images and Google Fonts need an internet connection.
