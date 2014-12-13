// Initiate Server
"use strict";

global.router = require("./routes");
global.controller = require("./controller");
global.framework = require("./framework");

framework.initLoad();

framework.startServer(8899);