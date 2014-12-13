"use strict";

var loginController = new controller("login");

loginController.setAction("index/{id}", "GET", function(test, pass){
	//_view.renderView("index");
	var res = this.response;
	// To Write a Cookie
	  res.writeHead(200, {
	    'Set-Cookie': 'username=drapal',
	    'Content-Type': 'text/plain'
	  });

	  this.sendJSON({user: 'rahul'});
}, { auth: false });

loginController.setAction("submit/{id}", "POST", function(test){
	//console.log(utils);
	this.sendJSON({user: 'rahul'});
},{ auth: true });