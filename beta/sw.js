// Beta service worker: pass-through (no caching) so beta always shows the latest build.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Remove /beta/ entries the live site's worker may have cached earlier.
      // Only beta URLs are touched; the live site's own entries stay.
      for (const name of await caches.keys()) {
        const cache = await caches.open(name);
        for (const req of await cache.keys()) {
          if (new URL(req.url).pathname.includes("/beta/")) await cache.delete(req);
        }
      }
      await self.clients.claim();
    })(),
  );
});
