angular.module('generalGUI',[])
.directive('closeBtn',function(){
    return{
        restrict: 'E',
        template:'X'
    };
})
.directive('minimizeBtn',function(){
    return{
        restrict: 'E',
        template:'-'
    };
});

