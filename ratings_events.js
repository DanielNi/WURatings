chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {

		var ratings = {};
		var success = false;
		var url = "http://www.ratemyprofessors.com/search.jsp";

		for (i = 0; i < message.length; i++) {
			// var url = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=washington+university+in+st+louis&queryoption=HEADER&query=" + message[i] + "&facetSearch=true";
			// var xhr = new XMLHttpRequest();
			// console.log(message[i]);
			// xhr.onload = function() {
			// 	var response = $(xhr.responseText);
			// 	var profs = response.find('.listing.PROFESSOR');
			// };
			// xhr.onerror = function() {
			// 	sendResponse({'success': success});
			// };
			// xhr.open('GET', url, true);
			// xhr.send();
			var professor = message[i];
			$.ajax({
				url			: url,
				type 		: 'GET',
				dataType	: 'HTML',
				async		: false,
				data 		: {
					'queryBy' 	  : 'teacherName',
					'schoolName'  : 'washington+university+in+st+louis',
					'queryoption' : 'HEADER',
					'query'		  : professor,
					'facetSearch' : true
				},
				success 	: function(response) {
					var response = $(response);
					var prof = response.find('.listing.PROFESSOR');
					var stats = {};
					if (prof.length > 0) {
						var page = prof.find('a').attr('href');

						$.ajax({
							url			: "http://www.ratemyprofessors.com" + page,
							type 		: 'GET',
							dataType	: 'HTML',
							async		: false,
							success		: function(resp) {
								var resp = $(resp);
								var ratingsDiv = resp.find('.left-breakdown');
								var breakdown = ratingsDiv.find('.breakdown-wrapper').children();
								var details = ratingsDiv.find('.faux-slides').children();
								stats.overall = $(breakdown[0]).find('.grade').text();
								stats.grade = $(breakdown[1]).find('.grade').text();
								stats.helpfulness = $(details[0]).find('.rating').text();
								stats.clarity = $(details[1]).find('.rating').text();
								stats.easiness = $(details[2]).find('.rating').text();
							}
						});
					}
					ratings[professor] = stats;
					success = true;
				},
				error 		: function(response) {
					console.log("There was a problem getting ratings.");
				}
			});
		}

		console.log(ratings);

		sendResponse({'success': success, 'ratings': ratings});
	});