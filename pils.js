// *************************************************************************
// ***      Pils : Objet representant une des cibles à manger            ***
// ***                                                                   ***
// *** Objet : Pils                                                      ***
// ***                                                                   ***
// *** Cet objet sert à gérer :                                          ***
// ***   - L'activation de la target active (le zoom/unzoom)             ***
// ***   - L'animation dub déplacement de la compétence dans sa case     ***
// ***                                                                   ***
// ***  Nécessite :                                                      ***
// ***      Une variable pour son instanciation                          ***
// ***      Le module ancêtre "spriteAncestor.js"                        ***
// ***      Le module "tooBox.js"                                        ***
// ***                                                                   ***
// *************************************************************************

module.exports = function Pils() {             // Fonction constructeur de Sprite "Pils"
    this.mangee= false;
    this.left;
    this.top;
    this.orientation;
    this.zIndex;

    // --------------------------------------------------------------
    // Génération d'un nombre aléatoire entre [pValInf,pValSup]
    // --------------------------------------------------------------
    Pils.prototype.random = function(pValInf, pValSup){
        return Math.round(((pValSup - pValInf) * Math.random()) + pValInf);
    }
    // --------------------------------------------------------------
    // Définition des caratéristiques des pilules (couleurs, position, orientation)
    // --------------------------------------------------------------
    Pils.prototype.initVar = function(pDataScreenSize){    
        // calcul de positions aléatoires sous contraintes (pas aux bords de l'ecran et jamais au-dessus du Control-Panel)
        this.left= this.random(10,Math.round(pDataScreenSize.vScreenWidth - 80))+'px';
        this.top = this.random(200,Math.round(pDataScreenSize.vScreenHeight - 50))+'px';
        this.orientation=(this.random(0,360));
        this.zIndex=this.random(1,999999);
    };
    // --------------------------------------------------------------
    //  Animation qui met en évidence la prochaine target à toucher
    // --------------------------------------------------------------
    Pils.prototype.affichePilsActive = function(){
        this.sprite.style.animation = '0.3s linear infinite animeImage alternate';
    };
    // --------------------------------------------------------------
    //  Lorsque Vil-Coyote touche la target clignotante, la compétence qui lui est liée est affichée dans le Control-Panel
    // --------------------------------------------------------------
    Pils.prototype.mangePils = function(){ 
        this.sprite.src=competence[dataPils.targetActif].image;
        this.sprite.style.width = '100%';
        this.sprite.style.height = '100%';
    }
}

