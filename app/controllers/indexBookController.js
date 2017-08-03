'use strict';

(function() {

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
            
            (function(div) {
                var url = mainUrl + '/addBook?bookId=' + array[i].bookId + '&title=' + array[i].title + '&image=' + array[i].image.replace(/&/g, "%26");
                
                if (array[i].authors) {
                    url += '&authors=' + array[i].authors;
                }
               div.addEventListener('click', function(event) {
                   xhttp.request('POST', url, function(response) {
                        console.log(response);
                       
                   });
               }, false);
            })(bookDiv);
            
            
            count++;
            fragment.appendChild(bookDiv);
            
            if (count === 10 || i === l - 1) {
                count = 0;
                linkNum++;
               var paginationLink = document.createElement('a');
               paginationLink.textContent = linkNum;
               paginationLink.className = "paginationLink";
               var appendMe = document.createElement('div');
               appendMe.id = "bookContainer";
               appendMe.className = "book-container";
               appendMe.appendChild(fragment);
               
               
               (function(link, append) {
                   link.addEventListener('click', function(event) {
                       event.preventDefault();
                       if (document.getElementById('bookContainer')) {
                           mainContainer.removeChild(document.getElementById('bookContainer'));
                       }
                       
                       mainContainer.appendChild(append);

                   }, false);
                   
               })(paginationLink, appendMe);
               
               pagination.appendChild(paginationLink);
            }
        }
    }


 	xhttp.ready(xhttp.request('GET', mainUrl + '/bookListIndex', function(data){
 		data = JSON.parse(data);
 		console.log(data);



 	}));















})();