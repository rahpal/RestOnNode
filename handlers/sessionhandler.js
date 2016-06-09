"use strict";

var handler = require('../pipeline_modules/messagehandler');

var sessionHandler = new handler("session");

sessionHandler.handleRequest = function(req, res) {
    console.log("Inside Session handler");
};

module.exports = sessionHandler;
