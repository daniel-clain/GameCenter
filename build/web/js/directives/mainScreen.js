angular.module('mainScreenModule', [])
.directive('mainScreen',function(){
    return{
        restrict: 'E',
        templateUrl:'views/mainScreen.html'
    };
})
.directive('openChatWindows',function(){
    return{
        restrict: 'E',
        templateUrl:'views/partials/openChatWindows.html',
        controller:function($scope){
            $scope.openChatWindows=[];
            
            $scope.send = function(event,chatWindow){
                if(event.which===13)
                    if(chatWindow.chat!==''){
                        var packet={
                            type:'chat',  
                            func:{name:'chatMessageUpdate'},
                            sendTo:chatWindow.otherPlayer.name,
                            sendFrom:$scope.player.name,
                            data:{
                                message:chatWindow.chat
                            }
                        };
                        $scope.sendPacket(packet);
                        
                        chatWindow.chatLog.push(
                            {who:$scope.player.name,time:new Date(),chat:chatWindow.chat});  
                        chatWindow.chat='';
                    }
                    
            };
            $scope.chatMessageUpdate = function(msgObj){
                var found=false;
                angular.forEach($scope.openChatWindows,function(openChatWindow){
                    if(openChatWindow.otherPlayer.name===msgObj.sendFrom){
                        found=true;
                        openChatWindow.chatLog.push(
                            {who:msgObj.sendFrom,time:new Date(),chat:msgObj.data.message});
                    }
                });
                if(!found){
                    angular.forEach($scope.onlineUsers,function(onlineUser){
                        if(onlineUser.name===msgObj.sendFrom){
                            $scope.openChatWindows.push({chatLog:[
                                {who:msgObj.sendFrom,time:new Date(),chat:msgObj.data.message}
                            ],otherPlayer:onlineUser});
                        }
                    });
                }
            }
            
            
        }
        
        
    };
});

