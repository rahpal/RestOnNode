// Authentication and Authorization

"use strict";				

var authClass = (function(){

	function _auth(){

		var that = this;

		that.onAuthentication = function(){
			console.log("Inside Auth");
			var self = this,
				req = self.request;
			//console.log(req.headers);
			if(!!req && !!req.headers.cookie){
				//console.log(req.headers["cookie"]);
				return true;
			}
		};
	};

	return _auth;

})();

module.exports = new authClass();