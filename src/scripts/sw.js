self.addEventListener('install', (event) => {
//   event.waitUntil(CacheHelper.cachingAppShell([...assetsToCache]));
    console.log('Installing Service Worker ...');
});

self.addEventListener('activate', (event) => {
//   event.waitUntil(CacheHelper.deleteOldCache());
    console.log('Activating Service Worker ...')
});

self.addEventListener('fetch', (event) => {
//   event.respondWith(CacheHelper.revalidateCache(event.request));
    console.log(event.request);
    event.respondWith(fetch(event.request));
});
