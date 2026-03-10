const CACHE_NAME = "eterna-pwa-v2";
const OFFLINE_URL = "/offline.html";

const CORE_ASSETS = ["/", "/offline.html", "/logo.png", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  const isNextAsset =
    url.pathname.startsWith("/_next/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".map");

  if (request.method !== "GET") {
    return;
  }

  // Never cache Next.js build/runtime assets in SW to avoid stale chunk errors.
  if (isNextAsset) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL).then((response) => response || caches.match("/")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // Only cache same-origin static assets that are safe to reuse.
          const isCacheableStatic =
            url.origin === self.location.origin &&
            (url.pathname.startsWith("/uploads/") ||
              url.pathname.startsWith("/icons/") ||
              url.pathname.endsWith(".png") ||
              url.pathname.endsWith(".jpg") ||
              url.pathname.endsWith(".jpeg") ||
              url.pathname.endsWith(".webp") ||
              url.pathname.endsWith(".svg") ||
              url.pathname.endsWith(".ico") ||
              url.pathname.endsWith(".html"));

          const responseClone = networkResponse.clone();
          if (isCacheableStatic) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match("/logo.png"));
    })
  );
});
