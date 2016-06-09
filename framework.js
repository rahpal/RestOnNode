// REST Framework

"use strict";

var http = require("http"),
	fs = require('fs'),
	qs = require('querystring'),
	url = require('url'),
	path = require("path"),
	root = __dirname;

var appFramework = function(){ /*empty function*/ };

// Contains all HTTP message handlers.
appFramework.handlerCollection = [];

appFramework.prototype.config = {
	controllerPath: path.join(root + "/controllers"),
	handlerPath: path.join(root + "/handlers"),
	skipMessageHandlers: false
};

appFramework.prototype.sendJSON = function(obj){
	var that = this;
	that.response.activeHandlerCollection.forEach(function(handler, index){
		handler.handleResponse.call(that, that.request, that.response);
	});
	// Send the response in JSON format
	// Enabling CORS for all Origins.
	that.response.setHeader("Access-Control-Allow-Origin", "*");
	that.response.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	that.response.setHeader("Access-Control-Allow-Headers", "Content-Type");
	that.response.end(JSON.stringify(obj, null, '\t'));
};

appFramework.prototype.initLoad = function(){
	console.log("InitLoad InProgress...");

	var controllerPath = this.config.controllerPath,
		handlerPath = this.config.handlerPath;

	if(fs.existsSync(controllerPath)){
		fs.readdir(controllerPath, function(error, files){
			files.forEach(function(file, index, files){
				require(path.join(controllerPath + '/' + file));
			});
		});
	} else {
		response.statusCode = 404;
		response.end(http.STATUS_CODES['404']);
	}

	// Initialize all handlers here
	if(fs.existsSync(handlerPath)){
		fs.readdir(handlerPath, function(error, files){
			files.forEach(function(file, index, files){
				appFramework.handlerCollection.push(require(path.join(handlerPath + '/' + file)));
			});
		});
	} else {
		response.statusCode = 404;
		response.end(http.STATUS_CODES['404']);
	}

	console.log("InitLoad Done...");
};

appFramework.prototype.getRequestPayload = function(callback){
	// extract the GET and POST payload data and pass it to the action CB

	var req = this.request,
		res = this.response;

	if(!!req){
		var parsedPayload;
		switch(req.method){
			case 'GET':
				parsedPayload = qs.parse(url.parse(req.url).query);
				callback(parsedPayload); 
				//return query;
				break;
			case 'POST':
				var payload = '';
					
				req.setEncoding("utf8"); // set encoding
				req.on("data", function(chunk){
					payload+=chunk;
					console.log("payload : "+chunk);
				});

				req.on("end", function(){
					//console.log(payload);
					parsedPayload = qs.parse(payload);
					callback(parsedPayload);
				});
				break;
		}
	}
};

appFramework.prototype.startServer = function(port){

	var that = this,
		route = new router(); // Get the file server root directory path
		
		// Request pipeline starts here.
		http.createServer(function(request, response){
			if(!!request){
				console.log(request.url);
				var parsedUrl = url.parse(request.url),
					routeFound = false;
				response.activeHandlerCollection = [];
				//console.log("Url : "+parsedUrl.pathname);
				that.request = request;
				that.response = response;
				that.httpStatusCodes = http.STATUS_CODES;

				//Pipeline#1: HTTP Message Handlers (Global).
				if(!that.config.skipMessageHandlers){
					// Request must pass through all defined handlers.
					appFramework.handlerCollection.forEach(function(handler, index){
						handler.handleRequest.call(that, request, response);
						response.activeHandlerCollection.unshift(handler);
					});
				};

				route.findRouteByRequest.call(that, parsedUrl, function(error, data){
					//console.log("Tested");
					if(error) console.log(data.message);
					// data contains callback function and optional params
					/* 
						Now check for two things:
						1. Authentication(Form only)
						2. Request handlers per route
					*/
					//console.log(data);
					if(!!data && !!data.attr && !!data.handler){
						appFramework.handlerCollection.forEach(function(handler, index){
							if(data.handler.toLowerCase() === handler.handlerName.toLowerCase()){
								handler.handleRequest.call(that, request, response);
								response.activeHandlerCollection.unshift(handler);
								return;
							}
						});
					}

					if(!!data){
						// Get the request payload if there
						that.getRequestPayload(function(payload){
							var uriParam = data.param,
								args;

							//console.log("Test: "+payload);
							if(!!payload){
								switch(that.request.method){
									case 'GET':
										// format the qs object to array
										args = Object.keys(payload).map(function(key){ return payload[key]; });
										console.log(args);
										break;
									case 'POST':
										args = uriParam === undefined ? [payload]: [uriParam, payload];
										console.log(payload);
										break;
								}
								// Call controller action callback with args
								data.actionCb.apply(that, args);
							}
						});
					}
				});
			}
		}).listen(port);

	console.log("Server started...");
};

module.exports = new appFramework();