self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('spese-app').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/css/style.css',
                '/js/app.js',
                '/js/parser.js',
                '/js/storage.js',
                '/js/voice.js',
                '/js/ui.js',
                '/js/charts.js'
            ]);
        })
    );
});
self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(resp => resp || fetch(e.request)));
});