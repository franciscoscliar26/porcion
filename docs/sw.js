// Sin conexión: guarda la app y la sirve aunque no haya internet; cuando hay, trae la versión nueva.
const V = "porcion-ed09596fae";
const CORE = ["./", "index.html", "config.js", "shim.js", "webui.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (u.origin !== location.origin && !/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(u.host)) return;   // la nube y la IA, siempre en vivo
  const isPage = e.request.mode === "navigate" || /\/(index\.html)?$/.test(u.pathname) || /\.(js|webmanifest)$/.test(u.pathname) && u.origin === location.origin;
  if (isPage) {   // primero la red (para recibir actualizaciones), si no hay, lo guardado
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(ca => ca.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
  } else {        // fotos, fuentes, librerías: primero lo guardado
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { if (res.ok || res.type === "opaque") { const c = res.clone(); caches.open(V).then(ca => ca.put(e.request, c)); } return res; })));
  }
});
