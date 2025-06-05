import { Components } from '../components/componentBase';
import { ComponentsAdd } from '../components/componentsAdd';
import { ComponentController } from '../components/componentController';
import { MessagesController } from './message.js';
import dbData from '../database/db.json';

const ListeMessages = document.querySelector("#ListeMessages");
let currentChatId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Charger les données sauvegardées
    MessagesController.chargerDonnees();
    MessagesController.afficherAllMessages();

    // Gestionnaire pour le bouton d'ajout
    const addButton = document.querySelector('#add');
    if (addButton) {
        addButton.addEventListener('click', () => {
            ListeMessages.innerHTML = ComponentsAdd.nouveauMenu(dbData);
            attacherGestionnairesMenu();
        });
    }

    // Gestionnaire pour les conversations
    document.addEventListener('click', (e) => {
        const chatItem = e.target.closest('.chat-item');
        if (chatItem) {
            currentChatId = chatItem.dataset.chatId;
            MessagesController.afficherConversation(currentChatId);
        }
    });

    // Gestionnaires pour l'envoi de messages
    const messageInput = document.querySelector('#messageInput');
    const sendButton = document.querySelector('#sendButton');

    const envoyerMessage = () => {
        const message = messageInput.value.trim();
        if (message && currentChatId) {
            messageInput.value = '';
            messageInput.focus();
            MessagesController.envoyerMessage(currentChatId, message);
        }
    };

    if (sendButton) {
        sendButton.addEventListener('click', envoyerMessage);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                envoyerMessage();
            }
        });
    }

    // Écouter les mises à jour des données
    document.addEventListener('donneesMisesAJour', (e) => {
        // Mettre à jour l'interface si nécessaire
        if (ListeMessages.querySelector('.chat-item')) {
            ListeMessages.innerHTML = ComponentsAdd.nouveauMenu(e.detail);
            attacherGestionnairesMenu();
        }
    });
});

// Fonction pour attacher les gestionnaires d'événements au menu
function attacherGestionnairesMenu() {
    const backButton = document.querySelector('#backButton');
    const newGroup = document.querySelector('#newGroup');
    const newContact = document.querySelector('#newContact');
    const newCommunity = document.querySelector('#newCommunity');

    if (backButton) {
        backButton.addEventListener('click', () => {
            MessagesController.afficherAllMessages();
        });
    }

    if (newGroup) {
        newGroup.addEventListener('click', () => {
            console.log('Création de groupe');
            // TODO: Implémenter la création de groupe
        });
    }

    if (newContact) {
        newContact.addEventListener('click', () => {
            document.body.insertAdjacentHTML('beforeend', ComponentsAdd.popupNouveauContact());
            attacherGestionnairesContact();
        });
    }

    if (newCommunity) {
        newCommunity.addEventListener('click', () => {
            console.log('Création de communauté');
            // TODO: Implémenter la création de communauté
        });
    }
}

// Fonction pour attacher les gestionnaires au formulaire de contact
function attacherGestionnairesContact() {
    const popup = document.querySelector('.fixed');
    const contactForm = document.querySelector('#contactForm');
    const closePopup = document.querySelector('#closePopup');
    const cancelButton = document.querySelector('#cancelButton');

    const fermerPopup = () => popup.remove();

    if (closePopup) {
        closePopup.addEventListener('click', fermerPopup);
    }
    if (cancelButton) {
        cancelButton.addEventListener('click', fermerPopup);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            const nouveauContact = {
                id: formData.get('numero'),
                numero: formData.get('numero'),
                prenom: formData.get('prenom'),
                nom: formData.get('nom'),
                lastMessage: "",
                nbreNonLu: 0,
                messages: [],
                epingler: false,
                archiver: false
            };

            try {
                const succes = await MessagesController.sauvegarderContact(nouveauContact);
                if (succes) {
                    fermerPopup();
                    ListeMessages.innerHTML = ComponentsAdd.nouveauMenu(dbData);
                    attacherGestionnairesMenu();
                    alert('Contact ajouté avec succès !');
                } else {
                    throw new Error('Échec de la sauvegarde');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors de l\'enregistrement du contact');
            }
        });
    }
}