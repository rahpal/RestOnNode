// Create JWT token(Bearer token) for authentication
var jwt = require('jwt-simple');

var authClass = (function(){
	"use strict";

	function _auth(){

		var that = this;

		that.getJWTToken = function() {
			var expires = _expiresIn(1),
				token = jwt.encode({
					exp: expires
				}, require('./secret-key'));

			if(!token){
				throw new Error("Unable to create JWT Token."); 
			};

			return token; 
		};

		// Private functions.
		var _expiresIn = function(numDays) {
			var dateObj = new Date();
			return dateObj.setDate(dateObj.getDate() + numDays);
		};
		
	};

	return _auth;

})();

module.exports = new authClass();