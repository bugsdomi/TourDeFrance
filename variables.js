// ************************************************************************
// ***                                                                  ***
// *** Variables                                                        ***
// ***                                                                  ***
// *** Cet objet contient différentes variable générales                ***
// *** Il s'entichira au fur et à mesure du temps de nouvelles méthodes ***
// ***                                                                  ***
// ************************************************************************
// --------------------------------------------------------------
var toolBox;                  // Instance de la boite à outil contenant des méthodes diverses
var vilCoyote;                // Instance de Vil-Coyote
var boiteControlPanel;        // Cadre contenant le panneau de controle de bas d'écran
var objectKeyFrame;           // Instance du gestionnaire des KeyFrames
var helpBtn;                  // variable du bouton 'Help' qui commande l'ouverture de l'écran d'aide
var helpScreen;               // Variable del'écran d'aide
var browserName;              // Variable contenant le nom du browser
var imgVictoire;              // Variable du message "Victoire"
var imgPerdu;                 // Variable du message "Perdu"
var imgRejouer;               // Variable du message "Rejouer"

var couleursPils = [
                    {
                        couleur : "blue",
                        image : "images/pil-blue-white.png"
                    }
    // cyan, green, orange, redBlack, red, violet, black, white, yellow
                    ];
var maxPilsParJoueur = 50;

var pils = [                         // Defini les pillules qui vont être mangées par les joueurs
        {           
            couleur : couleursPils.couleur,
            nonMangee : true
        }  
            ]        
        
// --------------------------------------------------------------

