HERO MORPH FIX, NO CDN DEPENDENCY

This version removes Flubber completely. The animation uses local JavaScript and interpolates matching SVG path coordinates itself. It makes no external script requests, so it works with a script-src 'self' policy.

Install:
1. Replace css/hero-morph.css with this package's file.
2. Replace js/hero-morph.js with this package's file.
3. Keep your existing crispy.css and hero HTML unchanged.
4. Remove the old Flubber CDN script reference entirely.
5. Load your own scripts just before </body>:

<script src="./js/hero-morph.js"></script>

Keep the stylesheet order:
<link rel="stylesheet" href="./css/crispy.css">
<link rel="stylesheet" href="./css/hero-morph.css">

Your existing markup remains:
<section class="hero">
  <p class="hero__h1">Hola!</p>
  <p class="hero__text">Coffee · Music · Creative</p>
</section>

Important:
- This does not change .hero height or background styles.
- The greeting fades into the mug. The mug-to-record and record-to-logo silhouettes morph using matching SVG path coordinates.
- The logo details are still a stylized approximation. Swap in your exact logo SVG paths when available.
