angular.module('onlineUsers',[])
.directive('onlineUsers',function(){
    return{
        restrict: 'E',
        templateUrl:'views/partials/onlineUsers.html',
        controller: function($scope){
            $scope.rightClickPlayer = function(player){
                angular.forEach($scope.onlineUsers,function(playerObj){                    
                    playerObj.menu=false;
                });
                $scope.onlineUsers[player].menu=true;
                
            };
            
            openChatWindow=function(obj){
                $scope.openChatWindows.push({chatLog:[],otherPlayer:obj});
            };
            
            
            
            $scope.rightClickOptions=[
                {name:'Chat',func:openChatWindow},
                {name:'Challenge: Card Game',func:function(){console.log('chat');}},
                {name:'Challenge: Archer Game',func:$scope.ArcherGame.challengeSend}
            ];
        }
    };
})

;
