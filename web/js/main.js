
function q(x){console.log(x);}

var app = angular.module('myApp', ['data','directives','services','mainScreenModule','onlineUsers','generalGUI']);
app.controller('mainCtrl',['myServices','$scope','ArcherGame','ArcherGameFactory','$timeout',function(s,$scope,ArcherGame,ArcherGameFactory,$timeout){
    //$scope.activeView='Archer Game';
    $scope.activeView='login';
    $scope.services=s;
    $scope.forumLog = s.forumLog;  
    ArcherGame($scope);
    ArcherGameFactory($scope);
    $scope.onlineUsers={};
    
    
    $scope.send = function(){
        $scope.webSocket.send($scope.input);
        $scope.input='';
    };
    
    $scope.stopDotDotDotWaiting=true;
    $scope.startDotDotDotWaiting=function(group,val){
        $scope.stopDotDotDotWaiting=false;
        var word=angular.copy(group[val]);
        var dots=4;
        var count=0;
        
        wait();
        function wait(){
            count++;
            group[val]=group[val]+'.';
            if(count===dots){
                count=0;
                group[val]=word;
            }
            
            if(!$scope.stopDotDotDotWaiting){
                $timeout(wait,500);
            }
        }
    };
    $scope.headstart=true;
    
    
    $scope.logUserIntoServer=function(){
        if($scope.webSocket !== undefined){
           s.writeResponse("WebSocket is already opened.");
            return;
        }        
        $scope.webSocket = new WebSocket("ws://dans-ssd:8090/GameCenter/echo");
        $scope.webSocket.onopen = function(event){
            var packet={type:'userJoin',data:$scope.player.name};
            $scope.sendPacket(packet);
        };
        $scope.webSocket.onmessage = function(event){
            var packet=JSON.parse(event.data);
            if(packet.type==='onlineList'){
                delete packet.type;
                $scope.onlineUsers=packet;
                
                if($scope.headstart){
                    angular.forEach(packet, function(filterObj , filterKey){
                        if(filterKey!==$scope.player.name){
                            $scope.ArcherGame.player={name:$scope.player.name};
                            $scope.ArcherGame.opponent={name:filterKey};
                            $scope.ArcherGame.acceptSend();
                        }
                    });
                }
                
            }
            if(packet.func!==undefined){
                var group=packet.func.group;
                var name=packet.func.name;
                if(group!==undefined){
                    $scope[group][name](packet);
                }else{                    
                    $scope[name](packet);
                }                    
            }
            
            $scope.$apply();
        };
        $scope.webSocket.onclose = function(event){
            q('close event');
            q(event);
            s.writeResponse("Connection closed");
            $scope.$apply();
        };
    };
    
    $scope.sendPacket = function(x){ 
        $scope.webSocket.send(JSON.stringify(x));
    };
    $scope.closeSocket = function(){
        s.webSocket.close();
    };
    $scope.when=function(obj,func){
        q(obj);
        func();
    };
    if($scope.headstart){
        autoLogin();
    }
    function autoLogin(){
        $scope.player={name:'Test'+Math.floor(Math.random()*10)};
        $scope.logUserIntoServer();
    }
    var keysObj={
        113:'q',
        119:'w',
        101:'e',
        114:'r',
        49:'1',
        50:'2',
        51:'3',
        52:'4',
        53:'5',
        32:'space'
    };
    $("html").keypress(function(e) {
       if(keysObj[e.which]==='q'){
           $scope.ArcherGame.factory.useShield();
       }
       if(keysObj[e.which]==='space'){
           $scope.ArcherGame.fireArrow();
       }
       
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
///////////////////////////////////////////////


    $scope.cards= {
        dog:{
            name:'dog',
            attack:3,
            health:4,
            cost:2
        },
        cat:{
            name:'cat',
            attack:2,
            health:1,
            cost:1
        },
        moose:{
            name:'moose',
            attack:2,
            health:6,
            cost:3
        },
        donkey:{
            name:'donkey',
            attack:2,
            health:5,
            cost:2
        },
        panther:{
            name:'panther',
            attack:4,
            health:3,
            cost:4
        },
        spider:{
            name:'spider',
            attack:2,
            health:1,
            cost:1
        },
        lion:{
            name:'lion',
            attack:5,
            health:5,
            cost:5
        },
        chicken:{
            name:'chicken',
            attack:1,
            health:2,
            cost:1
        },
        ninja:{
            name:'ninja',
            attack:8,
            health:4,
            cost:3
        },
        bear:{
            name:'bear',
            attack:4,
            health:7,
            cost:6
        },
        hippo:{
            name:'hippo',
            attack:1,
            health:9,
            cost:5
        },
        eagle:{
            name:'eagle',
            attack:5,
            health:2,
            cost:3
        },
        rabbit:{
            name:'rabbit',
            attack:1,
            health:2,
            cost:1
        },
        dingo:{
            name:'dingo',
            attack:5,
            health:2,
            cost:3
        }
    };
    $scope.theGame = {
            playersTurn:'nobody',
            player1:
            {
                health:30,
                mana:{
                    total:0,
                    spent:0
                },
                hand:[],
                deck:[
                    {id:1,card:angular.copy($scope.cards.dog)},
                    {id:2,card:angular.copy($scope.cards.hippo)},
                    {id:3,card:angular.copy($scope.cards.dingo)},
                    {id:4,card:angular.copy($scope.cards.rabbit)},
                    {id:5,card:angular.copy($scope.cards.spider)},
                    {id:6,card:angular.copy($scope.cards.moose)},
                    {id:7,card:angular.copy($scope.cards.chicken)},
                    {id:8,card:angular.copy($scope.cards.bear)},
                    {id:9,card:angular.copy($scope.cards.panther)}
                ],
                inPlay:[]
            },
            player2:
            {
                health:30,
                mana:{
                    total:0,
                    spent:0
                },
                hand:[],
                deck:[
                    {id:1,card:angular.copy($scope.cards.dingo)},
                    {id:2,card:angular.copy($scope.cards.rabbit)},
                    {id:3,card:angular.copy($scope.cards.spider)},
                    {id:4,card:angular.copy($scope.cards.lion)},
                    {id:5,card:angular.copy($scope.cards.donkey)},
                    {id:6,card:angular.copy($scope.cards.cat)},
                    {id:7,card:angular.copy($scope.cards.dingo)},
                    {id:8,card:angular.copy($scope.cards.rabbit)},
                    {id:9,card:angular.copy($scope.cards.ninja)},
                    {id:10,card:angular.copy($scope.cards.eagle)}
                ],
                inPlay:[]
            }
    };
    var p1=$scope.theGame.player1;
    var p2=$scope.theGame.player2;

    $scope.startGame = function(thePlayer){
        drawCard(p1,2);
        drawCard(p2,2);
        $scope.theGame.playersTurn="player1";
        startTurn();
        $('.start').attr("disabled",true);

    };

    function startTurn(){
        if($scope.theGame.playersTurn=="player1"){p=p1;xE=$("player2");pE=$("player1")}
        if($scope.theGame.playersTurn=="player2"){p=p2;xE=$("player1");pE=$("player2")}
        xE.addClass("myDisable")
        pE.removeClass("myDisable")
        drawCard(p,1)
        p.mana.spent=0;
        if(p.mana.total<10)p.mana.total++;
    }
    $scope.endTurn = function(){
        if($scope.theGame.playersTurn=="player1"){$scope.theGame.playersTurn="player2"}
        else if($scope.theGame.playersTurn=="player2"){$scope.theGame.playersTurn="player1"}
        startTurn()
    }
    function drawCard(player,num){
        for(var i=0;i<num;i++){
            player.hand.push(player.deck.pop())

            $('#moveCard')[0].load()
            $('#moveCard')[0].play()
        }
    }

    ////////////  WHEN PLAYER DRAWS A CARD SET UP DRAGGABLE  ///////////////////

    $scope.$watch("theGame.player1.hand",function(){setTimeout(function(){setDraggableHand("player1")},100);},true);
    $scope.$watch("theGame.player2.hand",function(){setTimeout(function(){setDraggableHand("player2")},100);},true);
    function setDraggableHand(player) {
        $( player+" inPlay" ).droppable({
            accept: player+" hand card",
            drop: playCard
        });
        $(  player+" hand card" ).draggable({
            revert: true,
            containment: player+".player",
            stack: player+" card"
        });
    };
    /////////////////////////////////////////////////////////////////////////

    //////////// DRAGS CARD FROM HAND TO PLAY ///////////////////
    function playCard(event, ui){
        db=false;
        var droppedElem=ui.draggable[0];
            if(db)console.log("droppedElem:")
            if(db)console.log(droppedElem)
        var parent=droppedElem.parentNode.parentNode.nodeName
        var droppedCard; var cardArrayIndex; var p;
        if(parent=='PLAYER1')p=p1;
        if(parent=='PLAYER2')p=p2;
        var availableMana = (p.mana.total-p.mana.spent);
        if(db)console.log("Available Mana: "+availableMana)

        for(var i=0;i<p.hand.length;i++){
            if(db)console.log(p.hand[i].id+" : "+droppedElem.id)
            if(p.hand[i].id==droppedElem.id){
                if(db)console.log('match')
                droppedCard = p.hand[i];
                cardArrayIndex = i;
                break;
            }
        }
        var cardCost=droppedCard.card.cost
        if(cardCost <= availableMana){
            $('#moveCard')[0].load()
            $('#moveCard')[0].play()
            console.log("You can afford this card | cost: "+cardCost+', available mana: '+availableMana)
            p.inPlay.push(p.hand.splice(cardArrayIndex,1)[0])
            if(parent=='PLAYER1')$scope.theGame.player1.mana.spent+=cardCost;
            if(parent=='PLAYER2')$scope.theGame.player2.mana.spent+=cardCost;
        }else{
            console.log("You CANNOT afford this card | cost: "+cardCost+', available mana: '+availableMana)
        }



        if(db)console.log('dropped card:')
        if(db)console.log(droppedCard)

        if(db)console.log(parent+"'s inplay:")
        if(db)console.log(p.inPlay)

        if(db)console.log(parent+"'s hand:")
        if(db)console.log(p.hand)

        $scope.$apply()
    }
    ////////////////////////////////////////////////////////////////////////////////



    ////////////  CARD FROM HAND TO PLAY  ///////////////////

    $scope.$watch("theGame.player1.inPlay",function(){
        setTimeout(function(){setDraggableInPlay("player1","player2")},100);},true);
    $scope.$watch("theGame.player2.inPlay",function(){
        setTimeout(function(){setDraggableInPlay("player2","player1")},100);},true);

    function setDraggableInPlay(player,enemyPlayer) {

        $( enemyPlayer+" inPlay card" ).droppable({
            accept: player+" inPlay card",
            drop: attack
        });
        $( enemyPlayer+" img" ).droppable({
            accept: player+" inPlay card",
            drop: attackPlayer
        });
        $(  player+" inPlay card" ).draggable({
            revert: true,
            containment: "gameboard",
            stack: player+" card"
        });
    };
    /////////////////////////////////////////////////////////////////////////


    ////////////  CREATURE ATTACKS CREATURE  ///////////////////
    function attack(event, ui){

        db=false;
        $('#attack')[0].load()
        $('#attack')[0].play()
        var attackingElem=ui.draggable[0];
        var defendingElem=$(this)[0];
        var parent=attackingElem.parentNode.parentNode.nodeName
        var attackingCard; var defendingCard; var attacker; var defender;
        var attackingIndex; var defendingIndex;
        if(parent=='PLAYER1'){attacker=p1;defender=p2}
        if(parent=='PLAYER2'){attacker=p2;defender=p1};

        for(var i=0;i<attacker.inPlay.length;i++){
            if(attacker.inPlay[i].id==attackingElem.id){
                attackingCard = attacker.inPlay[i];
                attackingIndex = i;
                break;
            }
        }
        for(var i=0;i<defender.inPlay.length;i++){
            if(defender.inPlay[i].id==defendingElem.id){
                defendingCard = defender.inPlay[i];
                defendingIndex = i;
                break;
            }
        }
        var attackingCardAttack=attackingCard.card.attack
        var attackingCardHealth=attackingCard.card.health

        var defendingCardAttack=defendingCard.card.attack
        var defendingCardHealth=defendingCard.card.health

        console.log("Attacking card | attack: "+attackingCardAttack+", health: "+attackingCardHealth)
        console.log("Defending card | attack: "+defendingCardAttack+", health: "+defendingCardHealth)


        if(parent=='PLAYER1'){
            $scope.theGame.player1.inPlay[attackingIndex].card.health-=defendingCardAttack;
            $scope.theGame.player2.inPlay[defendingIndex].card.health-=attackingCardAttack;
        }
        if(parent=='PLAYER2'){
            $scope.theGame.player2.inPlay[attackingIndex].card.health-=defendingCardAttack;
            $scope.theGame.player1.inPlay[defendingIndex].card.health-=attackingCardAttack;
        }
        if(attackingCard.card.health<=0){
            $('#death')[0].load()
            $('#death')[0].play()
            console.log(attackingCard.card.name+" is dead")
            attacker.inPlay.splice(attackingIndex,1)
        }
        if(defendingCard.card.health<=0){
            $('#death')[0].load()
            $('#death')[0].play()
            console.log(defendingCard.card.name+" is dead")
            defender.inPlay.splice(defendingIndex,1)
        }


        $scope.$apply()


    }
    ////////////////////////////////////////////////////////////////////////////////


    ////////////  CREATURE ATTACKS PLAYER  ///////////////////
    function attackPlayer(event, ui){
        $('#attack')[0].load()
        $('#attack')[0].play()
        console.log('attack player')
        var attackingElem=ui.draggable[0];
        var defendingElem=$(this)[0];
        var parent=attackingElem.parentNode.parentNode.nodeName
        var attackingCard; var attacker; var defender;
        var attackingIndex;

        // Determine who is attacking who
        if(parent=='PLAYER1'){attacker=p1;defender=p2}
        if(parent=='PLAYER2'){attacker=p2;defender=p1};

        // Find which card is attacking
        for(var i=0;i<attacker.inPlay.length;i++){
            if(attacker.inPlay[i].id==attackingElem.id){
                attackingCard = attacker.inPlay[i];
                attackingIndex = i;
                break;
            }
        }
        var attackingCardAttack=attackingCard.card.attack

        console.log("Attacking card | attack: "+attackingCardAttack)
        console.log("Target player health: "+defender.health)


        if(parent=='PLAYER1'){
            $scope.theGame.player2.health-=attackingCardAttack;
            if($scope.theGame.player2.health <=0)gameOver('Player1 Wins!')
        }
        if(parent=='PLAYER2'){
            $scope.theGame.player1.health-=attackingCardAttack;
            if($scope.theGame.player1.health <=0)gameOver('Player2 Wins!')
        }



        $scope.$apply()
    }
    ////////////////////////////////////////////////////////////////////////////////
    function gameOver(x){
        $('#playerDie')[0].load()
        $('#playerDie')[0].play()
        $('message').css('display','block')
        $('txt').text(x)
    }


    $scope.manaDisplay =function(player){
        if(player=="p1")p=p1
        if(player=="p2")p=p2
        return (p.mana.total-p.mana.spent)+"/"+ p.mana.total;
    }
    
    
    
}])


