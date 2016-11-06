'use strict';

window.allFavorites = JSON.parse(localStorage.getItem('savedFavorites'));

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
		deleteIcon.data({ id: element.id });					//attach the ID again so that the "deleteStory" variable further below can access

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
	$('.favorite-story').remove();
	displayFavorites();
	//location.reload();
}

function clickSortByTitle() {
	allFavorites.sort(function(a,b) {
		var titleA = a.title.toUpperCase(); // ignore upper and lowercase
		var titleB = b.title.toUpperCase(); // ignore upper and lowercase
		return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;

	});

	localStorage.setItem('savedFavorites', JSON.stringify(allFavorites));
	$('.favorite-story').remove();
	displayFavorites();
}

function clickDelete() {
	var deleteStory = $(this).data().id;

	for (var i = 0; i < allFavorites.length; i++) {
		if (allFavorites[i].id === deleteStory) {
			var index = i;
			break;
		}
	}

	allFavorites.splice(index, 1);
	localStorage.setItem('savedFavorites', JSON.stringify(allFavorites));
	var htmlToRemove = $(this).closest('.favorite-story');
	htmlToRemove.remove();
}

$('.sort-date').click(clickSortByDate);
$('.sort-title').click(clickSortByTitle);
displayFavorites();
