import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const timelineDirectory = path.resolve(
  process.cwd(),
  "public",
  "assets",
  "Timeline"
);

const supportedImageExtensions = new Set([
  ".avif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
]);

function createTimelineManifest() {
  const photos = {};

  // Avoid crashing the build if the folder is missing.
  if (!existsSync(timelineDirectory)) {
    console.warn(
      `Timeline directory not found: ${timelineDirectory}`
    );
    return JSON.stringify(photos);
  }

  const filenames = readdirSync(timelineDirectory)
    .filter((filename) =>
      supportedImageExtensions.has(
        path.extname(filename).toLowerCase()
      )
    )
    .sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );

  for (const filename of filenames) {
    const match = filename.match(/^(\d+)\s*[.)-]/);
    if (!match) continue;

    const number = Number(match[1]);

    if (!photos[number]) {
      photos[number] = {
        src: `/assets/Timeline/${encodeURIComponent(filename)}`,
      };
    }
  }

  return JSON.stringify(photos);
}

function timelineManifestPlugin() {
  return {
    name: "timeline-photo-manifest",

    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(
          request.url,
          "http://localhost"
        ).pathname;

        if (
          request.method !== "GET" ||
          pathname !== "/assets/Timeline/timeline-manifest.json"
        ) {
          next();
          return;
        }

        try {
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/json");
          response.setHeader("Cache-Control", "no-store");
          response.end(createTimelineManifest());
        } catch (error) {
          next(error);
        }
      });
    },

    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "assets/Timeline/timeline-manifest.json",
        source: createTimelineManifest(),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), timelineManifestPlugin()],
});
