# Projet Atelier N°2 (Back-End) - Tour de France
Date : Juillet 2018

Auteur : 
- Dominique Hourdequin
- DIWJS08 - Développeur FullStack Javascript

1) Procédure d'installation

a)PRE-REQUIS : 
    Les logiciels suivants doivent avoir été installés au préalable sur votre machine (Voir la documentation officielle de chacun) : 
    - "npm"
    - "node.js" 
    - "mongoDB"

b) Arborescence
- Créer un répertoire "xxx/TourDeFrance"  // Les "xxx" symbolisent votre arborescence de répertoires personnelle
- En dessous de ce répertoire, créer l'arborescence suivante :
    |_ data             // Stockage de la base de données "TourDeFrance"
    |_ public           // Répertoire dédié aux ressources utilisées par les clients
        |_ fonts        // Stockage des fontes éventuelles
        |_ images       // Stockage des images
        |_ css          // Stockage des ressources, en particulier des fichiers ".css"
        |_ js           // Stockage des scripts Javascripts utilisés par les clients
    |_ views            // Stockage des templates "Pug"

- Lancer les commandes suivantes depuis le répertoire "TourDeFrance" :
    npm init -y                     // Va créer le projet "TourDeFrance" et l'arborescence technique (node_modules...), 
                                    // et mettre en place le fichier JSON des dépendances 
    npm install mongodb --save      // Installe le module d'interface avec MongoDB
    npm install express --save      // Installe le module Express.JS
    npm install socket.io --save    // Installe le module de connectivité réseau Client-Serveur "socket.io"
    npm install pug --save          // Installe le module de templates qui va être utilisé avec Express.JS
    npm install nodemon -g          // Installe le moteur Node en mode redémarrage automatique (pas obligatoire)




XXXXXX ou npm install ???????




2) Procédure de lancement du jeu
    a)  Lancer la base de données
        - Se positionner sur le répertoire "xxx/mongodb/server/bin
        - lancer mongod --dbpath="xxx/TourDeFrance/data"
    
    b) Lancer le serveur de jeu
        - Se positionner sur le répertoire "xxx/TourDeFrance"
        - Si "Nodemon" installé --> lancer "nodemon TourDeFrance.js"
        - sinon lancer "nodemon TourDeFrance.js" ou "node TourDeFrance.js" si "nodemon" n'est pas installé


3) Règles du jeu

XXXXXXXXXXXXX
NPM Install


use TourDeFrance
show collections --> joueurs
db.joueurs.find();
db.joueurs.drop();