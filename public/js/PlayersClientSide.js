// -------------------------------------------------------------------------
// stockage des informations techniques des joueurs et des  coordonnées de leurs 
// pilules qui vont être générées pour le player
// 4 joueurs maximum - 50 pilules pour chacun 
// -------------------------------------------------------------------------
function PlayersClient(){    
// Les propriétés ci-dessous sont modifiables sans aucun problème
    this.precision = 30;                                // Distance minimum en pixels entre le centre du Jeton et le centre de la Pils pour determiner si elle est mangée (+ grand = +facile)
    this. delayToreset = 10;                            // Délai en secondes accordé aux joueurs pour admirer, faire des Screen-Shots, etc..., avant de revenir à l'écran principal

// NE PAS MODIFIER Les propriétés ci-dessous !!!!
    this.currentPlayer = -1;                            // Joueur en train d etre traité sur ce client : CE N EST PAS OBLIGATOIREMENT le joueur de ce client
    this.indexCurrentPlayer = '';                       // Indice développé du joueur à afficher dans la session courante ('player0'...)
    this.maxPlayers = -1;
    this.maxPilsByPlayer = -1;
    this.isItMe = false;                                // Flag permettaznt d'identifier le Joeur correspondant à ce client
    this.nextPils = -1;                                 // Pils désignée pour être la prochaine à être mangée
    this.nextPilsX = -1;                                // Coordonnée X de la Pils désignée pour être la prochaine à être mangée (mémorisée à part pour eviter des calcules recurrents)
    this.nextPilsY = -1;                                // Coordonnée X de la Pils désignée pour être la prochaine à être mangée (mémorisée à part pour eviter des calcules recurrents)

    this.ControlPanel;                                  // Panneau de controle contenant les avatars, les pseudo + Mails, et leur score 
    this.myClientPlayer = '';                           // Variable qui servira de raccourci pour l'objet "n" et diminuera la longueur du code  ('player0' à 'player3')
    this.myNumPlayer = -1;                              // Pendant de la variable ci-dessus mais sans le préfixe 'player' 'player3')
    this.distance= -1;                                  // Stocke la distance calculée entre 2 (utilisée lors de la detection de la Pils mangée)
    this.vainqueurTrouve = false;                       // Flag permettant de determiner le vainqueur dès que le 1er joueur a mangé toutes ses pils 
    this.vAdviseBtn;                                    // Instance du bouton afin de pouvoir simuler son click de n'importe
    
    this.player0 =
    {
        pseudo : '',                                     // Pseudo du joueur dans la partie
        couleur : '',                                    // Couleur du joueur
        avatar : '',                                     // Avatar du joueur
        containerAvatarToken : undefined,                // Conteneur du jeton qui sera piloté par la souris
        coordX : undefined,                              // Coordonnées en X du jeton du joueur (coordonnées pures, sans 'px')
        coordY : undefined,                              // Coordonnées en Y du jeton du joueur (coordonnées pures, sans 'px')
        rayon : undefined,                               // Taille du rayon du conteneur du jeton
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
        couleur : '',                                    // Couleur du joueur
        avatar : '',                                     // Avatar du joueur
        containerAvatarToken : undefined,                // Conteneur du jeton qui sera piloté par la souris
        coordX : undefined,                              // Coordonnées en X du jeton du joueur (coordonnées pures, sans 'px')
        coordY : undefined,                              // Coordonnées en Y du jeton du joueur (coordonnées pures, sans 'px')
        rayon : undefined,                               // Taille du rayon du conteneur du jeton
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
        couleur : '',                                    // Couleur du joueur
        avatar : '',                                     // Avatar du joueur
        containerAvatarToken : undefined,                // Conteneur du jeton qui sera piloté par la souris
        coordX : undefined,                              // Coordonnées en X du jeton du joueur (coordonnées pures, sans 'px')
        coordY : undefined,                              // Coordonnées en Y du jeton du joueur (coordonnées pures, sans 'px')
        rayon : undefined,                               // Taille du rayon du conteneur du jeton
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
        couleur : '',                                    // Couleur du joueur
        avatar : '',                                     // Avatar du joueur
        containerAvatarToken : undefined,                // Conteneur du jeton qui sera piloté par la souris
        coordX : undefined,                              // Coordonnées en X du jeton du joueur (coordonnées pures, sans 'px')
        coordY : undefined,                              // Coordonnées en Y du jeton du joueur (coordonnées pures, sans 'px')
        rayon : undefined,                               // Taille du rayon du conteneur du jeton
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
        this.advise('Veuillez remplir le champ "Pseudo" en respectant le format : '+
                    'Initiale en Majuscule, suivie de 0 à 11 caractères alphanumériques','Fermer');
        return false;
    } else {
        return true;
    }
}
// --------------------------------------------------------------
// Fenêtre améliorée de messsage, avec un bouton permettant sa validation 
// et declenchant une action passée en paramètre
// --------------------------------------------------------------
PlayersClient.prototype.advise = function(pMessage, pMessageAction, pAction, pMyPlayer, pWebSocketConnection){   
    var vAdviseWindow = window.document.createElement('form');   
    window.document.body.appendChild(vAdviseWindow);  
    vAdviseWindow.style.background = 'linear-gradient(0.75turn, rgba(252,141,50), rgba(230,159,42))';

    var vAdviseLegend = window.document.createElement('legend');   
    vAdviseWindow.appendChild(vAdviseLegend);  
    vAdviseLegend.innerHTML = pMessage;
    
    var vAdviseOL = window.document.createElement('ol');   
    vAdviseWindow.appendChild(vAdviseOL);  
    
    var vAdviseLi = window.document.createElement('li');   
    vAdviseOL.appendChild(vAdviseLi);  
    
    this.vAdviseBtn = window.document.createElement('button');   
    vAdviseLi.appendChild(this.vAdviseBtn);  
    this.vAdviseBtn.setAttribute('class', 'cButton');
    this.vAdviseBtn.setAttribute('type', 'button');
    this.vAdviseBtn.innerHTML = pMessageAction;

    vAdviseWindow.style.zIndex = '1000000';
    vAdviseWindow.style.display = 'block';

    this.vAdviseBtn.addEventListener('click', function(){
        this.vAdviseBtn.parentNode.removeChild(this.vAdviseBtn);
        vAdviseLi.parentNode.removeChild(vAdviseLi);            // Suppression de la fenêtre d'avertissement du DOM
        vAdviseOL.parentNode.removeChild(vAdviseOL);
        vAdviseLegend.parentNode.removeChild(vAdviseLegend);
        vAdviseWindow.parentNode.removeChild(vAdviseWindow);

        pAction.call(this,pMyPlayer,pWebSocketConnection);     // Lancement de l'action correspondante à celle indiquée sur le bouton de la fenêtre d'avertissement
    }.bind(this));
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
    if (this[this.myClientPlayer].tokenCaptured){
        this[this.myClientPlayer].containerAvatarToken.style.left = vMouseCoord.left - (this[this.myClientPlayer].rayon)+ 'px';
        this[this.myClientPlayer].containerAvatarToken.style.top = vMouseCoord.top - (this[this.myClientPlayer].rayon)+ 'px';
        
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
            this.advise('VICTOIRE !!! Vous avez gagné', 'Terminer', this.restartLogin);
            this.endOfParty(pWebSocketConnection)
        }
    }
}
/// -------------------------------------------------------------------------
// Fin de la partie - 
// Restauration du curseur de souris standard
// Détachement du Jeton du joueur  de la souris
// -------------------------------------------------------------------------
PlayersClient.prototype.clearParty = function(){
    document.body.style.cursor = 'default';
    this[this.myClientPlayer].tokenCaptured = false;
    window.removeEventListener("mousemove", this.playAndEatPils.bind(this)); 
    this.timerToExit();
}
/// -------------------------------------------------------------------------
// Fin de la partie - 
// Notification aux autres joueurs de la fin de partie
// -------------------------------------------------------------------------
PlayersClient.prototype.endOfParty = function(pWebSocketConnection){
    this.clearParty();
    var vMyClient = { 
        monClientPlayer : this.myClientPlayer,
        monNumPlayer : this.myNumPlayer,
    }
    pWebSocketConnection.emit('stopGame',vMyClient);
}
// -------------------------------------------------------------------------
// Lancement du jeu
// -------------------------------------------------------------------------
PlayersClient.prototype.startGame = function(pMyPlayer, pWebSocketConnection){   
    pWebSocketConnection.emit('startGame',pMyPlayer);
}
// -------------------------------------------------------------------------
// Ce timer a pour fonction de sortir les joueurs au bout d'un certain temps
// après la fin de la partie, s'ils n'ont pas actionné eux-même le boutoin 
// de retour à l'écran de Login
// -------------------------------------------------------------------------
PlayersClient.prototype.timerToExit = function(pMyPlayer, pWebSocketConnection){   
    setTimeout(function(){
        this.vAdviseBtn.click();
    }.bind(this), this.delayToreset * 1000);
}
/// -------------------------------------------------------------------------
// Création physique du "Control-Panel", version "Photo du Tour de France"
// -------------------------------------------------------------------------
PlayersClient.prototype.drawControlPanel = function(){
    this.controlPanel = window.document.createElement('div');   
    window.document.body.appendChild(this.controlPanel);  
    this.controlPanel.setAttribute('class', 'controlPanel');
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
    this[this.indexCurrentPlayer].timerFrame.innerHTML = '0h 0mn 0sec';
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

    this[this.indexCurrentPlayer].rayon = parseInt(window.getComputedStyle(this[this.indexCurrentPlayer].containerAvatarToken,null).getPropertyValue('width')) / 2;
    this[this.indexCurrentPlayer].coordX =  parseInt(window.getComputedStyle(this[this.indexCurrentPlayer].containerAvatarToken,null).getPropertyValue('left')) + 
                                            this[this.indexCurrentPlayer].rayon; 
    this[this.indexCurrentPlayer].coordY =  parseInt(window.getComputedStyle(this[this.indexCurrentPlayer].containerAvatarToken,null).getPropertyValue('top')) +                                               this[this.indexCurrentPlayer].rayon;

    this[this.indexCurrentPlayer].avatarToken = window.document.createElement('img');   
    this[this.indexCurrentPlayer].containerAvatarToken.appendChild(this[this.indexCurrentPlayer].avatarToken);     
    this[this.indexCurrentPlayer].avatarToken.setAttribute('class', 'avatarToken');
    this[this.indexCurrentPlayer].avatarToken.setAttribute('src', this[this.indexCurrentPlayer].avatar);

    if (this.isItMe){    // Mise en évidence de l'avatar du joueur sur sa session et uniquement la sienne
        this[this.indexCurrentPlayer].avatarToken.style.animation = '0.3s linear infinite animeAvatarToken alternate';
    }
}           
