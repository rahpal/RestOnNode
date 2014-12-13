// REST Framework

"use strict";

var http = require("http"),
	fs = require('fs'),
	qs = require('querystring'),
	url = require('url'),
	path = require("path"),
	root = __dirname;

var appFramework = function(){ /*empty function*/ };

appFramework.prototype.config = {
	controllerPath: path.join(root + "/controllers")
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
		response.end(http.STATUS_CODE['404']);
	}
};

appFramework.prototype.reqPayload = function(){
	// extract the GET and POST payload data and pass it to the action CB

	var req = this.request,
		res = this.response;

	if(!!req){
		switch(req.method){
			case 'GET':
				var query = qs.parse(url.parse(req.url).query);
				return query;
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
						var parsedPayload = qs.parse(payload);
						//console.log(parsedPayload);
						return parsedPayload;
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
				//console.log(request.url);
				var parsedUrl = url.parse(request.url),
					routeFound = false;
				//console.log("Url : "+parsedUrl.pathname);
				that.request = request;
				that.response = response;

				route.findRouteByRequest.call(that, parsedUrl, function(error, data){
					//console.log("Tested");
					if(error) console.log("Route doesn't exist.");
					// data contains callback function and optional params

					if(!!data){
						// Get the request payload if there
						var payload = that.reqPayload(),
							uriParam = data.param, 
							args;
						if(!!payload){
							switch(that.request.method){
								case 'GET':
									// format the qs object to array
									args = Object.keys(payload).forEach(function(k){ return payload[k]; });
									console.log(args);
									data.actionCb.apply(that, args);
									break;
								case 'POST':
									args = uriParam === undefined ? [uriParam, payload]: [payload];
									data.actionCb.apply(that, args);
									break;
							}
						}
					}
					
				});
			}
		}).listen(port);

	console.log("Server started...");
};

module.exports = new appFramework();