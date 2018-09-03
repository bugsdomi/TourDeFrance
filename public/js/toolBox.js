
// ************************************************************************
// ***                                                                  ***
// *** Objet : ToolBox                                                  ***
// ***                                                                  ***
// *** Cet objet contient différentes méthodes générales variées et trop***
// *** peu nombreuses pour definir une catégorie spécifique             ***
// *** Il s'enrichiera au fur et à mesure du temps de nouvelles méthodes***
// ***                                                                  ***
// *** - 1 Générateur de nombre aléatoire :                             ***
// ***     - random(ValeurInférieure, ValeurSupérieure                  ***
// ***                                                                  ***
// ***  Nécessite :                                                     ***
// ***      Une variable pour son instanciation                         ***
// ***                                                                  ***
// ************************************************************************
// --------------------------------------------------------------
function ToolBox(){
    this.screenWidth;              // Largeur de l'écran visible du navigateur
    this.screenHeight;             // Hauteur de l'écran visible du navigateur
    this.sensVertical = true;      // Constante pour la conversion Pourcentages / pixels
    this.sensHorizontal = false;   // Constante pour la conversion Pourcentages / pixels
}
// --------------------------------------------------------------
// Méthodes prototypées de l'objet "ToolBox"
// --------------------------------------------------------------
ToolBox.prototype.random = function(pValInf, pValSup){
    return Math.round(((pValSup - pValInf) * Math.random()) + pValInf);
}
// --------------------------------------------------------------
// Polyfill pour MSIE qui n'accepte pas la fonction Math.sign
// --------------------------------------------------------------
ToolBox.prototype.sign = function(x){
    return !(x = parseFloat(x)) ? x 
                                : x > 0 ? 1 
                                        : -1;
};
// --------------------------------------------------------------
ToolBox.prototype.getScreenSize = function(){
    this.screenWidth = (window.innerWidth);
    this.screenHeight = (window.innerHeight);
}
// --------------------------------------------------------------
ToolBox.prototype.refreshScreen = function(){   
    this.getScreenSize();
    window.location.href = window.location.href; // Apres un redimensionnement de l'écran, je le régénère from scratch;
}
// --------------------------------------------------------------
ToolBox.prototype.convertPercentToPixels = function(pValue,pOrientation){   
    return pOrientation ? (this.screenHeight / (100 / pValue))
                        : (this.screenWidth / (100 / pValue));
}
// --------------------------------------------------------------
// Transforme les secondes du joueurs stockées dans la BDD en H:Min:Sec
// --------------------------------------------------------------
ToolBox.prototype.addZero = function(pSection) { 
    return pSection < 10 ? '0' + pSection : pSection; 
};
// --------------------------------------------------------------
// Transforme les secondes du joueurs stockées dans la BDD en H:Min:Sec
// --------------------------------------------------------------
ToolBox.prototype.convertSecsToHoursMinsSecs = function(pNbreSecondes) {
    var vDate = new Date(pNbreSecondes * 1000); 
    var vFormattedTime = [];

    vFormattedTime.push(this.addZero(vDate.getHours()-1));
    vFormattedTime.push(this.addZero(vDate.getMinutes()));
    vFormattedTime.push(this.addZero(vDate.getSeconds()));

    return vFormattedTime.join(':');
}
// --------------------------------------------------------------
// Transforme les secondes du joueurs stockées dans la BDD en Jours:H:Min:Sec
// --------------------------------------------------------------
ToolBox.prototype.convertSecsToDaysHoursMinsSecs = function(pNbreSecondes) {
    var nbJours = Math.floor(pNbreSecondes/(86400));
    pNbreSecondes -= nbJours * 86400;
    return this.addZero(nbJours)+'j ' + this.convertSecsToHoursMinsSecs(pNbreSecondes);
}
