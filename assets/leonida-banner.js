/* Leonida Racing cross-promo banner (shared by all RRL pages).
   - Slim top strip, pushes the page down once, dismissible with the X.
   - Dismissal lasts for the current browser session only (sessionStorage),
     capped at HIDE_HOURS so long-lived mobile tabs see it again.
   - Texts / URL / timing: edit the CFG block below, nothing else.
   - Must be loaded as the FIRST element inside <body> (sync, no defer). */
(function () {
  "use strict";

  var CFG = {
    url: "https://leonidaracing.com/",
    logo: "leonida-lr.png",
    badge: "New",
    textLong: "Leonida Racing — GTA VI Racing Database & Community",
    textShort: "Leonida Racing \u00b7 GTA VI",
    tag: "Beta",
    cta: "Check it out",
    ariaLabel: "Leonida Racing announcement",
    closeLabel: "Dismiss Leonida Racing banner",
    HIDE_HOURS: 6,   // after a dismissal the banner stays away this long within the session
    DELAY_MS: 600,   // wait before the first slide-down
    K_DISMISSED: "rrlLbDismissed",
    K_SEEN: "rrlLbSeen"
  };

  var root = document.documentElement;
  var body = document.body;
  if (!body) return;

  // --- storage (sessionStorage with in-memory fallback) -------------------
  var mem = {};
  function sGet(k) {
    try { return window.sessionStorage.getItem(k); } catch (e) { return mem[k] || null; }
  }
  function sSet(k, v) {
    try { window.sessionStorage.setItem(k, v); } catch (e) { mem[k] = v; }
  }
  function sDel(k) {
    try { window.sessionStorage.removeItem(k); } catch (e) { delete mem[k]; }
  }

  var t = parseInt(sGet(CFG.K_DISMISSED), 10);
  if (t) {
    if (Date.now() - t < CFG.HIDE_HOURS * 3600 * 1000) return;
    sDel(CFG.K_DISMISSED);
  }

  // --- styles ---------------------------------------------------------------
  var css =
    "@property --lb-h{syntax:'<length>';inherits:true;initial-value:0px}" +
    "html{--lb-full:40px;--lb-sy:0px;transition:--lb-h .55s cubic-bezier(.16,1,.3,1)}" +
    "html.lb-instant{transition:none}" +
    "html.lb-on{--lb-h:var(--lb-full)}" +
    "body{padding-top:var(--lb-h)}" +
    "header{top:max(0px,calc(var(--lb-h) - var(--lb-sy)))!important}" +
    ".mobile-nav{padding-top:calc(88px + max(0px,calc(var(--lb-h) - var(--lb-sy))))!important}" +
    ".lb{position:absolute;top:0;left:0;right:0;height:var(--lb-h);overflow:hidden;z-index:49;" +
      "background:linear-gradient(90deg,#a3131f 0%,#e21c2b 50%,#a3131f 100%);color:#fff;" +
      "font-family:'Chakra Petch',sans-serif}" +
    ".lb-in{position:absolute;left:0;right:0;bottom:0;height:var(--lb-full);display:flex;align-items:stretch}" +
    ".lb-link{position:relative;flex:1 1 auto;min-width:0;display:flex;align-items:center;justify-content:center;" +
      "gap:10px;padding:0 48px;color:#fff;text-decoration:none;overflow:hidden;white-space:nowrap}" +
    ".lb-link::after{content:'';position:absolute;top:0;bottom:0;left:-40%;width:30%;" +
      "background:linear-gradient(100deg,transparent,rgba(255,255,255,.28),transparent);transform:skewX(-18deg);" +
      "animation:lb-shine 1.3s 1s ease-out 1 both;pointer-events:none}" +
    "@keyframes lb-shine{from{left:-40%}to{left:130%}}" +
    ".lb-logo{display:block;height:18px;width:auto;flex:0 0 auto}" +
    ".lb-badge{flex:0 0 auto;background:#fff;color:#a3131f;font-weight:700;font-size:10.5px;letter-spacing:.12em;" +
      "text-transform:uppercase;padding:3px 8px;border-radius:999px;line-height:1}" +
    ".lb-text{min-width:0;overflow:hidden;text-overflow:ellipsis;font-weight:600;font-size:13px;letter-spacing:.04em}" +
    ".lb-short{display:none}" +
    ".lb-tag{flex:0 0 auto;border:1px solid rgba(255,255,255,.7);font-weight:700;font-size:10px;letter-spacing:.12em;" +
      "text-transform:uppercase;padding:2px 7px;border-radius:999px;line-height:1.2}" +
    ".lb-cta{flex:0 0 auto;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;" +
      "border-bottom:1px solid rgba(255,255,255,.7);padding-bottom:1px}" +
    ".lb-cta i{font-style:normal;display:inline-block;transition:transform .2s ease}" +
    ".lb-link:hover .lb-cta i,.lb-link:focus-visible .lb-cta i{transform:translateX(4px)}" +
    ".lb-link:focus-visible,.lb-close:focus-visible{outline:2px solid #3ee1e8;outline-offset:-3px}" +
    ".lb-close{position:absolute;top:0;right:0;bottom:0;width:44px;display:flex;align-items:center;justify-content:center;" +
      "background:transparent;border:0;color:#fff;cursor:pointer;font-size:22px;line-height:1;opacity:.85}" +
    ".lb-close:hover{opacity:1;background:rgba(0,0,0,.16)}" +
    "@media (max-width:760px){.lb-cta span{display:none}.lb-link{padding:0 44px 0 12px;gap:8px}.lb-text{font-size:12px}}" +
    "@media (max-width:560px){html{--lb-full:36px}.lb-long{display:none}.lb-short{display:inline}.lb-logo{height:16px}}" +
    "@media (max-width:480px){.lb-badge{display:none}}" +
    "@media (prefers-reduced-motion:reduce){.lb-link::after{display:none}html{transition:none}}" +
    "@media print{.lb{display:none}html{--lb-h:0px!important}}";

  var style = document.createElement("style");
  style.id = "lb-style";
  style.textContent = css;
  document.head.appendChild(style);

  // --- markup ---------------------------------------------------------------
  var scriptEl = document.currentScript;
  var logoUrl = CFG.logo;
  try { logoUrl = new URL(CFG.logo, scriptEl ? scriptEl.src : document.baseURI).href; } catch (e) {}

  var el = document.createElement("div");
  el.className = "lb";
  el.id = "lbBanner";
  el.setAttribute("role", "region");
  el.setAttribute("aria-label", CFG.ariaLabel);
  el.innerHTML =
    '<div class="lb-in">' +
      '<a class="lb-link" href="' + CFG.url + '" target="_blank" rel="noopener">' +
        '<img class="lb-logo" src="' + logoUrl + '" alt="" width="58" height="18">' +
        '<span class="lb-badge">' + CFG.badge + '</span>' +
        '<span class="lb-text"><span class="lb-long">' + CFG.textLong.replace(/&/g, "&amp;") + '</span>' +
          '<span class="lb-short">' + CFG.textShort.replace(/&/g, "&amp;") + '</span></span>' +
        '<span class="lb-tag">' + CFG.tag + '</span>' +
        '<span class="lb-cta"><span>' + CFG.cta + ' </span><i aria-hidden="true">→</i></span>' +
      '</a>' +
      '<button class="lb-close" type="button" aria-label="' + CFG.closeLabel + '"><span aria-hidden="true">×</span></button>' +
    '</div>';
  body.insertBefore(el, body.firstChild);

  // --- header offset follows the scroll (banner scrolls away, header snaps to top) ---
  var ticking = false;
  function syncScroll() {
    ticking = false;
    root.style.setProperty("--lb-sy", (window.pageYOffset || 0) + "px");
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(syncScroll); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  syncScroll();

  // --- show -----------------------------------------------------------------
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var alreadySeen = sGet(CFG.K_SEEN) === "1";
  var scrolled = (window.pageYOffset || 0) > 8;

  if (alreadySeen || reduce || scrolled) {
    root.classList.add("lb-instant", "lb-on");
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { root.classList.remove("lb-instant"); });
    });
  } else {
    window.setTimeout(function () { root.classList.add("lb-on"); }, CFG.DELAY_MS);
  }
  sSet(CFG.K_SEEN, "1");

  // --- dismiss --------------------------------------------------------------
  var closeBtn = el.querySelector(".lb-close");
  closeBtn.addEventListener("click", function () {
    sSet(CFG.K_DISMISSED, String(Date.now()));
    root.classList.remove("lb-on");
    window.removeEventListener("scroll", onScroll);
    window.setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (style.parentNode) style.parentNode.removeChild(style);
      root.style.removeProperty("--lb-sy");
    }, reduce ? 0 : 650);
  });
})();
