/*
  PNG hero animation. No CDN, no third-party JavaScript.
  Existing .hero__h1 is replaced by a stage container.
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

    const makeStage = (name, label) => {
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
        img.src = `./assets/${label}`;
        img.alt = "";
        img.decoding = "async";
        stage.appendChild(img);
      }
      if (name === "coffee") {
        const steam = document.createElement("span");
        steam.className = "hero-animation__steam";
        steam.innerHTML = "<span></span><span></span><span></span>";
        stage.appendChild(steam);
      }
      if (name === "record") {
        const notes = document.createElement("span");
        notes.className = "hero-animation__notes";
        notes.innerHTML = "<span>♫</span> <span>♪</span>";
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

    const durations = [2200, 3000, 3000, 2400];
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
