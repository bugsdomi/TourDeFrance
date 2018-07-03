let fs = require('fs');
let http = require('http');
const mongodb = require('mongodb');
let pils = require('./pils')

let server = http.createServer();


// On se connecte à mongodb, on vérifie qu elle est lancée et que la BDD "TourDeFrance"est accessible
var checkDBConnect = function(){
    mongodb.MongoClient.connect('mongodb://localhost:27017/TourDeFrance', function(error, client) {
        return error;
    });
}


// -------------------------------------------------------------------------
// Verification de l'accessibilité de la base - Je ne le fais qu'au debut du jeu, 
// mais en tout état de cause, normalement, je devrais m'assurer qu'elle est 
// toujours accessible en cours de partie
// Si elle ne fonctionne pas, je sors du jeu
// -------------------------------------------------------------------------
if (!checkDBConnect){
    console.log('Base de données inaccessible, le jeu ne peut pas se lancer');
    throw 'Base de données inaccessible, le jeu ne peut pas se lancer, contacter l\'Administrateur système';
} else {
    console.log('La BDD tourne');
    
}


// -------------------------------------------------------------------------
server.on('request', function(request, response){
	fs.readFile('index.html', function(error, data){       // Recherche et envoi du fichier HTML client au navigateur qui se connecte
		let statusCode;
		let responseBody;
		if (error) {
			statusCode = 500;
			responseBody = new Buffer('<h1>Erreur 500</h1>');
		} else {
			statusCode = 200;
            responseBody = data;
		}
		response.writeHead(statusCode, {
			'Content-Length': responseBody.length,
			'Content-Type': 'text/html;charset=utf-8'
		});
		response.write(responseBody, function(){
			response.end();
		});
	});
});
// -------------------------------------------------------------------------
const SocketIo = require('socket.io');

let socketIo = new SocketIo(server);

// On définit un objet vide pour accueillir les nouveaux carrés.
let squares = {};

socketIo.on('connection', function( websocketConnection ){

    let square = {
        top: '0px',
        left: '0px',
        id: Math.round(Math.random() * 10000) + (new Date()).getTime() + '-carre',
        backgroundColor: '#' + Math.floor(Math.random()*16777215).toString(16)
    };

    // On ajoute le carré qu'on vient de créer pour cette connexion dans un objet accessible globalement
    squares[square.id] = square;

    websocketConnection.emit('drawSquare', square);

    // Que faire en cas de récéption des coordonnées de la souris.
    websocketConnection.on('mouseCoordinates', function (mouse) {

        // Ici on peut utiliser l'objet squares pour determiner sur le mouvement est permis ou pas.

        square.top = (mouse.top - (parseFloat(square.top) / 2)) + 'px';
        square.left = (mouse.left - (parseFloat(square.left) / 2)) + 'px';

        // Envoi à tous les client d'une demande de mise à jour du carré
        socketIo.emit('drawSquare', square);
    });

    // La déconnexion on envoie l'objet contenant les méta données du carré au front-end pour qu'il soit supprimé.
    websocketConnection.on('disconnect', function(){
        // On supprime le carré stocké dans l'objet squares
        delete squares[square.id];
        // On envoie les méta données du carré au front pour suppression du DOM
        socketIo.emit('removeSquare', square);
    });
});


/**
* Partie Websocket du serveur
*/



server.listen(3000, function(){
	console.log('Server started !');
});


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
