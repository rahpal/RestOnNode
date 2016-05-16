"use strict";

var pool = require("../dbconnect");

var loginController = new controller("login");

/* API URL: /api/login/testJson */
loginController.get("testJson", function(){
	//console.log(startpage +","+endpage+","+ pagesize);
	var res = this.response,
		self = this;
	
	pool.getConnection(function(connection) {
		// Use the connection
		connection.query('SELECT * FROM test', function(err, rows) {
			// And done with the connection.
			console.log(JSON.stringify(rows));
			self.sendJSON(rows);
			connection.release();
		});
	});
}, { auth: false });

loginController.post("submit", function(test){
	this.sendJSON({user: 'rahul'});
}, { auth: false });