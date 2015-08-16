app.factory('ArcherGame',function($timeout){function main($scope){
        
    $scope.ArcherGame={factory:{}};    
    var x=$scope.ArcherGame;
    var f=x.factory;
    
    

    x.challengeSend=function(obj){        
        x.opponent={name:obj.name};
        x.player={name:$scope.player.name};
        var packet={
            type:'challengeArcherGame',
            func:{group:'ArcherGame',name:'challengeReceive'},
            sendTo:obj.name,
            sendFrom:$scope.player.name,
            data:{

            }
        };
        $scope.sendPacket(packet);

        $scope.popupWindow={
            visible:true,
            heading:"Archer Game Challenge!",
            text:"You have challenged "+obj.name+" to a game of Archer Game, waiting for response....",
            buttons:[
                {name:'Cancel',func:function(){x.cancelSend();}}
            ]
        };
    }; 
    x.challengeReceive = function(packet){
        x.opponent={name:packet.sendFrom};
        x.player={name:$scope.player.name};
        $scope.popupWindow={
            visible:true,
            heading:"Archer Game Challenge!",
            text:packet.sendFrom+" has challenged you to a game of Archer Game, do you accept?",
            buttons:[
                {name:'Decline',func:function(){x.declineSend();}},
                {name:'Accept',func:function(){x.acceptSend();}}
            ]
        };
    };
    x.cancelSend=function(){
        $scope.activeView='mainScreen';
        $scope.popupWindow.visible=false;
        var packet={
            type:'cancelArcherGame',
            func:{group:'ArcherGame',name:'cancelReceive'},
            sendTo:x.opponent.name,
            sendFrom:x.player.name,
            data:{}
        };
        $scope.sendPacket(packet);
    };
    x.cancelReceive=function(packet){
        $scope.popupWindow={
            visible:true,
            heading:"Archer Game Challenge Cancled :(",
            text:packet.sendFrom+" has cancled the Archer Game challenge",
            buttons:[
                {name:'Ok',func:function(){
                        $scope.popupWindow.visible=false;
                        $scope.activeView='mainScreen';
                    }}
            ]
        };
    };
    
    
    x.acceptSend=function(){        
        $scope.popupWindow.visible=false;
        var packet={
            type:'acceptArcherGame',
            func:{group:'ArcherGame',name:'acceptReceive'},
            sendTo:x.opponent.name,
            sendFrom:x.player.name,
            data:{}
        };
        $scope.sendPacket(packet);
        startArcherGame();
    };
    x.acceptReceive=function(packet){
        $scope.popupWindow.visible=false;
        startArcherGame();
    };
    
    x.declineSend=function(){        
        $scope.activeView='mainScreen';
        $scope.popupWindow.visible=false;
        var packet={
            type:'declineArcherGame',
            func:{group:'ArcherGame',name:'declineReceive'},
            sendTo:x.opponent.name,
            sendFrom:x.player.name,
            data:{}
        };
        $scope.sendPacket(packet);
    };
    $scope.popupWindow={};
    x.declineReceive=function(packet){        
        $scope.popupWindow={
            visible:true,
            heading:"Archer Game Challenge Declined :(",
            text:packet.sendFrom+" has declined your Archer Game challenge.",
            buttons:[
                {name:'Ok',func:function(){
                        $scope.popupWindow.visible=false;
                        $scope.activeView='mainScreen';
                    }}
            ]
        };
    };
    
    
    
    x.selectChamp=function(val){
        if(x.selectedChamp===undefined){
            x.champSelectHeading='Waiting for opponent'; 
            $scope.startDotDotDotWaiting(x,'champSelectHeading');
        }
        x.selectedChamp=val;
        var packet={
            type:'champSelected',
            func:{group:'ArcherGame',name:'champSelected'},
            sendTo:x.opponent.name,
            sendFrom:x.player.name,
            data:{champ:x.selectedChamp}
        };
        $scope.sendPacket(packet);
        x.champSelected(packet);            
    };
    
    x.hoverChamp='none';
    x.hoverChampFunc=function(val){
        x.hoverChamp=val;
    };
    x.champSelected = function(packet){
        if(packet.sendFrom===x.opponent.name){
            x.opponent.champ=angular.copy(f.champList[packet.data.champ]);
            if(x.player.champ===undefined){
                x.opponent.side='left';
            }else{                
                x.opponent.side='right';
            }
        }
        if(packet.sendFrom===x.player.name){
            x.player.champ=angular.copy(f.champList[packet.data.champ]);
            if(x.opponent.champ===undefined){
                x.player.side='left';
            }else{                
                x.player.side='right';
            }
        }
        if(x.player.champ!==undefined && x.opponent.champ!==undefined){
            x.startCountDown();
        }
    };
    x.gameActive=false;
    function startArcherGame(){
        $scope.activeView='Archer Game';
        x.player={name:$scope.player.name};        
        x.champselectpanelopen=true;
        x.champSelectHeading='Select an Archer';
        x.selectedChamp=undefined;
        x.gameActive=true;
        
        //$scope.when(x.bothChampsSelected,x.startCountDown);
    }
    x.startCountDown=function(){
        x.champselectpanelopen=false;
        $scope.stopDotDotDotWaiting=true;
        q('countdown');
        placeChamp();
        f.gameSetup();
        
    };
    var pa;var oa;
    var location;
    function placeChamp(){
        
        pa= $('player-archer');
        oa= $('opponent-archer');        
        var rightStart=window.innerWidth-20-150;
        x.player.champ.champVisible=true;
        x.opponent.champ.champVisible=true;
        var px=rightStart; var ox=20;
        if(x.player.side==='left'){
            px=20;ox=rightStart;
        }
        
        x.player.champ.location={top:20,left:px};
        x.opponent.champ.location={top:20,left:ox};
        
        location=x.player.champ.location;
        
         
    }
    
    
    
    
    var arrowCount=0;
    var reloaded=true;
    x.fireArrow=function(){ 
        if(x.player.champ.currentArrows!==0 && x.gameActive && reloaded){
            startReload();
            if(x.player.champ.currentArrows===x.player.champ.stats['Max Arrows']){
                regenArrow();                    
            }
            x.player.champ.currentArrows--;
            var dir=1;
            if(x.player.side==='right'){
                dir=-1;
            }
            $('battle-arena').append("<arrow style='top:"+(location.top+25)+"px;left:"+(location.left+70*dir)+"px;' class='arrow player "+x.player.side+" "+x.player.champ.name+"Arrow'></arrow");
            arrowCount++;

            var packet={
                type:'archerMoved',
                func:{group:'ArcherGame',name:'arrowFired'},
                sendTo:x.opponent.name,
                sendFrom:x.player.name,
                data:{location:location}
            };
            $scope.sendPacket(packet);
        }
        
    };
    function startReload(){
        reloaded=false;
        setTimeout(function(){reloaded=true;},(5000/x.player.champ.stats['Fire Rate']))
    }
    x.arrowFired=function(packet){  
        x.opponent.champ.currentArrows--;
        var dir=1;
        if(x.opponent.side==='right'){
            dir=-1;
        }
        var location=x.opponent.champ.location;
        $('battle-arena').append("<arrow style='top:"+(location.top+25)+"px;left:"+(location.left+70*dir)+"px;' class='arrow opponent "+x.opponent.side+" "+x.opponent.champ.name+"Arrow'></arrow");
    };
    
    arrowMoveLoop();
    
    function arrowMoveLoop(){
        $('.arrow.right').each(function(){
            val=parseInt($(this).css('left'));
            $(this).css({'left':val-6+'px'});
            if(val<0){
                $(this).remove();
            }
            f.checkHit('left',this);
            
        });
        
        $('.arrow.left').each(function(){
            val=parseInt($(this).css('left'));
            $(this).css({'left':val+6+'px'});
            if(val>2000){
                $(this).remove();
            }
            f.checkHit('right',this);
        });
        setTimeout(arrowMoveLoop,5);
    }
    
    
    
    x.endGameClick = function(e){
        e.stopPropagation();
    };
    
    x.rightClickArena = function(e){ 
        x.player.champ.destination={top:e.pageY,left:e.pageX};
        f.moveArcher(location);
        f.markerBlink();
    };
    x.archerMoved=function(packet){        
        if(packet.data.x!==undefined){
            x.opponent.champ.location.left=packet.data.x;
        }            
        if(packet.data.y!==undefined){
            x.opponent.champ.location.top=packet.data.y;
        }         
    };
    
    $scope.$watch('ArcherGame.player.champ.currentHealth',function(val){
        if(val<=0){
            defeat();
            gameFinished();
        }
    });
    
    
    $scope.$watch('ArcherGame.opponent.champ.currentHealth',function(val){
        if(val<=0){
            victory();
            gameFinished();
        }
    });
    function victory(){
        x.player.finish='victory';
    }    
    function defeat(){
        x.player.finish='defeat';
    }
    function gameFinished(){
        x.player.champ.champVisible=false;
        x.opponent.champ.champVisible=false;
        $('.arrow').each(function(){
            $(this).remove();
        });
        x.gameActive=false;
    }
        
        
    function regenArrow(){
        $timeout(function(){
            if(x.player.champ!==undefined && x.player.champ.currentArrows!==x.player.champ.stats['Max Arrows']){
                regenArrow();
                x.player.champ.currentArrows++;
                var packet={
                    type:'archerMoved',
                    func:{group:'ArcherGame',name:'opponentRegenArrow'},
                    sendTo:x.opponent.name,
                    sendFrom:x.player.name,
                    data:{}
                };
                $scope.sendPacket(packet);
            }
        },(50000/x.player.champ.stats['Arrow Regen']));
        
    };
    
    
    x.opponentRegenArrow=function(packet){
        if(x.opponent.champ!==undefined){
            x.opponent.champ.currentArrows++;
        }
    };
    
    x.requestRematch=function(){
        x.player={name:x.player.name};
        x.opponent={name:x.opponent.name};
        x.challengeSend(x.opponent);
       
       var packet={
            type:'archerMoved',
            func:{group:'ArcherGame',name:'rematchRequested'},
            sendTo:x.opponent.name,
            sendFrom:x.player.name,
            data:{}
        };
        $scope.sendPacket(packet);
    };
    
    x.rematchRequested=function(){
        x.player={name:x.player.name};
        x.opponent={name:x.opponent.name};
    };
    x.return=function(){
        $scope.activeView='mainScreen';        
    };
        
        
}return main;});

