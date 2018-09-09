// *************************************************************************
// ***      DBMgr : Objet gérant la BDD "Tour de France                  ***
// ***                                                                   ***
// *** Objet : DBMgr                                                     ***
// ***                                                                   ***
// *** Cet objet sert à gérer :                                          ***
// ***   - L'ouverture et le contrôle du bon fonctionnement de la BDD    ***
// ***   - Les accès CRUD à la collection "Joueurs"                      ***
// ***                                                                   ***
// ***  Nécessite :                                                      *** 
// ***      Le module "MongoDB"                                          ***
// ***      Une variable pour son instanciation                          ***
// ***                                                                   ***
// *************************************************************************
// -------------------------------------------------------------------------
// stockage des informations techniques des joueurs et des  coordonnées de leurs 
// pilules qui vont être générées pour le player
// 4 joueurs maximum - 50 pilules pour chacun 
// -------------------------------------------------------------------------
const mongoDB = require('mongodb');

module.exports = function DBMgr(){
    // this.myDB=10;                           // Instance de la base de données
    // this.playerCollection=100;               // Sélectionne la collection que l'on veut utiliser
    this.myDB;                           // Instance de la base de données
    this.playerCollection;               // Sélectionne la collection que l'on veut utiliser
    
    // -------------------------------------------------------------------------
    // On se connecte à mongoDB, on vérifie qu elle est lancée et que la BDD 
    // "TourDeFrance" est accessible (avec stockage de sa référence), sinon, 
    // message d'avertissement pour l'Admin  système et fin directe du programme
    // -------------------------------------------------------------------------
    // Solution 1 Opérationnelle - Fonction CallBack traitée avec "Fonction 
    // Flèche" pour le "this" de la CallBack
    // -------------------------------------------------------------------------
    DBMgr.prototype.checkDBConnect = function(){
        // mongoDB.MongoClient.connect("mongodb://localhost:27017/TourDeFrance", (err,db) => {
        // mongoDB.MongoClient.connect("mongodb://localhost:27017/TourDeFrance", { useNewUrlParser: true }, (err,db) => {
        mongoDB.MongoClient.connect("mongodb://TourDeFranceAdmin:TDFAdmin*001@ds151012.mlab.com:51012/tourdefrance", { useNewUrlParser: true }, (err,db) => {
            if (err) {
                console.log('Base de données inaccessible, le jeu ne peut pas se lancer');
                console.log('Description de l\'erreur : ',err);
                throw "Base de données inaccessible, le jeu ne peut pas se lancer, contacter l\'Administrateur système";
            } else {  
                this.myDB = db;                                                                         // Conservation de l'instance de BDD
                this.playerCollection = this.myDB.db('TourDeFrance').collection('joueurs');             // On sélectionne la collection des joueurs
                console.log('La BDD "TourDeFrance" - Collection "Joueurs" est bien lancée et tourne');  // Message de notification BDD OK à destination de l'Admin 
            }
        });
    }
    // -------------------------------------------------------------------------
    // Solution 2 Opérationnelle - Fonction classique traitée avec "bind" pour le "this" de la CallBack
    // -------------------------------------------------------------------------
    // DBMgr.prototype.xxx = function(err,db){
    //     if (err) {
    //         console.log('Base de données inaccessible, le jeu ne peut pas se lancer');
    //         throw "Base de données inaccessible, le jeu ne peut pas se lancer, contacter l\'Administrateur système";
    //     } else {  
    //         this.myDB = db;                                                                   // Conservation de l'instance de BDD
    //         this.playerCollection = this.myDB.db('TourDeFrance').collection('joueurs');       // On sélectionne la collection des joueurs
    //         console.log('La BDD "TourDeFrance" - Collection "Joueurs" est bien lancée et tourne');
    //     }
    // }
    // -------------------------------------------------------------------------
    // DBMgr.prototype.checkDBConnect = function(){
    //     mongoDB.MongoClient.connect("mongodb://localhost:27017/TourDeFrance", this.xxx.bind(this));
    // }
    
    // -------------------------------------------------------------------------
    // Solution 0 NON-OPERATIONNELLE dans le cadre d'un objet car Probleme de MAJ 
    // du "This" de l'objet car conflit avec le "this" de la CallBack
    // -------------------------------------------------------------------------
    //     DBMgr.prototype.checkDBConnect = function(){
    //         mongoDB.MongoClient.connect("mongodb://localhost:27017/TourDeFrance", function(err,db){
    //             if (err) {
    //                 console.log('Base de données inaccessible, le jeu ne peut pas se lancer');
    //                 throw "Base de données inaccessible, le jeu ne peut pas se lancer, contacter l\'Administrateur système";
    //             } else {  
    //                 this.myDB = db;                                                                   // Conservation de l'instance de BDD
    //                 this.playerCollection = this.myDB.db('TourDeFrance').collection('joueurs');       // On sélectionne la collection des joueurs
    //                 console.log('La BDD "TourDeFrance" - Collection "Joueurs" est bien lancée et tourne');
    //             }
    //         });
    //     }
    // }
}

    // -------------------------------------------------------------------------
    // Solution 3 en chantier avec les "Promesses" -A finaliser...
    // -------------------------------------------------------------------------
    // DBMgr.prototype.myConnect = function(url){
    //     return new Promise(function (ok, ko){
    //         mongoDB.MongoClient.connect(url,function(err,db){
    //             if (err){
    //                 ko(err)
    //             } else {
    //                 ok({
    //                     this.myDB : db,
    //                     this.playerCollection : this.myDB.db('TourDeFrance').collection('joueurs'),       // On sélectionne la collection des joueurs

    //                 })
    //             }
    //         })
    //     })
    // }
    // -------------------------------------------------------------------------
    // DBMgr.prototype.myConnect("mongodb://localhost:27017/TourDeFrance")
    // .then (function (
    //     // this.myDB = db;                                                                   // Conservation de l'instance de BDD
    //     // this.playerCollection = this.myDB.db('TourDeFrance').collection('joueurs');       // On sélectionne la collection des joueurs
    //     console.log('La BDD "TourDeFrance" - Collection "Joueurs" est bien lancée et tourne');
    // ))
    // .catch(){
    //     console.log('Base de données inaccessible, le jeu ne peut pas se lancer');
    //     throw "Base de données inaccessible, le jeu ne peut pas se lancer, contacter l\'Administrateur système";
    // }



