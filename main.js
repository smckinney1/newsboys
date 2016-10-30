'use strict';

////////////////REMOVE LATER ///////////////
//window.localStorage.clear();

Date.prototype.toDateInputValue = function() {
	return (new Date(this)).toJSON().slice(0,10);
};

$(function() {

	var currentPage = 1;
	var searchTopic, dateFrom, dateTo, orderBy;	//set all of these variables at the top so that they can be used in other functions


	$('#from-date').val(new Date().toDateInputValue());
	$('#to-date').val(new Date().toDateInputValue());

	function clickSearch () {
		$('.news-results').empty();					//empty the news-results div of all elements inserted from previous searches

		//Information below to be used in the query string in AJAX call
		searchTopic = $('#search-area .form-control').val();		
		dateFrom = $('#from-date').val();
		dateTo = $('#to-date').val();
		orderBy = $('.drop-down').val();

		//validate form, make API call if it validates
		if (validateForm()) {
			getAjax();	//make the API call
		}
	};

	//Below: When search is clicked or "enter" pressed, run the clickSearch function

	$('#search-area .glyphicon').click(clickSearch);		

	$('#search-area .form-control').keypress(function(e) {
		if (e.which === 13) {
			e.preventDefault();
			clickSearch();
		}
	})

	function validateForm() {

		if (!searchTopic) {
			$('#search-area .form-control').addClass('has-error');
			return false;
		} else if (!dateFrom || !dateTo || dateFrom > dateTo) {
			$('.dates').addClass('has-error');
			return false;
		}

		$('#search-area .form-control').removeClass('has-error').addClass('has-success');
		$('.dates').removeClass('has-error').addClass('has-success');
		return true;

	}

	//below functions disable/enable Previous & Next buttons and make them unclickable/clickable depending on page number

	function showNextButton(pages) {
		if(currentPage === pages) {
			$('.next').addClass('disabled').off('click');
		} else {
			$('.next').removeClass('disabled').on('click', clickNext);
		}
	}

	function clickNext() {
		currentPage++;
		$('.news-results').empty();
		getAjax();
	}

	function showPreviousButton(pages) {
		if(currentPage === 1) {
			$('.previous').addClass('disabled').off('click');
		} else {
			$('.previous').removeClass('disabled').on('click', clickPrevious);
		}
	}

	function clickPrevious() {
		currentPage--;
		$('.news-results').empty();
		getAjax();
	}

	function getAjax() {
		$.ajax({
			url: 'https://content.guardianapis.com/search?page=' + currentPage + '&q=' + searchTopic + '&api-key=9f55a2ee-1376-4d7f-b1bf-dfed2da408c5' + '&from-date=' + dateFrom + '&to-date=' + dateTo + '&order-by=' + orderBy,
			success: function (data) {

				if(data.response.total !== 0) {

					showNextButton(data.response.pages);
					showPreviousButton(data.response.pages);
					//for each search result, create a link to the news story along with the date.
					//regEx to extract the part of the date that we actually want to display.
					data.response.results.forEach(function (element, index, array) {
						//var pubDate = element.webPublicationDate.match(/\d{4}[-]\d{2}[-]\d{2}/g);		//don't need regEx, see below!
						var pubDate = (new Date(element.webPublicationDate)).toLocaleDateString();

						//convert string to jQuery object, attach data to it before you append it to the DOM.
						var row = 
							$('<div class="news-story">' +
								'<a href="' + element.webUrl + '" target="_blank">' + element.webTitle + '</a>' + 
								'<span class="glyphicon glyphicon-heart" aria-hidden="true"></span>' + 
								'<br>' + 
								pubDate + 
							'</div>');

						//below code finds the heart icon so that we can allow it to save to favorites
						var heartIcon = row.find('.glyphicon-heart');
						heartIcon.data({title: element.webTitle, url: element.webUrl, date: pubDate[0]});
						/*heartIcon.click(function() {
							//var thisHeart = $(this);
							var story = $(this).data();
							var storedFavorites = localStorage.

							var retrievedObject = localStorage.getItem('savedFavorites');				//set the items in local storage (if any) to 																				variable
							if (retrievedObject) {														//if local storage has items, execute code
								var parsedObject = JSON.parse(retrievedObject);
								parsedObject.push(story);
								localStorage.setItem('savedFavorites', JSON.stringify(parsedObject));
							} else {																	//code if local storage is empty
								var favoriteItem = [story];
								localStorage.setItem('savedFavorites', JSON.stringify(favoriteItem));
							}
						});*/

						heartIcon.click(function () {

						    var story = $(this).data();
						    var favorites = JSON.parse(localStorage.getItem('savedFavorites') || "[]");	//DEFAULT to the savedFavorites in LS, if there are none, create an empty array. Same thing as what was being done in commented code above, only in fewer lines.

						    favorites.push(story);
						    localStorage.setItem('savedFavorites', JSON.stringify(favorites));

						})

						$('.news-results').append(row);
					})

				} else {
					var row = '<div>' + 'No results found.' + '</div>';
					$('.news-results').append(row);
				}

				$('.pages').removeClass('hidden');
			},

			error: function(data) {
				console.log('Error: ', data.response);
			}
 		
		});
	}

});