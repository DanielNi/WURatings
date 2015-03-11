chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {

		var ratings = [];
		var success = false;
		var url = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=washington+university+in+st+louis&queryoption=HEADER&query=";

		for (i = 0; i < message.length; i++) {
			url += message[i] + "&facetSearch=true";

			var xhr = new XMLHttpRequest();
			xhr.onload = function() {
				ratings.push(xhr.responseText);
			};
			xhr.onerror = function() {
				sendResponse({'success': 'ERROR'});
			};
			xhr.open(method, url, true);
			xhr.send();
			// $.ajax({
			// 	url			: url,
			// 	type 		: 'GET',
			// 	dataType	: 'HTML',
			// 	data 		: {
			// 		// 'queryBy' 	  : 'teacherName',
			// 		// 'schoolName'  : 'washington+university+in+st+louis',
			// 		// 'queryoption' : 'HEADER',
			// 		// 'query'		  : message[i],
			// 		// 'facetSearch' : true
			// 	},
			// 	success 	: function(response) {
			// 		console.log("SUCCESSSSS");
			// 		success = true;
			// 	},
			// 	error 		: function(response) {
			// 		// error = response;
			// 		// console.log(response);
			// 		alert("There was a problem saving your changes. Please try again.");
			// 	}
			// });
		}

		// if (request.greeting == "hello")
		sendResponse({'success': success, 'length': message.length, 'message': message});
	});