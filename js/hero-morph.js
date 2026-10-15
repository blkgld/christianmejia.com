/*
  Hero morph animation. No external libraries, CDNs, or network requests.
  Uses matching SVG cubic paths and interpolates their coordinates directly.
*/
(() => {
  "use strict";

  function initHeroMorph() {
    const hero = document.querySelector(".hero");
    const heading = hero && hero.querySelector(".hero__h1");
    if (!hero || !heading || hero.querySelector(".hero-morph")) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const NS = "http://www.w3.org/2000/svg";

    // Every silhouette has the same M + four cubic curves + Z structure.
    // This lets the browser interpolate every coordinate without a third-party library.
    const SHAPES = {
      mug: [
        130, 92,
        175, 58, 425, 58, 470, 92,
        472, 165, 435, 225, 370, 248,
        330, 264, 270, 264, 230, 248,
        165, 225, 128, 165, 130, 92
      ],
      record: [
        300, 22,
        370, 22, 428, 80, 428, 150,
        428, 220, 370, 278, 300, 278,
        230, 278, 172, 220, 172, 150,
        172, 80, 230, 22, 300, 22
      ],
      logo: [
        300, 22,
        370, 22, 428, 80, 428, 150,
        428, 220, 370, 278, 300, 278,
        230, 278, 172, 220, 172, 150,
        172, 80, 230, 22, 300, 22
      ]
    };

    function pathFrom(points) {
      return `M ${points[0]} ${points[1]} ` +
        `C ${points[2]} ${points[3]}, ${points[4]} ${points[5]}, ${points[6]} ${points[7]} ` +
        `C ${points[8]} ${points[9]}, ${points[10]} ${points[11]}, ${points[12]} ${points[13]} ` +
        `C ${points[14]} ${points[15]}, ${points[16]} ${points[17]}, ${points[18]} ${points[19]} ` +
        `C ${points[20]} ${points[21]}, ${points[22]} ${points[23]}, ${points[24]} ${points[25]} Z`;
    }

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "hero-morph");
    svg.setAttribute("viewBox", "0 0 600 300");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Hola transforms into a coffee mug, a vinyl record, and the studio logo");
    svg.setAttribute("focusable", "false");

    const word = document.createElementNS(NS, "text");
    word.setAttribute("class", "hero-morph__word");
    word.setAttribute("x", "300");
    word.setAttribute("y", "190");
    word.setAttribute("text-anchor", "middle");
    word.setAttribute("font-family", 'Georgia, "Times New Roman", serif');
    word.setAttribute("font-size", "150");
    word.setAttribute("font-weight", "700");
    word.textContent = heading.textContent.trim() || "Hola!";
    svg.appendChild(word);

    const shape = document.createElementNS(NS, "path");
    shape.setAttribute("class", "hero-morph__shape");
    shape.setAttribute("d", pathFrom(SHAPES.mug));
    shape.style.opacity = "0";
    svg.appendChild(shape);

    const detail = document.createElementNS(NS, "g");
    detail.innerHTML = `
      <g class="hero-morph__mug-detail">
        <path d="M462 102 C515 90 531 117 527 145 C523 173 500 184 460 177"/>
        <path d="M145 99 C205 124 395 124 455 99" stroke-width="3"/>
        <path d="M252 94 C235 75 264 65 253 44 C248 35 251 29 258 22" class="hero-morph__steam"/>
      </g>
      <g class="hero-morph__steam">
        <path d="M252 94 C235 75 264 65 253 44 C248 35 251 29 258 22"/>
        <path d="M286 91 C269 72 300 62 288 41 C283 32 288 26 295 18"/>
        <path d="M320 94 C304 77 331 66 320 48"/>
      </g>
      <g class="hero-morph__record-detail">
        <circle cx="300" cy="150" r="105"/>
        <circle cx="300" cy="150" r="91"/>
        <circle cx="300" cy="150" r="76"/>
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
    svg.appendChild(detail);
    heading.replaceWith(svg);

    const mugDetail = svg.querySelector(".hero-morph__mug-detail");
    const steam = svg.querySelector(".hero-morph__steam");
    const notes = svg.querySelector(".hero-morph__notes");
    const recordDetail = svg.querySelector(".hero-morph__record-detail");
    const logoDetail = svg.querySelector(".hero-morph__logo-detail");
    const setOpacity = (el, value) => { el.style.opacity = String(Math.max(0, Math.min(1, value))); };
    const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;

    function morph(from, to, duration, done) {
      const start = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        const e = ease(t);
        const points = from.map((value, i) => value + (to[i] - value) * e);
        shape.setAttribute("d", pathFrom(points));
        if (done) done(t);
        if (t < 1 && !reduceMotion) requestAnimationFrame(frame);
      }
      if (reduceMotion) {
        shape.setAttribute("d", pathFrom(to));
        if (done) done(1);
      } else requestAnimationFrame(frame);
    }

    if (reduceMotion) {
      word.style.display = "none";
      shape.setAttribute("d", pathFrom(SHAPES.logo));
      setOpacity(logoDetail, 1);
      return;
    }

    function loop() {
      word.style.transition = "none";
      word.style.display = "";
      word.style.opacity = "1";
      shape.style.transition = "none";
      shape.style.opacity = "0";
      shape.setAttribute("d", pathFrom(SHAPES.mug));
      setOpacity(mugDetail, 0);
      setOpacity(steam, 0);
      setOpacity(notes, 0);
      setOpacity(recordDetail, 0);
      setOpacity(logoDetail, 0);

      window.setTimeout(() => {
        word.style.transition = "opacity 450ms ease";
        shape.style.transition = "opacity 450ms ease";
        word.style.opacity = "0";
        shape.style.opacity = "1";

        window.setTimeout(() => {
          setOpacity(mugDetail, 1);
          setOpacity(steam, 1);

          window.setTimeout(() => {
            setOpacity(mugDetail, 0);
            setOpacity(steam, 0);
            morph(SHAPES.mug, SHAPES.record, 1700, t => {
              setOpacity(notes, t);
              setOpacity(recordDetail, t);
            });

            window.setTimeout(() => {
              morph(SHAPES.record, SHAPES.logo, 1700, t => {
                setOpacity(recordDetail, 1 - t);
                setOpacity(notes, 1 - t);
                setOpacity(logoDetail, t);
              });
            }, 1750);

            window.setTimeout(() => {
              window.setTimeout(() => {
                morph(SHAPES.logo, SHAPES.mug, 1300, t => {
                  shape.style.opacity = String(1 - t);
                  word.style.opacity = String(t);
                  setOpacity(logoDetail, 1 - t);
                });
                window.setTimeout(loop, 1450);
              }, 1400);
            }, 3600);
          }, 1400);
        }, 500);
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
