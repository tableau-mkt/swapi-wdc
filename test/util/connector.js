'use strict';

var tableau = require('./tableau.js');

module.exports = {
  getConnectionData: function getConnectionData() {
    return tableau.connectionData ? JSON.parse(tableau.connectionData) : {};
  },
  setConnectionData: function setConnectionData(data) {
    tableau.connectionData = JSON.stringify(data);
    return data;
  },
  getUsername: function getUsername() {
    return tableau.username;
  },
  setUsername: function setUsername(username) {
    tableau.username = username;
    return tableau.username;
  },
  getPassword: function getPassword() {
    return tableau.password;
  },
  setPassword: function setPassword(password) {
      tableau.password = password;
    return tableau.password;
  },
  getIncrementalExtractColumn: function getIncrementalExtractColumn() {
    return tableau.incrementalExtractColumn;
  },
  setIncrementalExtractColumn: function setIncrementalExtractColumn(column) {
    tableau.incrementalExtractColumn = column;
    return column;
  },
  ajaxErrorHandler: function ajaxErrorHandler(jqXHR, textStatus, errorThrown) {
    var message = 'There was a problem retrieving data: "' +
        textStatus + '" with error thrown: "' +
        errorThrown + '"';

    tableau.abortWithError(message);
  }
};
