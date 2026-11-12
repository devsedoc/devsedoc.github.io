/* =================================================================
   Devang Sharma portfolio script
   1. Apply the saved theme immediately (runs before the page paints)
   2. Theme toggle button (dark is the default)
   3. Footer year
   4. Highlight the nav link for the section on screen
   ================================================================= */

(function () {
  "use strict";

  var STORAGE_KEY = "theme";
  var root = document.documentElement;

  /* localStorage can throw in private mode, so never let it break the page */
  function readTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function saveTheme(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* ignore */ }
  }

  /* -----------------------------------------------------------------
     1. APPLY SAVED THEME
     The site is dark by default. If the visitor picked light before,
     set data-theme="light" on <html> right away.
     ----------------------------------------------------------------- */
  if (readTheme() === "light") {
    root.setAttribute("data-theme", "light");
  }

  function isLight() {
    return root.getAttribute("data-theme") === "light";
  }

  /* Everything below needs the page's HTML to exist */
  document.addEventListener("DOMContentLoaded", function () {

    /* ---------------------------------------------------------------
       2. THEME TOGGLE
       The word in the brackets names the theme you'll switch TO.
       --------------------------------------------------------------- */
    var toggle = document.querySelector(".theme-toggle");
    var label = toggle && toggle.querySelector(".theme-toggle__label");

    function syncToggle() {
      if (!toggle) return;
      var light = isLight();
      toggle.setAttribute("aria-pressed", String(light));
      toggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
      if (label) label.textContent = light ? "dark" : "light";
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        if (isLight()) {
          root.removeAttribute("data-theme");
          saveTheme("dark");
        } else {
          root.setAttribute("data-theme", "light");
          saveTheme("light");
        }
        syncToggle();
      });
    }
    syncToggle();

    /* ---------------------------------------------------------------
       3. FOOTER YEAR
       --------------------------------------------------------------- */
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());

    /* ---------------------------------------------------------------
       4. ACTIVE NAV LINK
       Marks the nav link whose section is in the middle of the screen.
       --------------------------------------------------------------- */
    var links = document.querySelectorAll(".site-nav a[href^='#']");
    if (!("IntersectionObserver" in window) || !links.length) return;

    var byId = {};
    links.forEach(function (link) {
      byId[link.getAttribute("href").slice(1)] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.removeAttribute("aria-current"); });
        var active = byId[entry.target.id];
        if (active) active.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  });
})();
