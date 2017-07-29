'use strict';


(function() {
    var search = document.getElementById('bookSearch');
    
    
    
    
    
    search.addEventListener('submit', function(event) {
        event.preventDefault();
        xhttp.request('GET', mainUrl + '/bookSearch?q=' + document.getElementById('bookSearchBar').value, function(data) {
            data = JSON.parse(data);
            console.log(data);
            if (data.error) {
               if (document.getElementById('error')) {
                  return document.getElementById('error').textContent = data.error; 
               }
                
                
               var error = document.createElement('p');
               var errortext = document.createTextNode(data.error);
               error.appendChild(errortext);
               error.className = "error";
               error.id = 'error';
               document.getElementById('search-error-container').insertBefore(error, document.getElementById('search-container')); 
                return;
            }
            
            
        });
        
        
        
    });
    
})();