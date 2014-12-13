// base controller
// return constructor.
"use strict";

var controllerClass = (function (){

	var path = require("path"),
		route = new router();

	function _controller(name){
		var that = this;

		that.name = name;

		that.setAction = function(actionWithParams, verb, callback, attr){
			var httpVerb = verb || "GET",
				actionParams, actionname, parameter, isOptional = false;

			try{
				if(!!actionWithParams){
					// splits actionname and params
					actionParams = actionWithParams.split('/');
					/* 
						controllername:{
								actionname:{  
									//action:GET/POST
									params: {id},
									optional: true/false
									callback: callback(id)
								}
						}
					*/
					//console.log(actionParams);
					var paramRegex = new RegExp("^[\{][a-z]*[\}]$");
					if(paramRegex.test(actionParams[1])){
						isOptional = true;
					}

					// form data object
					var routeObj = {
						controllerName: name,
						actionData: {
							actionname: actionParams[0],
							paramLiteral: actionParams[1].substr(1, actionParams[1].length-2),
							optional: isOptional,
							callback: callback,
							httpVerb: httpVerb,
							attr: attr || {auth: false}
						}
					}

					console.log(routeObj);
					// call routeSetter function.
					route.routeSetter(routeObj);
				}
			}
			catch(ex){
				throw new Error(ex.message || "Route setting wrong!!!");
			}
		};
	};

	return _controller;

})();

module.exports = controllerClass;