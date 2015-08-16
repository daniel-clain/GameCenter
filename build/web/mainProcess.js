/*

Get into game
V
    Main Screen
        - Make Deck
        - Que for game
            : get 2 most recently qued players and make them start a game
        - Invite an online player into a game
            : 2nd player get popup invite if that player picks yes start game
            
    Start Game
        - shuffle decks
        - determine who goes first
        - start turns
        V
            
            Turns
                - set to active players turn
                - disable inactive player
                - reset mana
                - draw card
                ~ if player plays card do update
                ~ if card attacks do update
                ~ if player presses end turn do turn for other player
                ~ if players health is 0 or below do end game
                
            End Game
                - display winner/loser message
                - continue button to main screen
                - invite opponent to a rematch
                
                */