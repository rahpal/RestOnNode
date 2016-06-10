// Routes config

var routeClass = (function(){

	var _routeCollection = [];

	var _routes = function(){
		/* 
			controllername:{
					actionname:{  
						//action:GET/POST
						params: {id},
						optional: true/false
						callback: callback(id)
					}
			},
			controllername:{
				
			}
		*/
		var that = this;

		// Defaults
		this.mapRouteConfig = {
			name: "DefaultApi",
			routeTemplate: "/api/{controller}/{action}/{id}"
		};

		this.routeSetter = function(routeObj){
			var flag = false;
			if(!!routeObj){
				console.log("SET : "+_routeCollection.length);
				_routeCollection.forEach(function(route, index, routes){
					if(route.controllerName.toLowerCase() === routeObj.controllerName.toLowerCase()){
						flag = true;
						route.actions.push(routeObj.actionData);
						return;
					}
				});
				
				if(!flag){
					_routeCollection.push({
						controllerName: routeObj.controllerName,
						actions: [routeObj.actionData]
					});
				}
			}
		};

		this.routeGetter = function(){
			return _routeCollection;
		};

		this.findRouteByRequest = function(parsedUrl, callback){
			var self = this,
				req = this.request,
				res = this.response;

			if(!!parsedUrl){
				// parsedUrl.pathname(uri): /api/login/submit/5
				/* 	1. Get the controller name
					2. Get the action name
				*/
				console.log(parsedUrl);
				var routeValues,
					routeflag = false;

				if(parsedUrl.pathname !== '/'){
					routeValues = _resolveRoute(parsedUrl.pathname);
				}else{
					res.statusCode = 400;
					res.end(self.httpStatusCodes['400']);
				}

				console.log(_routeCollection);

				_routeCollection.forEach(function(route, index, routes){
					console.log("index :" +index);
					if(route.controllerName.toLowerCase() === routeValues.controllerName.toLowerCase()){
						route.actions.forEach(function(action, index, actions){
							if(action.actionname.toLowerCase() === routeValues.actionName.toLowerCase()){
								routeflag = true;
								// We skip the [OPTIONS] requests from the browser.
								if(req.method === 'OPTIONS') {
									callback(true, { message: 'Skipping [OPTIONS] (preflight) request.' });
								} else if(action.httpVerb.toUpperCase() === self.request.method.toUpperCase()){
									//console.log("I am inside "+action);
									callback(false, {
										actionCb: action.callback,
										param: routeValues.uriParam,
										attr: action.attr,
										handler: action.handler
									});
								}

								return;
							}
						});

						return;
					}
				});

				if(!routeflag){
					callback(true, { message: 'Route(s) does not exist.' });
				}
			}
		};

		var _resolveRoute = function(uripath){
			// uri: /api/login/submit/5

			var routeTemplateArray = uripath.toLowerCase().split('/');
			console.log(routeTemplateArray);
			if(!!routeTemplateArray && routeTemplateArray.length){

				return {
					controllerName: routeTemplateArray[2],
					actionName: routeTemplateArray[3],
					uriParam: !!routeTemplateArray[4] ? routeTemplateArray[4] : undefined
				}
			}
		};

	};

	return _routes;

})();

module.exports = routeClass;