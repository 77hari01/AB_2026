import { readdirSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const timelineDirectory = path.resolve(process.cwd(), "public", "assets", "Timeline");
const timelineManifestPath = "/assets/Timeline/timeline-manifest.json";
const supportedImageExtensions = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);

function createTimelineManifest() {
  const photos = {};
  const filenames = readdirSync(timelineDirectory)
    .filter((filename) => supportedImageExtensions.has(path.extname(filename).toLowerCase()))
    .sort((first, second) => first.localeCompare(second, undefined, { numeric: true }));

  for (const filename of filenames) {
    const match = filename.match(/^(\d+)\s*[.)-]/);
    if (!match) continue;

    const number = Number(match[1]);
    if (!photos[number]) {
      photos[number] = { src: `/assets/Timeline/${encodeURIComponent(filename)}` };
    }
  }

  return JSON.stringify(photos);
}

function timelineManifestPlugin() {
  return {
    name: "timeline-photo-manifest",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.method !== "GET" || new URL(request.url, "http://localhost").pathname !== timelineManifestPath) {
          next();
          return;
        }

        try {
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
        fileName: timelineManifestPath.slice(1),
        source: createTimelineManifest(),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), timelineManifestPlugin()],
});
