import { NotificationComponent } from '../components/componentNotification.js';
import { BadgeController } from './badgeController.js';

export const NotificationController = (() => ({
    async initialiser() {
        // Demander la permission pour les notifications
        await NotificationComponent.demanderPermission();
        
        // Démarrer la surveillance des nouveaux messages
        this.demarrerSurveillance();
    },

    demarrerSurveillance() {
        // Vérifier les nouveaux messages toutes les 5 secondes
        setInterval(() => {
            this.verifierNouveauxMessages();
        }, 5000);
    },

    async verifierNouveauxMessages() {
        try {
            const userId = sessionStorage.getItem("userId");
            if (!userId) return;

            const response = await fetch(`https://backendwhatsapp-twxo.onrender.com/utilisateurs/${userId}`);
            const userData = await response.json();

            // Vérifier les nouveaux messages dans les contacts
            if (userData.contacts) {
                userData.contacts.forEach(contact => {
                    if (contact.nbreNonLu > 0) {
                        const dernierMessage = contact.messages[contact.messages.length - 1];
                        if (dernierMessage && dernierMessage.envoyeur !== userId) {
                            // Nouveau message reçu
                            this.traiterNouveauMessage(contact, dernierMessage);
                        }
                    }
                });
            }

            // Vérifier les nouveaux messages dans les groupes
            if (userData.groupes) {
                userData.groupes.forEach(groupe => {
                    if (groupe.nbreNonLu > 0) {
                        const dernierMessage = groupe.messages[groupe.messages.length - 1];
                        if (dernierMessage && dernierMessage.envoyeur !== userId) {
                            // Nouveau message de groupe reçu
                            this.traiterNouveauMessageGroupe(groupe, dernierMessage);
                        }
                    }
                });
            }

        } catch (error) {
            console.error('Erreur lors de la vérification des messages:', error);
        }
    },

    traiterNouveauMessage(contact, message) {
        const expediteur = `${contact.prenom} ${contact.nom}`;
        let contenuMessage = '';

        switch (message.type) {
            case 'text':
                contenuMessage = message.texte;
                break;
            case 'audio':
                contenuMessage = '🎵 Message vocal';
                break;
            case 'image':
                contenuMessage = '📷 Image';
                break;
            case 'video':
                contenuMessage = '🎥 Vidéo';
                break;
            default:
                contenuMessage = 'Nouveau message';
        }

        // Afficher notification seulement si la fenêtre n'est pas active
        if (document.hidden) {
            NotificationComponent.notifierNouveauMessage(expediteur, contenuMessage, contact.id);
        }

        // Jouer un son de notification
        this.jouerSonNotification();
    },

    traiterNouveauMessageGroupe(groupe, message) {
        const expediteur = `${groupe.nom}`;
        let contenuMessage = '';

        switch (message.type) {
            case 'text':
                contenuMessage = message.texte;
                break;
            case 'audio':
                contenuMessage = '🎵 Message vocal';
                break;
            case 'image':
                contenuMessage = '📷 Image';
                break;
            case 'video':
                contenuMessage = '🎥 Vidéo';
                break;
            default:
                contenuMessage = 'Nouveau message';
        }

        // Afficher notification seulement si la fenêtre n'est pas active
        if (document.hidden) {
            NotificationComponent.notifierNouveauMessage(expediteur, contenuMessage, groupe.id);
        }

        // Jouer un son de notification
        this.jouerSonNotification();
    },

    jouerSonNotification() {
        try {
            // Créer un son de notification simple
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            console.log('Impossible de jouer le son de notification');
        }
    },

    notifierStatut(auteur) {
        if (document.hidden) {
            NotificationComponent.notifierNouveauStatut(auteur);
        }
    }
}))();