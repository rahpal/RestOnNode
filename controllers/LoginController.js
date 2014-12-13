"use strict";

var loginController = new controller("login");

loginController.setAction("index/{id}", "GET", function(id){
	//_view.renderView("index");
	var res = this.response;
	res.end("{id: 2}");

});

loginController.setAction("submit/{id}", "GET", function(){
	//console.log(utils);
	var res = this.response;
	res.end("Hi "+ id);
});