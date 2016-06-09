"use strict";

var handler = require('../pipeline_modules/messagehandler');

var tokenHandler = new handler("token");

tokenHandler.handleRequest = function(req, res) {
    console.log("Inside token Request handler");
};

tokenHandler.handleResponse = function(req, res) {
    console.log("Inside token Response handler");
};

module.exports = tokenHandler;