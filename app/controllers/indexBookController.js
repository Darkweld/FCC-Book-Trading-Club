'use strict';

(function() {
var bookContainer = document.getElementById('bookContainer');



function arrayLoop(array) {
            
            var fragment = document.createDocumentFragment();
            
            var count = 0;
            
            var linkNum = 0;
            
        for (var i = 0, l = array.length; i < l; i++) {

            var bookDiv = document.createElement('div');
            bookDiv.className = "bookDiv";
            
            var bookImage = document.createElement('img');
            bookImage.src = array[i].image;
            bookImage.className = 'bookImage';
            bookDiv.appendChild(bookImage);
            
            var bookTitle = document.createElement('p');
            bookTitle.textContent = array[i].title;
            bookTitle.className = "bookTitle";
            bookDiv.appendChild(bookTitle);
            
            if (array[i].authors)
            
            for (var j = 0, k = array[i].authors.length; j < k; j++) {
                var bookAuthor = document.createElement('p');
                bookAuthor.textContent = array[i].authors[j];
                bookAuthor.className = "bookAuthor";
                bookDiv.appendChild(bookAuthor);
            }

            var tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            tooltip.textContent = 'owned by: ' + array[i].user.localUsername;
            bookDiv.appendChild(tooltip);

            
            (function(div, username) {

               div.addEventListener('click', function(event) {
                   	window.location.href = mainUrl + '/request/' + username;
               }, false);
            })(bookDiv, array[i].user.localUsername);
            

            fragment.appendChild(bookDiv);

        }

        bookContainer.appendChild(fragment);

    }


 	xhttp.ready(xhttp.request('GET', mainUrl + '/bookListIndex', function(data){
 		data = JSON.parse(data);
 		
 		arrayLoop(data);



 	}));















})();