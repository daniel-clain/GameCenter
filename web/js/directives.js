angular.module('directives',['onlineUsers'])
.directive('card',function(){
    return{
        restrict: 'E',
        templateUrl:'views/partials/cardsGroup.html'
    };
})
.directive('gameBoard',function(){
    return{
        restrict: 'E',
        templateUrl:'views/gameBoard.html'
    };
})
.directive('archerGame',function(){
    return{
        restrict: 'E',
        templateUrl:'views/archerGame/archerGame.html',
        scope:{},
        link:function(scope){
            scope.x=scope.$parent.ArcherGame;
            scope.f=scope.$parent.ArcherGame.factory;
        }
    };
})
.directive('globalPopups',function(){
    return{
        restrict: 'E',
        templateUrl:'views/globalPopups.html'
    };
})
.directive('champSelect',function(){
    return{
        restrict: 'E',
        templateUrl:'views/archerGame/partials/champSelect.html'
    };
})

.directive('gameFinish',function(){
    return{
        restrict: 'E',
        templateUrl:'views/archerGame/partials/gameFinish.html'
    };
})

.directive('container',function(){
    return{
        restrict: 'E',
        templateUrl:'container.html'
    };
})
.directive('login',['myServices',function(s){
    return{
        restrict: 'E',
        templateUrl:'views/login.html',
        link:function(scope){
            scope.login = function(e){
                if(e.which===13)
                    if(scope.player!==undefined){
                        scope.logUserIntoServer();                       
                        scope.activeView='mainScreen';
                    }
                    
            };
        }
    };
}])
.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
})



;