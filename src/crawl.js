/*
 * Star Wars opening crawl from 1977
 *
 * I freaking love Star Wars, but could not find
 * a web version of the original opening crawl from 1977.
 * So I created this one.
 *
 * I wrote an article where I explain how this works:
 * http://timpietrusky.com/star-wars-opening-crawl-from-1977
 *
 * Watch the Start Wars opening crawl on YouTube.
 * http://www.youtube.com/watch?v=7jK-jZo6xjY
 *
 * Stuff I used:
 * - CSS (animation, transform)
 * - HTML audio (the opening theme)
 * - SVG (the Star Wars logo from wikimedia.org)
 *   http://commons.wikimedia.org/wiki/File:Star_Wars_Logo.svg
 * - JavaScript (to sync the animation/audio)
 *
 * Thanks to Craig Buckler for his amazing article
 * which helped me to create this remake of the Star Wars opening crawl.
 * http://www.sitepoint.com/css3-starwars-scrolling-text/
 *
 * 2013 by Tim Pietrusky
 * timpietrusky.com
 *
 */
StarWarsCrawl = (function() {

  /*
   * Constructor
   */
  function StarWarsCrawl(args) {
    // Context wrapper
    this.el = $(args.el);

    // The animation wrapper
    this.animation = this.el.find('.animation');

    // Remove animation
    this.reset();
  }

  /*
   * Resets the animation.
   */
  StarWarsCrawl.prototype.reset = function() {
    this.cloned = this.animation.clone(true);
    this.animation.remove();
    this.animation = this.cloned;
  };

  return StarWarsCrawl;
})();
