const CACHE_VERSION = "wordocchi-v3";
const APP_SHELL_CACHE = `${CACHE_VERSION}:app-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}:runtime`;
const scopePath = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const basePath = scopePath === "" ? "" : scopePath;

const appShellUrls = [
  `${basePath}/`,
  `${basePath}/manifest.webmanifest`,
  `${basePath}/icons/icon-192.png`,
  `${basePath}/icons/icon-512.png`,
  `${basePath}/icons/maskable-512.png`,
  `${basePath}/og-image.png`,
  `${basePath}/rules/what.png`,
  `${basePath}/rules/parent.png`,
  `${basePath}/rules/pick.png`,
  `${basePath}/rules/timer.png`,
  `${basePath}/rules/reveal.png`,
  `${basePath}/illustrations/dog-detective.png`,
  `${basePath}/illustrations/cat-notekeeper.png`,
  `${basePath}/illustrations/lock-secret.png`,
  `${basePath}/illustrations/decor-star.png`,
  `${basePath}/illustrations/decor-heart.png`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(appShellUrls))
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
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, `${basePath}/`));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request);

  if (response.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
  }

  return response;
}

async function networkFirst(request, fallbackUrl) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch {
    return (await caches.match(request)) ?? (await caches.match(fallbackUrl));
  }
}
