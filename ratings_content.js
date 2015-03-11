// $("#Body_upResults #Body_oCourseList_tabSelect").prepend("<h1>TESTING</h1>");

// $("#Body_upResults").on("load", function() {
// 	console.log($(this).find("#Body_oCourseList_viewSelect .CrsOpen .ResultTable"));
// });

// $(".SearchBox").on("click", function() {
// 	console.log($(document).find("#Body_oCourseList_viewSelect .CrsOpen .ResultTable"));
// });

var ratings_content = (function($) {

	var profs = [];

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
				var button = "<button class='showRatings'>Show rating</button>";
				profResults = elements.results.find(".ResultTable .instructorLink");
				profResults.after(button);

				ev.getProfs();

				chrome.runtime.sendMessage(profs, function(response) {
					console.log(response);
				});
			}
		},

		getProfs:function() {
			profs.length = 0;
			profResults.each(function(ind) {
				if (profs.indexOf($(this).text()) === -1) {
					profs.push($(this).text());
				}
			});
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