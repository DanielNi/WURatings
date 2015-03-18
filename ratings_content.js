// TODO:
// Fix on click handler problem with other random thing catching event

var ratings_content = (function($) {

	var profs = [];
	var withRatings;
	var pages;

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

	var multipleTable = 
	'<div class="bearRatings">'+
		'<div class="brHeading">'+
	    '</div>'+
	    '<div class="professors">'+
	    	'There are multiple professors with this last name at WashU.'+
	    	'<ul>'+
	   		'</ul>'+
	    '</div>'+
	'</div>';

	var elements = {
		acquire:function() {
			this.results 		= $("#Body_upResults");
			this.profResults    = this.results.find(".ResultTable .instructorLink");
		}
	};

	var ev = {
		bind:function() {
			elements.results.on('DOMNodeInserted', ev.appendRatings);
			elements.results.on('click', 'button.showRatings', ev.toggleRatings);
		},

		appendRatings:function(e) {
			if ($(e.target).attr('id') == 'Body_divResults') {
				elements.profResults = elements.results.find(".ResultTable .instructorLink");
				ev.getProfs();
				// $('#form1').children('span').css;

				chrome.runtime.sendMessage({'message': 'initial query', 'profs': profs}, function(response) {
					pages = response;

					var button = "<button class='showRatings'>Show rating</button>";
					elements.profResults = elements.results.find(".ResultTable .instructorLink");
					withRatings = elements.profResults.filter(function(index) {
						return $(elements.profResults[index]).text() in pages;
					});
					withRatings.after(button);
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
			var $this = $(this);
			var profName = $this.prev().text();

			// only toggle ratings of the appropriate professor
			$thisTable = $this.parents('.ResultTable').find('.bearRatings .brHeading:contains(' + profName + ')');
			$thisTable.parent().toggle();

			if ($this.text() == "Show rating" && $thisTable.length == 0) {
				var prof = {};
				if ($.isArray(pages[profName])) { // multiple profs with the same name
					var multTable = $(multipleTable);

					// var lastName = (profName.substr(0, profName.indexOf(" ")) == pages[profName].firstName) ? profName.substr(profName.indexOf(" ") + 1, profName.length) : profName;

					multTable.find('.brHeading').append("<div class='profName'>" + profName + "</div>");
					for (var data in pages[profName]) {
						multTable.find('ul').append("<li><a href='http://www.ratemyprofessors.com" + pages[profName][data].page 
							+ "' target='_blank'>" + pages[profName][data].firstName + " " + profName + "</a></li>");
					}

					if ($this.parents('.ResultTable').find('.profName').text() !== profName) {
						$this.parents('.ResultTable').prepend(multTable);
					}

				} else { // only one prof with this name
					prof[profName] = pages[profName];
					chrome.runtime.sendMessage({'message': 'specific professor', 'prof': prof}, function(ratings) {
						var customTable = $(ratingTable);

						// handle the case where course listings has full prof name
						var lastName = (profName.substr(0, profName.indexOf(" ")) == ratings[profName].firstName) ? profName.substr(profName.indexOf(" ") + 1, profName.length) : profName;
						
						// add all the custom info to the ratingTable html
						customTable.find('.brHeading').append("<a href='http://www.ratemyprofessors.com" 
							+ ratings[profName].page + "' class='profName' target='_blank'>" + ratings[profName].firstName
							+ " " + lastName + "</a>");
						customTable.find('.numRatings').append(ratings[profName].count + " ratings");
						customTable.find('.overall').append(ratings[profName].overall);
						customTable.find('.grade').append(ratings[profName].grade);
						customTable.find('.helpfulness').append(ratings[profName].helpfulness);
						customTable.find('.clarity').append(ratings[profName].clarity);
						customTable.find('.easiness').append(ratings[profName].easiness);

						if ($this.parents('.ResultTable').find('.profName').text() !== ratings[profName].firstName + " " + profName) {
							$this.parents('.ResultTable').prepend(customTable);
						}
					});
				}
			}

			var $containingTable = $this.parents('.MainTableRow').parents('table').first();
			$containingTable.find('.ResultRow2').each(function(ind) {
				var $prof = $(this).find('.instructorLink');
				if ($prof.text() == profName) {
					var $button = $prof.next();
					if ($button.text() == "Show rating") {
						$button.text("Hide rating");
					} else {
						$button.text("Show rating");
					}
				}
			});
			e.stopPropagation(); // there's something on the page catching events or something, which is messing stuff up

		},

		makeRatingTable:function(profName) {
			var prof = {};
			prof[profName] = pages[profName];
			chrome.runtime.sendMessage({'message': 'specific professor', 'prof': prof}, function(ratings) {
				var customTable = $(ratingTable);

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

				if ($this.parents('.ResultTable').find('.profName').text() !== ratings[profName].firstName + " " + profName) {
					$this.parents('.ResultTable').prepend(customTable);
				}
			});
		},

		replaceTable:function() {

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