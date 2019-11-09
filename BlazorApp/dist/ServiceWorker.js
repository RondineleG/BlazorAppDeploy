const baseURL = '/';
const indexURL = '/index.html';
const networkFetchEvent = 'fetch';
const swInstallEvent = 'install';
const swInstalledEvent = 'installed';
const swActivateEvent = 'activate';
const staticCachePrefix = 'blazor-cache-v';
const staticCacheName = 'blazor-cache-v1';
const requiredFiles = [
"/_framework/blazor.boot.json",
"/_framework/blazor.server.js",
"/_framework/blazor.webassembly.js",
"/_framework/wasm/mono.js",
"/_framework/wasm/mono.wasm",
"/_framework/_bin/BlazorApp.dll",
"/_framework/_bin/BlazorApp.Shared.dll",
"/_framework/_bin/Microsoft.AspNetCore.Authorization.dll",
"/_framework/_bin/Microsoft.AspNetCore.Blazor.dll",
"/_framework/_bin/Microsoft.AspNetCore.Blazor.HttpClient.dll",
"/_framework/_bin/Microsoft.AspNetCore.Components.dll",
"/_framework/_bin/Microsoft.AspNetCore.Components.Forms.dll",
"/_framework/_bin/Microsoft.AspNetCore.Components.Web.dll",
"/_framework/_bin/Microsoft.AspNetCore.Metadata.dll",
"/_framework/_bin/Microsoft.Bcl.AsyncInterfaces.dll",
"/_framework/_bin/Microsoft.Extensions.DependencyInjection.Abstractions.dll",
"/_framework/_bin/Microsoft.Extensions.DependencyInjection.dll",
"/_framework/_bin/Microsoft.Extensions.Logging.Abstractions.dll",
"/_framework/_bin/Microsoft.Extensions.Options.dll",
"/_framework/_bin/Microsoft.Extensions.Primitives.dll",
"/_framework/_bin/Microsoft.JSInterop.dll",
"/_framework/_bin/Mono.Security.dll",
"/_framework/_bin/Mono.WebAssembly.Interop.dll",
"/_framework/_bin/mscorlib.dll",
"/_framework/_bin/System.Buffers.dll",
"/_framework/_bin/System.ComponentModel.Annotations.dll",
"/_framework/_bin/System.Core.dll",
"/_framework/_bin/System.dll",
"/_framework/_bin/System.Memory.dll",
"/_framework/_bin/System.Net.Http.dll",
"/_framework/_bin/System.Numerics.Vectors.dll",
"/_framework/_bin/System.Runtime.CompilerServices.Unsafe.dll",
"/_framework/_bin/System.Text.Encodings.Web.dll",
"/_framework/_bin/System.Text.Json.dll",
"/_framework/_bin/System.Threading.Tasks.Extensions.dll",
"/assets/css/fontawesome-all.min.css",
"/assets/css/main.css",
"/assets/css/noscript.css",
"/assets/js/breakpoints.min.js",
"/assets/js/browser.min.js",
"/assets/js/jquery.min.js",
"/assets/js/main.js",
"/assets/js/util.js",
"/assets/sass/base/_page.scss",
"/assets/sass/base/_reset.scss",
"/assets/sass/base/_typography.scss",
"/assets/sass/components/_actions.scss",
"/assets/sass/components/_box.scss",
"/assets/sass/components/_button.scss",
"/assets/sass/components/_form.scss",
"/assets/sass/components/_icon.scss",
"/assets/sass/components/_icons.scss",
"/assets/sass/components/_image.scss",
"/assets/sass/components/_list.scss",
"/assets/sass/components/_table.scss",
"/assets/sass/layout/_bg.scss",
"/assets/sass/layout/_footer.scss",
"/assets/sass/layout/_header.scss",
"/assets/sass/layout/_main.scss",
"/assets/sass/layout/_wrapper.scss",
"/assets/sass/libs/_breakpoints.scss",
"/assets/sass/libs/_functions.scss",
"/assets/sass/libs/_mixins.scss",
"/assets/sass/libs/_vars.scss",
"/assets/sass/libs/_vendor.scss",
"/assets/sass/main.scss",
"/assets/sass/noscript.scss",
"/assets/webfonts/fa-brands-400.eot",
"/assets/webfonts/fa-brands-400.svg",
"/assets/webfonts/fa-brands-400.ttf",
"/assets/webfonts/fa-brands-400.woff",
"/assets/webfonts/fa-brands-400.woff2",
"/assets/webfonts/fa-regular-400.eot",
"/assets/webfonts/fa-regular-400.svg",
"/assets/webfonts/fa-regular-400.ttf",
"/assets/webfonts/fa-regular-400.woff",
"/assets/webfonts/fa-regular-400.woff2",
"/assets/webfonts/fa-solid-900.eot",
"/assets/webfonts/fa-solid-900.svg",
"/assets/webfonts/fa-solid-900.ttf",
"/assets/webfonts/fa-solid-900.woff",
"/assets/webfonts/fa-solid-900.woff2",
"/css/bootstrap/bootstrap.min.css",
"/css/bootstrap/bootstrap.min.css.map",
"/css/open-iconic/FONT-LICENSE",
"/css/open-iconic/font/css/open-iconic-bootstrap.min.css",
"/css/open-iconic/font/fonts/open-iconic.eot",
"/css/open-iconic/font/fonts/open-iconic.otf",
"/css/open-iconic/font/fonts/open-iconic.svg",
"/css/open-iconic/font/fonts/open-iconic.ttf",
"/css/open-iconic/font/fonts/open-iconic.woff",
"/css/open-iconic/ICON-LICENSE",
"/css/open-iconic/README.md",
"/css/site.css",
"/images/bg.jpg",
"/images/icon-192.png",
"/images/icon-512.png",
"/images/overlay.png",
"/images/pic01.jpg",
"/images/pic02.jpg",
"/images/pic03.jpg",
"/index.html",
"/_redirects",
"/ServiceWorkerRegister.js",
"/manifest.json"
];
// * listen for the install event and pre-cache anything in filesToCache * //
self.addEventListener(swInstallEvent, event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(requiredFiles);
            })
    );
});
self.addEventListener(swActivateEvent, function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (staticCacheName !== cacheName && cacheName.startsWith(staticCachePrefix)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
self.addEventListener(networkFetchEvent, event => {
    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === baseURL) {
            event.respondWith(caches.match(indexURL));
            return;
        }
    }
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (response.ok) {
                            if (requestUrl.origin === location.origin) {
                                caches.open(staticCacheName).then(cache => {
                                    cache.put(event.request.url, response);
                                });
                            }
                        }
                        return response.clone();
                    });
            }).catch(error => {
                console.error(error);
            })
    );
});
