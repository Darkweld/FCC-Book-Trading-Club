'use strict';

(function(){

	var mainRequestDiv = document.getElementById('myRequestDiv');


	function makeBookDivs(array) {

		if (!array.length) {
        	return;
        }

        var bookfragment = document.createDocumentFragment();
            
        for (var i = 0, l = array.length; i < l; i++) {

            var bookDiv = document.createElement('div');
            bookDiv.className = "bookDiv";
            
            var bookImage = document.createElement('img');
            bookImage.src = array[i].image;
            bookImage.className = 'bookImage';
            bookDiv.appendChild(bookImage);

            var tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            
            var bookTitle = document.createElement('p');
            bookTitle.textContent = array[i].title;
            bookTitle.className = "bookTitle";
            tooltip.appendChild(bookTitle);
            
            if (array[i].authors)
            
            for (var j = 0, k = array[i].authors.length; j < k; j++) {
                var bookAuthor = document.createElement('p');
                bookAuthor.textContent = array[i].authors[j];
                bookAuthor.className = "bookAuthor";
                tooltip.appendChild(bookAuthor);
            }

            var bookUser = document.createElement('p');
            bookUser.textContent = 'owned by: ' + array[i].user.localUsername;
            bookUser.className = "bookUser";
            tooltip.appendChild(bookUser);
            bookDiv.appendChild(tooltip);
            
            bookfragment.appendChild(bookDiv);

        }

        return bookfragment;
	}



	function requestArray(reqArr){
		var fragment = new DocumentFragment();

		for (var i = 0, l = reqArr.length; i < l; i++){
			var requestFrag = new DocumentFragment();

			var requestDiv = document.createElement('div');
			requestDiv.className = "requestDiv";

			requestFrag.appendChild(makeBookDivs(reqArr[i].booksOffered));
			requestFrag.appendChild(makeBookDivs(reqArr[i].booksRequested));

			var requestName = document.createElement('p');
			requestName.textContent = "Request Number" + (i + 1);
			fragment.appendChild(requestName);
			fragment.appendChild(requestFrag);

		}

		mainRequestDiv.appendChild(fragment);


	}





xhttp.request('GET', mainUrl + '/myRequestsController', function(data){
	data = JSON.parse(data);
	console.log(data);
	requestArray(data.requests);
})














})()