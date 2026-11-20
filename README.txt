CHRISTIANMEJIA.COM

This is the source code for my personal website, live at
https://christianmejia.com

I'm a web specialist and graphic designer with 25+ years of experience,
and I'm working toward opening a small listening café: good coffee, vinyl
records, and a vintage Hi-Fi system. This site is where that story, my
photos, my music and my links live.


ABOUT THE SITE
--------------
A simple, clean, hand-built static site. No frameworks, no build step,
and no external script dependencies.

  - Sticky header with logo (top left) and navigation (right)
  - Full-width hero with an editable text greeting on top
  - Bio section: "Hola!" intro and the listening café idea
  - Bluesky microblog feed page
  - Record Archive page that displays current record collection on personal Discogs account
  - Shared header and footer
  - Full-width, 3-column footer

Navigation: Home, About, Links (Feed, Photos, Music), Contact


FOLDER STRUCTURE
----------------
  index.html            Home page
  feed.html             Bluesky feed page
  css/
    crispy.css          Main site styles
    hero-morph.css      Hero animation styles
  js/
    hero-morph.js       Hero animation (plain JavaScript, no libraries)
  README.txt            This file


HERO MARKUP
-----------
  <section class="hero">
    <p class="hero__h1">Hola!</p>
    <p class="hero__text">Coffee · Music · Creative</p>
  </section>

The animation does not change the .hero height or background. Those are
controlled in crispy.css.


HOW THE HERO ANIMATION WORKS
----------------------------
hero-morph.js interpolates between matching SVG path coordinates itself,
so it needs no outside libraries and makes no external requests. This
keeps the site compatible with a strict script-src 'self' policy.

The logo shape is currently a stylized approximation. Swap in the exact
logo SVG paths when they are ready.


RUNNING IT LOCALLY
------------------
Open index.html in a browser, or use the Live Server extension in
VS Code. There is nothing to install.


HOSTING
-------
Hosted on GitHub Pages from the main branch. The domain is registered at
GoDaddy and points to GitHub Pages through A records and a www CNAME.
Pushing a commit to main updates the live site within a minute or two.


CONTACT
-------
Web:      https://christianmejia.com
Bluesky:  @mejiachris
GitHub:   https://github.com/blkgld


LICENSE / COPYRIGHT
-------------------
© Chris Mejia. All rights reserved.
The code, design, logo and images in this repository may not be copied or
reused without permission.