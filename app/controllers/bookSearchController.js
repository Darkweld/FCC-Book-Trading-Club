'use strict';


(function() {
    var search = document.getElementById('bookSearch');
    var mainContainer = document.getElementById('mainContainer');
    var pagination = document.getElementById('pagination');
    var ownedBooks = document.getElementById('ownedBooks');
    var error = document.getElementById('error');
 
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
                console.log(url);
               div.addEventListener('click', function(event) {
                   xhttp.request('POST', url, function(response) {
                        console.log(response);
                       
                   });
               }, false);
            })(bookDiv);
            
            
            count++;
            fragment.appendChild(bookDiv);
            
            if (count === 10 || i === l) {
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
    
    
    
    
    
    
    
    
    
    
    
    
    search.addEventListener('submit', function(event) {
        event.preventDefault();
        xhttp.request('GET', mainUrl + '/bookSearch?q=' + document.getElementById('bookSearchBar').value, function(data) {
            data = JSON.parse(data);
            if (data.error) {
                  return error.textContent = data.error;
            }
            
            error.textContent = '';
            
            
            if (data.ownedBooks) {
                
             for (var i = 0, l = data.ownedBooks.length; i < l; i++) {
                 
            var bookDiv = document.createElement('div');
            bookDiv.className = "bookDiv";
            
            var bookImage = document.createElement('img');
            bookImage.src = data.ownedBooks[i].image;
            bookImage.className = 'bookImage';
            bookDiv.appendChild(bookImage);
            
            var bookTitle = document.createElement('p');
            bookTitle.textContent = data.ownedBooks[i].title;
            bookTitle.className = "bookTitle";
            bookDiv.appendChild(bookTitle);
            
            if (data.ownedBooks[i].authors)
            
            for (var j = 0, k = data.ownedBooks[i].authors.length; j < k; j++) {
                var bookAuthor = document.createElement('p');
                bookAuthor.textContent = data.ownedBooks[i].authors[j];
                bookAuthor.className = "bookAuthor";
                bookDiv.appendChild(bookAuthor);
            }
            
            var bookUser = document.createElement('a');
            bookUser.textContent = data.ownedBooks[i].title;
            bookUser.className = "bookUser";
            bookDiv.appendChild(bookUser);

            (function(div) {
               div.addEventListener('click', function(event) {
                   console.log("clicky");

               }, false);
            })(bookDiv);
            
            ownedBooks.appendChild(bookDiv);
            
             }

              arrayLoop(data.unownedBooks);
                
                return;
            }
            
            
            arrayLoop(data);
     
        });
        
        
        
    }, false);
    
})();