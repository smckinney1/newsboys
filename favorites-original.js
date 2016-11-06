'use strict';

$(function(){

	var allFavorites = JSON.parse(localStorage.getItem('savedFavorites'));

	function displayFavorites() {

		JSON.parse(localStorage.getItem('savedFavorites')).forEach(function (element, index, array) {

			var favoritesRow = 
				$('<div class="favorite-story">' +
					'<a href="' + element.url + '" target="_blank">' + element.title + '</a>' + 
					'<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' + 
					'<br>' + 
					element.date + 
				'</div>');

			var deleteIcon = favoritesRow.find('.glyphicon-remove');
			deleteIcon.data({ 'index': index });

			deleteIcon.click(clickDelete);

			$('.favorites').append(favoritesRow);

		});
	}

	function clickSortByDate() {
		allFavorites.sort(function(a,b){
			var c = new Date(a.date);
			var d = new Date(b.date);
			return d-c;
		});

		localStorage.setItem('savedFavorites', JSON.stringify(allFavorites));
		location.reload();
	}

	function clickSortByTitle() {
		allFavorites.sort(function(a,b) {
			var titleA = a.title.toUpperCase(); // ignore upper and lowercase
			var titleB = b.title.toUpperCase(); // ignore upper and lowercase
			return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;

		});

		localStorage.setItem('savedFavorites', JSON.stringify(allFavorites));
		location.reload();
	}

	function clickDelete () {
		var deleteStory = $(this).data().index;
		//console.log('index of deleted story: ', deleteStory)
		allFavorites.splice(deleteStory, 1);
		//console.log('All Favorites: ', allFavorites)
		localStorage.setItem('savedFavorites', JSON.stringify(allFavorites));
		/*var htmlToRemove = $(this).closest('.favorite-story');
		htmlToRemove.remove();*/
		location.reload();		//reload the whole page so that the array indices can properly refresh
	}

	$('.sort-date').click(clickSortByDate);
	$('.sort-title').click(clickSortByTitle);
	displayFavorites();

});