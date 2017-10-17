// TODO: DEFINE CACHE NAME
var cacheName = 'firstApp';

// TODO: DEFINE APP SHELL: ADD FILES TO BE CACHED
var filesToCache = [
	'./index.html',
	'./css/styles.css',
	'./js/menu.js',
	'./js/app.js'
];

// TODO: IMPLEMENT 'INSTALL' EVENT LISTENER
self.addEventListener('install', function (event) {

	// TODO: ADD FILES TO CACHE
	event.waitUntil(
			caches.open(cacheName)
			.then(function(cache){
				return cache.addAll(filesToCache)
					.then(function(){
						console.log("FIles caches");
					})
			})
			.catch(function(err){
				console.log("Error while caching",err);
			})
		)	

});

self.addEventListener('activate', function (event) {

	// TODO: CONSOLE OUTPUT TO CHECK WHEN ACTIVATE EVENT IS CALLED

});


//Adding 'fetch' event listener
self.addEventListener('fetch', function (event) {
  console.info("[FETCH] Event Request: ", event.request.url);

  var request = event.request;

  //Tell the browser to wait for network request and respond with below
  event.respondWith(
    //If request is already in cache, return it
    caches.match(request).then(function(response) {
      if (response) {
				console.log("[FETCH] Service Worker returning from Cache");
        return response;
      }

      //else add the request to cache and return the response
      return fetch(request).then(function(response) {
				console.log("[FETCH] Service Worker returning from Network");

				// User is Online but wrong URL and page not found
	      if(response.status === 404){
	        // Page Not Found - Return Custom Error Message:
	        return new Response('Whooops! You\'re looking for something that doesn\'t exist. Page not found!');
	      }

        var responseToCache = response.clone(); //Cloning the response stream in order to add it to cache
        caches.open(cacheName).then(
          function(cache) {
            cache.put(request, responseToCache); //Adding to cache
          });

        return response;
      });
    })
  );
});
