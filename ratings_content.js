// TODO:
// Fix on click handler problem with other random thing catching event


var ratings_content = (function($) {

	var profs = [];

	var ratingTable = 
	'<div class="bearRatings">'+
	    '<div class="brHeading">'+
	    '</div>'+
	    '<div class="numRatings">'+
	    '</div>'+
	    '<div class="brRatings1">'+
	        '<div class="overall">'+
	            '<div class="title">'+
	                '<b>Overall Quality</b>'+
	            '</div>'+
	        '</div>'+
	        '<div class="grade">'+
	            '<div class="title">'+
	                '<b>Average Grade</b>'+
	            '</div>'+
	        '</div>'+
	    '</div>'+
	    '<div class="brRatings2">'+
	        '<div class="helpfulness">'+
	            '<div class="title">'+
	                '<b>Helpfulness</b>'+
	            '</div>'+
	        '</div>'+
	        '<div class="clarity">'+
	            '<div class="title">'+
	                '<b>Clarity</b>'+
	            '</div>'+
	        '</div>'+
	        '<div class="easiness">'+
	            '<div class="title">'+
	                '<b>Easiness</b>'+
	            '</div>'+
	        '</div>'+
	    '</div>'+
	'</div>';

	var elements = {
		acquire:function() {
			this.window 		= $(window);
			this.document		= $(document);
			this.results 		= $("#Body_upResults");
			this.profResults    = this.results.find(".ResultTable .instructorLink");
		}
	};

	var ev = {
		bind:function() {
			elements.results.on('DOMNodeInserted', ev.appendRatings);
			elements.results.on('click', 'button.showRatings', ev.toggleRatings);
			// elements.courses.on('load', "div.ResultTable", ev.appendRatings);
		},

		appendRatings:function(e) {
			console.log("dom node inserted");
			if ($(e.target).attr('id') == 'Body_divResults') {
				ev.getProfs();

				chrome.runtime.sendMessage(profs, function(response) {
					console.log(response);
					var ratings = response.ratings;
					var button = "<button class='showRatings'>Show rating</button>";
					elements.profResults = elements.results.find(".ResultTable .instructorLink");
					var withRatings = elements.profResults.filter(function(index) {
						return $(elements.profResults[index]).text() in ratings;
					});
					withRatings.after(button);

					withRatings.each(function(ind) {
						customTable = $(ratingTable);
						var profName = $(this).text();

						// handle the case where course listings has full prof name
						var lastName = (profName.substr(0, profName.indexOf(" ")) == ratings[profName].firstName) ? profName.substr(profName.indexOf(" ") + 1, profName.length) : profName;
						
						// add all the custom info to the ratingTable html
						customTable.find('.brHeading').append("<a href='http://www.ratemyprofessors.com' class='profName'" 
							+ ratings[profName].page + ">" + ratings[profName].firstName + " " + lastName
							+ "</a>");
						customTable.find('.numRatings').append(ratings[profName].count + " ratings");
						customTable.find('.overall').append(ratings[profName].overall);
						customTable.find('.grade').append(ratings[profName].grade);
						customTable.find('.helpfulness').append(ratings[profName].helpfulness);
						customTable.find('.clarity').append(ratings[profName].clarity);
						customTable.find('.easiness').append(ratings[profName].easiness);

						if ($(this).parents('.ResultTable').find('.profName').text() !== ratings[profName].firstName + " " + profName) {
							$(this).parents('.ResultTable').prepend(customTable);
						}
					});
				});
			}
		},

		getProfs:function() {
			profs.length = 0;
			elements.profResults.each(function(ind) {
				if (profs.indexOf($(this).text()) === -1) {
					profs.push($(this).text());
				}
			});
		},

		toggleRatings:function(e) {
			var name = $(this).prev().text();

			// only toggle ratings of the appropriate professor
			$(this).parents('.ResultTable').find('.bearRatings .brHeading:contains(' + name + ')').parent().toggle();

			var $containingTable = $(this).parents('table');
			$containingTable.find('.ResultRow2').each(function(ind) {
				var $prof = $(this).find('.instructorLink');
				if ($prof.text() == name) {
					var $button = $prof.next();
					if ($button.text() == "Show rating") {
						$button.text("Hide rating");
					} else {
						$button.text("Show rating");
					}
				}
			});
			e.stopPropagation(); // there's something on the page catching events or something, which is fucking shit up
		}
	};

	elements.acquire();

	return {
		init:function() {
			ev.bind();
		}
	};

})(jQuery);

jQuery(function($) {
	ratings_content.init();
});