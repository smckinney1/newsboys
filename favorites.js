'use strict';

$(function(){

	/*listOfFavorites.forEach(function (element, index, array) {
		//display each of the objects within the listOfFavorites array
		
		$('.favorites').append('<div>title</div>');
	})*/

	//Going to start the page assuming there are items in local storage.

	JSON.parse(localStorage.getItem('savedFavorites')).forEach(function (element, index, array) {
		//console.log('element: ', element, ' & index: ', index, ' & array: ', array);
		$('.favorites').append('<div>' + element.title + '</div>');
	})

});