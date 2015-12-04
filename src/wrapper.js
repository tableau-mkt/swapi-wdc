/**
 * @file
 *   A utility that wraps the Tableau Web Data Connector API into something with
 *   more opinionated, and simple for beginners. Also takes care of very common
 *   setup and event handling boilerplate.
 */

var wdcw = window.wdcw || {};

(function($, tableau, wdcw) {
  var connector = tableau.makeConnector();

  /**
   * Simplifies the connector.init method in several ways:
   * - Makes it so the implementor doesn't have to know to call the
   *   tableau.initCallback method.
   * - Passes the current phase directly to the initializer so that it doesn't
   *   have to know to pull it from the global tableau object.
   * - Handles population of saved data on behalf of the implementor during the
   *   interactive phase.
   * - Unifies the callback-based API of all connector wrapper methods, and
   *   simplifies asynchronous set-up tasks in the process.
   */
  connector.init = function callConnectorInit() {
    var data = this.getConnectionData(),
        $input,
        key;

    // Auto-fill any inputs with known data values.
    if (tableau.phase === tableau.phaseEnum.interactivePhase) {
      for (key in data) {
        if (data.hasOwnProperty(key)) {
          $input = $('*[name="' + key + '"]');
          if ($input.length) {
            if ($input.is(':checkbox')) {
              $input.attr('checked', !!data[key]).change();
            }
            else {
              $input.val(data[key]).change();
            }
          }
        }
      }

      // Pre-populate username and password if stored values exist.
      if (tableau.username) {
        $('input[name="username"]').val(tableau.username);
      }
      if (tableau.password) {
        $('input[type="password"]').val(tableau.password);
      }
    }

    // If the provided connector wrapper has a setup property, call it with the
    // current initialization phase.
    if (wdcw.hasOwnProperty('setup')) {
      wdcw.setup.call(this, tableau.phase, function setUpComplete() {
        tableau.initCallback();
      });
    }
    else {
      tableau.initCallback();
    }
  };

  /**
   * Simplifies the connector.shutDown method in a couple of ways:
   * - Makes it so that the implementor doesn't have to know to call the
   *   tableau.shutdownCallback method.
   * - Mirrors the wrapped init callback for naming simplicity (setup/teardown).
   * - Unifies the callback-based API of all connector wrapper methods, and
   *   simplifies asynchronous tear-down tasks in the process.
   */
  connector.shutDown = function callConnectorShutdown() {
    // If the provided connector wrapper has a teardown property, call it.
    if (wdcw.hasOwnProperty('teardown')) {
      wdcw.teardown.call(this, function shutDownComplete() {
        tableau.shutdownCallback();
      });
    }
    else {
      tableau.shutdownCallback();
    }
  };

  /**
   * Simplifies the connector.getColumnHeaders method in a few ways:
   * - Enables simpler asynchronous handling by making the interface only accept
   *   a callback.
   * - Simplifies the API by expecting an array of objects, mapping field names
   *   and types on a single object, rather than in two separate arrays.
   * - Simplifies incremental refresh handling by bundling this as a declarative
   *   property in the column header object.
   * - Makes it so the implementor doesn't have to know to call the
   *   tableau.headersCallback method.
   */
  connector.getColumnHeaders = function callConnectorColumnHeaders() {
    var thisConnector = this;

    wdcw.columnHeaders.call(this, function getColumnHeadersSuccess(headers) {
      var names = [],
          types = [];

      // Iterate through returned column header objects and process them into the
      // format expected by the API.
      headers.forEach(function(header) {
        names.push(header.name);
        types.push(header.type);

        // If a column is marked as incremental refresh key, then set it.
        if (header.incrementalRefresh) {
          thisConnector.setIncrementalExtractColumn(header.name);
        }
      });

      tableau.headersCallback(names, types);
    });
  };

  /**
   * Simplifies (and limits) the connector.getTableData method in a couple ways:
   * - Enables simpler asynchronous handling by providing a callback.
   * - Simplifies chunked/paged data handling by limiting the arguments that the
   *   implementor needs to be aware of to just 1) the data retrieved and 2) if
   *   paging functionality is needed, a token for the last record.
   * - Makes it so the implementor doesn't have to know to call the
   *   tableau.dataCallback method.
   *
   * @param {string} lastRecordToken
   *   The token provided by the implementor representing the last record or
   *   page retrieved.
   */
  connector.getTableData = function callConnectorTableData(lastRecordToken) {
    wdcw.tableData.call(this, function getTableDataSuccess(data, lastToken) {
      // If there are more records to be returned, indicate as such to Tableau.
      if (lastToken) {
        tableau.dataCallback(data, lastToken, true);
      }
      // If no more records need to be retrieved, indicate as such to Tableau.
      else {
        tableau.dataCallback(data, null, false);
      }
    }, lastRecordToken);
  };

  /**
   * Extension of the web data connector API that handles complex connection
   * data getting for the implementor.
   *
   * @returns {object}
   *   An object representing connection data. Keys are assumed to be form input
   *   names; values are assumed to be form input values.
   *
   * @see connector.setConnectionData
   */
  connector.getConnectionData = function getConnectionData() {
    return tableau.connectionData ? JSON.parse(tableau.connectionData) : {};
  };

  /**
   * Extension of the web data connector API that handles complex connection
   * data setting for the implementor.
   *
   * @param {object} data
   *   The data that's intended to be set for this connection. Keys are assumed
   *   to be form input names; values are assumed to be form input values.
   *
   * @returns {object}
   *   Returns the data that was set.
   *
   * @see connector.getConnectionData
   */
  connector.setConnectionData = function setConnectionData(data) {
    tableau.connectionData = JSON.stringify(data);
    return data;
  };

  /**
   * Extension of the web data connector API that gets the connection username.
   *
   * @returns {string}
   *   The username associated with this connection.
   */
  connector.getUsername = function getUsername() {
    return tableau.username;
  };

  /**
   * Extension of the web data connector API that sets the connection username.
   *
   * @param {string} username
   *   The username to be associated with this connection.
   *
   * @returns {string}
   *   The username now associated with this connection.
   */
  connector.setUsername = function setUsername(username) {
    tableau.username = username;
    return tableau.username;
  };

  /**
   * Extension of the web data connector API that gets the connection password.
   *
   * @returns {string}
   *   The password associated with this connection.
   */
  connector.getPassword = function getPassword() {
    return tableau.password;
  };

  /**
   * Extension of the web data connector API that sets the connection password.
   *
   * @param {string} password
   *   The password or other sensitive connection information to be associated
   *   with this connection. The value is encrypted and stored by tableau.
   *
   * @returns {string}
   *   The password now associated with this connection.
   */
  connector.setPassword = function setPassword(password) {
    tableau.password = password;
    return tableau.password;
  };

  /**
   * Extension of the web data connector API that gets the incremental extract
   * column.
   */
  connector.getIncrementalExtractColumn = function getIncrementalExtractColumn() {
    return tableau.incrementalExtractColumn;
  };

  /**
   * Extension of the web data connectors API that sets the incremental extract
   * column.
   *
   * @param {string} column
   *   The column from the data source on which incremental extracts should be
   *   based. This can be a column that represents either a DateTime or an
   *   integer.
   */
  connector.setIncrementalExtractColumn = function setIncrementalExtractColumn(column) {
    tableau.incrementalExtractColumn = column;
    return column;
  };

  /**
   * A generic error handler that can be used by implementors for simplicity.
   *
   * @param {object} jqXHR
   * @param {string} textStatus
   * @param {string} errorThrown
   */
  connector.ajaxErrorHandler =  function ajaxErrorHandler(jqXHR, textStatus, errorThrown) {
    var message = 'There was a problem retrieving data: "' +
          textStatus + '" with error thrown: "' +
          errorThrown + '"';

    tableau.abortWithError(message);
  };

  // Register our connector, which uses logic from the connector wrapper.
  tableau.registerConnector(connector);

  /**
   * Register a submit handler and take care of the following on behalf of the
   * implementor:
   * - Parse and store form data in tableau's connection data property.
   * - Provide the connection name.
   * - Trigger the data collection phase of the web data connector.
   */
  $(document).ready(function connectorDocumentReady() {
    $('form').submit(function connectorFormSubmitHandler(e) {
      var $fields = $('input, select, textarea').not('[type="password"],[type="submit"],[name="username"]'),
          $password = $('input[type="password"]'),
          $username = $('input[name="username"]'),
          data = {};

      e.preventDefault();

      // Format connection data according to assumptions.
      $fields.map(function getValuesFromFields() {
        var $this = $(this),
            name = $this.attr('name');
        if (name) {
          if ($this.is(':checkbox')) {
            data[name] = $this.is(':checked');
          }
          else {
            data[name] = $this.val();
          }
        }
        return this;
      });

      // If nothing was entered, there was a problem. Abort.
      // @todo Automatically add validation handling.
      if ($fields.length && data === {}) {
        return false;
      }

      // Set connection data and connection name.
      connector.setConnectionData(data);
      tableau.connectionName = 'Star Wars API';

      // If there was a password, set the password.
      if ($password.length) {
        connector.setPassword($password.val());
      }

      // If there was a username, set the username.
      if ($username.length) {
        connector.setUsername($username.val());
      }

      // Initiate the data retrieval process.
      tableau.submit();
    });
  });

})(jQuery, tableau, wdcw);
