import { warmStrategyCache, offlineFallback } from 'workbox-recipes';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';


// configurando o cache
const pageCache = new CacheFirst({
  cacheName: 'pwa-geoloc-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
    }),
  ],
});

// indicando o cache da página
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// registrando a rota
registerRoute(
  (request) => request.mode === 'navigate', pageCache
);

registerRoute( // configurando cache de assets
  ({ request }) => ['style', 'script', 'worker']
    .includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

OfflineFallback({ 
  pageFallback: '/offline.html',
});

const imageRoute = new Route(({ request }) => {
  return request.destination === 'image';
}, new CacheFirst({
  cacheName: 'images',
  plugins: [
    new ExpirationPlugin({
      maxAgeSeconds: 60 * 60 * 24 * 30, 
    }),
  ],
}));

registerRoute(imageRoute);