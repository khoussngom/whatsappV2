import { Components } from '../components/componentBase';
import { ComponentsAdd } from '../components/componentsAdd';
import { ComponentController } from '../components/componentController';
import { MessagesController } from './message.js';
import dbData from '../database/db.json';
import { ServiceValidation } from '../services/service.js';
import { contact } from '../models/contact.js';
import { Profil } from '../components/componentsProfil.js';
import { layout } from '../components/componentsGauche.js';
const popupConnexion = document.querySelector("#popupConnexion");
const btnConnexion = document.querySelector("#btnConnexion");
const profil = document.querySelector("#profil");
const gauche = document.querySelector("#gauche");
const parametre = document.querySelector("#parametre")
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

    if (est_connecte === "true" && userId) {
        popupConnexion.classList.replace("flex", "hidden");
        try {
            await contact.chargerDonnees();
            MessagesController.afficherAllMessages()

        } catch (error) {
            console.error("Erreur lors de la vérification:", error);

            sessionStorage.clear();
            popupConnexion.classList.replace("hidden", "flex");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {


    const formConnexion = document.querySelector("#formConnexion");
    if (formConnexion) {
        formConnexion.addEventListener("submit", connexion);
    } else {
        console.error("Formulaire de connexion non trouvé");
    }

    verifierConnexion();
});



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

    const handleSendMessage = async(e) => {
        if (e) e.preventDefault();

        const messageInput = document.querySelector('#messageInput');
        if (!messageInput) {
            console.error('Input message non trouvé');
            return;
        }

        const message = messageInput.value.trim();
        if (!message) return;

        if (!MessagesController.chatActif) {
            alert('Veuillez sélectionner une conversation');
            return;
        }

        try {
            await MessagesController.envoyerMessage(message);
            messageInput.value = '';
            messageInput.focus();
            alert('Message envoyé');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message :', error);
        }
    };

    document.addEventListener('click', async(e) => {
        if (e.target.closest('#sendMessageBtn')) {
            await handleSendMessage(e);
        }
    });

    document.addEventListener('keypress', async(e) => {
        if (e.target.id === 'messageInput' && e.key === 'Enter' && !e.shiftKey) {
            await handleSendMessage(e);
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
        menu.innerHTML = Components.menuContextuel(chatId);
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
    if (e.target.closest('.bloquer-contact')) {
        const chatId = e.target.closest('.bloquer-contact').dataset.chatId;
        if (await actionContact.bloquerContact(chatId)) {
            MessagesController.afficherAllMessages();
        }
        const menuContextuel = document.querySelector('.menu-contextuel');
        if (menuContextuel) menuContextuel.remove();
    }

    if (e.target.closest('.debloquer-contact')) {
        const chatId = e.target.closest('.debloquer-contact').dataset.chatId;
        if (await actionContact.debloquerContact(chatId)) {
            MessagesController.afficherAllMessages();
        }
        const menuContextuel = document.querySelector('.menu-contextuel');
        if (menuContextuel) menuContextuel.remove();
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

    const formConnexion = document.querySelector("#formConnexion");
    if (formConnexion) {
        formConnexion.addEventListener("submit", connexion);
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

const FormContact = function(formContact) {
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
                blocked: false,
                archived: false,
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
}

function handleNewContactClick() {
    const ListeMessages = document.querySelector('#ListeMessages');
    ListeMessages.innerHTML = Components.AjoutContact({ mode: 'creation' });

    const formContact = document.querySelector('#form-contact');
    const retourListe = document.querySelector('#retour-liste');

    FormContact(formContact);

    if (retourListe) {
        retourListe.addEventListener('click', MessagesController.afficherAllMessages);
    }
}

function getChatIdFromEvent(e) {
    const element = e.target.closest('.modifier-contact');
    return element ? element.dataset.chatId : null;
}


function getContactById(id) {
    return dbData.contact.find(c => c.id === id);
}

function renderEditContactForm(contact) {
    const ListeMessages = document.querySelector('#ListeMessages');
    ListeMessages.innerHTML = Components.AjoutContact({
        mode: 'edition',
        contact: contact
    });
}

function setupContactFormSubmit(chatId) {
    const formContact = document.querySelector('#form-contact');
    if (!formContact) return;

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


async function handleModifierContactClick(e) {
    const chatId = getChatIdFromEvent(e);
    const contactToEdit = getContactById(chatId);
    if (!contactToEdit) return;

    renderEditContactForm(contactToEdit);
    setupContactFormSubmit(chatId);
    setupRetourListeClick();
    removeMenuContextuel();
}


function handleBackButtonClick() {
    MessagesController.afficherAllMessages();
}


document.addEventListener('click', async(e) => {
    if (e.target.id === 'newContact' || e.target.closest('#newContact')) {
        handleNewContactClick();
    }

    if (e.target.closest('.modifier-contact')) {
        await handleModifierContactClick(e);
    }

    if (e.target.id === 'backButton' || e.target.closest('#backButton')) {
        handleBackButtonClick();
    }
});



profil.addEventListener("click", (e) => {
    if (e.target.id === 'profil' || e.target.closest("#profil")) {
        gauche.innerHTML = "";
        gauche.innerHTML = Profil.profil();

        recharger()
    }
})

function recharger() {
    document.addEventListener('click', function handleRetour(e) {
        const retourBtn = e.target.closest('#retour');
        if (retourBtn) {
            renderContactsUI();
            document.removeEventListener('click', handleRetour);
        }
    });
}

function attacherEventListener() {
    const addButton = document.querySelector('#add');
    const ListeMessages = document.querySelector('#ListeMessages');
    if (addButton) {
        addButton.addEventListener('click', () => {
            if (dbData.contact || dbData.groupe) {
                ListeMessages.innerHTML = ComponentsAdd.nouveauMenu(dbData);
                const liste = document.querySelector("#liste-Contacts");

            }
        });
    }
}

function renderContactsUI() {
    gauche.innerHTML = layout.gauche();
    MessagesController.afficherAllMessages();
    attacherEventListener();
}


parametre.addEventListener("click", () => {
    gauche.innerHTML = layout.parametre();

    const logoutBtn = document.querySelector("#logoutBtn");
    const BtnDeconnexion = () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('username');
        popupConnexion.classList.replace("hidden", "flex");
    };
    logoutBtn.addEventListener('click', BtnDeconnexion);
})