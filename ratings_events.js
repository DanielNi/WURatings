// TODO:
// Handle case with multiple professor results
// 

chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {

		var ratings = {};
		var url = "http://www.ratemyprofessors.com/search.jsp";
		var searches = [];
		var profs = {};

		if (message.message == "initial query") {
			function searchProfs(professor, callback) {
				return $.ajax({
					url			: url,
					type 		: 'GET',
					dataType	: 'HTML',
					data 		: {
						'queryBy' 	  : 'teacherName',
						'schoolName'  : 'washington+university+in+st+louis',
						'queryoption' : 'HEADER',
						'query'		  : professor,
						'facetSearch' : true
					},
					success		: function(response) {
						var response = $(response);
						var prof = response.find('.listing.PROFESSOR');
						if (prof.length > 0) {
							var page = prof.find('a').attr('href');
							callback(professor, page);
						}
					}
				});
			}

			function populateProfs(professor, page) {
				profs[professor] = page;
			}

			for (i = 0; i < message.profs.length; i++) {
				searches.push(searchProfs(message.profs[i], populateProfs));
			}

			$.when.apply($, searches).done(function() {
				sendResponse(profs);
			});


		} else if (message.message == "specific professor") {
			console.log(message);

			function getRatings(professor, page, callback) {
				return $.ajax({
					url			: "http://www.ratemyprofessors.com" + page,
					type 		: 'GET',
					dataType	: 'HTML',
					success		: function(resp) {
						var stats = {};
						var resp = $(resp);
						var nameDiv = resp.find('.result-name').children().first();
						var ratingsDiv = resp.find('.left-breakdown');
						var numDiv = resp.find('.rating-count');
						var breakdown = ratingsDiv.find('.breakdown-wrapper').children();
						var details = ratingsDiv.find('.faux-slides').children();
						stats.firstName = nameDiv.text().trim();
						stats.count = numDiv.text().trim().split(' ')[0];
						stats.overall = $(breakdown[0]).find('.grade').text();
						stats.grade = $(breakdown[1]).find('.grade').text();
						stats.helpfulness = $(details[0]).find('.rating').text();
						stats.clarity = $(details[1]).find('.rating').text();
						stats.easiness = $(details[2]).find('.rating').text();
						stats.page = page;
						populateStats(professor, stats);
					}
				});
			}

			function populateStats(professor, stats) {
				ratings[professor] = stats;
			}

			$.when(getRatings(Object.keys(message.prof)[0], message.prof[Object.keys(message.prof)[0]], populateStats)).done(function() {
				sendResponse(ratings);
			});
		}

		return true;
	});