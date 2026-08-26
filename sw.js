const V="pgai-v1";
const CORE=["/","/index.html","/privacy.html","/manifest.json",
 "/games/bastione.html","/games/eco.html","/games/microlabirinto.html",
 "/games/palazzo.html","/games/skibidi.html","/games/sisifo.html"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=="pgai-fonts").map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin){
    e.respondWith(caches.open(V).then(async c=>{
      const hit=await c.match(e.request);
      const net=fetch(e.request).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit);
      return hit||net;
    }));
  }else if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.open("pgai-fonts").then(async c=>{
      const hit=await c.match(e.request);
      if(hit)return hit;
      const r=await fetch(e.request);
      if(r&&(r.ok||r.type==="opaque"))c.put(e.request,r.clone());
      return r;
    }).catch(()=>fetch(e.request)));
  }
});
