// REST Framework

"use strict";

var http = require("http"),
	fs = require('fs'),
	qs = require('querystring'),
	url = require('url'),
	path = require("path"),
	root = __dirname;

var auth = require('./auth');

var appFramework = function(){ /*empty function*/ };

appFramework.prototype.config = {
	controllerPath: path.join(root + "/controllers")
};

appFramework.prototype.sendJSON = function(obj){
	// Send the response in JSON format

	this.response.end(JSON.stringify(obj, null, '\t'));
};

appFramework.prototype.initLoad = function(){
	console.log("InitLoad InProgress...");

	var controllerPath = this.config.controllerPath;

	if(fs.existsSync(controllerPath)){
		fs.readdir(controllerPath, function(error, files){
			files.forEach(function(file, index, files){
				require(path.join(controllerPath + '/' + file));
			});
		});

		console.log("InitLoad Done...");
	}else{
		response.statusCode = 404;
		response.end(http.STATUS_CODES['404']);
	}
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
					if(!!payload){
						parsedPayload = qs.parse(payload);
						callback(parsedPayload);
					}
				});
				break;
		}
	}
};

appFramework.prototype.startServer = function(port){

	var that = this;

	var url = require("url"),
		route = new router(); // Get the file server root directory path

		http.createServer(function(request, response){
			if(!!request){
				console.log(request.url);
				var parsedUrl = url.parse(request.url),
					routeFound = false;
				//console.log("Url : "+parsedUrl.pathname);
				that.request = request;
				that.response = response;
				that.httpStatusCodes = http.STATUS_CODES;

				route.findRouteByRequest.call(that, parsedUrl, function(error, data){
					//console.log("Tested");
					if(error) console.log("Route doesn't exist.");
					// data contains callback function and optional params
					/* 
						Now check for two things:
						1. Authentication(Form only)
						2. Authorization
					*/
					//console.log(data);
					if(!!data && !!data.attr){
						if(!!data.attr.auth && !auth.onAuthentication.call(that)){
							response.statusCode = 403;
							response.end(http.STATUS_CODES['403']);
							return;
						}
					}

					if(!!data){
						// Get the request payload if there
						that.getRequestPayload(function(payload){
							var uriParam = data.param,
								args;

							console.log("Test: "+payload);
							if(!!payload){
								switch(that.request.method){
									case 'GET':
										// format the qs object to array
										args = Object.keys(payload).map(function(k){ return payload[k]; });
										console.log(args);
										break;
									case 'POST':
										args = uriParam === undefined ? [uriParam, payload]: [payload];
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