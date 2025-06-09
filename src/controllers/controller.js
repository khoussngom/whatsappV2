import { Components } from '../components/componentBase';
import { ComponentsAdd } from '../components/componentsAdd';
import { ComponentController } from '../components/componentController';
import { MessagesController } from './message.js';
import dbData from '../database/db.json';
import { ServiceValidation } from '../services/service.js';
import { contact } from '../models/contact.js';

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
    console.log("Fonction connexion appelée");
    e.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    try {
        await ServiceValidation.validerNumero(username);
        cacherErreur('username');

        const response = await fetch(`http://localhost:3000/utilisateurs?numero=${username}`);
        if (!response.ok) throw new Error("Erreur de connexion au serveur");

        const utilisateurs = await response.json();
        const utilisateur = utilisateurs.find(u => u.numero === username && u.password === password);

        if (!utilisateur) {
            throw new Error("Numéro ou mot de passe incorrect");
        }

        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("userId", utilisateur.id);

        popupConnexion.classList.replace("flex", "hidden");

        await contact.chargerDonnees();
        MessagesController.afficherAllMessages();

    } catch (error) {
        console.error("Erreur de connexion:", error);
        afficherErreur(error.message, 'username');
    }
}

const verifierConnexion = async function() {
    const est_connecte = sessionStorage.getItem("isLoggedIn");
    const userId = sessionStorage.getItem("userId");

    console.log("Vérification connexion:", { est_connecte, userId });

    if (est_connecte === "true" && userId) {
        popupConnexion.classList.replace("flex", "hidden");
        try {
            await contact.chargerDonnees();
            MessagesController.afficherAllMessages();
        } catch (error) {
            console.error("Erreur lors de la vérification:", error);

            sessionStorage.clear();
            popupConnexion.classList.replace("hidden", "flex");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM chargé");


    const formConnexion = document.querySelector("#formConnexion");
    if (formConnexion) {
        formConnexion.addEventListener("submit", connexion);
        console.log("Événement de connexion attaché au formulaire");
    } else {
        console.error("Formulaire de connexion non trouvé");
    }

    verifierConnexion();
});

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
            const chatId = chatItem.dataset.chatId;
            MessagesController.definirChatActif(chatId);
            MessagesController.afficherConversation(chatId);
        }
    });

    const handleSendMessage = async() => {
        const messageInput = document.querySelector('#messageInput');
        const message = messageInput.value.trim();

        if (!message) return;

        if (!MessagesController.chatActif) {
            console.error('Aucune conversation active');
            return;
        }

        const success = await MessagesController.envoyerMessage(message);
        if (success) {
            console.log('Message envoyé avec succès');
            messageInput.value = '';
            messageInput.focus();
        }
    };

    document.addEventListener('click', async(e) => {
        if (e.target.id === 'sendMessageBtn' || e.target.closest('#sendMessageBtn')) {
            await handleSendMessage();
        }
    });

    document.addEventListener('keypress', async(e) => {
        if (e.target.id === 'messageInput' && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await handleSendMessage();
        }
    });
});

document.addEventListener('click', (e) => {
    const menuExistant = document.querySelector('.menu-contextuel');
    if (menuExistant && !e.target.closest('.menu-contextuel')) {
        menuExistant.remove();
    }


    const trigger = e.target.closest('.menu-trigger');
    if (trigger) {
        e.preventDefault();
        e.stopPropagation();

        const chatId = trigger.dataset.chatId;


        if (menuExistant) {
            menuExistant.remove();
        }


        const menu = document.createElement('div');
        menu.className = 'menu-contextuel';
        menu.innerHTML = `
            <div class="menu-contextuel-option modifier-contact" data-chat-id="${chatId}">
                <i class='bx bx-edit mr-2'></i> Modifier le contact
            </div>
            <div class="menu-contextuel-option supprimer-contact" data-chat-id="${chatId}">
                <i class='bx bx-trash mr-2'></i> Supprimer le contact
            </div>
        `;

        const rect = trigger.getBoundingClientRect();
        const parentRect = trigger.closest('.chat-item').getBoundingClientRect();

        menu.style.top = `${rect.bottom - parentRect.top}px`;
        menu.style.left = `${rect.left - parentRect.left}px`;

        trigger.closest('.chat-item').appendChild(menu);

        menu.querySelector('.modifier-contact').addEventListener('click', () => {
            console.log('Modifier contact:', chatId);
            menu.remove();
        });

        menu.querySelector('.supprimer-contact').addEventListener('click', async() => {

            try {
                await supprimerContact(chatId);
                menu.remove();
                MessagesController.afficherAllMessages();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        });
    }
});

document.body.addEventListener('click', async(e) => {

    if (e.target.closest('.modifier-contact')) {
        const chatId = e.target.closest('.modifier-contact').dataset.chatId;


        const contactToEdit = dbData.contact.find(c => c.id === chatId);

        if (contactToEdit) {

            ListeMessages.innerHTML = Components.AjoutContact({
                mode: 'edition',
                contact: contactToEdit
            });

            const formContact = document.querySelector('#form-contact');
            const retourListe = document.querySelector('#retour-liste');

            if (formContact) {
                formContact.addEventListener('submit', async(e) => {
                    e.preventDefault();
                    const formData = new FormData(formContact);

                    const contactModifie = {
                        id: chatId,
                        prenom: formData.get('prenom'),
                        nom: formData.get('nom'),
                        numero: formData.get('telephone')
                    };

                    try {
                        const success = await contact.modifierContact(chatId, contactModifie);
                        if (success) {
                            MessagesController.afficherAllMessages();
                        }
                    } catch (error) {
                        console.error('Erreur lors de la modification:', error);
                    }
                });
            }

            if (retourListe) {
                retourListe.addEventListener('click', () => {
                    MessagesController.afficherAllMessages();
                });
            }
        }

        const menuContextuel = document.querySelector('.menu-contextuel');
        if (menuContextuel) {
            menuContextuel.remove();
        }
    }

    if (e.target.closest('.supprimer-contact')) {
        const chatId = e.target.closest('.supprimer-contact').dataset.chatId;

        document.body.insertAdjacentHTML('beforeend', Components.PopupSuppression(chatId));

        const menuContextuel = document.querySelector('.menu-contextuel');
        if (menuContextuel) {
            menuContextuel.remove();
        }
    }

    if (e.target.id === 'annuler-suppression') {
        const popup = document.querySelector('#popup-overlay');
        if (popup) {
            popup.remove();
        }
    }

    if (e.target.id === 'confirmer-suppression') {
        const chatId = e.target.dataset.chatId;
        const userId = sessionStorage.getItem('userId');

        try {
            const response = await fetch(`http://localhost:3000/utilisateurs/${userId}`);
            if (!response.ok) throw new Error('Erreur de récupération des données');

            const userData = await response.json();

            userData.contacts = userData.contacts.filter(c => c.id !== chatId);

            const updateResponse = await fetch(`http://localhost:3000/utilisateurs/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contacts: userData.contacts
                })
            });

            if (!updateResponse.ok) throw new Error('Erreur lors de la suppression');

            const popup = document.querySelector('#popup-overlay');
            if (popup) {
                popup.remove();
            }

            MessagesController.afficherAllMessages();

        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM chargé");


    const formConnexion = document.querySelector("#formConnexion");
    if (formConnexion) {
        formConnexion.addEventListener("submit", connexion);
        console.log("Événement de connexion attaché au formulaire");
    } else {
        console.error("Formulaire de connexion non trouvé");
    }

    verifierConnexion();
});

document.addEventListener('click', (e) => {
    const chatItem = e.target.closest('.chat-item');
    if (chatItem) {
        const chatId = chatItem.dataset.chatId;
        MessagesController.afficherConversation(chatId);
    }
});

document.addEventListener('click', async(e) => {
    if (e.target.id === 'newContact' || e.target.closest('#newContact')) {
        const ListeMessages = document.querySelector('#ListeMessages');
        ListeMessages.innerHTML = Components.AjoutContact({ mode: 'creation' });

        const formContact = document.querySelector('#form-contact');
        const retourListe = document.querySelector('#retour-liste');

        if (formContact) {
            formContact.addEventListener('submit', async(e) => {
                e.preventDefault();
                const formData = new FormData(formContact);

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
                    const success = await contact.sauvegarderContact(nouveauContact);
                    if (success) {
                        MessagesController.afficherAllMessages();
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'ajout:', error);
                }
            });
        }

        if (retourListe) {
            retourListe.addEventListener('click', () => {
                MessagesController.afficherAllMessages();
            });
        }
    }

    if (e.target.closest('.modifier-contact')) {
        const chatId = e.target.closest('.modifier-contact').dataset.chatId;
        const contactToEdit = dbData.contact.find(c => c.id === chatId);

        if (contactToEdit) {
            const ListeMessages = document.querySelector('#ListeMessages');
            ListeMessages.innerHTML = Components.AjoutContact({
                mode: 'edition',
                contact: contactToEdit
            });

            const formContact = document.querySelector('#form-contact');
            const retourListe = document.querySelector('#retour-liste');

            if (formContact) {
                formContact.addEventListener('submit', async(e) => {
                    e.preventDefault();
                    const formData = new FormData(formContact);

                    const contactModifie = {
                        id: chatId,
                        numero: formData.get('numero'),
                        prenom: formData.get('prenom'),
                        nom: formData.get('nom')
                    };

                    try {
                        const success = await contact.modifierContact(chatId, contactModifie);
                        if (success) {
                            MessagesController.afficherAllMessages();
                        }
                    } catch (error) {
                        console.error('Erreur lors de la modification:', error);
                    }
                });
            }

            if (retourListe) {
                retourListe.addEventListener('click', () => {
                    MessagesController.afficherAllMessages();
                });
            }
        }

        const menuContextuel = document.querySelector('.menu-contextuel');
        if (menuContextuel) {
            menuContextuel.remove();
        }
    }
});