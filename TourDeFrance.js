const express = require('express');
const SocketIo = require('socket.io');
const PlayersServer = require('./PlayersServerSide');

// -------------------------------------------------------------------------
// Initilisations des variables, structures, constantes...
// -------------------------------------------------------------------------
let vPlayersServer = new PlayersServer();   // Instanciation de l'objet descrivant l'ensemble des joueurs et les méthodes de gestion de ces joueurs
let vNbrConnectionsAlive=0;                 // Nombre total de connexions en cours sur ce serveur     !!! ATTENTION !!! Il ne's'agit pas encore de joueurs valides , juste de connexions
let vGameStarted = false;                   // Indicateur de lancement de la partie

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
const server = app.listen(3000, function() {
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
console.log('--------------------------------------------------------------------------------------------------------------------')
console.log('Connection  Avant : Nombre de connectés : ', vNbrConnectionsAlive,'--- Nombre de joueurs en jeu : ',vPlayersServer.NbrPlayersInParty,'--- N° du joueur dans la partie : ',vCurrentPlayerInSession);

    webSocketConnection.emit('callLoginForm');                                           // Demande au client d'afficher le formulaire de saisie du login
    webSocketConnection.on('playerLoginData',function(playerLoginData){                  // Réception des infos de Login du futur joueur envoyées par le client
        if (vPlayersServer.reachPlayerInDatabase(playerLoginData)){                            // Recherche du joueur dans la base et éventuellement ajout de celui-ci
            if (!vPlayersServer.playerAlreadyInParty(playerLoginData, webSocketConnection)){   // Vérification que le joueur n'est pas déjà dans la partie dans une autre session
                if (!vPlayersServer.partyFull(webSocketConnection)){                           // Vérification de place encore disponible dans la partie
                    if (!vPlayersServer.partyStarted(webSocketConnection, vGameStarted)){      // Vérification que la partie n'a pas déja commencé
                        if (vPlayersServer.selectSlotInParty(playerLoginData)){                // Recherche et selection du 1er slot libre dans la partie
                            vCurrentPlayerInSession = vPlayersServer.currentPlayer;            // Le candidat-joueur passe au statut de joueur courant validé
                            console.log('Connection  Après : Nombre de connectés : ', vNbrConnectionsAlive,'--- Nombre de joueurs en jeu : ',vPlayersServer.NbrPlayersInParty,'--- N° du joueur dans la partie : ',vCurrentPlayerInSession);
                            console.log('********************************************************************************************************************')
                            
                            // Alimentation de la structure de data coté serveur recensant les données de tous les joueurs admis :
                            //  Stockage de l'Id du WebSocket pour communiquer individuellement
                            vPlayersServer.objectPlayer['player'+vCurrentPlayerInSession].webSocketID = webSocketConnection.id; 
                            
                            // Génère le jeu du joueur et le transmet au client et à tous les joueurs déjà connectés dans la partie
                            vPlayersServer.genPlayerDeck(vCurrentPlayerInSession, webSocketConnection, socketIo);   
                            if (!vGameStarted){                                                              // Si la partie n'est pas déjà lancée
                                vPlayersServer.searchMasterOfGame(socketIo);
                            }
                            webSocketConnection.on('startGame',function(pMyPlayer){
                                vGameStarted = true;
                                vPlayersServer.startGame(pMyPlayer,socketIo);
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
                            webSocketConnection.on('stopGame',function(pMyClient){
                                vPlayersServer.stopGame(pMyClient,socketIo);
                            });
                        } //    selectSlotInParty
                    } //    partyStarted
                } //    partyFull
            }  //    playerAlreadyInParty
        }; //   reachPlayerInDatabase
    }); //  playerLoginData
    
    
                
    webSocketConnection.on('disconnect', function() {
console.log('disconnect avant : Nombre de connectés : ', vNbrConnectionsAlive,'--- Nombre de joueurs en jeu : ',vPlayersServer.NbrPlayersInParty,'--- N° du joueur de la session en cours de deconnexion : ',vCurrentPlayerInSession);
console.log('000 Je me déconnecte : ',vCurrentPlayerInSession)
        if (vCurrentPlayerInSession > -1){                                              // S'il s'agit d'un joueur qui était connecté dans une partie
console.log('001 Je me déconnecte : ',vCurrentPlayerInSession)
console.log('disconnect Efface joueur Avant - vPlayersServer.objectPlayer["player"+vCurrentPlayerInSession].pseudo : ',vPlayersServer.objectPlayer['player'+vCurrentPlayerInSession].pseudo,' --- vPlayersServer.currentPlayer : ',vPlayersServer.currentPlayer);
            vPlayersServer.deletePlayerDeck(vCurrentPlayerInSession, socketIo);               // Efface le jeu du joueur et le transmet au client et à tous les joueurs déjà connectés
            vPlayersServer.objectPlayer['player'+vCurrentPlayerInSession].pseudo = '';
            vPlayersServer.objectPlayer['player'+vCurrentPlayerInSession].pils = {};
            vPlayersServer.objectPlayer['player'+vCurrentPlayerInSession].webSocketID = null; // On supprime l'id de connection stocké dans l'objet joueurs
            vPlayersServer.currentPlayer=-1;                                                  // Ré-initialisation du joueur courant
            vPlayersServer.NbrPlayersInParty--;                                               // Décrémentation du nombre de joueurs dans la partie

            if (vPlayersServer.NbrPlayersInParty === 0){                                      // S'il n'y a plus de joueurs encore dans la partie, la partie s'arrête
                vGameStarted = false;
            }
console.log('disconnect Efface joueur Après - vPlayersServer.objectPlayer["player"+vCurrentPlayerInSession].pseudo : ',vPlayersServer.objectPlayer['player'+vCurrentPlayerInSession].pseudo,' --- vPlayersServer.currentPlayer : ',vPlayersServer.currentPlayer);        

        if (!vGameStarted){                                                              // Si la partie n'est pas déjà lancée
            if (vCurrentPlayerInSession === vPlayersServer.numPlayerMasterOfGame){             // Si le joueur qui quitte la partie est le Maître du jeu...
                    vPlayersServer.numPlayerMasterOfGame = -1;
console.log('Changement de maitre de jeu - AncienMaitredeJeu : ',vCurrentPlayerInSession,'--- vPlayersServer.numPlayerMasterOfGame : ',vPlayersServer.numPlayerMasterOfGame);
                    vPlayersServer.searchMasterOfGame(socketIo);                               // ... on désigne le joueur suivant comme Maître du jeu
console.log('Changement de maitre de jeu - NouveauMaitredeJeu : ',vPlayersServer.numPlayerMasterOfGame);
                }
            }
        }
        vCurrentPlayerInSession = -1
        vNbrConnectionsAlive--;
            
console.log('disconnect après : Nombre de connectés : ', vNbrConnectionsAlive,'--- Nombre de joueurs en jeu : ',vPlayersServer.NbrPlayersInParty,'--- N° du joueur de la session en cours de deconnexion : ',vCurrentPlayerInSession);
console.log('=================================================================================================================');
    });


});








    // let square = 
    // {
        //     top: '0px',
        //     left: '0px',
        //     id: Math.round(Math.random() * 10000) + (new Date()).getTime() + '-carre',
        //     backgroundColor: '#' + Math.floor(Math.random()*16777215).toString(16)
        // };
        
        // // Que faire en cas de réception des coordonnées de la souris.
        // webSocketConnection.on('mouseCoordinates', function (mouse) {
            
            //     // Ici on peut utiliser l'objet squares pour determiner sur le mouvement est permis ou pas.
            
            //     square.top = (mouse.top - (parseFloat(square.top) / 2)) + 'px';
            //     square.left = (mouse.left - (parseFloat(square.left) / 2)) + 'px';
            
            //     // Envoi à tous les client d'une demande de mise à jour du carré
            //     socketIo.emit('drawSquare', square);
            // });
            
            // // La déconnexion on envoie l'objet contenant les méta données du carré au front-end pour qu'il soit supprimé.
            // webSocketConnection.on('disconnect', function(){
                //     // On supprime le carré stocké dans l'objet squares
                //     delete squares[square.id];
                //     // On envoie les méta données du carré au front pour suppression du DOM
                //     socketIo.emit('removeSquare', square);
                // });
                // }
                // }XXXX







/**
* Partie Websocket du serveur
*/
// var checkDBConnect = function(){
//     mongoDB.MongoClient.connect('mongodb://localhost:27017/TourDeFrance', function(error, client) {
//         if (!error){
//     console.log('2 ajoutHTML : ',ajoutHTML);
//     let PlayersServer = client.db('TourDeFrance').collection('PlayersServer');
//     PlayersServer.find({}).toArray(function(error, documents){
//         documents.forEach(function(objetMessage){
//                     ajoutHTML = '<p><strong>' + objetMessage.username + '</strong>:</p><p><i>' + objetMessage.message + ' </i></p>' + ajoutHTML;
//             });
//             // ajoutHTML contient un texte en HTML à ajouter à exemple3.html
//             let responseBodyToHTMLString = responseBody.toString('utf8');
// console.log('3 ajoutHTML : ',ajoutHTML);
//                 responseBodyToHTMLString = responseBodyToHTMLString.replace('<div id="PlayersServer"></div>', '<div id="PlayersServer">' + ajoutHTML + '</div>');
//                 responseBody = new Buffer(responseBodyToHTMLString);

//                 response.writeHead(statusCode, {
//                     'Content-Length': responseBody.length,
//                     'Content-Type': 'text/html;charset=utf-8'
//                 });
//                 response.write(responseBody, function(){
//                     response.end();
//                 });
//             })
//             return true;
//         } else {
//             console.log('Erreur BDD');
//             return false;
//         }
//     });
// }





// serveurWeb.on('request', function(requeteHttp, reponseHttp) {
//     // console.log(requeteHttp.headers);
  
//     console.log('Requête reçue :');
//     console.log(requeteHttp.url);
  
//     // __dirname
//     // process.cwd()
  
//     let fichier = path.normalize(process.cwd() + requeteHttp.url);
  
//     let documentHTML = '';
//     let codeResponse = 200;
//     // let contentType = 'text/html';
  
//     var extension = fichier.split('.');
//     extension = extension[extension.length - 1];
  
//     console.log('extension :', extension);
  
//     const getMediaType = function(extension) {
//       const mediaTypes = {
//         jpg: 'image/jpeg',
//         png: 'image/png',
//         css: 'text/css',
//         js: 'text/javascript',
//         html: 'text/html'
//       }
//       const contentType = mediaTypes[extension];
//       return contentType ? contentType : 'text/html';
//     }
//     console.log('Un smiley (😄) est codé sur combien d\'octets?', Buffer.byteLength('😄', 'utf8'));
  
//     let contentType = getMediaType(extension);
  
//     /*
//     if (extension === 'jpg') {
//       contentType = 'image/jpeg';
//     }
  
//     if (extension === 'png') {
//       contentType = 'image/png';
//     }
  
//     if (extension === 'css') {
//       contentType = 'text/css';
//     }
  
//     if (extension === 'js') {
//       contentType = 'text/javascript'; // application/javascript
//     }
//   */
  
//     moduleFS.access(fichier, moduleFS.constants.R_OK, function(erreurAccess) {
  
//       if (erreurAccess) {
//         console.log('Accès impossible à :', fichier);
//         fichier = path.normalize(process.cwd() + path.sep + '404.html');
//         codeResponse = 404;
//         contentType = 'text/html';
//       }
  
//       console.log('fichier à lire :', fichier);
  
//       moduleFS.readFile(fichier, function(erreurDeLecture, contenuDuFichier) {
//         if (erreurDeLecture) {
//           console.log('Lecture impossible.');
//         } else {
//           // contenuDuFichier est un Buffer car on ne passe pas d'argument de codage. Dans ce cas readFile() retourne un Buffer.
//           reponseHttp.writeHead(codeResponse, {
//             'Content-Type': contentType,
//             'Content-Length': contenuDuFichier.length
//           });
//           reponseHttp.write(contenuDuFichier, function() {
//             reponseHttp.end();
//           });
//         }
//       });
//     });
//   });
//   serveurWeb.listen(1337);




//  Le Serveur HTTP.
//  URL : http://[adresse IP/nom de domaine]:8888/
//  Ce serveur produit une réponse HTTP contenant un document
//  HTML suite à une requête HTTP provenant d'un client HTTP.
// **/
// //chargement du module HTTP.
// const http = require('http');
// const express = require('express');
// const app = express();
// //création du serveur HTTP.
// var httpServer = http.createServer(app);
// app.set('view engine', 'pug');
// app.use('/css', express.static('css'));
// app.use('/images', express.static('images'));
// app.use('/js', express.static('js'));
// app.use('/node_modules', express.static('node_modules'));
// app.use('/semantic', express.static('semantic'));
// app.get('/', function(req, res){
//  res.render('index');
// });
// /**
//  Le Serveur WebSocket associé au serveur HTTP.
//  URL : ws://[adresse IP/nom de domaine]:8888/
//  Ce serveur accepte une requête HTTP upgrade et établit
//  une connexion persistante basée sur WebSocket.
// **/
// /**
//  On installe et on utilise le package socket.io.
//  La documentation est ici : 
//  - https://www.npmjs.com/package/socket.io
//  - https://github.com/socketio/socket.io
//  - http://socket.io/
// **/
// //var socketIO = require('socket.io');
// // On utilise utilise la fonction obtenue avec notre serveur HTTP.
// //var socketIOWebSocketServer = socketIO(httpServer);
// /**
//  Gestion de l'évènement 'connection' : correspond à la gestion
//  d'une requête WebSocket provenant d'un client WebSocket.
// **/
// //socketIOWebSocketServer.on('connection', function (socket) {
//  // socket : Est un objet qui représente la connexion WebSocket établie entre le client WebSocket et le serveur WebSocket. 
//  /**
//   On attache un gestionnaire d'évènement à un évènement personnalisé 'unEvenement'
//   qui correspond à un événement déclaré coté client qui est déclenché lorsqu'un message
//   a été reçu en provenance du client WebSocket.
//  **/
//  //socket.on('unEvenement', function (message) {
//   // Affichage du message reçu dans la console.
//   //console.log(message);
//   // Envoi d'un message au client WebSocket.
//   //socket.emit('unAutreEvenement', {texte: 'Message bien reçu !'});
//   /**
//    On déclare un évènement personnalisé 'unAutreEvenement'
//    dont la réception sera gérée coté client.
//   **/
  
//  //});
// //});
// function getRandomInt(max) {
//  return Math.floor(Math.random() * Math.floor(max));
// };
// function getShade() {
//  return Math.floor(Math.random() * 256);
// };
// function getRandomColor() {
//  return `rgb(${getShade()}, ${getShade()}, ${getShade()})`;
// };
// function movingSquare(square, mouse) {
//  if (parseFloat(square.y) > (mouse.y - parseFloat(square.height) / 2)) {
//   if(parseFloat(square.y) <= 0){
//     square.y = (parseFloat(square.y) - 0) + 'px';
//   } else {
//     square.y = (parseFloat(square.y) - 2) + 'px';
//   }
// } else {
//   if (parseFloat(square.y) < (mouse.y - parseFloat(square.height) / 2)) {
//     if(parseFloat(square.y) >= 411){
//       square.y = (parseFloat(square.y) + 0) + 'px';
//     } else {
//       square.y = (parseFloat(square.y) + 2) + 'px';
//     }
    
//   }
// }
// if (parseFloat(square.x) > (mouse.x - parseFloat(square.width) / 2)) {
//   if(parseFloat(square.x) <= 0){
//     square.x = (parseFloat(square.x) - 0) + 'px';
//   } else {
//     square.x = (parseFloat(square.x) - 2) + 'px';
//   }
// } else {
//   if (parseFloat(square.x) < (mouse.x - parseFloat(square.width) / 2)) {
//     if(parseFloat(square.x) >= 1222){
//       square.x = (parseFloat(square.x) + 0) + 'px';
//     } else {
//       square.x = (parseFloat(square.x) + 2) + 'px';
//     }
    
//   }
//  }
// };
// function getRandomFood(){
//  var divFood = document.createElement('div');
//  divFood.id = 'food' + getRandomInt(10000000000);
//  divFood.style.position = 'absolute';
//  divFood.style.border = '1px solid black';
//  divFood.style.width = '8px';
//  divFood.style.height = '8px';
//  divFood.style.borderRadius = '5px';
//  divFood.style.backgroundColor = getRandomColor();
//  divFood.style.top = getRandomInt(403) + 'px';
//  divFood.style.left = getRandomInt(1214) + 'px';
//  gameFrame.appendChild(divFood);
//  foodPosition.id = divFood.id;
//  foodPosition.x = divFood.style.left;
//  foodPosition.y = divFood.style.top;
//  foodPosition.height = divFood.style.height;
//  foodPosition.width = divFood.style.width;
//  foodPosition.color = divFood.style.backgroundColor;
//  socketIo.emit('foodApparition', foodPosition);
// };
// const SocketIo = require('socket.io');
// // nouvelle instance de 'serveur' websocket
// let socketIo = new SocketIo(httpServer);
// // Objet vide pour accueillir les nouveaux squares.
// let squares = {};
// socketIo.on('connection', function(webSocketConnection){
//   console.log('Connexion établie en back');
//   let square = {
//    x: '0px',
//    y: '0px',
//    id: 'square' + getRandomInt(50000000000),
//    color: getRandomColor(),
//    height: '40px',
//    width: '40px'
//   };
//   // Le square crée pour la connexion en cours est ajouté dans l'objet vide.
//   squares[square.id] = square;
//   console.log('Squares : ', squares);
//   // Envoi du square coté client.
//   webSocketConnection.emit('drawSquare', square);
  
//   webSocketConnection.on('movingMouse', function(mouse){
//     console.log('mouse reçu au back : ', mouse);
//     //collisionDetection(square, food);
//     movingSquare(square, mouse);
//     // Envoi à tous, les coordonnées du carré à jour.
//     socketIo.emit('drawSquare', square);
//  });
 
//  webSocketConnection.on('foodApparition', function(foodPosition){
//   console.log('Food Position :', foodPosition);
//   webSocketConnection.broadcast.emit('foodApparition', foodPosition);
//  });
//  // Si il y a une déconnexion on envoi l'objet contenant les données du square en front
//  webSocketConnection.on('disconnect', function(){
//   // On supprime le square stocké dans l'objet squares
//   delete squares[square.id];
//   // On envoi les donnée du square en front pour le supprimer du DOM.
//   socketIo.emit('removeSquare', square);
//  });
// });
// httpServer.listen(8888);
// Réduire 

// Zone de message




// SURE: Simplement,
// C'est ce dont vous avez besoin:
//  io.to(socket.id).emit("event", data); 
// Chaque fois qu'un utilisateur se joigne au serveur, les détails du socket seront générés, y compris ID. 
//Ceci est l'ID qui aide vraiment à envoyer un message à des personnes particulières.
// D'abord, nous devons stocker tous les socket.ids en ordre,
//  var people={}; people[name] = socket.id; 
// Ici le nom est le nom du destinataire. Exemple:
//  people["ccccc"]=2387423cjhgfwerwer23; 
// Donc, maintenant, nous pouvons obtenir ce socket.id avec le nom de réception chaque fois que nous envoyons un message:
// Pour cela, nous devons connaître le nom de recievern. Vous devez émettre un nom de réception sur le serveur.
// La dernière chose est:
//   socket.on('chat message', function(data){ io.to(people[data.reciever]).emit('chat message', data.msg); }); 
// J'espère que ça va bien pour toi. Bonne chance

// Vous pouvez vous référer aux chambres socket.io. Lorsque vous avez saisi une prise murale – vous pouvez l'associer à la chambre nommée, par exemple "utilisateur. # {Userid}".
// Après cela, vous pouvez envoyer un message privé à n'importe quel client par un nom pratique, par exemple:
//     Io.sockets.in ('user.125'). Émettent ('new_message', {text: "Hello world"})
// En opération ci-dessus, nous envoyons "new_message" à l'utilisateur "125".
// Merci.
// Dans un projet de notre société, nous utilisons l'approche «chambres» et son nom est une combinaison d'identifiants utilisateur de tous les utilisateurs dans une conversation en tant qu'identifiant unique (notre mise en œuvre ressemble plus à Facebook messenger), par exemple:
// | Id | Nom | 1 | Scott | 2 | Susan
// Le nom de la "pièce" sera "1-2" (les identifiants sont commandés Asc.) Et le débranchement socket.io nettoie automatiquement la pièce
// De cette façon, vous envoyez des messages uniquement à cette salle et uniquement aux utilisateurs en ligne (connectés) (moins de paquets envoyés dans l'ensemble du serveur).



