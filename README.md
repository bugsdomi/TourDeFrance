# Projet Atelier N°2 (Back-End) - Tour de France
Date : Juillet 2018

Pour garder le format de présentation original, regarder ce document en mode "RAW" ou en mode "Edit" dans GitHub 

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
- Voici un répertoire "xxx/TourDeFrance"  // Les "xxx" symbolisent votre arborescence de répertoires personnelle
- En dessous de ce répertoire, créer l'arborescence suivante :
    |_ data             // Stockage de la base de données "TourDeFrance"
    |   |_              // BDD "TourDeFrance" et sa collection "Joueurs"
    |_ public           // Répertoire dédié aux ressources utilisées par les clients
        |_ fonts        // Stockage des fontes éventuelles
        |_ images       // Stockage des images
        |_ css          // Stockage des ressources, en particulier des fichiers ".css"
        |_ js           // Stockage des scripts Javascripts utilisés par les clients
    |_ views            // Stockage des templates "Pug"

- Lancer les commandes suivantes depuis le répertoire "TourDeFrance" :
    npm init -y                     // Va créer le projet "TourDeFrance" et l'arborescence technique (node_modules...), 
                                    // et mettre en place le fichier JSON des dépendances 
    npm install nodemon -g          // Installe le moteur Node en mode redémarrage automatique (pas obligatoire)


2) Procédure de lancement du jeu
    a)  Lancer la base de données
        - Se positionner sur le répertoire "xxx/mongodb/server/bin
        - lancer mongod --dbpath="xxx/TourDeFrance/data"


    b: Pour créer la BDD "TourDeFrance" : 
            use TourDeFrance

    c: Ou autre possibilité: on crée la collection "joueurs" 
            db.createCollection("joueurs");

        La base de données "TourDeFrance" a déjà été créée et a actuellemnt une collection "joueurs".
        Néanmoins, si la BDD est vide, à la premiere exécution du jeu "TourDeFrance", lorsqu'un premier joueur s'inscrira, la collection "joueur" sera créée. 

    d) Rappel de quelques commandes utiles pour MongoDB :
        use TourDeFrance
        show collections --> joueurs
        db.joueurs.find();
        db.joueurs.drop();

    b) Lancer le serveur de jeu
        - Se positionner sur le répertoire "xxx/TourDeFrance"
        - Si "Nodemon" installé --> lancer "nodemon TourDeFrance.js"
        - sinon lancer "nodemon TourDeFrance.js" ou "node TourDeFrance.js" si "nodemon" n'est pas installé
        - Si le test a lieu localement sur la machine qui contient le Serveur ET le Client :
            http://localhost:3000

        - Si le test a lieu a partir de différentes machines vers le serveur de jeu, il faut d'abord obtenir l'adresse IP du serveuir de jeu avec la commande "ipconfig" dans une fenêtre de commande, et relever l'adresse IP (exemple 192.168.0.26) et saisir en prenant l'adresse donnée en exemple :
            http://192.168.0.26:3000
