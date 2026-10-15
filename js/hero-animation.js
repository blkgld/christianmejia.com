/*
  PNG hero animation, no CDN or external libraries.
  Keeps the existing .hero element and its background intact.
*/
(() => {
  "use strict";

  function init() {
    const hero = document.querySelector(".hero");
    const heading = hero && hero.querySelector(".hero__h1");
    if (!hero || !heading || hero.querySelector(".hero-animation")) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.createElement("div");
    root.className = "hero-animation";
    root.setAttribute("role", "img");
    root.setAttribute("aria-label", "Hola, coffee, music, and logo animation");

    const makeStage = (name, file) => {
      const stage = document.createElement("div");
      stage.className = `hero-animation__stage hero-animation__stage--${name}`;
      stage.setAttribute("aria-hidden", "true");

      if (name === "hola") {
        const word = document.createElement("span");
        word.className = "hero-animation__word";
        word.textContent = heading.textContent.trim() || "Hola!";
        stage.appendChild(word);
      } else {
        const img = document.createElement("img");
        img.className = "hero-animation__art";
        img.src = `./assets/${file}`;
        img.alt = "";
        img.decoding = "async";
        stage.appendChild(img);
      }

      if (name === "coffee") {
        const steam = document.createElement("span");
        steam.className = "hero-animation__steam";
        steam.setAttribute("aria-hidden", "true");
        steam.innerHTML = `
          <svg viewBox="0 0 116 82" aria-hidden="true" focusable="false">
            <path d="M26 73 C9 58 38 48 25 32 C19 24 24 14 34 7"/>
            <path d="M57 77 C42 60 68 50 57 35 C49 24 58 14 64 4"/>
            <path d="M83 72 C71 58 94 48 84 34 C79 26 84 18 92 12"/>
          </svg>`;
        stage.appendChild(steam);
      }

      if (name === "record") {
        const notes = document.createElement("span");
        notes.className = "hero-animation__notes";
        notes.setAttribute("aria-hidden", "true");
        notes.innerHTML = "<span>♫</span><span>♪</span>";
        stage.appendChild(notes);
      }

      root.appendChild(stage);
      return stage;
    };

    const stages = [
      makeStage("hola", ""),
      makeStage("coffee", "Coffee-cm.png"),
      makeStage("record", "Record-cm.png"),
      makeStage("logo", "Logo-cm.png")
    ];

    heading.replaceWith(root);

    let active = 0;
    const show = index => {
      stages.forEach((stage, i) => stage.classList.toggle("is-active", i === index));
      active = index;
    };
    show(0);

    if (reduceMotion) return;

    // A little more time on the logo lets it read as a deliberate signature.
    const durations = [2100, 3000, 3000, 2800];
    function advance() {
      window.setTimeout(() => {
        show((active + 1) % stages.length);
        advance();
      }, durations[active]);
    }
    advance();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
