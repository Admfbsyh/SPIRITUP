/* eslint-disable no-unused-vars */

import { precacheAndRoute } from 'workbox-precaching';

// Do precaching
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', () => {
    console.log('Service Worker: Installed');
    self.skipWaiting();
});

self.addEventListener('push', (event) => {
    console.log('Service Worker: Pushed');
});
