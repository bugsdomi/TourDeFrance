const express = require('express');
const SocketIo = require('socket.io');
const PlayersServer = require('./PlayersServerSide');

// -------------------------------------------------------------------------
// Initilisations des variables, structures, constantes...
// -------------------------------------------------------------------------
let vPlayersServer = new PlayersServer();   // Instanciation de l'objet descrivant l'ensemble des joueurs et les méthodes de gestion de ces joueurs
let vNbrConnectionsAlive=0;                 // Nombre total de connexions en cours sur ce serveur     !!! ATTENTION !!! Il ne's'agit pas encore de joueurs valides , juste de connexions
let vGameStarted = false;                   // Indicateur de lancement de la partie
let refreshElapsedTimeInterval = undefined;        // Variable du SetInterval pour pouvoir le stopper proprement

// -------------------------------------------------------------------------
// Verification de l'accessibilité de la base - Je ne le fais qu'au debut du jeu, 
// mais en tout état de cause, normalement, professionnellement, je devrais 
// m'assurer qu'elle est toujours accessible en cours de partie, mais dans le 
// contexte ultra-limité de cet atelier, ce n'est pas nécessaire
// Si elle ne fonctionne pas, je sors du jeu, après avoir envoyé un message à la console
// -------------------------------------------------------------------------
vPlayersServer.checkDBConnect();
// -------------------------------------------------------------------------
// Création de l'application ExpressJS
// Création des routes ExppressJS, car je vais utiliser cet outil pour transferer
// au client la page HTML et tout ce qui lui est nécessaire pour s'afficher et gérer
// l'affichage
// -------------------------------------------------------------------------
const app = express();
app.set('view engine', 'pug');
app.use('/static', express.static(__dirname + '/public'));
app.get('/', function(req, res){
    res.render('index');    
});
// -------------------------------------------------------------------------
// Création du serveur et lancement du listener
// -------------------------------------------------------------------------
const server = app.listen(process.env.PORT || 3000, function() {
    const addressHote = server.address().address;
    const portEcoute = server.address().port
    console.log('Écoute du serveur http://%s:%s',addressHote,portEcoute);
});
// ------------------------------------------------------------
// Fin de la partie HTTP - Début de la partie WebSocket avec "Socket.io"
// ------------------------------------------------------------

// -------------------------------------------------------------------------
// Création de la liaison socket.io sur la base du serveur HTTP déja déclaré précédement
// -------------------------------------------------------------------------
let socketIo = new SocketIo(server);

socketIo.on('connection', function(webSocketConnection){                        // Une connexion au serveur vient d être faite
    let vCurrentPlayerInSession=-1;                                             // No de joueur courant validé dans la partie
    vNbrConnectionsAlive++;                                                     // Nombre de connexions (pas forcément des joueurs dans une partie)
    webSocketConnection.on('askPlayersList',function(){
        vPlayersServer.askPlayersList(socketIo, webSocketConnection.id);
    });
    webSocketConnection.emit('callLoginForm');                                             // Demande au client d'afficher le formulaire de saisie du login
    webSocketConnection.on('playerLoginData',function(playerLoginData){                    // Réception des infos de Login du futur joueur envoyées par le client
        if (!vPlayersServer.playerAlreadyInParty(playerLoginData, webSocketConnection)){   // Vérification que le joueur n'est pas déjà dans la partie dans une autre session
            if (!vPlayersServer.partyFull(webSocketConnection)){                           // Vérification de place encore disponible dans la partie
                if (!vPlayersServer.partyStarted(webSocketConnection, vGameStarted)){      // Vérification que la partie n'a pas déja commencé
                    if (vPlayersServer.selectSlotInParty(playerLoginData)){                // Recherche et selection du 1er slot libre dans la partie
                        vCurrentPlayerInSession = vPlayersServer.currentPlayer;            // Le candidat-joueur passe au statut de joueur courant validé
                        console.log('--------------------------------------------------------------------------------------------------------------------')
                        console.log('Connection : Nombre de connectés : ', vNbrConnectionsAlive,'--- Nombre de joueurs en jeu : ',vPlayersServer.NbrPlayersInParty,'--- N° du joueur dans la partie : ',vCurrentPlayerInSession);
                        
                        // Alimentation de la structure de data coté serveur recensant les données de tous les joueurs admis :
                        //  Stockage de l'Id du WebSocket pour communiquer individuellement
                        vPlayersServer.objectPlayer['player'+vCurrentPlayerInSession].webSocketID = webSocketConnection.id; 
                        
                        // Génère le jeu du joueur et le transmet au client et à tous les joueurs déjà connectés dans la partie
                        vPlayersServer.genPlayerDeck(vCurrentPlayerInSession, webSocketConnection, socketIo);   
                        if (!vGameStarted){                                                              // Si la partie n'est pas déjà lancée
                            vPlayersServer.searchMasterOfGame(socketIo);
                        }

                        webSocketConnection.on('adviseStartGame',function(){
                            vPlayersServer.adviseStartGame(socketIo);
                        });

                        webSocketConnection.on('startGame',function(){
                            if (vCurrentPlayerInSession === vPlayersServer.numPlayerMasterOfGame){             // Seule la session appartenant au maitre du jeu peut activer la partie
                                vGameStarted = true;
                                vPlayersServer.elapsedTime = 0;
                                refreshElapsedTimeInterval = setInterval(function(){
                                    vPlayersServer.addOneSecond(socketIo)},1000);
                                vPlayersServer.startGame(socketIo);
                            }
                        });

                        webSocketConnection.on('broadcastTokenCoord',function(pMyToken){
                            vPlayersServer.broadcastTokenCoord(pMyToken, socketIo);
                        });

                        webSocketConnection.on('broadcastNextPilsToEat',function(pMyPils){
                            vPlayersServer.broadcastNextPilsToEat(pMyPils, socketIo);
                        });

                        webSocketConnection.on('broadcastEatedPils',function(pMyPils){
                            vPlayersServer.broadcastEatedPils(pMyPils, socketIo);
                        });

                        webSocketConnection.on('broadcastTotalTime',function(vMyTotalTime){
                            vPlayersServer.broadcastTotalTime(vMyTotalTime, socketIo);
                        });

                        webSocketConnection.on('stopGame',function(pMyClient){
                            clearInterval(refreshElapsedTimeInterval);              // Arrêt du chrono
                            vPlayersServer.stopGame(pMyClient, socketIo);
                        });

                        webSocketConnection.on('sendPartyData',function(pMyClient){
                            vPlayersServer.recordPartyData(pMyClient);
                        });
                    } //    selectSlotInParty
                } //    partyStarted
            } //    partyFull
        }  //    playerAlreadyInParty
    }); //  playerLoginData
                        
    webSocketConnection.on('disconnect', function() {
        if (vCurrentPlayerInSession > -1){                                              // S'il s'agit d'un joueur qui était connecté dans une partie
            vPlayersServer.deletePlayerDeck(vCurrentPlayerInSession, socketIo);               // Efface le jeu du joueur et le transmet au client et à tous les joueurs déjà connectés
            vPlayersServer.razPlayerData('player'+vCurrentPlayerInSession);

            vPlayersServer.currentPlayer=-1;                                                  // Ré-initialisation du joueur courant
            vPlayersServer.NbrPlayersInParty--;                                               // Décrémentation du nombre de joueurs dans la partie
            vPlayersServer.isItMe = false;                                                    // Flag permettant de savoir si le joueur courant qui va être communiqué aux clients est moi 

            if (vPlayersServer.NbrPlayersInParty === 0){                                      // S'il n'y a plus de joueurs encore dans la partie, la partie s'arrête
                clearInterval(refreshElapsedTimeInterval);
                vGameStarted = false;
            }

            if (!vGameStarted){                                                                    // Si la partie n'est pas déjà lancée
                if (vCurrentPlayerInSession === vPlayersServer.numPlayerMasterOfGame){             // Si le joueur qui quitte la partie est le Maître du jeu...
                        vPlayersServer.numPlayerMasterOfGame = -1;
                        vPlayersServer.searchMasterOfGame(socketIo);                               // ... on désigne le joueur suivant comme Maître du jeu
                    }
            }
        }
        vCurrentPlayerInSession = -1
        vNbrConnectionsAlive--;
            
        console.log('disconnect après : Nombre de connectés : ', vNbrConnectionsAlive,'--- Nombre de joueurs en jeu : ',vPlayersServer.NbrPlayersInParty,'--- N° du joueur de la session en cours de deconnexion : ',vCurrentPlayerInSession);
        console.log('=================================================================================================================');
    });
});