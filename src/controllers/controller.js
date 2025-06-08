import { Components } from '../components/componentBase';
import { ComponentsAdd } from '../components/componentsAdd';
import { ComponentController } from '../components/componentController';
import { MessagesController } from './message.js';
import dbData from '../database/db.json';
import { ServiceValidation } from '../services/service.js';

const popupConnexion = document.querySelector("#popupConnexion");
const btnConnexion = document.querySelector("#btnConnexion");


const afficherErreur = (message, elementId) => {
    const errorElement = document.querySelector(`#${elementId}Error`);
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
};

const cacherErreur = (elementId) => {
    const errorElement = document.querySelector(`#${elementId}Error`);
    errorElement.classList.add('hidden');
};

const connexion = async(e) => {
    e.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    try {
        await ServiceValidation.validerNumero(username);
        cacherErreur('username');

        const response = await fetch(`http://localhost:3000/utilisateurs?numero=${username}&password=${password}`);
        const utilisateurs = await response.json();

        if (utilisateurs.length === 0) {
            const nouvelUtilisateur = {
                id: username,
                numero: username,
                password: password,
                contacts: [],
                groupes: [],
                messages: []
            };

            await ServiceValidation.verifierNumeroExistant(username);

            const createResponse = await fetch('http://localhost:3000/utilisateurs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nouvelUtilisateur)
            });

            if (!createResponse.ok) {
                throw new Error("Erreur lors de la création du compte");
            }
        }

        popupConnexion.classList.replace("flex", "hidden");
        sessionStorage.setItem("isLoggedIn", true);
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("userId", username);

        await MessagesController.chargerDonnees();
        MessagesController.afficherAllMessages();

    } catch (error) {
        afficherErreur(error.message, 'username');
    }
}

const verifierConnexion = async function() {
    const est_connecte = sessionStorage.getItem("isLoggedIn");
    if (est_connecte) {
        popupConnexion.classList.replace("flex", "hidden");

        await MessagesController.chargerDonnees();
        MessagesController.afficherAllMessages();
    }
}

btnConnexion.addEventListener("click", connexion)
document.addEventListener("DOMContentLoaded", verifierConnexion);

const logoutBtn = document.querySelector("#logoutBtn");

const BtnDeconnexion = () => {

    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    popupConnexion.classList.replace("hidden", "flex");


};

logoutBtn.addEventListener('click', BtnDeconnexion);

const ListeMessages = document.querySelector("#ListeMessages");
let currentChatId = null;

document.addEventListener('DOMContentLoaded', () => {

    const addButton = document.querySelector('#add');
    if (addButton) {
        addButton.addEventListener('click', () => {
            if (dbData.contact || dbData.groupe) {
                ListeMessages.innerHTML = ComponentsAdd.nouveauMenu(dbData);
                attacherGestionnairesMenu();
            }
        });
    }


    document.addEventListener('click', (e) => {
        const chatItem = e.target.closest('.chat-item');
        if (chatItem) {
            currentChatId = chatItem.dataset.chatId;
            MessagesController.afficherConversation(currentChatId);
        }
    });


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

    document.addEventListener('donneesMisesAJour', (e) => {
        if (ListeMessages.querySelector('.chat-item')) {
            ListeMessages.innerHTML = ComponentsAdd.nouveauMenu(e.detail);
            attacherGestionnairesMenu();
        }
    });
});

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
        });
    }
}

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