
const express = require('express');
const mongodb = require('mongodb');
const SocketIo = require('socket.io');
const Pils = require('./pils');

// -------------------------------------------------------------------------
// Création de l'application ExpressJS
// -------------------------------------------------------------------------
const app = express();

// -------------------------------------------------------------------------
// On se connecte à mongodb, on vérifie qu elle est lancée et que la BDD "TourDeFrance"
// est accessible, sinon, message d'avertissement et fin directe du programme
// -------------------------------------------------------------------------
var checkDBConnect = function(){
    mongodb.MongoClient.connect("mongodb://localhost:27017/TourDeFrance", function(err, db) {
        if (err) {
            console.log('Base de données inaccessible, le jeu ne peut pas se lancer');
        throw "Base de données inaccessible, le jeu ne peut pas se lancer, contacter l\'Administrateur système";
        } else {
            console.log('La BDD tourne');
        }
    });
}
// -------------------------------------------------------------------------
// Verification de l'accessibilité de la base - Je ne le fais qu'au debut du jeu, 
// mais en tout état de cause, normalement, je devrais m'assurer qu'elle est 
// toujours accessible en cours de partie
// Si elle ne fonctionne pas, je sors du jeu
// -------------------------------------------------------------------------
checkDBConnect();

// -------------------------------------------------------------------------
// Création des routes ExppressJS, car je vais utiliser cet outil pour transferer
// au client la page HTML et tout ce qui lui est nécessaire pour s'afficher et se gérer
// -------------------------------------------------------------------------
app.set('view engine', 'pug');
app.use('/static', express.static(__dirname + '/public'));
app.get('/', function(req, res){
    console.log('render de la surface de jeu')
    res.render('index');    
});

const server = app.listen(3000, function() {
    const addressHote = server.address().address;
    const portEcoute = server.address().port
    console.log('Écoute du serveur http://%s:%s',addressHote,portEcoute);
});


// ------------------------------------------------------------
// Fin de la partie HTTP - Début de la partie WebSocket avec "Socket.io"
// ------------------------------------------------------------

// -------------------------------------------------------------------------
// A la détection de la connexion,on initialise la partie player sur le client :
// - Vérification du nombre de joueurs (Ok, si <= 4)
// - Login
//      |_ Affichage du formulaire de saisie du login
//      |_ Attente du login
//      |_ Vérification de la validité du login
//      |_ caclul des positions des pilules du player
// -------------------------------------------------------------------------
// stockage des coordonnées des pilules qui vont être générées pour le player
// 4 joueurs maximum - 50 pilules pour chacun 
let vPilules = 
{
    currentPlayer: -1,
    maxPilsByPlayer: 50,
    objectColorPlayer : 
    {   
        player0 : 
        {
            couleur : 'blue',
            fichier : "static/images/pil-blue-white.png",
        },
        player1 : 
        {
            couleur : 'red',
            fichier : "static/images/pil-red-white.png",
        },
        player2 : 
        {
            couleur : 'yellow',
            fichier : "static/images/pil-yellow-white.png",
        },
        player3 : 
        {
            couleur : 'green',
            fichier : "static/images/pil-green-white.png",
        }
        // cyan, green, orange, redBlack, red, violet, black, white, yellow
    },
    pils: {},
}

// ------------------------------------------------------------
// 
// ------------------------------------------------------------
let vNumJoueur = -1;

// ------------------------------------------------------------
// Initialisation des targets - Les targets representent pilules 
// de produits dopants que les cyclistes doivent s'approprier
// avant que les joueurs aient mangé les leurs
// ------------------------------------------------------------
var initPilsDeck = function(pNumJoueur,pDataScreenSize){

    // console.log('objectColorPils.player0.couleur : ',objectColorPlayer.player0.couleur);
    // console.log(' objectColorPils['player0'].couleur : ',objectColorPlayer['player0'].couleur);
    // console.log(' objectColorPils['player'+0].couleur : ',objectColorPlayer['player'+0].couleur);

    vPilules.currentPlayer = pNumJoueur;                // Ajout dans les données du message du N0 de joueur actuel

    for (let i=0; i < vPilules.maxPilsByPlayer; i++){
        var pils = new Pils()
        pils.initVar(pDataScreenSize);    // Création de chaque pilule individuelle pour le player 
        vPilules.pils[i] = pils;          // On ajoute la pilule qu'on vient de créer dans un objet concentrateur global

    }
        // dataPils.targetActif = 0;
        // dataPils.bipBip[dataPils.targetActif].AfficheTargetActif();
// console.log('Pilules : ', vPilules);
}



// -------------------------------------------------------------------------
// Création de la liaison socket.io sur la base du serveur HTTP déja déclaré précédement
// -------------------------------------------------------------------------
let socketIo = new SocketIo(server);

socketIo.on('connection', function(websocketConnection){
console.log('websocketConnection.handshake.headers.host : ',websocketConnection.handshake.headers.host);
console.log('websocketConnection.handshake.address : ',websocketConnection.handshake.address);

    let PilsColorPlayer;
// XXXXXXXXXX  Corriger le nbre de joueurs --> 4
    if (vNumJoueur == 400){
        console.log('Nbre max de joueurs atteint');
    } else {
        vNumJoueur++;
        console.log('vNumJoueur : ',vNumJoueur);

        let pDataScreenSize;
        websocketConnection.emit('askScreenSize',pDataScreenSize);
        websocketConnection.on('receiveScreenSize',function(pDataScreenSize){
console.log('Screen Sizes recu coté serveur: ',pDataScreenSize.vScreenHeight,'***',pDataScreenSize.vScreenWidth);

        initPilsDeck(vNumJoueur, pDataScreenSize);

        websocketConnection.emit('drawPils',vPilules);
        });

        // let square = 
        // {
        //     top: '0px',
        //     left: '0px',
        //     id: Math.round(Math.random() * 10000) + (new Date()).getTime() + '-carre',
        //     backgroundColor: '#' + Math.floor(Math.random()*16777215).toString(16)
        // };
    


    // // Que faire en cas de réception des coordonnées de la souris.
    // websocketConnection.on('mouseCoordinates', function (mouse) {

    //     // Ici on peut utiliser l'objet squares pour determiner sur le mouvement est permis ou pas.

    //     square.top = (mouse.top - (parseFloat(square.top) / 2)) + 'px';
    //     square.left = (mouse.left - (parseFloat(square.left) / 2)) + 'px';

    //     // Envoi à tous les client d'une demande de mise à jour du carré
    //     socketIo.emit('drawSquare', square);
    // });

    // // La déconnexion on envoie l'objet contenant les méta données du carré au front-end pour qu'il soit supprimé.
    // websocketConnection.on('disconnect', function(){
    //     // On supprime le carré stocké dans l'objet squares
    //     delete squares[square.id];
    //     // On envoie les méta données du carré au front pour suppression du DOM
    //     socketIo.emit('removeSquare', square);
    // });
    }
});


/**
* Partie Websocket du serveur
*/





// var checkDBConnect = function(){
//     mongodb.MongoClient.connect('mongodb://localhost:27017/TourDeFrance', function(error, client) {
//         if (!error){
//     console.log('2 ajoutHTML : ',ajoutHTML);
//     let joueurs = client.db('TourDeFrance').collection('joueurs');
//     joueurs.find({}).toArray(function(error, documents){
//         documents.forEach(function(objetMessage){
//                     ajoutHTML = '<p><strong>' + objetMessage.username + '</strong>:</p><p><i>' + objetMessage.message + ' </i></p>' + ajoutHTML;
//             });
            
//             // ajoutHTML contient un texte en HTML à ajouter à exemple3.html
//             let responseBodyToHTMLString = responseBody.toString('utf8');
// console.log('3 ajoutHTML : ',ajoutHTML);
//                 responseBodyToHTMLString = responseBodyToHTMLString.replace('<div id="joueurs"></div>', '<div id="joueurs">' + ajoutHTML + '</div>');
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
// socketIo.on('connection', function(websocketConnection){
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
//   websocketConnection.emit('drawSquare', square);
  
//   websocketConnection.on('movingMouse', function(mouse){
//     console.log('mouse reçu au back : ', mouse);
//     //collisionDetection(square, food);
//     movingSquare(square, mouse);
//     // Envoi à tous, les coordonnées du carré à jour.
//     socketIo.emit('drawSquare', square);
//  });
 
//  websocketConnection.on('foodApparition', function(foodPosition){
//   console.log('Food Position :', foodPosition);
//   websocketConnection.broadcast.emit('foodApparition', foodPosition);
//  });
//  // Si il y a une déconnexion on envoi l'objet contenant les données du square en front
//  websocketConnection.on('disconnect', function(){
//   // On supprime le square stocké dans l'objet squares
//   delete squares[square.id];
//   // On envoi les donnée du square en front pour le supprimer du DOM.
//   socketIo.emit('removeSquare', square);
//  });
// });
// httpServer.listen(8888);
// Réduire 

// Zone de message


// Envoyer un message à @Didz Bilel 