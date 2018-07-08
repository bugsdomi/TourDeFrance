# Projet Atelier N°2 (Back-End) - Vigor
Date : Juin 2018

Auteur : 
- Dominique Hourdequin


1) Procédure d'installation

PRE-REQUIS : 
    Les logiciels suivants doivent avoir été installé au préalable sur votre machine (Voir la documentation officielle de chacun) : 
    - "npm"
    - "node.js" 
    - "mongoDB"

- Créer un répertoire "xxx/TourDeFrance"  // Les "xxx" symbolisent votre arborescence de répertoires personnelle
- En dessous de ce répertoire, créer l'arborescence suivante :
    |_ data             // Stockage de la base de données "TourDeFrance"
    |_ static
        |_ fonts        // Stockage des fontes éventuelles
        |_ images       // Stockage des images
        |_ css          // Stockage des ressources, en particulier des fichiers ".css"
    |_ views            // Stockage des templates "Pug"

- Lancer les commandes suivantes depuis le répertoire "TourDeFrance" :
    npm init -y                     // Va créer le projet "TourDeFrance" et l'arborescence technique (node_modules...), 
                                    // et mettre en place le fichier JSON des dépendances 
    npm install mongodb --save      // Installe le module d'interface avec MongoDB
    npm install express --save      // Installe le module Express.JS
    npm install socket.io --save    // Installe le module de connectivité réseau Client-Serveur "socket.io"
    npm install pug --save




2) Procédure de lancement du jeu
- Se positionner sur le répertoire "xxx/mongodb/server/bin
- lancer mongod --dbpath="xxx/TourDeFrance/data"


