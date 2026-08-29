const CACHE = "dcic-shell-v3";
const SHELL = ["/", "/index.html", "/demo/", "/privacy/", "/terms/", "/assets/lineage-drafting-hero.webp", "/favicon.svg", "/apple-touch-icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const isNavigation = event.request.mode === "navigate";
  const cachedDocument = isNavigation
    ? caches.match(event.request, { ignoreSearch: true })
    : caches.match(event.request);
  event.respondWith(
    cachedDocument.then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response.ok && url.origin === self.location.origin) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => {
          if (!isNavigation) return Response.error();
          const shell = ["/", "/demo/", "/privacy/", "/terms/"].includes(url.pathname)
            ? url.pathname
            : "/";
          return caches.match(shell);
        });
    }),
  );
});
