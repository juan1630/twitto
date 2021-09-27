

function actualizaCacheDinamico (dynamicCache , request, res ) {
        
    if(res.ok) {

        return caches.open(dynamicCache)
            .then( cache => {
            cache.put(request, res.clone());
            return res.clone();
        });
    
    }else {
        return res;
    }
}
