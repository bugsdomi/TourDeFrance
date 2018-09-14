// -------------------------------------------------------------------------
// stockage des informations techniques des joueurs et des  coordonnées de leurs 
// pilules qui vont être générées pour le player
// 4 joueurs maximum - 50 pilules pour chacun 
// -------------------------------------------------------------------------

function PlayersClient(){    
// Les propriétés ci-dessous sont modifiables sans aucun problème
    this.precision = 40;                                // Distance minimum en pixels entre le centre du Jeton et le centre de la Pils pour determiner si elle est mangée (+ grand = +facile)
    this. delayToReset = 10;                            // Délai en secondes accordé aux joueurs pour admirer, faire des Screen-Shots, etc..., avant de revenir à l'écran principal
    this.compteARebours = 5;                            // Constante Compte à rebours en secondes avant le début de la partie

// NE PAS MODIFIER Les propriétés ci-dessous !!!!
    this.currentPlayer = -1;                            // Joueur en train d etre traité sur ce client : CE N EST PAS OBLIGATOIREMENT le joueur de ce client
    this.indexCurrentPlayer = '';                       // Indice développé du joueur à afficher dans la session courante ('player0'...)
    this.maxPlayers = -1;
    this.maxPilsByPlayer = -1;
    this.isItMe = false;                                // Flag permettant d'identifier le Joueur correspondant à ce client
    this.nextPils = -1;                                 // Pils désignée pour être la prochaine à être mangée
    this.nextPilsX = -1;                                // Coordonnée X de la Pils désignée pour être la prochaine à être mangée (mémorisée à part pour eviter des calcules recurrents)
    this.nextPilsY = -1;                                // Coordonnée X de la Pils désignée pour être la prochaine à être mangée (mémorisée à part pour eviter des calcules recurrents)

    this.ControlPanel;                                  // Panneau de controle contenant les avatars, les pseudo + Mails, et leur score 
    this.imgBtnPlayerList;                              // Petit bouton d'affichage de la liste des joueurs à partir du Control-Panel
    this.myClientPlayer = '';                           // Variable qui servira de raccourci pour l'objet "n" et diminuera la longueur du code  ('player0' à 'player3')
    this.myNumPlayer = -1;                              // Pendant de la variable ci-dessus mais sans le préfixe 'player' 'player3')
    this.distance= -1;                                  // Stocke la distance calculée entre 2 (utilisée lors de la detection de la Pils mangée)
    this.vainqueurTrouve = false;                       // Flag permettant de determiner le vainqueur dès que le 1er joueur a mangé toutes ses pils 

    this.AdviseLegend = undefined;                      //\
    this.AdviseWindow = undefined;                      // \
    this.adviseLi = undefined;                          //      Elements de la fenetre d'avertissement à usages et options multiples
    this.adviseOL = undefined;                          // /
    this.adviseBtn = undefined;                         ///

    this.rayon = undefined;                             // Taille du rayon du conteneur du jeton
    this.vCompteARebours;                               // Variable du compte-à-rebours
    this.refreshCompteARebours;                         // Variable du stockage du 'SetInterval' du compte-à-rebours


    this.player0 =
    {
        pseudo : '',                                     // Pseudo du joueur dans la partie
        totalPlayedTime : 0,                             // Temps total de jeu
        vainqueur : false,                               // Designe la vainqueur
        couleur : '',                                    // Couleur du joueur
        avatar : '',                                     // Avatar du joueur
        containerAvatarToken : undefined,                // Conteneur du jeton qui sera piloté par la souris
        coordX : undefined,                              // Coordonnées en X du jeton du joueur (coordonnées pures, sans 'px')
        coordY : undefined,                              // Coordonnées en Y du jeton du joueur (coordonnées pures, sans 'px')
        tokenCaptured : false,                           // Le jeton a été capturé par la souris et la suit desormais
        avatarToken : undefined,                         // Jeton de l'avatar qui sera piloté à la souris
        playerFrame : undefined,                         // Objet du Cadre contenant l avatar; le pseudo; et le scorte
        avatarFrame : undefined,                         // Objet de l'avatar
        pseudoFrame : undefined,                         // Objet du cadre contenant le pseudo
        counterFrame : undefined,                        // Objet de cadre du compteur de pilules mangées
        timerFrame : undefined,                          // Objet de cadre du compteur de temps
        pilsNonMangeesRestantes : -1,                    // Nombre de Pils non mangées encore dans le stock
        pils: {},                                        // Jeu de pilules affectées au joueur            
    };
    this.player1 =
    {
        pseudo : '',                                     // Pseudo du joueur dans la partie
        totalPlayedTime : 0,                             // Temps total de jeu
        vainqueur : false,                               // Designe la vainqueur
        couleur : '',                                    // Couleur du joueur
        avatar : '',                                     // Avatar du joueur
        containerAvatarToken : undefined,                // Conteneur du jeton qui sera piloté par la souris
        coordX : undefined,                              // Coordonnées en X du jeton du joueur (coordonnées pures, sans 'px')
        coordY : undefined,                              // Coordonnées en Y du jeton du joueur (coordonnées pures, sans 'px')
        tokenCaptured : false,                           // Le jeton a été capturé par la souris et la suit desormais
        avatarToken : undefined,                         // Jeton de l'avatar qui sera piloté à la souris
        playerFrame : undefined,                         // Objet du Cadre contenant l avatar; le pseudo; et le scorte
        avatarFrame : undefined,                         // Objet de l'avatar
        pseudoFrame : undefined,                         // Objet du cadre contenant le pseudo
        counterFrame : undefined,                        // Objet de cadre du compteur de pilules mangées
        timerFrame : undefined,                          // Objet de cadre du compteur de temps
        pilsNonMangeesRestantes : -1,                    // Nombre de Pils non mangées encore dans le stock
        pils: {},                                        // Jeu de pilules affectées au joueur            
    };
    this.player2 = 
    {
        pseudo : '',                                     // Pseudo du joueur dans la partie
        totalPlayedTime : 0,                             // Temps total de jeu
        vainqueur : false,                               // Designe la vainqueur
        couleur : '',                                    // Couleur du joueur
        avatar : '',                                     // Avatar du joueur
        containerAvatarToken : undefined,                // Conteneur du jeton qui sera piloté par la souris
        coordX : undefined,                              // Coordonnées en X du jeton du joueur (coordonnées pures, sans 'px')
        coordY : undefined,                              // Coordonnées en Y du jeton du joueur (coordonnées pures, sans 'px')
        tokenCaptured : false,                           // Le jeton a été capturé par la souris et la suit desormais
        avatarToken : undefined,                         // Jeton de l'avatar qui sera piloté à la souris
        playerFrame : undefined,                         // Objet du Cadre contenant l avatar; le pseudo; et le scorte
        avatarFrame : undefined,                         // Objet de l'avatar
        pseudoFrame : undefined,                         // Objet du cadre contenant le pseudo
        counterFrame : undefined,                        // Objet de cadre du compteur de pilules mangées
        timerFrame : undefined,                          // Objet de cadre du compteur de temps
        pilsNonMangeesRestantes : -1,                    // Nombre de Pils non mangées encore dans le stock
        pils: {},                                        // Jeu de pilules affectées au joueur            
    };
    this.player3 = 
    {
        pseudo : '',                                     // Pseudo du joueur dans la partie
        totalPlayedTime : 0,                             // Temps total de jeu
        vainqueur : false,                               // Designe la vainqueur
        couleur : '',                                    // Couleur du joueur
        avatar : '',                                     // Avatar du joueur
        containerAvatarToken : undefined,                // Conteneur du jeton qui sera piloté par la souris
        coordX : undefined,                              // Coordonnées en X du jeton du joueur (coordonnées pures, sans 'px')
        coordY : undefined,                              // Coordonnées en Y du jeton du joueur (coordonnées pures, sans 'px')
        tokenCaptured : false,                           // Le jeton a été capturé par la souris et la suit desormais
        avatarToken : undefined,                         // Jeton de l'avatar qui sera piloté à la souris
        playerFrame : undefined,                         // Objet du Cadre contenant l avatar; le pseudo; et le scorte
        avatarFrame : undefined,                         // Objet de l'avatar
        pseudoFrame : undefined,                         // Objet du cadre contenant le pseudo
        counterFrame : undefined,                        // Objet de cadre du compteur de pilules mangées
        timerFrame : undefined,                          // Objet de cadre du compteur de temps
        pilsNonMangeesRestantes : -1,                    // Nombre de Pils non mangées encore dans le stock
        pils: {},                                        // Jeu de pilules affectées au joueur            
    }
        
}
// -------------------------------------------------------------------------
// Vérifie la validité du champ "pseudo" et renvoie un message d'alerte 
// rappelant sa structure
// -------------------------------------------------------------------------
PlayersClient.prototype.checkPseudo = function(pPseudo){
    var regex = /^[A-Z]{1}[A-Za-z0-9 ._\-']{0,11}$/;
    pPseudo.value = pPseudo.value.trim();
    
    if(!regex.test(pPseudo.value)){
        this.adviseWithButton('Veuillez remplir le champ "Pseudo" en respectant le format : '+
                    'Initiale en Majuscule, suivie de 0 à 11 caractères alphanumériques','Fermer');
        return false;
    } else {
        return true;
    }
}

// --------------------------------------------------------------
// Efface la Fenêtre simplifiée de messsage
// --------------------------------------------------------------
PlayersClient.prototype.clearAdvise = function(){   
    this.adviseLegend.parentNode.removeChild(this.adviseLegend);
    this.adviseWindow.parentNode.removeChild(this.adviseWindow);
}
// --------------------------------------------------------------
// Affiche une Fenêtre simplifiée de messsage (Sans bouton, ni action associée)
// --------------------------------------------------------------
PlayersClient.prototype.displayAdvise = function(pMessage){   
    this.adviseWindow = window.document.createElement('form');   
    window.document.body.appendChild(this.adviseWindow);  
    this.adviseWindow.style.background = 'linear-gradient(0.75turn, rgba(252,141,50), rgba(230,159,42))';
    this.adviseWindow.style.zIndex = '1000000';
    this.adviseWindow.style.display = 'block';

    this.adviseLegend = window.document.createElement('legend');   
    this.adviseWindow.appendChild(this.adviseLegend);  
    this.adviseLegend.innerHTML = pMessage;
}
// --------------------------------------------------------------
// Fenêtre améliorée de messsage, avec un bouton permettant sa validation 
// et declenchant une action passée en paramètre
// --------------------------------------------------------------
PlayersClient.prototype.adviseWithButton = function(pMessage, pMessageAction, pAction, pMyPlayer, pWebSocketConnection){  
    this.displayAdvise(pMessage);

    this.adviseOL = window.document.createElement('ol');   
    this.adviseWindow.appendChild(this.adviseOL);  
    
    this.adviseLi = window.document.createElement('li');   
    this.adviseOL.appendChild(this.adviseLi);  
    
    this.adviseBtn = window.document.createElement('button');   
    this.adviseLi.appendChild(this.adviseBtn);  
    this.adviseBtn.setAttribute('class', 'cButton');
    this.adviseBtn.setAttribute('type', 'button');
    this.adviseBtn.innerHTML = pMessageAction;

    this.adviseBtn.addEventListener('click', function(){
        this.adviseBtn.parentNode.removeChild(this.adviseBtn);
        this.adviseLi.parentNode.removeChild(this.adviseLi);            // Suppression de la fenêtre d'avertissement du DOM
        this.adviseOL.parentNode.removeChild(this.adviseOL);
        this.clearAdvise();
        if (pAction){
            pAction.call(this,pMyPlayer,pWebSocketConnection);     // Lancement de l'action correspondante à celle indiquée sur le bouton de la fenêtre d'avertissement
        }
    }.bind(this));
}
// --------------------------------------------------------------
// Affiche et décrémente le compte_à_rebours
// Puis efface la fenêtre, et active la partie
// --------------------------------------------------------------
PlayersClient.prototype.playCompteARebours = function(pWebSocketConnection){  
    this.vCompteARebours--;
    if (this.vCompteARebours>0){
        this.adviseLegend.innerHTML = 'Le jeu va démarrer dans '+this.vCompteARebours+' secondes'; 
    } else {
        window.clearInterval(this.refreshCompteARebours)
        this.clearAdvise();
        pWebSocketConnection.emit('startGame');
    }
}
// --------------------------------------------------------------
// MAJ l'affichage du temps total passé par le joueur sur toutes ses parties
// --------------------------------------------------------------
PlayersClient.prototype.refreshElapsedTime = function(pMyTotalTime){  
    this[pMyTotalTime.monClientPlayer].timerFrame.innerHTML = vToolBox.convertSecsToDaysHoursMinsSecs(pMyTotalTime.monTotalTime);
}
// --------------------------------------------------------------
// Caclule le temps total passé par le joueur sur toutes ses parties
// Et l'envoie au serveur pour l'afficher sur tous les autres postes
// --------------------------------------------------------------
PlayersClient.prototype.addOneSecond = function(pWebSocketConnection){  
    this[this.myClientPlayer].totalPlayedTime++;
    
    var vMyTotalTime = { 
        monClientPlayer : this.myClientPlayer,
        monNumPlayer : this.myNumPlayer,
        monTotalTime : this[this.myClientPlayer].totalPlayedTime,
    }
    pWebSocketConnection.emit('broadcastTotalTime',vMyTotalTime);
}
// --------------------------------------------------------------
// Retour au formulaire de login
// Régénération de l'écran de base from scratch;
// --------------------------------------------------------------
PlayersClient.prototype.restartLogin = function(){   
    window.location.href = window.location.href; 
}
// --------------------------------------------------------------
// Effacement de l'écran de la Pils qui viuent d'être mangée
// --------------------------------------------------------------
PlayersClient.prototype.hideEatedPils = function(pMyPils){  
    this[pMyPils.monClientPlayer].pils[pMyPils.maPils].setAttribute('class', 'pils');
    this[pMyPils.monClientPlayer].pils[pMyPils.maPils].style.animation = '';
    this[pMyPils.monClientPlayer].pils[pMyPils.maPils].style.display = 'none';    // La Pils est supprimée de l'affichage
    this[pMyPils.monClientPlayer].counterFrame.innerHTML =  this.maxPilsByPlayer - pMyPils.monSoldeDePils + ' / ' + this.maxPilsByPlayer;
}
// -------------------------------------------------------------------------
// Sélectionne au haserd une Pils qui n'a pas été mangée, et demande au 
// serveur de la mettre en evidence sur tous les écrans
// -------------------------------------------------------------------------
PlayersClient.prototype.checkPilsEated = function(pMouseCoord, pWebSocketConnection){
    this.distance = Math.round(Math.sqrt(Math.pow((this.nextPilsX - pMouseCoord.left),2) + Math.pow((this.nextPilsY - pMouseCoord.top),2)));
    if (this.distance < this.precision){
        this[this.myClientPlayer].pils[this.nextPils].mangee = true;             // La Pils a été mangée
        this[this.myClientPlayer].pilsNonMangeesRestantes--;

        var vMyPils = { 
            monClientPlayer : this.myClientPlayer,
            monNumPlayer : this.myNumPlayer,
            maPils : this.nextPils,
            monSoldeDePils : this[this.myClientPlayer].pilsNonMangeesRestantes,
        }
        pWebSocketConnection.emit('broadcastEatedPils',vMyPils);
        this.selectNextPilsToEat(pWebSocketConnection);
    }  
}
// --------------------------------------------------------------
// Gestion de la capture du jeton du joueur et attachement à la souris
// puis Jeu proprement dit, le joueur doit manger toutes les pilules 
// de sa couleur
// --------------------------------------------------------------
PlayersClient.prototype.playAndEatPils = function(pWebSocketConnection, event){   
    var vMouseCoord = {
        left: event.clientX,
        top: event.clientY,
    };

    // Vérifie si la souris rentre dans le Control-Panel, et si oui, se détache de son jeton et reprend sa forme de curseur fleché
    if (vMouseCoord.top <= parseInt(this.controlPanel.style.height)){
        this[this.myClientPlayer].tokenCaptured = false;
        document.body.style.cursor = 'default';
    } else {
        if (!this.vainqueurTrouve){
            this[this.myClientPlayer].tokenCaptured = true;
            document.body.style.cursor = 'none';
        }
    }
    
    if (this[this.myClientPlayer].tokenCaptured){
        this[this.myClientPlayer].containerAvatarToken.style.left = vMouseCoord.left - (this.rayon)+ 'px';
        this[this.myClientPlayer].containerAvatarToken.style.top = vMouseCoord.top - (this.rayon)+ 'px';
        
        var vMyToken = { 
            monClientPlayer : this.myClientPlayer,
            monNumPlayer : this.myNumPlayer,
            top : this[this.myClientPlayer].containerAvatarToken.style.top,
            left: this[this.myClientPlayer].containerAvatarToken.style.left,
        }

        pWebSocketConnection.emit('broadcastTokenCoord',vMyToken);
        this.checkPilsEated(vMouseCoord, pWebSocketConnection);
    } else {
        this.distance = Math.round(Math.sqrt(   Math.pow((this[this.myClientPlayer].coordX - vMouseCoord.left),2) + 
                                                Math.pow((this[this.myClientPlayer].coordY - vMouseCoord.top), 2)));
        if (this.distance < this.precision){
            this[this.myClientPlayer].tokenCaptured = true;
            document.body.style.cursor = 'none';
        }
    }
};
// --------------------------------------------------------------
// Activation de l'animation principale de la pilule sélectionnée
// --------------------------------------------------------------
PlayersClient.prototype.switchToSecondAnimation = function(pMyPils){  
    this[pMyPils.monClientPlayer].pils[pMyPils.maPils].style.animation = '0.5s linear infinite animePils'
}
// --------------------------------------------------------------
// Mise en évidence de la prochaine Pils à manger
// --------------------------------------------------------------
PlayersClient.prototype.showNextPilsToEat = function(pMyPils){  
    this[pMyPils.monClientPlayer].pils[pMyPils.maPils].setAttribute('class', 'pils selected');
    this[pMyPils.monClientPlayer].pils[pMyPils.maPils].style.animation = 'scalePils 0.4s linear 8';
    this[pMyPils.monClientPlayer].pils[pMyPils.maPils].addEventListener('animationend', this.switchToSecondAnimation.bind(this,pMyPils));
}
// -------------------------------------------------------------------------
// Sélectionne au haserd une Pils qui n'a pas été mangée, et demande au 
// serveur de la mettre en evidence sur tous les écrans
// -------------------------------------------------------------------------
PlayersClient.prototype.selectNextPilsToEat = function(pWebSocketConnection){
    if (this[this.myClientPlayer].pilsNonMangeesRestantes > 0){
        var  found = false;
        while (!found){
            this.nextPils = vToolBox.random(0,this.maxPilsByPlayer-1);

            if (!this[this.myClientPlayer].pils[this.nextPils].mangee){
                this.nextPilsX = parseInt(this[this.myClientPlayer].pils[this.nextPils].style.left) +  // \ Pour des raisons de perfs,stockage dans des propriétés d acces courts des
                                (parseInt(window.getComputedStyle(this[this.myClientPlayer].pils[this.nextPils],null).getPropertyValue('width'))/2);
                this.nextPilsY = parseInt(this[this.myClientPlayer].pils[this.nextPils].style.top) +   // / Coord de ma pils augmentées de la moitié de leurs dimensions pour les centrer
                                (parseInt(window.getComputedStyle(this[this.myClientPlayer].pils[this.nextPils],null).getPropertyValue('height'))/2);
                found = true;

                var vMyPils = { 
                    monClientPlayer : this.myClientPlayer,
                    monNumPlayer : this.myNumPlayer,
                    maPils : this.nextPils,
                }

                this.showNextPilsToEat(vMyPils);
                pWebSocketConnection.emit('broadcastNextPilsToEat',vMyPils);
            }
        }
    } else {
        if (!this.vainqueurTrouve){
            this.vainqueurTrouve = true;
            this[this.myClientPlayer].vainqueur = true;
            this.adviseWithButton('VICTOIRE !!! Vous avez gagné', 'Terminer', this.restartLogin);
            this.endOfParty(pWebSocketConnection)
        }
    }
}
// -------------------------------------------------------------------------
// Fin de la partie 
// Restauration du curseur de souris standard
// Détachement du Jeton du joueur  de la souris
// Sortie automatique de la partie au bout de N secondes si le joueur n'est 
// pas sorti de lui-même
// -------------------------------------------------------------------------
PlayersClient.prototype.clearParty = function(){
    this.vainqueurTrouve = true;
    window.removeEventListener("mousemove", this.playAndEatPils.bind(this)); 
    document.body.style.cursor = 'default';
    this[this.myClientPlayer].tokenCaptured = false;
    this.timerToExit();             // Déclenchement du timer de sortie automatique
}
// -------------------------------------------------------------------------
// Fin de la partie - 
// Le joueur qui a gagné envoie au serveur l'ordre d'arrêter le jeu (et donc aussi le chrono)
// Le serveur va notifier aux autres joueurs la fin de partie et leur statut de "Loosers"
// et enregistrer les données de temps et de score
// -------------------------------------------------------------------------
PlayersClient.prototype.endOfParty = function(pWebSocketConnection){
    this.clearParty();
    var vMyClient = { 
        monClientPlayer : this.myClientPlayer,
        monNumPlayer : this.myNumPlayer,
        monTotalTime : this[this.myClientPlayer].totalPlayedTime,                                 
        monVainqueur : this[this.myClientPlayer].vainqueur,
    }
    pWebSocketConnection.emit('stopGame',vMyClient);
}
// -------------------------------------------------------------------------
// Fin de la partie - 
// Le joueur qui a gagné envoie au serveur l'ordre d'arrêter le jeu (et donc aussi le chrono)
// Le serveur va notifier aux autres joueurs la fin de partie et leur statut de "Loosers"
// et enregistrer les données de temps et de score
// -------------------------------------------------------------------------
PlayersClient.prototype.sendPartyData = function(pWebSocketConnection){
    var vMyClient = { 
        monClientPlayer : this.myClientPlayer,
        monNumPlayer : this.myNumPlayer,
        monTotalTime : this[this.myClientPlayer].totalPlayedTime,                                 
        monVainqueur : this[this.myClientPlayer].vainqueur,
        monNbrePilsMangees : this.maxPilsByPlayer - this[this.myClientPlayer].pilsNonMangeesRestantes--,
    }
    pWebSocketConnection.emit('sendPartyData',vMyClient);
}
// -------------------------------------------------------------------------
// Lancement du jeu
// -------------------------------------------------------------------------
PlayersClient.prototype.launchGame = function(pMyPlayer, pWebSocketConnection){  
    pWebSocketConnection.emit('adviseStartGame',pMyPlayer);
}
// -------------------------------------------------------------------------
// Ce timer a pour fonction de sortir les joueurs au bout d'un certain temps
// après la fin de la partie, s'ils n'ont pas actionné eux-même le bouton 
// de retour à l'écran de Login
// -------------------------------------------------------------------------
PlayersClient.prototype.timerToExit = function(){   
    setTimeout(function(){
        this.adviseBtn.click();
    }.bind(this), this.delayToReset * 1000);
}
// -------------------------------------------------------------------------
// Création physique du bouton "Liste des joueurs" à partir de la partie en cours
// -------------------------------------------------------------------------
PlayersClient.prototype.drawBtnPlayerListe = function(pOuterBrdrWindowList, pWindowList, pWebSocketConnection){
    this.imgBtnPlayerList = window.document.createElement('img');   
    window.document.body.appendChild(this.imgBtnPlayerList);  

    this.imgBtnPlayerList.setAttribute('id', 'idImgBtnPlayerList');
    this.imgBtnPlayerList.setAttribute('src', 'static/images/Btn-Liste-joueurs.jpg');
    this.imgBtnPlayerList.setAttribute('alt', 'Listes des joueurs');
    this.imgBtnPlayerList.setAttribute('title', 'Listes des joueurs');

    var widthCadreJoueur = vToolBox.convertPercentToPixels(20,false);
    var vInterEspace = ((vToolBox.screenWidth - (widthCadreJoueur * 4)) / 5);

    this.imgBtnPlayerList.style.width = (vInterEspace - 2) - 4 +'px';
    this.imgBtnPlayerList.style.left = (vToolBox.screenWidth / 2) - (parseInt(this.imgBtnPlayerList.style.width) / 2) + 6 + 'px';
    this.imgBtnPlayerList.style.top = (this.controlPanel.style.height / 2) + (parseInt(this.imgBtnPlayerList.style.width) / 2) + 6 + 'px';

    this.imgBtnPlayerList.addEventListener('click', function(){
        this.askPlayersList(pOuterBrdrWindowList, pWindowList, pWebSocketConnection)
    }.bind(this));
}
// -------------------------------------------------------------------------
// Création physique du "Control-Panel", version "Photo du Tour de France"
// -------------------------------------------------------------------------
PlayersClient.prototype.drawControlPanel = function(pOuterBrdrWindowList, pWindowList, pWebSocketConnection){
    this.controlPanel = window.document.createElement('div');   
    window.document.body.appendChild(this.controlPanel);  
    this.controlPanel.setAttribute('class', 'controlPanel');
    this.controlPanel.style.height = parseInt(window.getComputedStyle(this.controlPanel,null).getPropertyValue('height')) + 'px';

    this.drawBtnPlayerListe(pOuterBrdrWindowList, pWindowList, pWebSocketConnection);
}
// -------------------------------------------------------------------------
// Création physique de l'avatar du joueur dans le "Control-Panel"
// -------------------------------------------------------------------------
PlayersClient.prototype.drawAvatar = function(){
    this[this.indexCurrentPlayer].avatarFrame = window.document.createElement('img');   
    this[this.indexCurrentPlayer].playerFrame.appendChild(this[this.indexCurrentPlayer].avatarFrame);     
    this[this.indexCurrentPlayer].avatarFrame.setAttribute('class', 'avatar');
    this[this.indexCurrentPlayer].avatarFrame.setAttribute('src', this[this.indexCurrentPlayer].avatar);
    this[this.indexCurrentPlayer].avatarFrame.setAttribute('alt', 'Avatar');
    this[this.indexCurrentPlayer].avatarFrame.setAttribute('title', 'Avatar');
    this[this.indexCurrentPlayer].avatarFrame.style.border = 'solid 10px ' + this[this.indexCurrentPlayer].couleur;
    
    if (this.isItMe){    // Mise en évidence de l'avatar du joueur sur sa session et uniquement la sienne
        this[this.indexCurrentPlayer].avatarFrame.style.animation = '0.5s linear infinite animeAvatar alternate';
    }
}           
// -------------------------------------------------------------------------
// Création du cadre pour l'affichage du pseudonyme
// -------------------------------------------------------------------------
PlayersClient.prototype.drawPseudoFrame = function(){
    this[this.indexCurrentPlayer].pseudoFrame = window.document.createElement('div');   
    this[this.indexCurrentPlayer].playerFrame.appendChild(this[this.indexCurrentPlayer].pseudoFrame);    
    this[this.indexCurrentPlayer].pseudoFrame.setAttribute('class', 'pseudoFrame'); 
    this[this.indexCurrentPlayer].pseudoFrame.style.backgroundColor = this[this.indexCurrentPlayer].couleur;

    switch (this[this.indexCurrentPlayer].couleur){
        case 'blue':
            this[this.indexCurrentPlayer].pseudoFrame.style.color = 'white';
        break;
        case 'red':
            this[this.indexCurrentPlayer].pseudoFrame.style.color = 'yellow';
        break;
        case 'yellow':
            this[this.indexCurrentPlayer].pseudoFrame.style.color = 'black';
        break;
        case 'green':
            this[this.indexCurrentPlayer].pseudoFrame.style.color = 'aquamarine';
        break;
        default:
            this[this.indexCurrentPlayer].pseudoFrame.style.color = 'white';
        break;
    }
    this[this.indexCurrentPlayer].pseudoFrame.innerHTML = this[this.indexCurrentPlayer].pseudo;
}
// -------------------------------------------------------------------------
// Création physique de l'espace d'affichage du compteur de pilules mangées
// -------------------------------------------------------------------------
PlayersClient.prototype.drawCounterFrame = function(){
    this[this.indexCurrentPlayer].counterFrame = window.document.createElement('div');   
    this[this.indexCurrentPlayer].playerFrame.appendChild(this[this.indexCurrentPlayer].counterFrame);     
    this[this.indexCurrentPlayer].counterFrame.setAttribute('class', 'counterFrame'); 
    this[this.indexCurrentPlayer].counterFrame.innerHTML = '0 / ' + this.maxPilsByPlayer;
}   
// -------------------------------------------------------------------------
// Création physique de l'espace d'affichage du compteur de temps passé
// -------------------------------------------------------------------------
PlayersClient.prototype.drawTimerFrame = function(){
    this[this.indexCurrentPlayer].timerFrame = window.document.createElement('div');   
    this[this.indexCurrentPlayer].playerFrame.appendChild(this[this.indexCurrentPlayer].timerFrame);  
    this[this.indexCurrentPlayer].timerFrame.setAttribute('class', 'timerFrame'); 
    this[this.indexCurrentPlayer].timerFrame.innerHTML = vToolBox.convertSecsToDaysHoursMinsSecs(this[this.indexCurrentPlayer].totalPlayedTime);
}
// -------------------------------------------------------------------------
// Création physique du cadre des données du joueur dans le "Control-Panel" 
// -------------------------------------------------------------------------
PlayersClient.prototype.drawPlayerFrame = function(){
    this[this.indexCurrentPlayer].playerFrame = window.document.createElement('div');   
    this.controlPanel.appendChild(this[this.indexCurrentPlayer].playerFrame);    
    this[this.indexCurrentPlayer].playerFrame.setAttribute('class', 'cadreJoueur');

    var widthCadreJoueur = parseInt(window.getComputedStyle(this[this.indexCurrentPlayer].playerFrame,null).getPropertyValue('width'));
    var vInterEspace = ((vToolBox.screenWidth - (widthCadreJoueur * this.maxPlayers)) / (this.maxPlayers + 1));
    this[this.indexCurrentPlayer].playerFrame.style.left = (vInterEspace * (this.currentPlayer + 1)) + (widthCadreJoueur * this.currentPlayer) + 'px';

    this.drawAvatar();
    this.drawPseudoFrame();
    this.drawCounterFrame();
    this.drawTimerFrame();
}
// -------------------------------------------------------------------------
// Création physique du jeton de l'avatar qui va être piloté par la souris
// -------------------------------------------------------------------------
PlayersClient.prototype.drawAvatarToken = function(){
    this[this.indexCurrentPlayer].containerAvatarToken = window.document.createElement('div');   
    window.document.body.appendChild(this[this.indexCurrentPlayer].containerAvatarToken);    
    this[this.indexCurrentPlayer].containerAvatarToken.setAttribute('class', 'containerAvatarToken');
    this[this.indexCurrentPlayer].containerAvatarToken.style.backgroundColor= this[this.indexCurrentPlayer].couleur;
    this[this.indexCurrentPlayer].containerAvatarToken.style.zIndex = '1000005';

    switch (this.currentPlayer){
        case 0:
            this[this.indexCurrentPlayer].containerAvatarToken.style.top = '184px';
            this[this.indexCurrentPlayer].containerAvatarToken.style.left =  '0';
        break;
        case 1:
            this[this.indexCurrentPlayer].containerAvatarToken.style.top = '184px';
            this[this.indexCurrentPlayer].containerAvatarToken.style.right =  '0';
        break;
        case 2:
            this[this.indexCurrentPlayer].containerAvatarToken.style.bottom = '0';
            this[this.indexCurrentPlayer].containerAvatarToken.style.left =  '0';
        break;
        case 3:
            this[this.indexCurrentPlayer].containerAvatarToken.style.bottom = '0';
            this[this.indexCurrentPlayer].containerAvatarToken.style.right =  '0';
        break;
        default:
        break;
    }

    this.rayon = parseInt(window.getComputedStyle(this[this.indexCurrentPlayer].containerAvatarToken,null).getPropertyValue('width')) / 2;
    this[this.indexCurrentPlayer].coordX =  parseInt(window.getComputedStyle(this[this.indexCurrentPlayer].containerAvatarToken,null).getPropertyValue('left')) + this.rayon; 
    this[this.indexCurrentPlayer].coordY =  parseInt(window.getComputedStyle(this[this.indexCurrentPlayer].containerAvatarToken,null).getPropertyValue('top')) + this.rayon;

    this[this.indexCurrentPlayer].avatarToken = window.document.createElement('img');   
    this[this.indexCurrentPlayer].containerAvatarToken.appendChild(this[this.indexCurrentPlayer].avatarToken);     
    this[this.indexCurrentPlayer].avatarToken.setAttribute('class', 'avatarToken');
    this[this.indexCurrentPlayer].avatarToken.setAttribute('src', this[this.indexCurrentPlayer].avatar);

    if (this.isItMe){    // Mise en évidence de l'avatar du joueur sur sa session et uniquement la sienne
        this[this.indexCurrentPlayer].avatarToken.style.animation = '0.3s linear infinite animeAvatarToken alternate';
    }
}           
// -------------------------------------------------------------------------
// Affichage de la fenetre de la liste et demande au serveurs de la liste 
// des joueurs
// -------------------------------------------------------------------------
PlayersClient.prototype.askPlayersList = function(pOuterBrdrWindowList, pWindowList, pWebSocketConnection){
    pOuterBrdrWindowList.style.display = 'block';
    pWindowList.style.display = 'block';
    pWebSocketConnection.emit('askPlayersList');
}
// -------------------------------------------------------------------------
// Affichage de la fenetre de la liste et demand au serveurs de la liste 
// des joueurs
// -------------------------------------------------------------------------
PlayersClient.prototype.displayDisclaimer = function(pOuterBrdrWindowList, pWindowList, pWebSocketConnection){
    pOuterBrdrWindowList.style.display = 'block';
    pWindowList.style.display = 'block';
    
    pWindowList.style.fontFamily = 'cursive, serif, sans-serif';
    pWindowList.style.color = '#6f3c13';
    pWindowList.style.fontStyle = 'normal';
    pWindowList.style.fontSize = '1.5em';

    var vInnerHTML = 
    '<h1>Avertissement</h1></br>' +
    'Ce jeu non "politiquement correct", a été créé suite à la polémique qui a éclaté à propos de Christopher Froome, peu avant le Tour de France 2018.</br></br>' +
    'Cette affaire venait s\'ajouter à tant d\'autres qui ont émaillé l\'Histoire du sport en général et du cyclisme en particulier : ' +
    '</br>'+
        '- Laurent Jalabert</br>'+
        '- Richard Virenque</br>'+
        '- Lance Armstrong</br>'+
        '- Marco Pantani</br>'+
        '- Jan Ullrich</br>'+
        '- Alberto Contador</br>'+
    '</ul>'+
        '...et tellement d\'autres, parmi les plus grands, qui ont avoué avoir pris des produits durant leur carrière, mais bien après la fin de celle-ci...</br>' + 
        'Certains en sont même morts, et aujourd\'hui, la 1ère affaire de dopage technologique est apparue avec un vélo électrique utilisé lors d\'une course amateur...</br>' +
        'Il n\'y a pas de limites dans la recherche de la performance assistée, et malheureusement, cela fait de gros dégâts parmi les sportifs "clean", dans l\'opinion publique, et c\'est bien triste pour eux et le sport en général... </br></br>' +
        'C\'est en pensant à tous ces sportifs "clean", que j\'ai conçu ce petit jeu, sans autre prétention que d\'apporter une note d\'humour décalée et qui gratte un peu, là où ça fait mal... Et ça fait souvent du bien finalement !!!... </br></br><hr></br>' +

        '<h1>Pitch du jeu</h1></br>' +
        'Willy Pouett, le soigneur de l\'équipe "Cretina", trop pressé, a fait tomber sa caisse de produits dopants, et toutes les gélules se sont mélangées en vrac dans la caisse.</br>' +
        'Les coureurs sont à quelques minutes du départ de la course et doivent <strong>impérativement ET rapidement</strong>, prendre leurs produits dopants qui ont été dosés et étudiés spécifiquement pour chacun d\'entr-eux.</br>' + 
        'Fort heureusement, chacune des gélules du traitement est repérée par une couleur spécifique à chaque coureur, qu\'il pourra donc s\`administrer sans risque d\'erreur.</br></br><hr></br>' +
        '<h1>Règles du jeu</h1></br>' +
        'Le but du jeu est de manger toutes les gélules de la couleur de votre avatar, le plus rapidement possible</br>' + 
        'Mais elles doivent être mangées dans un certain ordre, c\'est pour cette raison, que chacune des gélules clignote et tourne, jusqu\'à ce qu\'elle soit ingérée, et qu\'il n\'y en ait plus du tout...</br></br>' +
        'Après avoir saisi votre pseudo, vous arrivez dans la partie proprement dite, avec les pilules de couleur identique à l\'avatar qui clignote et qui vous représente.</br>' +
        'Le 1er joueur disponible est le "Maître du Jeu", c\'est lui qui va déclencher la partie.</br>'+
        'Votre Avatar, représenté par un jeton de couleur avec la photo de votre avatar, va s\'accrocher à votre souris et la suivre...</br>' + 
        'Vous n\'avez qu\'à la diriger sur la gélule de votre couleur, qui tourne pour la manger, puis la suivante, après une petite phase ou elle va changer de dimension alternativement quelque secondes, puis se mettre à tourner en attendant d\'être mangée à son tour, et ainsi de suite, jusqu\'à ce que le stock soit épuisé.</br></br>' +
        'Vous pouvez suivre votre progression sur le panneau qui concerne votre avatar en haut de l\'écran (Nombre de gélules mangées / Total de gélules, et cumul de temps de jeu).</br></br>' +
        'Vous pouvez accéder à la liste de tous les joueurs ayant participé à ce jeu, soit dans l\'écran principal (bouton "Podium" à gauche) , soit dans l\'écran de jeu, où vous disposez de ce même bouton, mais de taille réduite, au centre du panneau de contrôle, en haut de l\'écran.</br>' + 
        'Vous pouvez quitter cette liste (ainsi que l\'écran que vous êtes en train de lire actuellement) en appuyant sur n\'importe quelle touche du clavier...</br></br></br>' + 
        'Amusez-vous et prenez autant de plaisir que moi, qui me suis beaucoup amusé également en le créant...</br></br>' + 
        'L\'Auteur...</br></br><hr></br>' +
        '<h1>Règles de calcul des points et du ranking</h1></br>' +
        'Les points sont calculés selon le barême suivant :</br>' + 
        '1) Chaque participation a 1 partie vaut 10 points</br>' +
        '2) Chaque gélule mangée vaut 1 point</br>' + 
        '3) Chaque victoire vaut 100 points</br></br>' + 
        'Ceci donne nombre de points brut (TPB) qui est pondéré par le temps et le nombres de gélules mangées :</br>' +
        'Le nombre TOTAL de points (NTP) est calculé selon la méthode suivante :</br>' +
        'NTP = NTP + (TPB + (Temps de la dernière partie / Nbre de gélules mangées)) --> Total de points pondérés (TPP), qui vient s\'ajouter à vos points déjà enregistrés lors de précédentes parties</br></br>' +
        'Le ranking est calculé selon la méthode suivante :</br>' + 
        'Ranking = Nbre total de points / Nbre de parties jouées</br></br>' +
        'Bonne chance et Bon Jeu !!!</br></br></br></br>';

    pWindowList.innerHTML = vInnerHTML;
}
// -------------------------------------------------------------------------
// Affichage de la liste des joueurs
// -------------------------------------------------------------------------
PlayersClient.prototype.displayPlayersList = function(pWindowList, pDocuments){
    var vInnerHTML ='';

    vInnerHTML = 
    '<table>' +
        '<caption> Liste des joueurs ayant joué à "Tour De France"</caption>' + 
        '<thead>' +
            '<tr>' +
                '<th scope="col">Pseudo</th>' + 
                '<th scope="col">Nbre de parties</th>' +
                '<th scope="col">Parties gagnées</th>' +
                '<th scope="col">Parties perdues</th>' +
                '<th scope="col">Temps total de jeu</th>' +
                '<th scope="col">Nbre de points</th>' +
                '<th scope="col">Ranking</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>';

    pDocuments.forEach(function(player){
        vInnerHTML = vInnerHTML +        
            '<tr>' +
                '<th scope="row">'+player.pseudo +'</th>' +
                '<td>' + (player.nbrWonParties + player.nbrLostParties) + '</td>' +
                '<td>' + player.nbrWonParties + '</td>' +
                '<td>' + player.nbrLostParties + '</td>' +
                '<td>' + vToolBox.convertSecsToDaysHoursMinsSecs(player.totalPlayedTime) + '</td>' +
                '<td>' + player.totalPoints + '</td>' +
                '<td>' + player.ranking + '</td>' +
            '</tr>';
    });

    vInnerHTML = vInnerHTML +
        '</tbody>' +
    '</table>';

    pWindowList.innerHTML = vInnerHTML;
}
// --------------------------------------------------------------
// Guette l'appui d'une touche quelconque pour fermer la fenêtre
// --------------------------------------------------------------
PlayersClient.prototype.hidePalmaresAndRules = function(pOuterBrdrWindowList, pWindowList, event){
    pWindowList.innerHTML = '';
    pOuterBrdrWindowList.style.display = 'none';
}

