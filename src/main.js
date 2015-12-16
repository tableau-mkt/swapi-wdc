/*jshint -W079 */
/*jshint -W082 */
var module = module || {},
    window = window || {location: {href: ''}, history: {pushState: function() {}}},
    jQuery = jQuery || {},
    tableau = tableau || {},
    wdcw = window.wdcw || {},
    StarWarsMeta = window.StarWarsMeta || {},
    swapiModule = window.swapiModule || {};

module.exports = function($, tableau, wdcw, StarWarsMeta, swapiModule) {
  // Inspired by Tim Pietrusky's work, timpietrusky.com
  var StarWarsCrawl = (function() {
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
      $(this.animation).show();
    };

    return StarWarsCrawl;
  })();

  /**
   * Run during initialization of the web data connector.
   *
   * @param {string} phase
   *   The initialization phase. This can be one of:
   *   - tableau.phaseEnum.interactivePhase: Indicates when the connector is
   *     being initialized with a user interface suitable for an end-user to
   *     enter connection configuration details.
   *   - tableau.phaseEnum.gatherDataPhase: Indicates when the connector is
   *     being initialized in the background for the sole purpose of collecting
   *     data.
   *   - tableau.phaseEnum.authPhase: Indicates when the connector is being
   *     accessed in a stripped down context for the sole purpose of refreshing
   *     an OAuth authentication token.
   * @param {function} setUpComplete
   *   A callback function that you must call when all setup tasks have been
   *   performed.
   */
  wdcw.setup = function setup(phase, setUpComplete) {
    var $skipRedo = $('.skip-redo a'),
        delayShow = parseInt($('.animation .titles > div').css('animation-duration')) + parseInt($('.animation .titles > div').css('animation-delay')),
        baseUrl = window.location.protocol + '//' + window.location.host,
        crawl;

    if (phase === tableau.phaseEnum.interactivePhase) {
      // Do the Star Wars Crawl unless disabled.
      if (window.location.href.indexOf('crawlOff') < 0) {
        // Initiate the crawl.
        crawl = new StarWarsCrawl({
          el : '.starwars'
        });
        crawl.el.append(crawl.animation);

        // In the set amount of time, show the fields.
        setTimeout(function() {
          $('.jumbotron').hide().fadeIn();
          $skipRedo.attr('href', baseUrl + window.location.pathname)
            .text('See it again')
            .attr('title', 'For the first time...');
        }, delayShow * 1000);

        // Immediately push history onto the window so connection edits don't
        // get the crawl.
        window.history.pushState({}, '', baseUrl + window.location.pathname + '?crawlOff');
        $skipRedo.hide().attr('href', '?crawlOff')
          .text('Skip')
          .attr('title', '')
          .fadeIn();
      }
      else {
        $('.starwars').hide();
        $('.jumbotron').fadeIn();
        $skipRedo.hide().attr('href', baseUrl + window.location.pathname)
          .text('See it again')
          .attr('title', 'For the first time...')
          .fadeIn();
      }
    }

    setUpComplete();
  };

  /**
   * Primary method called when Tableau is asking for the column headers that
   * this web data connector provides. Takes a single callable argument that you
   * should call with the headers you've retrieved.
   *
   * @param {function(Array<{name, type, incrementalRefresh}>)} registerHeaders
   *   A callback function that takes an array of objects as its sole argument.
   *   For example, you might call the callback in the following way:
   *   registerHeaders([
   *     {name: 'Boolean Column', type: 'bool'},
   *     {name: 'Date Column', type: 'date'},
   *     {name: 'DateTime Column', type: 'datetime'},
   *     {name: 'Float Column', type: 'float'},
   *     {name: 'Integer Column', type: 'int'},
   *     {name: 'String Column', type: 'string'}
   *   ]);
   *
   *   Note: to enable support for incremental extract refreshing, add a third
   *   key (incrementalRefresh) to the header object. Candidate columns for
   *   incremental refreshes must be of type datetime or integer. During an
   *   incremental refresh attempt, the most recent value for the given column
   *   will be passed as "lastRecord" to the tableData method. For example:
   *   registerHeaders([
   *     {name: 'DateTime Column', type: 'datetime', incrementalRefresh: true}
   *   ]);
   */
  wdcw.columnHeaders = function columnHeaders(registerHeaders) {
    var resource = this.getConnectionData().Resource || '',
        normalized = resource.toLowerCase();

    if (StarWarsMeta[normalized]) {
      registerHeaders(util.flattenHeaders(StarWarsMeta[normalized]()));
    }
    else {
      tableau.abortWithError('Unsupported data-type');
    }
  };


  /**
   * Primary method called when Tableau is asking for your web data connector's
   * data. Takes a callable argument that you should call with all of the
   * data you've retrieved. You may optionally pass a token as a second argument
   * to support paged/chunked data retrieval.
   *
   * @param {function(Array<{object}>, {string})} registerData
   *   A callback function that takes an array of objects as its sole argument.
   *   Each object should be a simple key/value map of column name to column
   *   value. For example, you might call the callback in the following way:
   *   registerData([
   *     {'String Column': 'String Column Value', 'Integer Column': 123}
   *   ]});
   *
   *   It's possible that the API you're interacting with supports some mechanism
   *   for paging or filtering. To simplify the process of making several paged
   *   calls to your API, you may optionally pass a second argument in your call
   *   to the registerData callback. This argument should be a string token that
   *   represents the last record you retrieved.
   *
   *   If provided, your implementation of the tableData method will be called
   *   again, this time with the token you provide here. Once all data has been
   *   retrieved, pass null, false, 0, or an empty string.
   *
   * @param {string} lastRecord
   *   Optional. If you indicate in the call to registerData that more data is
   *   available (by passing a token representing the last record retrieved),
   *   then the lastRecord argument will be populated with the token that you
   *   provided. Use this to update/modify the API call you make to handle
   *   pagination or filtering.
   *
   *   If you indicated a column in wdcw.columnHeaders suitable for use during
   *   an incremental extract refresh, the last value of the given column will
   *   be passed as the value of lastRecord when an incremental refresh is
   *   triggered.
   */
  wdcw.tableData = function tableData(registerData, lastRecord) {
    var resource = this.getConnectionData().Resource || '',
        normalized = resource.toLowerCase(),
        method = getMethodGivenResource(normalized),
        pageNumber = lastRecord ? parseInt(lastRecord) + 1 : 1;

    if (!swapiModule[method]) {
      tableau.abortWithError('Unsupported data-type');
    }

    swapiModule[method](pageNumber, function (data) {
      var processedData = [];

      data.results.forEach(function shapeData(item) {
        processedData.push(util.flattenData(item));
      });

      if (data.next) {
        registerData(processedData, pageNumber);
      }
      else {
        registerData(processedData);
      }
    });
  };

  /**
   * Returns the Star Wars API wrapper method name given a resource.
   * @param string resource
   * @returns {string}
   */
  function getMethodGivenResource(resource) {
    var normalized = resource.toLowerCase(),
        map = {
          people: 'getPeople',
          films: 'getFilms',
          planets: 'getPlanets',
          species: 'getAllSpecies',
          starships: 'getStarships',
          vehicles: 'getVehicles'
        };

    return map[normalized] ? map[normalized] : 'getResources';
  }

  return wdcw;
};

// Set the global wdcw variable as expected.
wdcw = module.exports(jQuery, tableau, wdcw, StarWarsMeta, swapiModule);
