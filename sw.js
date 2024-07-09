const staticCacheName = 'site-static'
const dynamicCacheName = 'site-dynamic'
const assets = [
    '/',
    '/index.html',
    // js
    '/js/app.js',
    '/js/ui.js',
    '/js/db.js',
    '/js/auth.js',
    // css
    '/styles.css',
];

// cache size limiting function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        })
    })
}


// install event
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets);
        })
    )
});

// activate event
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys =>  {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key)))
        })
    )
})

// fetch event
self.addEventListener('fetch', evt => {
    if(evt.request.url.indexOf('googleapis.com') == -1){
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                return cacheRes || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(evt.request, fetchRes.clone());
                        limitCacheSize(dynamicCacheName, 13)
                        return fetchRes;
                    })
                });
            }).catch(() => {
                if(evt.request.url.indexOf('.html') > -1){
                    return caches.match('/pages/fallback.html')
                }
            })
        )
    }
})