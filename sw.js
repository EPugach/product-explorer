const SHELL_VERSION = 9;
const SHELL_CACHE = `pe-shell-v${SHELL_VERSION}`;
const DATA_CACHE = "pe-data-v1";

const SHELL_URLS = [
  "./app/css/galaxy.css",
  "./app/css/galaxy-planets.css",
  "./app/fonts/BricolageGrotesque-latin.woff2",
  "./app/vendor/minisearch.7.2.0.js",
  "./app/vendor/three.0.184.min.js",
  "./app/vendor/three.core.min.js",
  "./app/js/main.js",
  "./app/js/navigation.js",
  "./app/js/search.js",
  "./app/js/physics.js",
  "./app/js/galaxy-renderer.js",
  "./app/js/galaxy-3d.js",
  "./app/js/particles.js",
  "./app/js/starfield.js",
  "./app/js/tours.js",
  "./app/js/state.js",
  "./app/js/utils.js",
  "./app/js/icons.js",
  "./app/js/pointer-events.js",
  "./app/js/templates.js",
  "./app/js/version.js",
  "./app/js/feedback-shared.js",
];

const NETWORK_ONLY = [
  "workers.dev",
  "googletagmanager.com",
  "google-analytics.com",
  "googleapis.com/analytics",
  "script.google.com",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL_CACHE && k !== DATA_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET") return;
  if (
    NETWORK_ONLY.some(
      (host) => url.hostname.includes(host) || url.pathname.includes(host),
    )
  )
    return;

  if (isShellRequest(url)) {
    event.respondWith(cacheFirst(event.request, SHELL_CACHE));
    return;
  }

  if (isProductData(url)) {
    event.respondWith(staleWhileRevalidate(event.request, DATA_CACHE));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(event.request, DATA_CACHE));
    return;
  }
});

function isShellRequest(url) {
  return (
    url.pathname.includes("/app/js/") ||
    url.pathname.includes("/app/css/") ||
    url.pathname.includes("/app/fonts/") ||
    url.pathname.includes("/app/vendor/")
  );
}

function isProductData(url) {
  return url.pathname.includes("/products/");
}

function isStaticAsset(url) {
  return (
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".woff2")
  );
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreSearch: true });

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return (
    cached || (await fetchPromise) || new Response("Offline", { status: 503 })
  );
}
