$(function() {

	var currentPage = 1;
	var searchTopic, dateFrom, dateTo, orderBy;	//set all of these variables at the top so that they can be used in other functions

	$('#submit').click(function(event) {

		event.preventDefault();
		$('.news-results').empty();					//empty the news-results div of all elements inserted from previous searches

		//Information below to be used in the query string in AJAX call
		searchTopic = $('#search').val();		
		dateFrom = $('#from-date').val();
		dateTo = $('#to-date').val();
		orderBy = $('.drop-down').val();
		getAjax(searchTopic, dateFrom, dateTo, orderBy, currentPage);	//make the API call
	});

	function clickNext() {
		currentPage++;
		$('.news-results').empty();
		getAjax(searchTopic, dateFrom, dateTo, orderBy, currentPage);
	}

	function clickPrevious() {
		currentPage--;
		$('.news-results').empty();
		getAjax(searchTopic, dateFrom, dateTo, orderBy, currentPage);
	}

	function getAjax(searchTopic, dateFrom, dateTo, orderBy, currentPage) {
		$.ajax({
			url: 'https://content.guardianapis.com/search?page=' + currentPage + '&q=' + searchTopic + '&api-key=9f55a2ee-1376-4d7f-b1bf-dfed2da408c5' + '&from-date=' + dateFrom + '&to-date=' + dateTo + '&order-by=' + orderBy,
			success: function (data) {

				//below conditional statements disable/enable Previous & Next buttons and make them unclickable/clickable depending on page number
				if(currentPage === data.response.pages) {
					$('.next').addClass('disabled').off('click');
				} else {
					$('.next').removeClass('disabled').on('click', clickNext);
				}

				if(currentPage === 1) {
					$('.previous').addClass('disabled').off('click');
				} else {
					$('.previous').removeClass('disabled').on('click', clickPrevious);
				}

				//for each search result, create a link to the news story along with the date.
				//regEx to extract the part of the date that we actually want to display.
				data.response.results.forEach(function (element, index, array) {
					var contentDate = element.webPublicationDate.match(/\d{4}[-]\d{2}[-]\d{2}/g);
					var contentHtml = '<div class="content-html hidden">' + '<a href="' + element.webUrl + '">' + element.webTitle + '</a>' + '<br>' + contentDate + '</div>';
					$('.news-results').append(contentHtml);
				})
				
				$(".content-html").removeClass('hidden');	//the "hidden" class causes everything from forEach to show at the same time. Remove later?
				$('.pages').removeClass('hidden');
			},

			error: function(data) {
				console.log(data.response);
			}
 		
		});
	}

});