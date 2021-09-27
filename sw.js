importScripts('./js/sw-utils.js');


const STATIC_CACHE_NAME = 'static-v2';
const DYNAMIC_CACHE_NAME = 'dynamic-v1';
const INMUTABLE_CACHE_NAME = 'inmutable-v1';

// agregamos los assets al app shell
const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js'
];


const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
    'css/animate.css',
    'js/libs/jquery.js'
]





self.addEventListener('install', e => {


    // Grabamos el cache statico
    const cache_static = caches.open(STATIC_CACHE_NAME).then( cache => cache.addAll(APP_SHELL));

    // grabamos el cache inmutable
    const cache_inmutable = caches.open(INMUTABLE_CACHE_NAME).then( cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(  Promise.all([cache_static, cache_inmutable] ));

});



self.addEventListener('activate', event => {
    // event.waitUntil();
        // borrar cahces viejos
   const respuesta = caches.keys()
   .then( keys => {
       keys.forEach( key => {

           // si es diferente al key que tenemos lo borramos
           if(key  !== STATIC_CACHE_NAME  && key.includes('static') ) {
               return caches.delete( key );
           }
       });
   });

    event.waitUntil(respuesta)
});



self.addEventListener('fetch', (event) => {

    const respuesta = caches.match( event.request ).then( resp => {

        if(resp) {
            return resp;
        }else {
                return fetch( event.request )
                .then( newResponse => {
                    // 
                    return actualizaCacheDinamico(DYNAMIC_CACHE_NAME, event.request, newResponse);
                });
        }
    });

    event.respondWith( respuesta );
});


