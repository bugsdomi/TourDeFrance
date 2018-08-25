// *************************************************************************
// ***      PlayersServer : Objet représentant les joueurs-candidats et ceux   ***
// ***                admis dans la partie                               ***
// ***                                                                   ***
// *** Objet : PlayersServer                                                   ***
// ***                                                                   ***
// *** Cet objet sert à gérer :                                          ***
// ***   - Le filtrage des candidats qui aspirent à jouer                ***
// ***   - La structure principale des données d'échange avec les clients***
// ***                                                                   ***
// ***  Nécessite :                                                      ***
// ***      Le module "dbMgr"                                            ***
// ***      Une variable pour son instanciation                          ***
// ***                                                                   ***
// *************************************************************************
// -------------------------------------------------------------------------
// stockage des informations techniques des joueurs et des  coordonnées de leurs 
// pilules qui vont être générées pour le player
// 4 joueurs maximum - 50 pilules pour chacun 
// -------------------------------------------------------------------------
const DBMgr = require('./dbMgr');
let vDBMgr = new DBMgr();       // Instanciation de l'objet descrivant l'ensemble des joueurs et les méthodes de gestion de ces joueurs

const Pils = require('./pils');



module.exports = function PlayersServer(){        // Fonction constructeur exportée
    this.NbrPlayersInParty = 0;             // Nombre de joueurs en jeu, c.a.d. de candidats-joueurs validés et acceptés dans la partie (0) ==> Aucun joueur en jeu
    this.currentPlayer = -1;                // Joueur en cours d'admission dans la partie 
    this.isItMe = false;                    // Flag permetant de savoir si le joueur courant qui va être communiqué aux clients est moi ou non
    this.numPlayerMasterOfGame = -1;        // Détermine si ce joueur sera la maître de la partie, c.a.d., celui qui declenche le jeu
    this.maxPilsByPlayer = 5;              // Nombre de pilules par joueurs
    this.maxPlayers = 4;                    // Nombre maximum de joueurs
    this.objectPlayer =
        {   
            player0 :
            {
                webSocketID : null,                                 // Identifiant interne du WebSocket qui va servir pour les Msg envoyé à un client individuel
                pseudo : '',                                        // Pseudo du joueur dans la partie
                couleur : 'blue',                                   // Couleur dominante du joueur
                fichier : "static/images/pil-blue-white-1.png",     // Image des pilules associées au joueur
                avatar : "static/images/Armstrong.png",             // Avatar du joueur
                pils: {},                                           // Jeu de pilules affectées au joueur            
            },
            player1 :
            {
                webSocketID : null,
                pseudo : '',
                couleur : 'red',
                fichier : "static/images/pil-red-white-1.png",
                avatar : "static/images/Virenque.png",                           
                pils: {},
            },
            player2 : 
            {
                webSocketID : null,
                pseudo : '',
                couleur : 'yellow',
                fichier : "static/images/pil-yellow-white-1.png",
                avatar : "static/images/Jalabert.png",                           
                pils: {},
            },
            player3 : 
            {
                webSocketID : null,
                pseudo : '',
                couleur : 'green',
                fichier : "static/images/pil-green-white-1.png",
                avatar : "static/images/Contador.png",                           
                pils: {},
            }
            // cyan, green, orange, redBlack, red, violet, black, white, yellow             // peut-être pour un futur usage
        }
    // -------------------------------------------------------------------------
    // A la détection de la connexion,on initialise la partie player sur le client :
    // - Vérification du nombre de joueurs (Ok, si <= 4)
    // - Login
    //      |_ Affichage du formulaire de saisie du login
    //      |_ Attente du login
    //      |_ Vérification de la validité du login
    //      |_ calcul des positions des pilules du player
    //      |_ Generation des surfaces de jeu sur le client
    //          |_ Fond d'écran
    //          |_ Control-panel
    //          |_ Cartes des joueurs
    //          |_ Jeton du joueur (capturé par la souris)

    // ------------------------------------------------------------
    // Initialisation des targets - Les targets representent des pilules 
    // de produits dopants que les cyclistes doivent s'approprier
    // avant que les autres joueurs aient mangé les leurs
    // Génération du Deck de pilules de la bonne couleur (Position, 
    // orientation, statut, z-index) pour le joueur courant (celui 
    // qui vient de se connecter avec succès et admis a jouer)
    // ------------------------------------------------------------
    PlayersServer.prototype.initPilsDeck = function(pCurrentPlayer,pDataScreenSize){
        for (let i=0; i < this.maxPilsByPlayer; i++){
            let pils = new Pils()
            pils.initVar(pDataScreenSize);                              // Création de chaque pilule individuelle pour le player 
            this.objectPlayer['player'+pCurrentPlayer].pils[i] = pils;  // On ajoute la pilule qu'on vient de créer dans la liste des pilules du Player
            delete pils;
        };
    }
    // ------------------------------------------------------------
    // Ajout des données du joueur (Pseudo, score, TimeStamp
    // (au format brut) dans la BDD
    // ------------------------------------------------------------
    PlayersServer.prototype.addPlayerInDatabase = function(pPlayerLoginData){
        let playerRecord = 
        {
            pseudo: pPlayerLoginData.pseudo,
            score : 0,
            timestamp : (new Date()).getTime(),
        }
        vDBMgr.playerCollection.insert(playerRecord);
    }
    // ------------------------------------------------------------
    // Vérification des données du joueur (Pseudo) :
    // - Soit il existe
    // - Soit il n'existe pas dans la DB, auquel cas, on le crée
    // ------------------------------------------------------------
    PlayersServer.prototype.reachPlayerInDatabase = function(pPlayerLoginData){
        vDBMgr.playerCollection.find(                                          // Recherche du profil du joueur
        {
            pseudo: pPlayerLoginData.pseudo,
        }
        ).toArray((error, documents) => {
            if (error) {
                console.log('Erreur d\'accès à la collection',error);
                return false;
            } else {
                if (!documents.length){
                    this.addPlayerInDatabase(pPlayerLoginData);                 // Si le profil du joueur n'a pas été trouvé (pas de documents), on l'ajoute à la BDD
                }
            }
        });
        return true
    }
    // ------------------------------------------------------------
    // Vérification des données du joueur (Pseudo) :
    // - Soit il existe dans la BDD
    // - Soit il n'existe pas dans la BDD, auquel cas, on le crée
    // ------------------------------------------------------------
    PlayersServer.prototype.playerAlreadyInParty = function(pPlayerLoginData, pWebSocketConnection){
        let i=-1;   
        let found  = false;
        while (!found && (i < this.maxPlayers-1)){
            i++;
            if (this.objectPlayer['player'+i].pseudo === pPlayerLoginData.pseudo){              // Il y a déjà le même Pseudo dans le jeu
                pWebSocketConnection.emit('playerAlreadyInGame');                               // Demande au client d'afficher le message d'avertissement approrprié
                found =  true;
            }
        }
        return found;
    }
    // ------------------------------------------------------------
    // Recherche de la 1ere place dispo dans la partie
    // S'il y en a une, ce qui est normalement le cas à ce stade, 
    // on lui affecte l'indice de ce slot libre
    // ------------------------------------------------------------
    PlayersServer.prototype.partyFull = function(pWebSocketConnection){
        if (this.NbrPlayersInParty === this.maxPlayers){  
            pWebSocketConnection.emit('alertPartyFull');         // Si la partie est pleine (> à maxPlayers), on rejette le joueur
            return true         
        } else {
            return false                                         // S'il y a encore de la place dans la partie, on continue le process d'acceptation du joueur
        }
    }
    // ------------------------------------------------------------
    // Recherche de la 1ere place dispo dans la partie
    // S'il y en a une, ce qui est normalement le cas à ce stade, 
    // on lui affecte l'indice de ce slot libre
    // ------------------------------------------------------------
    PlayersServer.prototype.selectSlotInParty = function(pPlayerLoginData){
        let i=-1;   
        let found = false;
        while (!found && (i<this.maxPlayers-1)){
            i++;
            if (!this.objectPlayer['player'+i].pseudo.length){
                this.objectPlayer['player'+i].pseudo = pPlayerLoginData.pseudo;
                this.currentPlayer = i;
                this.NbrPlayersInParty++;
                found=true;
            }
        }
        return found;
    }
    // ------------------------------------------------------------
    // Nous avons tout ce qu'il faut pour que le client affiche la 
    // surface de jeu et le deck des pilules du nouveau joueur
    // Donc, demande à chaque client des joueurs déjà admis dans la partie 
    // d'afficher le deck du joueur qui vient d'être admis à jouer
    // ------------------------------------------------------------
    PlayersServer.prototype.sendDataPlayerToClient = function(pWebSocketConnection, pSocketIo){

        pWebSocketConnection.emit('drawGameBackground');            // Affichage du plateau de jeu, de la barre des scores, et des joueurs
        
        for (let i=0; i <= this.maxPlayers-1; i++){
            if (this.objectPlayer['player'+i].pseudo.length){       // Pour chaque joueur UNIQUEMENT DANS la partie (dont moi) (et non ceux qui sont simplement connectés) ...
                if (i === this.currentPlayer){
                    this.isItMe = true;                             // Set du flag qui indique que la session en cours est la mienne, et servira de reference pour chaque client
                } else {
                    this.isItMe = false;
                }
                pSocketIo.to(this.objectPlayer['player'+i].webSocketID).emit('drawPils',this);     // ... Envoi à son client d'un message individuel pour afficher mes pilules
                
                let saveCurrentPlayer = this.currentPlayer;
                if (i !== saveCurrentPlayer){                        // Je ne reafiiche pas sur mon propre client mes pils car elles sont déjà affichées
                    this.currentPlayer = i;  
                    this.isItMe = false;
                    pWebSocketConnection.emit('drawPils',this);      // Affichage sur mon client des pils de tous les autres joueurs déjà dans la partie      
                }
                this.currentPlayer = saveCurrentPlayer;
            }
        }
    }
    // ------------------------------------------------------------
    // Génère l'ensemble des pilules (le deck de pils) du joueur et 
    // les envoie à tous les joueurs déjà dans la partie
    // ------------------------------------------------------------
    PlayersServer.prototype.genPlayerDeck = function(pCurrentPlayerInSession, pWebSocketConnection, pSocketIo){
        let vDataScreenSize;
        pWebSocketConnection.emit('askScreenSize');             // Demande la taille d'écran du client pour pouvoir calculer la positions des Pils de façon                                                                                 adaptée
        pWebSocketConnection.on('receiveScreenSize',vDataScreenSize =>{
            this.initPilsDeck(pCurrentPlayerInSession, vDataScreenSize);        // Génération du deck de pilules (position, couleur, orientation)
            this.sendDataPlayerToClient(pWebSocketConnection, pSocketIo);       // Envoi du deck à tous les clients dejà en jeu
        });
    }
    // -------------------------------------------------------------------------
    // Demande à tous les joueurs dans la partie d'effacer les pils du joueur 
    // qui vient de se déconnecter
    // -------------------------------------------------------------------------
    PlayersServer.prototype.deletePlayerDeck = function(pCurrentPlayerInSession, pSocketIo){
        for (let i=0; i <= this.maxPlayers-1; i++){
            if (this.objectPlayer['player'+i].pseudo.length){       // Pour chaque joueur UNIQUEMENT DANS la partie (et non ceux qui sont simplement connectés)            
                let saveCurrentPlayer = this.currentPlayer;
                if (i !== pCurrentPlayerInSession){                 // On évite au client d'un autre joueur d'effacer ses propres Pils
                    this.currentPlayer = pCurrentPlayerInSession;   // On indique au client d'un autre joueur, le N° de joueur dont il faut effacer les Pils                      
                    pSocketIo.to(this.objectPlayer['player'+i].webSocketID).emit('erasePils',this);     // Envoi à chaque client d'un message individuel pour effacer mes pilules
                }
                this.currentPlayer = saveCurrentPlayer;
            }
        }
    }
    // -------------------------------------------------------------------------
    // Vérification que la partie à laquelle le joueur vet se connecter
    // n'a pas déjà débuté
    // -------------------------------------------------------------------------
    PlayersServer.prototype.partyStarted = function(pWebSocketConnection, pGameStarted){
        if (pGameStarted){
            pWebSocketConnection.emit('partyAlreadyStarted');         // Si la partie est pleine (> à maxPlayers), on rejette le joueur
            return true;
        } else {
            return false;
        }
    }
    // -------------------------------------------------------------------------
    // Recherche du Maître de jeu --> C'est le joueur correspondant au 1er slot 
    // occupé qui est désigné et affichage du bouton de lancement uniquement sur 
    // son ecran
    // -------------------------------------------------------------------------
    PlayersServer.prototype.searchMasterOfGame = function(pSocketIo){
        if (this.numPlayerMasterOfGame === -1){                         // Si le Maître de jeu n'a pas encore été désigné
            let i=-1;   
            let found  = false;
            while (!found && (i<this.maxPlayers-1)){
                i++;
                if (this.objectPlayer['player'+i].pseudo.length){
                    this.numPlayerMasterOfGame = i;

                    // Envoi au client adequat d'un message individuel pour lui signaler son état de "Maître du jeu"
                    pSocketIo.to(this.objectPlayer['player'+i].webSocketID).emit('masterOfGame',('player'+i));     
                    found = true;
                }
            }
        }
    }
    // -------------------------------------------------------------------------
    // Le Maître du jeu a lancé la partie
    // Le serveur envoie l'ordre à tous les joueurs d'aller capturer leur jeton 
    // et de commencer la collecte des Pils
    // -------------------------------------------------------------------------
    PlayersServer.prototype.startGame = function(pMyClientPlayer, pSocketIo){
        console.log('Partie démarrée par',this.objectPlayer[pMyClientPlayer].pseudo);

        for (let i=0; i <= this.maxPlayers-1; i++){
            if (this.objectPlayer['player'+i].pseudo.length){               // Pour chaque joueur UNIQUEMENT DANS la partie (et non ceux qui sont simplement connectés)
                pSocketIo.to(this.objectPlayer['player'+i].webSocketID).emit('playAndEatPils');     // Envoi à chaque client d'un message individuel pour effacer mes pilules
            }
        }
    }
    // -------------------------------------------------------------------------
    // La partie est terminée, un vainqueur a été désigné
    // Le serveur envoie la ntification de défaite à tous les joueurs 
    // -------------------------------------------------------------------------
        PlayersServer.prototype.stopGame = function(pMyClient, pSocketIo){
        console.log('Partie gagnée par',this.objectPlayer[pMyClient.monClientPlayer].pseudo);

        this.numPlayerMasterOfGame = -1;
        for (let i=0; i <= this.maxPlayers-1; i++){
            if (this.objectPlayer['player'+i].pseudo.length){               // Pour chaque joueur UNIQUEMENT DANS la partie (et non ceux qui sont simplement connectés)
                if (i !== pMyClient.monNumPlayer){                          // Je n affiche pas le message de defaite sur mon propre écran puisque j'ai gagné
                    pSocketIo.to(this.objectPlayer['player'+i].webSocketID).emit('youLoose');     // Envoi à chaque client d'un message pour leur notifier la défaite
                }
            }
        }
    }
    // -------------------------------------------------------------------------
    // Actualise la position du token du joueur sur les autres clients
    // -------------------------------------------------------------------------
    PlayersServer.prototype.broadcastTokenCoord = function(pMyToken, pSocketIo){
        for (let i=0; i <= this.maxPlayers-1; i++){
            if (this.objectPlayer['player'+i].pseudo.length){               // Pour chaque joueur UNIQUEMENT DANS la partie (et non ceux qui sont simplement connectés)            
                if (i !== pMyToken.monNumPlayer){                           // Je ne reaffiche pas sur mon propre client mon token
                    pSocketIo.to(this.objectPlayer['player'+i].webSocketID).emit('refreshToken',pMyToken);     // Envoi à chaque joueur la nouvelle position du token
                }
            }
        }
    }
    // -------------------------------------------------------------------------
    // Actualise et met en évidence la nouvelle Pils cible sur les autres clients
    // -------------------------------------------------------------------------
    PlayersServer.prototype.broadcastNextPilsToEat = function(pMyPils, pSocketIo){
        for (let i=0; i <= this.maxPlayers-1; i++){
            if (this.objectPlayer['player'+i].pseudo.length){               // Pour chaque joueur UNIQUEMENT DANS la partie (et non ceux qui sont simplement connectés)            
                if (i !== pMyPils.monNumPlayer){                            // Je ne reaffiche pas sur mon propre client ma prochaine Pils à manger
                    pSocketIo.to(this.objectPlayer['player'+i].webSocketID).emit('showNextPilsToEat',pMyPils);     // Envoi à chaque joueur la nouvelle Pils a manger
                }
            }
        }
    }
    // -------------------------------------------------------------------------
    // Actualise et met en évidence la nouvelle Pils cible sur les autres clients
    // -------------------------------------------------------------------------
    PlayersServer.prototype.broadcastEatedPils = function(pMyPils, pSocketIo){
        for (let i=0; i <= this.maxPlayers-1; i++){
            if (this.objectPlayer['player'+i].pseudo.length){               // Pour chaque joueur UNIQUEMENT DANS la partie (et non ceux qui sont simplement connectés)            
                // if (i !== pMyPils.monNumPlayer){                            // Je ne reaffiche pas sur mon propre Pils quia été mangée
                    pSocketIo.to(this.objectPlayer['player'+i].webSocketID).emit('hideEatedPils',pMyPils);     // Envoi à chaque joueur de la disparition de la derniere Pils mangée
                // }
            }
        }
    }
    // -------------------------------------------------------------------------
    // Verification de l'accessibilité de la base - Je ne le fais qu'au debut du jeu, 
    // mais en tout état de cause, normalement, professionnellement, je devrais 
    // m'assurer qu'elle est toujours accessible en cours de partie, mais dans le 
    // contexte ultra-limité de cet atelier, ce n'est pas nécessaire
    // Si elle ne fonctionne pas, je sors du jeu, après avoir envoyé un message à la console
    // -------------------------------------------------------------------------
    PlayersServer.prototype.checkDBConnect = function(){
        vDBMgr.checkDBConnect();
    }
}