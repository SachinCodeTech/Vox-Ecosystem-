/* Vox Ecosystem service guard.
   Add to <head> of each app:
   <script src="https://vox-ecosystem.vercel.app/service-guard.js" data-app="voxcadd"></script>
   IDs: voxcadd | archpad | tento7
   If the status can't be loaded (offline, error) the app keeps working. */
(function () {
  var me = document.currentScript;
  var id = me && me.getAttribute("data-app");
  if (!id) return;
  fetch("https://vox-ecosystem.vercel.app/services.json?t=" + Date.now(), { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      var s = j && j.services && j.services[id];
      if (!s || s.enabled !== false) return;
      var msg = (s.message || "").trim() || "This service is temporarily unavailable. Please check back soon.";
      function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
      document.documentElement.innerHTML =
        '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<title>Service unavailable</title></head>' +
        '<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#070b18;color:#f1f4ff;' +
        'font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-align:center;padding:24px">' +
        '<div style="max-width:420px"><div style="font-size:48px">🛠️</div>' +
        '<h1 style="font-size:1.5rem;margin:14px 0 8px">Temporarily unavailable</h1>' +
        '<p style="color:#93a0c6;line-height:1.5">' + esc(msg) + '</p>' +
        '<p style="color:#6b7899;font-size:.8rem;margin-top:26px">CodeTech Developers · Vox Ecosystem</p></div></body>';
    })
    .catch(function () {});
})();
