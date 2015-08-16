angular.module('services',[])
.factory('myServices',function(){
    var s={};  
    s.forumLog=[];
    s.writeResponse=function(text){
        s.forumLog.push(text)
        console.log(text)
        
    };
    
     return s;       
});
