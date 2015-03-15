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
					searches.push($.ajax({
						url			: "http://www.ratemyprofessors.com" + page,
						type 		: 'GET',
						dataType	: 'HTML',
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
					}));
				}
				ratings[professor] = stats;
				
			}
		}

		for (i = 0; i < message.length; i++) {
			searches.push(searchProfs(message[i]).done(getRatings(message[i])));
		}

		$.when.apply($, searches).done(function() {
			console.log(searches);
			// $.when.apply($, details).done(function() {
				console.log(ratings);
				sendResponse({'ratings': ratings});
			// });
		});

		return true;
	});