// sw.js — guarda la app de ParaBot en la tablet para que abra aunque no haya internet (Ariel, 26 de nov. de 2026).
// Red primero: si hay internet, siempre trae la versión más nueva y la guarda; si no hay, usa la copia guardada.
const CACHE = 'parabot-app';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html']))); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // el coach de la laptop y lo demás, sin tocar
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});
