// TODO:
// Handle case with multiple professor results
// Make second call async
// 

chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {

		var ratings = {};
		var success = false;
		var url = "http://www.ratemyprofessors.com/search.jsp";
		var searches = [];


		function searchProfs(professor) {
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
				}
			});
		}

		var getRatings = function(professor) {
			return function(response) {
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
							ratings[professor] = stats;
						}
					});
				}
				// ratings[professor] = stats;
			}
		}

		for (i = 0; i < message.length; i++) {
			searches.push(searchProfs(message[i]).done(getRatings(message[i])));
		}

		$.when.apply($, searches).done(function() {
			// $.when.apply($, details).done(function() {
				console.log(ratings);
				sendResponse({'ratings': ratings});
			// });
		});

		return true;
	});