"use strict";

//var pool = require("../dbconnect");
var token = require('../auth.js');

var loginController = new controller("login");

/* API URL: /api/login/testJson */
loginController.get("testJson", function(startpage, endpage, pagesize){
	//console.log(startpage +","+endpage+","+ pagesize);
	
	var res = this.response,
		self = this;

	/*pool.getConnection(function(connection) {
		// Use the connection
		connection.query('SELECT * FROM mmt where id = '+ startpage, function(err, rows) {
			// And done with the connection.
			console.log(JSON.stringify(rows));
			self.sendJSON(rows);
			connection.release();
		});
	});*/
}, { auth: false }, "token");

/* API URL: /api/login/testJson */
loginController.post("validuser", function(userObj){
	console.log(userObj);
	
	var res = this.response,
		self = this;

	var jwtToken = token.getJWTToken();

	self.sendJSON({
		token: jwtToken,
		user: userObj.username
	});
		
}, { auth: false }, "token");