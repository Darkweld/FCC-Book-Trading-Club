'use strict';


(function() {
	var bookContainer = document.getElementById('profileBookContainer');
    
	function profilePage(data) {


        for (var i in data.tokens) {
            var capital = i.substr(0,1).toUpperCase() + i.substr(1, i.length);
            document.getElementById(i).href = mainUrl + "/unlink/" + i;
            document.getElementById(i + "-text").innerHTML = "Unlink " + capital;
        }
         
         
}

function bookArray (array) {
        
        if (!array.length) {
        	bookContainer.parentNode.removeChild(bookContainer);
        	document.getElementById('bookShowText').textContent = "You currently do not have any books";
        	return;
        }
        var fragment = document.createDocumentFragment();
            
        for (var i = 0, l = array.length; i < l; i++) {

            var bookDiv = document.createElement('div');
            bookDiv.className = "bookDiv";
            bookDiv.id = array[i].bookId
            
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

            bookDiv.appendChild(tooltip);


            
            (function(div, bookid) {

               div.addEventListener('click', function(event) {
                   	xhttp.request('POST', mainUrl + '/deleteBook/' + bookid, function(data){
                   		return div.parentNode.removeChild(div);
                   	});
               }, false);
            })(bookDiv, array[i]._id);
            

            fragment.appendChild(bookDiv);

        }

        bookContainer.appendChild(fragment);

    }

	var recieveprofileUrl = mainUrl + "/getUser";
	xhttp.request("GET", recieveprofileUrl, function(data){
			var data = JSON.parse(data);
			profilePage(data);
			return bookArray(data.books);
	});















    
    
    
    
    
    
    
    
    
    
    
})();