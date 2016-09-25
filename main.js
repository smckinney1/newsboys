$(function() {

//API key: 9f55a2ee-1376-4d7f-b1bf-dfed2da408c5
	$('#submit').click(function(event) {

		event.preventDefault();
		$('.news-results').empty();
		var searchTopic = $('#search').val();
		var dateFrom = $('#from-date').val();
		var dateTo = $('#to-date').val();
		var orderBy = $('.drop-down').val();

		
		$.ajax({
			url: 'https://content.guardianapis.com/search?api-key=9f55a2ee-1376-4d7f-b1bf-dfed2da408c5' + '&q=' + searchTopic + '&from-date=' + dateFrom + '&to-date=' + dateTo + '&order-by=' + orderBy,
			success: function (data) {
				data.response.results.forEach(function (element, index, array) {
					var contentHtml = '<div class="content-html hidden">' + '<a href="' + element.webUrl + '">' + element.webTitle + '</a></div>'
					var contentDate = element.webPublicationDate.match(/\d{4}[-]\d{2}[-]\d{2}/g);
					var x = '<div>' + contentDate + '</div>'
					$('.news-results').append(contentHtml, x);
					//$('.news-results').text(element.webTitle);
				})
				
				$(".content-html").removeClass('hidden');	//the "hidden" class causes everything from forEach to show at the same time. Remove later?
			},

			error: function(data) {
				console.log(data.response);
			}
 		
		})

	})

})