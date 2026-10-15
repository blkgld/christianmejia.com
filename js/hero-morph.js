/*
 * Hero morph integration.
 * Load flubber before this file if you want path interpolation:
 * https://cdn.jsdelivr.net/npm/flubber@0.4.2/build/flubber.min.js
 *
 * If Flubber fails to load, this script reports a clear console error and
 * leaves the original heading in place instead of breaking the hero.
 */
(() => {
  "use strict";

  function initHeroMorph() {
    const hero = document.querySelector(".hero");
    const heading = hero && hero.querySelector(".hero__h1");

    if (!hero || !heading) {
      console.error("Hero morph: couldn't find .hero and .hero__h1. Check the HTML class names.");
      return;
    }
    if (!window.flubber || typeof window.flubber.interpolate !== "function") {
      console.error("Hero morph: Flubber did not load. Check the Flubber script URL and network access.");
      return;
    }
    if (hero.querySelector(".hero-morph")) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const NS = "http://www.w3.org/2000/svg";

    // Each target is one closed silhouette. The detailed strokes are separate
    // so the cup handle, record grooves, steam and logo can fade independently.
    const SHAPES = {
      mug: "M132 98 C154 72 219 65 300 65 C381 65 446 72 468 98 C468 170 438 223 383 246 C340 264 260 264 217 246 C162 223 132 170 132 98 Z",
      record: "M300 22 C370 22 428 80 428 150 C428 220 370 278 300 278 C230 278 172 220 172 150 C172 80 230 22 300 22 Z",
      logo: "M300 22 C370 22 428 80 428 150 C428 220 370 278 300 278 C230 278 172 220 172 150 C172 80 230 22 300 22 Z"
    };

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "hero-morph");
    svg.setAttribute("viewBox", "0 0 600 300");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Hola transforms into a coffee mug, a vinyl record, and the logo");
    svg.setAttribute("focusable", "false");

    // Use the existing heading as accessible text. The letterforms are preserved
    // as text at first, then fade into the first silhouette. This avoids trying
    // to force a compound word path into a single-contour shape.
    const word = document.createElementNS(NS, "text");
    word.setAttribute("class", "hero-morph__word");
    word.setAttribute("x", "300");
    word.setAttribute("y", "190");
    word.setAttribute("text-anchor", "middle");
    word.setAttribute("font-family", '"Playfair Display", Georgia, serif');
    word.setAttribute("font-size", "150");
    word.setAttribute("font-weight", "600");
    word.textContent = heading.textContent.trim() || "Hola!";
    svg.appendChild(word);

    const silhouette = document.createElementNS(NS, "path");
    silhouette.setAttribute("class", "hero-morph__shape");
    silhouette.setAttribute("d", SHAPES.mug);
    silhouette.style.opacity = "0";
    svg.appendChild(silhouette);

    const extras = document.createElementNS(NS, "g");
    extras.innerHTML = `
      <g class="hero-morph__mug-detail">
        <path d="M458 105 C510 91 531 115 527 145 C523 174 499 184 458 177"/>
        <path d="M151 105 C207 126 393 126 449 105"/>
        <path d="M151 105 C207 153 393 153 449 105" stroke-width="3"/>
      </g>
      <g class="hero-morph__steam">
        <path d="M252 94 C235 75 264 65 253 44 C248 35 251 29 258 22"/>
        <path d="M286 91 C269 72 300 62 288 41 C283 32 288 26 295 18"/>
        <path d="M320 94 C304 77 331 66 320 48"/>
      </g>
      <g class="hero-morph__record-grooves">
        <circle cx="300" cy="150" r="105"/>
        <circle cx="300" cy="150" r="91"/>
        <circle cx="300" cy="150" r="75"/>
        <circle cx="300" cy="150" r="24"/>
      </g>
      <g class="hero-morph__notes">
        <path d="M424 77 V42 L449 35 V67"/>
        <ellipse class="note-head" cx="416" cy="80" rx="9" ry="6" transform="rotate(-25 416 80)"/>
        <ellipse class="note-head" cx="441" cy="70" rx="9" ry="6" transform="rotate(-25 441 70)"/>
        <path d="M454 209 V177 L477 171 V199"/>
        <ellipse class="note-head" cx="447" cy="212" rx="8" ry="6" transform="rotate(-25 447 212)"/>
        <ellipse class="note-head" cx="470" cy="202" rx="8" ry="6" transform="rotate(-25 470 202)"/>
        <path d="M141 111 V82 L161 77 V103"/>
        <ellipse class="note-head" cx="135" cy="113" rx="8" ry="5" transform="rotate(-25 135 113)"/>
      </g>
      <g class="hero-morph__logo-detail">
        <circle cx="300" cy="150" r="102"/>
        <path d="M369 128 A72 72 0 0 0 236 110"/>
        <path class="slash" d="M254 194 L302 139 M287 194 L335 139 M320 194 L368 139"/>
      </g>`;
    svg.appendChild(extras);

    heading.replaceWith(svg);

    const mugDetail = svg.querySelector(".hero-morph__mug-detail");
    const steam = svg.querySelector(".hero-morph__steam");
    const notes = svg.querySelector(".hero-morph__notes");
    const grooves = svg.querySelector(".hero-morph__record-grooves");
    const logoDetail = svg.querySelector(".hero-morph__logo-detail");

    const opacity = (el, value) => { el.style.opacity = String(Math.max(0, Math.min(1, value))); };
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;

    function morph(from, to, duration, done) {
      let interpolate;
      try {
        interpolate = window.flubber.interpolate(from, to, { maxSegmentLength: 3 });
      } catch (error) {
        console.error("Hero morph: Flubber couldn't interpolate the silhouette.", error);
        done && done();
        return;
      }
      const start = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        silhouette.setAttribute("d", interpolate(ease(t)));
        if (done) done(t);
        if (t < 1 && !reduceMotion) requestAnimationFrame(frame);
      }
      if (reduceMotion) {
        silhouette.setAttribute("d", to);
        if (done) done(1);
      } else {
        requestAnimationFrame(frame);
      }
    }

    if (reduceMotion) {
      word.style.display = "none";
      silhouette.setAttribute("d", SHAPES.logo);
      silhouette.style.opacity = "0";
      opacity(logoDetail, 1);
      return;
    }

    function loop() {
      word.style.display = "";
      word.style.opacity = "1";
      silhouette.style.opacity = "0";
      silhouette.setAttribute("d", SHAPES.mug);
      opacity(mugDetail, 0);
      opacity(steam, 0);
      opacity(notes, 0);
      opacity(grooves, 0);
      opacity(logoDetail, 0);

      // Greeting fades into the mug. Mug, record and logo use true SVG path morphing.
      window.setTimeout(() => {
        word.style.transition = "opacity 500ms ease";
        word.style.opacity = "0";
        silhouette.style.transition = "opacity 500ms ease";
        silhouette.style.opacity = "1";
        window.setTimeout(() => {
          opacity(mugDetail, 1);
          opacity(steam, 1);

          window.setTimeout(() => {
            opacity(mugDetail, 0);
            opacity(steam, 0);
            morph(SHAPES.mug, SHAPES.record, 1700, t => {
              opacity(notes, t);
              opacity(grooves, t);
            });

            window.setTimeout(() => {
              opacity(notes, 0);
              morph(SHAPES.record, SHAPES.logo, 1800, t => {
                opacity(grooves, 1 - t);
                opacity(logoDetail, t);
              });
            }, 1750);

            window.setTimeout(() => {
              // Hold on the logo, then transition back to the greeting.
              window.setTimeout(() => {
                opacity(logoDetail, 0);
                morph(SHAPES.logo, SHAPES.mug, 1400, t => {
                  silhouette.style.opacity = String(1 - t);
                  word.style.opacity = String(t);
                });
                window.setTimeout(loop, 1500);
              }, 1200);
            }, 3700);
          }, 1400);
        }, 520);
      }, 1300);
    }

    loop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroMorph, { once: true });
  } else {
    initHeroMorph();
  }
})();
