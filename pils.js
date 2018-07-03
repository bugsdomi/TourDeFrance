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
            this.idSprite;            // Sprite Pillule" qui va être créée            
            
            this.initVar = function(pColor){            
                this.sprite = document.createElement('div');
                document.body.appendChild(this.sprite);  
                
                // Affichage du fond d'écran brouilleur
                this.sprite.style.position= 'absolute';
                this.sprite.style.backgroundImage= 'url("images/pil-blue-white.png")';
                this.sprite.style.backgroundSize= 'contain';
                this.sprite.style.backgroundRepeat= 'no-repeat';

                // Définition des caratéristiques des pilules (couleurs, taille, position, orientation)
                this.sprite.style.width= '8%';
                this.sprite.style.height= '8%';
                // this.sprite.id= Math.random()*10000<<0;
                // this.sprite.innerHTML= vMonCarre.id;      

                // calcul de positions aléatoires sous contraintes (pas aux bords de l'ecran et jamais au-dessus du Control-Panel)
                this.sprite.style.left= toolBox.random(10,(toolBox.screenWidth - (toolBox.convertPercentToPixels(parseInt(this.sprite.style.width),false) + 10)))+'px';

                this.sprite.style.top = toolBox.random((parseInt(getComputedStyle(boiteControlPanel).height) + 10),(toolBox.screenHeight - (toolBox.convertPercentToPixels(parseInt(this.sprite.style.height),false))))+'px';

                this.sprite.style.transformOrigin='center';
                this.sprite.style.transform='rotate('+(toolBox.random(0,360))+'deg)';
            };
            // --------------------------------------------------------------
            //  Animation qui met en évidence la prochaine target à toucher
            // --------------------------------------------------------------
            this.affichePilsActive = function(){
                this.sprite.style.animation = '0.3s linear infinite animeImage alternate';
            };
            // --------------------------------------------------------------
            //  Lorsque Vil-Coyote touche la target clignotante, la compétence qui lui est liée est affichée dans le Control-Panel
            // --------------------------------------------------------------
            this.mangePils = function(){ 
                this.sprite.src=competence[dataPils.targetActif].image;
                this.sprite.style.width = '100%';
                this.sprite.style.height = '100%';
            }
        }

