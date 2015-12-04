'use strict';

var originalMethods = {},
    tableau = {
      // Default properties and methods of the tableau global as of v1.1.0.
      connectionName: '',
      connectionData: '',
      password: '',
      username: '',
      incrementalExtractColumn: '',
      initCallback: function () {console.log('original');},
      shutdownCallback: function () {},
      submit: function () {},
      log: function (msg) {},
      headersCallback: function (fieldNames, types) {},
      dataCallback: function (data, lastRecordToken, moreData) {},
      abortWithError: function (errorMsg) {},
      versionNumber: '0.0.0',
      phaseEnum: {
        interactivePhase: 'interactive',
        authPhase: 'auth',
        gatherDataPhase: 'gatherData'
      },
      makeConnector: function () {},
      registerConnector: function (wdc) {},

      /**
       * Replaces the method of the given name on this object to the function
       * provided.
       *
       * @param {string} method
       *   The name of the method to replace.
       *
       * @param {function} func
       *   The function to replace it with.
       */
      setMethod: function setMethod(method, func) {
        originalMethods[method] = tableau[method];
        tableau[method] = func;
      },

      /**
       * Resets the method on this object to its original implementation.
       *
       * @param {string} method
       *   The name of the method to reset.
       */
      resetMethod: function resetMethod(method) {
        if (originalMethods.hasOwnProperty(method)) {
          tableau[method] = originalMethods[method];
        }
      }
    };

module.exports = tableau;
