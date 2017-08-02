'use strict';


(function() {
    
    var recieveprofileUrl = mainUrl + "/getUser";
    
    xhttp.ready(xhttp.request("GET", recieveprofileUrl, function(data){
        var userObject = JSON.parse(data);
        
        for (var i in userObject.tokens) {
            var capital = i.substr(0,1).toUpperCase() + i.substr(1, i.length);
            document.getElementById(i).href = mainUrl + "/unlink/" + i;
            document.getElementById(i + "-text").innerHTML = "Unlink " + capital;
        }
        
        
        
        
    }));
    
    
    
    
    
    
    
    
    
    
    
})();