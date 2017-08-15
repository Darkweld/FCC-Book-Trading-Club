'use strict';


(function() {
    var search = document.getElementById('bookSearch');
    var mainContainer = document.getElementById('mainContainer');
 
    function arrayLoop(array) {
            
            var fragment = document.createDocumentFragment();
            
            var count = 0;
            
            var linkNum = 0;
            
            var pagination = document.createElement('div');
            pagination.className = "pagination";

        for (var i = 0, l = array.length; i < l; i++) {

            var bookDiv = document.createElement('div');
            bookDiv.className = "bookDiv";
            
            var bookImage = document.createElement('img');
            bookImage.src = array[i].image;
            bookImage.className = 'bookImage';
            bookDiv.appendChild(bookImage);
            
            var tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            bookDiv.appendChild(tooltip);
            
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
                       var children = pagination.childNodes;
                       for (var x = 0, y = children.length; x < y; x++) {
                        children[x].classList.remove('paginationLinkCurrent');
                       }
                       link.classList.add('paginationLinkCurrent');
                       if (document.getElementById('bookContainer')) {
                           mainContainer.removeChild(document.getElementById('bookContainer'));
                       }
                       
                       mainContainer.appendChild(append);

                   }, false);
                   
               })(paginationLink, appendMe);
               
               pagination.appendChild(paginationLink);
            }
        }
        mainContainer.appendChild(pagination);
    }

    search.addEventListener('submit', function(event) {
        event.preventDefault();
        xhttp.request('GET', mainUrl + '/bookSearch?q=' + document.getElementById('bookSearchBar').value, function(data) {
            data = JSON.parse(data);
            if (data.error) {
                  return alert(data.error);
            }
            while(mainContainer.hasChildNodes()){
              mainContainer.removeChild(mainContainer.lastChild);
            }
            
            if (data.ownedBooks) {
                
                var fragment = new DocumentFragment();

                var ownedBooks = document.createElement('div');
                ownedBooks.className = 'owned-books-container'; 


             for (var i = 0, l = data.ownedBooks.length; i < l; i++) {
                 
            var bookDiv = document.createElement('div');
            bookDiv.className = "bookDiv";
            
            var bookImage = document.createElement('img');
            bookImage.src = data.ownedBooks[i].image;
            bookImage.className = 'bookImage';
            bookDiv.appendChild(bookImage);
            
            var tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            
            var bookTitle = document.createElement('p');
            bookTitle.textContent = data.ownedBooks[i].title;
            bookTitle.className = "bookTitle";
            tooltip.appendChild(bookTitle);
            
            if (data.ownedBooks[i].authors)
            
            for (var j = 0, k = data.ownedBooks[i].authors.length; j < k; j++) {
                var bookAuthor = document.createElement('p');
                bookAuthor.textContent = data.ownedBooks[i].authors[j];
                bookAuthor.className = "bookAuthor";
                tooltip.appendChild(bookAuthor);
            }

            var bookUser = document.createElement('p');
            bookUser.textContent = 'owned by: ' + data.ownedBooks[i].user.localUsername;
            bookUser.className = "bookUser";
            tooltip.appendChild(bookUser);
            bookDiv.appendChild(tooltip);

            (function(div, username) {
               div.addEventListener('click', function(event) {
                   window.location.href = mainUrl + '/request/' + username;
               }, false);
            })(bookDiv, data.ownedBooks[i].user.localUsername);
            
            fragment.appendChild(bookDiv);
            
            }
            ownedBooks.appendChild(fragment);
            mainContainer.appendChild(ownedBooks);

            return arrayLoop(data.unownedBooks);
                
                
            }
            
            
            return arrayLoop(data);
     
        });
        
        
        
    }, false);
    
})();
