// TODO:
// Fix on click handler problem


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
			// elements.courses.on('load', "div.ResultTable", ev.appendRatings);
		},

		appendRatings:function(e) {
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
						var profName = $(withRatings[ind]).text();
						customTable.find('.brHeading').append("<a href=http://www.ratemyprofessors.com" 
							+ ratings[profName].page + ">" + ratings[profName].firstName + " " + profName
							+ "</a>");
						customTable.find('.numRatings').append(ratings[profName].count + " ratings");
						customTable.find('.overall').append(ratings[profName].overall);
						customTable.find('.grade').append(ratings[profName].grade);
						customTable.find('.helpfulness').append(ratings[profName].helpfulness);
						customTable.find('.clarity').append(ratings[profName].clarity);
						customTable.find('.easiness').append(ratings[profName].easiness);
						$(withRatings[ind]).parents('.ResultTable').prepend(customTable);

					});

					// withRatings.parents('.ResultTable').prepend(ratingTable);



					// $('button.showRatings').on('click', ev.toggleRatings);
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
			console.log("toggling");
			$(this).parents('.ResultTable').find('.bearRatings').toggle();
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