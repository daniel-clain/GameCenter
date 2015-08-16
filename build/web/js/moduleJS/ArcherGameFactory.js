app.factory('ArcherGameFactory',function($timeout){function main($scope){
           
    var x=$scope.ArcherGame;
    var f=x.factory;
    
    f.champList={
        "Jaraxis":{
            name:"Jaraxis",
            stats:{
                "Speed":70,
                "Max Arrows":7,
                "Arrow Speed":4,
                "Fire Rate":12,
                "Arrow Regen":12,
                "Health":60                
            },
            height:187
        },
        "Morde":{name:"Morde",
            stats:{
                "Speed":50,
                "Max Arrows":5,
                "Arrow Speed":12,
                "Fire Rate":8,
                "Arrow Regen":8,
                "Health":90               
            },
            height:180
        }
    };
    f.buttons={
        'shield':{count:0}
    };
    
    f.buffs={
        heal:{width:40,height:40},
        arrows:{width:77,height:60},
        shield:{width:38,height:51}
    };
    f.gameSetup=function(){
        x.player.champ.currentHealth=x.player.champ.totalHealth=angular.copy(x.player.champ.stats['Health']);
        x.opponent.champ.currentHealth=x.opponent.champ.totalHealth=angular.copy(x.opponent.champ.stats['Health']);
        
        x.player.champ.currentArrows=x.player.champ.stats['Max Arrows'];
        x.opponent.champ.currentArrows=x.opponent.champ.stats['Max Arrows'];
        startRandomBuffSpawn();
        x.maxLeft=(window.innerWidth/100)*45;
        x.maxRight=(window.innerWidth/100)*55;
    };
    
    function startRandomBuffSpawn(){
        var count = Math.round(Math.random()*1000)*1;
        $timeout(makeRandomBuff,count);
    }
    
    
    function makeRandomBuff(){
        var count = Math.round(Math.random()*1000)*60;
        var buffNum = Math.round(Math.random()*2);
        var locationX = Math.round((window.innerWidth/100)*Math.random()*100);
        var locationY = Math.round((window.innerHeight/100)*Math.random()*100);
        var buff;
        if(buffNum===0){buff="heal";}        
        if(buffNum===1){buff="arrows";}  
        if(buffNum===2){buff="shield";}
        
        var packet={
                type:'createBuff',
                func:{group:'ArcherGame',name:'createBuff'},
                sendTo:x.opponent.name,
                sendFrom:x.player.name,
                data:{buff:buff,x:locationX,y:locationY}
            };
            $scope.sendPacket(packet);
        x.createBuff(packet);
        if(x.gameActive){
            $timeout(makeRandomBuff,count);
        }
    }
    f.activeBuffs=[];
    var buffCount=0;
    x.createBuff=function(packet){
        buffCount++;
        f.activeBuffs.push({buff:packet.data.buff,x:packet.data.x,y:packet.data.y,id:buffCount});
        $('battle-arena').append("<buff id='buffId_"+buffCount+"' style='top:"+packet.data.y+"px;left:"+packet.data.x+"px;' class='buff "+packet.data.buff+"'></buff>");
        removeBuffIn5Seconds(buffCount);
        q(packet.data.buff+" spawn");
    };
    
    function removeBuffIn5Seconds(buffCount){
        $timeout(function(){$('#buffId_'+buffCount).remove();f.activeBuffs.splice(0,1);},8000);
    }
    
    f.gameReset=function(){        
    };
    
    
    
    var commandCount=0;
    var dest={}; var loc={};   
    var xDir;var yDir;
    var xSpeed; var ySpeed;
    f.moveArcher=function(){
        dest=x.player.champ.destination;
        loc=x.player.champ.location;
        commandCount++;        

        if(dest.left<loc.left){
            xDir=-1;
        }else{
            xDir=1;
        }

        if(dest.top<loc.top){
            yDir=-1;
        }else{
            yDir=1;
        }       

        var xlength=Math.abs(dest.left-loc.left);       
        var ylength=Math.abs(dest.top-loc.top);

        var hypotenuse=parseInt(Math.sqrt(xlength*xlength+ylength*ylength));

        xSpeed=hypotenuse/xlength;
        ySpeed=hypotenuse/ylength;
        
        loopMoveY();
        loopMoveX();
    };
    function loopMoveX(){
        var thisCommand=commandCount;
        loop();
        function loop(){  
            var outOfBounds=false;
            if(x.player.side==="left" && xDir===1){
                if(loc.left+75>x.maxLeft){
                    outOfBounds=true;
                }
            }
            if(x.player.side==="right" && xDir===-1){
                if(loc.left+75<x.maxRight){
                    outOfBounds=true;
                }
            }
            if(!outOfBounds){
                loc.left+=(2*xDir);
                checkForBuff();

                var packet={
                    type:'archerMoved',
                    func:{group:'ArcherGame',name:'archerMoved'},
                    sendTo:x.opponent.name,
                    sendFrom:x.player.name,
                    data:{x:loc.left}
                };
                $scope.sendPacket(packet);

                if(loc.left*xDir<dest.left*xDir && commandCount===thisCommand){            
                    $timeout(loop,8*xSpeed);  
                }
            }
        }
    };
    
    function loopMoveY(){
        var thisCommand=commandCount;
        loop();
        function loop(){ 
            
            loc.top+=(2*yDir);
            
            var packet={
                type:'archerMoved',
                func:{group:'ArcherGame',name:'archerMoved'},
                sendTo:x.opponent.name,
                sendFrom:x.player.name,
                data:{y:loc.top}
            };
            $scope.sendPacket(packet);

            if(loc.top*yDir<dest.top*yDir && commandCount===thisCommand){            
                $timeout(loop,8*ySpeed);
            }
        }
       
    };
    
    f.markerBlink=function(){
        $('point-marker').addClass('markerBlink');
        setTimeout(function(){$('point-marker').removeClass('markerBlink');},300);
    };
    
    
    f.checkHit=function(dir,arrow){
        var targetLocation;
        var targetPlayer;
        var targetChampHeight;
        var arrowHitY=parseInt($(arrow).css('top'))+9;
        var arrowHitX;
        var xHit; var yHit;
        
        if(dir==='left'){
            arrowHitX=parseInt($(arrow).css('left'));
            if(x.player.side==='left'){
                targetPlayer='player';
                targetLocation=x.player.champ.location;
                targetChampHeight=x.player.champ.height;
            }else{                
                targetPlayer='opponent';
                targetLocation=x.opponent.champ.location;
                targetChampHeight=x.opponent.champ.height;
            }
            
            if(arrowHitX<targetLocation.left+100 && arrowHitX>targetLocation.left){
                xHit=true;
            }
        }
        
        if(dir==='right'){
            arrowHitX=parseInt($(arrow).css('left'))+154;
            if(x.player.side==='right'){
                targetPlayer='player';
                targetLocation=x.player.champ.location;
                targetChampHeight=x.player.champ.height;
            }else{                
                targetPlayer='opponent';
                targetLocation=x.opponent.champ.location;
                targetChampHeight=x.opponent.champ.height;
            }
            
            if(arrowHitX<targetLocation.left+150 && arrowHitX>targetLocation.left+100){
                xHit=true;
            }
        }
        
        
        
            if(arrowHitY<targetLocation.top+targetChampHeight && arrowHitY>targetLocation.top){
                yHit=true;
            }
            
            if(xHit && yHit){
                f.arrowHit(arrow,targetPlayer,arrowHitX,arrowHitY);
            }
    };
    
    var bloodCount=0;
    f.arrowHit = function(arrow, player,xHit,yHit){
        bloodCount++;
        console.log(player+" HIT!");
        $(arrow).remove();
        $('battle-arena').append("<blood id='blood"+bloodCount+"' style='top:"+(yHit-35)+"px;left:"+(xHit-45)+"px;'></blood");
        x[player].champ.currentHealth=x[player].champ.currentHealth-10;
        $scope.$apply();
        setTimeout(function(){
            $('#blood'+bloodCount).addClass('fadeAway');
            setTimeout(function(){
                $('#blood'+bloodCount).remove();
            },300);
        },100);
    };
    
    
    function checkForBuff(){
        for(var i=0;i<f.activeBuffs.length;i++){
            var bx=f.activeBuffs[i].x;var by=f.activeBuffs[i].y;
            var bw=f.buffs[f.activeBuffs[i].buff].width;
            var bh=f.buffs[f.activeBuffs[i].buff].height;
            
            var px=x.player.champ.location.left;var py=x.player.champ.location.top;
            var ph=x.player.champ.height;var pw=150;
            
            if(bx<px+pw && px<bx+bw && by<py+ph && py<by+bh){
                q("Picked up "+f.activeBuffs[i].buff);
                
                var packet={
                    type:'pickupBuff',
                    func:{group:'ArcherGame',name:'pickupBuff'},
                    sendTo:x.opponent.name,
                    sendFrom:x.player.name,
                    data:{index:i}
                };
                $scope.sendPacket(packet);
                x.pickupBuff(packet);
            }
        }
    }
    
    x.pickupBuff=function(packet){ 
        if(f.activeBuffs[packet.data.index]!==undefined){
            $("#buffId_"+f.activeBuffs[packet.data.index].id).remove();
            var player;
            if(packet.sendFrom===x.player.name){
                player=x.player;
            }
            if(packet.sendFrom===x.opponent.name){
                player=x.opponent;
            }
            f[f.activeBuffs[packet.data.index].buff](player);
            f.activeBuffs.splice(packet.data.index,1);
        }
    };
    f['heal']=function(player){
        if(player.champ.currentHealth+20>=player.champ.totalHealth){
            player.champ.currentHealth=player.champ.totalHealth;
        }else{
            player.champ.currentHealth+=20;
        }
    };
    f['arrows']=function(player){
        if(player.champ.currentArrows+3>=player.champ.stats['Max Arrows']){
            player.champ.currentArrows=player.champ.stats['Max Arrows'];
        }else{
            player.champ.currentArrows+=3;
        }
    };
    f['shield']=function(player){
        if(player.name===x.player.name){
            f.buttons.shield.count++;
        }
    };
    
    f.useShield=function(){
        if(f.buttons.shield.count>0){
            f.buttons.shield.count--;
            var packet={
                type:'pickupBuff',
                func:{group:'ArcherGame',name:'healPlayer'},
                sendTo:x.opponent.name,
                sendFrom:x.player.name,
                data:{}
            };
            $scope.sendPacket(packet);
            x.healPlayer(packet);
        }
    };
    
    x.healPlayer=function(packet){
        var player;
        if(packet.sendFrom===x.player.name){
            player=x.player;
        }
        if(packet.sendFrom===x.opponent.name){
            player=x.opponent;
        }
        if(player.champ.currentHealth+10>=player.champ.totalHealth){
            player.champ.currentHealth=player.champ.totalHealth;
        }else{
            player.champ.currentHealth+=10;
        }
    };
    
    
        
}return main;});