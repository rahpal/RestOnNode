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
			routeTemplate: "api/{controller}/{action}/{id}"
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
			var self = this;

			if(!!parsedUrl){
				// parsedUrl.pathname(uri): /api/login/submit/5
				console.log(parsedUrl);
				var routeTemplateArray = parsedUrl.pathname.toLowerCase().split('/'),
					routeValues,
					routeflag = false;

				if(!!routeTemplateArray && routeTemplateArray.length){
					routeValues = _resolveRoute(routeTemplateArray);
				}

				console.log(_routeCollection);

				_routeCollection.forEach(function(route, index, routes){
					console.log("index :" +index);
					if(route.controllerName.toLowerCase() === routeValues.controllerName.toLowerCase()){
						route.actions.forEach(function(action, index, actions){
							if(action.actionname.toLowerCase() === routeValues.actionName.toLowerCase()
								&& action.httpVerb.toUpperCase() === self.request.method.toUpperCase()){
								//console.log("I am inside "+action);
								routeflag = true;

								callback(false, {
									actionCb: action.callback,
									param: !!routeTemplateArray[4] ? routeTemplateArray[4] : undefined
								});

								return;
							}
						});
					}
				});

				if(!routeflag){
					callback(true, undefined);
				}
			}
		};

		var _resolveRoute = function(routeTemplateArray){
			return {
				controllerName: routeTemplateArray[2],
				actionName: routeTemplateArray[3]
			}
		};

	};

	return _routes;

})();

module.exports = routeClass;