"use strict";

// EDIT THIS LINE to change the health-check endpoint (relative path keeps
// file:// and any static host working; use an absolute URL only if needed).
const HEALTH_ENDPOINT = "/healthz";

// Version/build string shown in the header subtitle.
const BUILD_VERSION = "v1.0.0 (build 2026-09-29)";

function formatViewport() {
  return window.innerWidth + " x " + window.innerHeight;
}

function updateOnlineStatus() {
  var el = document.getElementById("online-status");
  if (!el) return;
  el.textContent = navigator.onLine ? "Online" : "Offline";
}

function debounce(fn, delay) {
  var timer = null;
  return function () {
    if (timer !== null) window.clearTimeout(timer);
    timer = window.setTimeout(fn, delay);
  };
}

async function runHealthCheck() {
  var output = document.getElementById("health-output");
  var button = document.getElementById("health-check-btn");
  if (!output || !button) return;

  button.disabled = true;
  output.classList.remove("ok", "fail");
  output.textContent = "Checking " + HEALTH_ENDPOINT + " …";

  var start = window.performance.now();
  try {
    var response = await fetch(HEALTH_ENDPOINT, { cache: "no-store" });
    var elapsed = Math.round(window.performance.now() - start);
    if (response.ok) {
      output.classList.add("ok");
      output.textContent =
        "Success: HTTP " + response.status + " in " + elapsed + " ms.";
    } else {
      output.classList.add("fail");
      output.textContent =
        "Failure: HTTP " + response.status + " (" + response.statusText + ") in " +
        elapsed + " ms. Endpoint did not return 2xx.";
    }
  } catch (err) {
    var elapsedErr = Math.round(window.performance.now() - start);
    output.classList.add("fail");
    var reason = err instanceof Error ? err.message : String(err);
    output.textContent =
      "Failure: could not reach " + HEALTH_ENDPOINT +
      " after " + elapsedErr + " ms (" + reason + ").";
  } finally {
    button.disabled = false;
  }
}

function initThemeToggle() {
  var button = document.getElementById("theme-toggle");
  if (!button) return;

  var isDark = function () {
    var explicit = document.documentElement.getAttribute("data-theme");
    if (explicit === "dark") return true;
    if (explicit === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  var render = function () {
    var dark = isDark();
    button.textContent = dark ? "Light mode" : "Dark mode";
    button.setAttribute("aria-pressed", String(dark));
  };

  button.addEventListener("click", function () {
    document.documentElement.setAttribute("data-theme", isDark() ? "light" : "dark");
    render();
  });

  render();
}

document.addEventListener("DOMContentLoaded", function () {
  var versionEl = document.getElementById("build-version");
  if (versionEl) versionEl.textContent = BUILD_VERSION;

  var loadEl = document.getElementById("load-timestamp");
  if (loadEl) loadEl.textContent = new Date().toString();

  var clockEl = document.getElementById("clock");
  var tick = function () {
    if (clockEl) clockEl.textContent = new Date().toLocaleString();
  };
  tick();
  window.setInterval(tick, 1000);

  var originEl = document.getElementById("location-origin");
  if (originEl) {
    originEl.textContent =
      window.location.origin && window.location.origin !== "null"
        ? window.location.origin
        : "(opaque origin — opened via file://)";
  }

  var hrefEl = document.getElementById("location-href");
  if (hrefEl) hrefEl.textContent = window.location.href;

  var uaEl = document.getElementById("user-agent");
  if (uaEl) uaEl.textContent = navigator.userAgent;

  var viewportEl = document.getElementById("viewport");
  var renderViewport = function () {
    if (viewportEl) viewportEl.textContent = formatViewport() + " px";
  };
  renderViewport();
  window.addEventListener("resize", debounce(renderViewport, 150));

  updateOnlineStatus();
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  var healthButton = document.getElementById("health-check-btn");
  if (healthButton) healthButton.addEventListener("click", runHealthCheck);

  initThemeToggle();
});
