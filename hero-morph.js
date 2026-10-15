const SHAPES = {
  hola: 'M35.00,246.33 L35.00,231.07 L52.02,231.07 L52.02,73.21 L35.00,73.21 L35.00,57.95 L103.42,57.95 L103.42,73.21 L86.32,73.21 L86.32,136.56 L139.23,136.56 L139.23,73.21 L122.21,73.21 L122.21,57.95 L190.63,57.95 L190.63,73.21 L173.52,73.21 L173.52,231.07 L190.63,231.07 L190.63,246.33 L122.21,246.33 L122.21,231.07 L139.23,231.07 L139.23,153.84 L86.32,153.84 L86.32,231.07 L103.42,231.07 L103.42,246.33 L35.00,246.33 Z M259.79,235.71 Q269.77,235.71 273.81,223.60 Q277.86,211.49 277.86,179.19 Q277.86,146.89 273.84,134.86 Q269.85,122.83 259.79,122.83 Q249.70,122.83 245.59,135.02 Q241.51,147.17 241.51,179.19 Q241.51,211.24 245.59,223.48 Q249.70,235.71 259.79,235.71 Z M259.79,250.00 Q234.73,250.00 220.53,231.15 Q206.33,212.25 206.33,179.19 Q206.33,146.04 220.53,127.31 Q234.73,108.54 259.79,108.54 Q284.90,108.54 299.07,127.31 Q313.24,146.04 313.24,179.19 Q313.24,212.25 299.02,231.15 Q284.82,250.00 259.79,250.00 Z M371.76,231.07 L385.31,231.07 L385.31,246.33 L326.78,246.33 L326.78,231.07 L340.23,231.07 L340.23,65.14 L326.78,65.14 L326.78,50.00 L371.76,50.00 L371.76,231.07 Z M490.34,163.93 L490.34,231.07 L503.88,231.07 L503.88,246.33 L458.81,246.33 L458.81,229.29 Q452.56,239.91 444.90,244.95 Q437.26,250.00 427.45,250.00 Q412.91,250.00 405.13,238.98 Q397.34,227.92 397.34,207.33 Q397.34,184.76 408.52,173.54 Q419.69,162.31 442.24,162.31 L458.81,162.31 L458.81,154.36 Q458.81,138.09 453.36,130.34 Q447.95,122.55 436.54,122.55 Q427.08,122.55 421.95,128.04 Q416.84,133.53 414.71,146.04 L404.64,146.04 L404.64,117.14 Q413.11,112.86 422.17,110.72 Q431.27,108.54 441.33,108.54 Q466.73,108.54 478.54,121.94 Q490.34,135.30 490.34,163.93 Z M458.81,204.18 L458.81,177.33 L446.95,177.33 Q438.14,177.33 433.41,184.15 Q428.70,190.94 428.70,203.69 Q428.70,216.41 432.12,222.75 Q435.55,229.05 442.59,229.05 Q449.89,229.05 454.33,222.22 Q458.81,215.40 458.81,204.18 Z M531.25,225.90 Q531.25,216.05 536.18,208.98 Q541.11,201.92 548.07,201.92 Q555.02,201.92 560.01,208.98 Q565.00,216.05 565.00,225.90 Q565.00,235.87 560.01,242.94 Q555.02,250.00 548.07,250.00 Q541.11,250.00 536.18,242.94 Q531.25,235.87 531.25,225.90 Z M531.42,57.95 L564.83,57.95 L554.22,164.21 L554.22,188.15 L541.82,188.15 L541.82,164.21 L531.42,57.95 Z',
  mug: "M132 98 C154 72 219 65 300 65 C381 65 446 72 468 98 L453 171 C441 229 382 258 300 260 C218 258 159 229 147 171 Z",
  record: "M300 22 C370 22 428 80 428 150 C428 220 370 278 300 278 C230 278 172 220 172 150 C172 80 230 22 300 22 Z",
  logo: "M300 22 C370 22 428 80 428 150 C428 220 370 278 300 278 C230 278 172 220 172 150 C172 80 230 22 300 22 Z"
};

/*
 * Organic hero morph.
 * Requires flubber 0.4.2 loaded before this file:
 * https://cdn.jsdelivr.net/npm/flubber@0.4.2/build/flubber.min.js
 */
(() => {
  const hero = document.querySelector(".hero");
  const heading = hero?.querySelector(".hero__h1");
  if (!hero || !heading || !window.flubber) {
    console.warn("Hero morph: .hero, .hero__h1, or flubber is missing.");
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const originalText = heading.textContent.trim() || "Hola!";
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "hero-morph");
  svg.setAttribute("viewBox", "0 0 600 300");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Hola transforms into coffee, vinyl, and the studio logo");
  svg.setAttribute("focusable", "false");

  const path = document.createElementNS(NS, "path");
  path.setAttribute("class", "hero-morph__shape");
  path.setAttribute("d", SHAPES.hola);
  svg.appendChild(path);

  const extras = document.createElementNS(NS, "g");
  extras.innerHTML = `
    <g class="hero-morph__mug-detail" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M461 104 C514 91 532 117 528 145 C524 171 500 183 458 177"/>
      <path d="M151 105 C207 126 393 126 449 105"/>
      <path d="M151 105 C207 153 393 153 449 105" stroke-width="3"/>
    </g>
    <g class="hero-morph__steam">
      <path d="M252 94 C235 75 264 65 253 44 C248 35 251 29 258 22"/>
      <path d="M286 91 C269 72 300 62 288 41 C283 32 288 26 295 18"/>
      <path d="M320 94 C304 77 331 66 320 48"/>
    </g>
    <g class="hero-morph__notes">
      <path d="M424 77 V42 L449 35 V67"/>
      <ellipse cx="416" cy="80" rx="9" ry="6" transform="rotate(-25 416 80)" fill="#fff" stroke="none"/>
      <ellipse cx="441" cy="70" rx="9" ry="6" transform="rotate(-25 441 70)" fill="#fff" stroke="none"/>
      <path d="M454 209 V177 L477 171 V199"/>
      <ellipse cx="447" cy="212" rx="8" ry="6" transform="rotate(-25 447 212)" fill="#fff" stroke="none"/>
      <ellipse cx="470" cy="202" rx="8" ry="6" transform="rotate(-25 470 202)" fill="#fff" stroke="none"/>
      <path d="M141 111 V82 L161 77 V103"/>
      <ellipse cx="135" cy="113" rx="8" ry="5" transform="rotate(-25 135 113)" fill="#fff" stroke="none"/>
    </g>
    <g class="hero-morph__logo-detail">
      <circle cx="300" cy="150" r="102" />
      <path d="M369 128 A72 72 0 0 0 236 110" />
      <path d="M254 194 L302 139 M287 194 L335 139 M320 194 L368 139" stroke-width="13"/>
    </g>`;
  svg.appendChild(extras);

  heading.replaceWith(svg);
  const mugDetail = svg.querySelector(".hero-morph__mug-detail");
  const steam = svg.querySelector(".hero-morph__steam");
  const notes = svg.querySelector(".hero-morph__notes");
  const logoDetail = svg.querySelector(".hero-morph__logo-detail");

  // Main silhouette path targets. Detail strokes fade in on the vinyl/logo stages.
  const sequence = [
    { key: "hola", duration: 1500 },
    { key: "mug", duration: 1500 },
    { key: "record", duration: 2500 },
    { key: "logo", duration: 2500 }
  ];
  const total = sequence.reduce((sum, item) => sum + item.duration, 0);

  function setOpacity(el, value) {
    el.style.opacity = String(Math.max(0, Math.min(1, value)));
  }
  function ease(t) { return t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2; }

  function morph(from, to, duration, callback) {
    const interpolate = flubber.interpolate(from, to, { maxSegmentLength: 3 });
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now-start)/duration);
      path.setAttribute("d", interpolate(ease(t)));
      if (callback) callback(t);
      if (t < 1 && !reducedMotion) requestAnimationFrame(frame);
    }
    if (reducedMotion) {
      path.setAttribute("d", to);
      if (callback) callback(1);
    } else requestAnimationFrame(frame);
  }

  function animateLoop() {
    if (reducedMotion) {
      path.setAttribute("d", SHAPES.logo);
      setOpacity(logoDetail, 1);
      return;
    }
    path.setAttribute("d", SHAPES.hola);
    path.style.opacity = "1";
    setOpacity(mugDetail, 0); setOpacity(steam, 0); setOpacity(notes, 0); setOpacity(logoDetail, 0);
    const stages = [
      { from: "hola", to: "mug", duration: 1500, after: () => { setOpacity(mugDetail, 1); setOpacity(steam, 1); } },
      { from: "mug", to: "record", duration: 1500, after: () => { setOpacity(mugDetail, 0); setOpacity(steam, 0); setOpacity(notes, 1); } },
      { from: "record", to: "logo", duration: 2500, after: () => { setOpacity(notes, 0); setOpacity(logoDetail, 1); } },
      { from: "logo", to: "hola", duration: 2500, after: () => setOpacity(logoDetail, 0) }
    ];
    let index = 0;
    const next = () => {
      if (index >= stages.length) {
        window.setTimeout(animateLoop, 150);
        return;
      }
      const stage = stages[index++];
      morph(SHAPES[stage.from], SHAPES[stage.to], stage.duration, t => {
        if (stage.from === "mug" && stage.to === "record") setOpacity(notes, t);
        if (stage.from === "record" && stage.to === "logo") {
          setOpacity(logoDetail, t);
          path.style.opacity = String(1 - t);
        }
        if (stage.from === "logo" && stage.to === "hola") path.style.opacity = String(t);
      });
      window.setTimeout(() => { stage.after?.(); next(); }, stage.duration);
    };
    next();
  }
  animateLoop();
})();
