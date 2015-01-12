"use strict";

var loginController = new controller("login");

loginController.get("testJson", function(startpage, endpage, pagesize){
	//_view.renderView("index");
	console.log(startpage +","+endpage+","+ pagesize);
	var res = this.response;
	// To Write a Cookie
	var makeSampleData = function () {
	  var sampleDataSize = 30;
	  var jobData = [];
	  
	  for (var counter = 0; counter < sampleDataSize; counter++) { 
	    
		var borAttachmentList = [];
		borAttachmentList.push(
		{id: 4, name: "abcvv44.pdf", link: "google.com", policyKey: counter + 1},
	    {id: 3, name: "abc3.pdf", link: "google.com", policyKey: counter + 1});
		
		jobData.push({
			  requestId: ((counter % 5 == 0) ? counter : counter + 1),
			  policyKey: counter + 1,
			  name: "Tiancum",
			  loc: "Jacob",
			  intermediary: "Jacob123",
			  carrier: "JacoJacob",
			  role: "Jacob777",
			  department: "Jacob34",
			  sales: "Jacodfg",
			  branch: "Jaco5555",
			  date: new Date(),
			  borAttachment: borAttachmentList
		  });
	
	  }
	  return jobData;
	}

	this.sendJSON({ policy: makeSampleData(), RowCount: 100});

}, { auth: false });

loginController.post("submit", function(test){
	//console.log(utils);
	this.sendJSON({user: 'rahul'});
}, { auth: false });