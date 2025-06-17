import { Components } from '../components/componentBase.js';
import { ComponentsAdd } from '../components/componentsAdd.js';
import { ComponentController } from '../components/componentController.js';
import { MessagesController } from './message.js';
import dbData from '../database/db.json';
import { ServiceValidation } from '../services/service.js';
import { contact } from '../models/contact.js';
import { Profil } from '../components/componentsProfil.js';
import { layout } from '../components/componentsGauche.js';
import { actionContact } from '../models/actionContact.js';
import { optionContact } from '../components/optionContact.js';
import { groupe } from '../components/componentGroupe.js';
import { NewGroupeClique } from './groupe.js';
import { Recherche } from './recherche.js';
import { messageVocal } from './messagesVocal.js';
import { sendFichier } from '../components/componentSendFichier.js';
import { selectFile } from './envoiePhotoVideo.js';
import { GroupeAdminController } from './groupeAdmin.js';
import { BadgeController } from './badgeController.js';
import { ProfilController } from './profilController.js';
import { Presence } from '../components/componentPresence.js';

const sendPlus = document.querySelector("#sendFichier");
const popupConnexion = document.querySelector("#popupConnexion");
const btnConnexion = document.querySelector("#btnConnexion");
const profil = document.querySelector("#profil");
const gauche = document.querySelector("#gauche");
const parametre = document.querySelector("#parametre");
const optionDuContact = document.querySelector("#optionContact");
const nosMessages = document.querySelector("#nosMessages");

const url = "https://backendwhatsapp-twxo.onrender.com/utilisateurs";
// const url = "http://localhost:3000/utilisateurs";

const search = document.querySelector("#recherche");

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

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value;

    try {
        await ServiceValidation.validerNumero(username);
        cacherErreur('username');

        const response = await fetch(`${url}?numero=${username}`);
        if (!response.ok) throw new Error("Erreur lors de la vérification");

        const utilisateurs = await response.json();
        let utilisateur = utilisateurs[0];

        const userId = sessionStorage.getItem("userId");

        if (!utilisateur) {
            const nouvelUtilisateur = {
                id: userId,
                numero: username,
                password: password,
                nom: "",
                prenom: "",
                contacts: [],
                groupes: [],
                status: "Hey! J'utilise WhatsApp",
                presence: {
                    isOnline: true,
                    showOnline: true,
                    lastSeen: new Date().toISOString()
                }
            };

            const createResponse = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nouvelUtilisateur)
            });

            if (!createResponse.ok) {
                throw new Error("Erreur lors de la création du compte");
            }

            utilisateur = nouvelUtilisateur;
        } else {
            if (utilisateur.password !== password) {
                throw new Error("Mot de passe incorrect");
            }
        }

        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("userId", utilisateur.id);

        popupConnexion.classList.replace("flex", "hidden");
        await contact.chargerDonnees();
        MessagesController.afficherAllMessages();

        Presence.demarrerSuiviPresence();

        BadgeController.mettreAJourBadges();

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
            MessagesController.afficherAllMessages();

            Presence.demarrerSuiviPresence();

            BadgeController.mettreAJourBadges();

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

    document.addEventListener('click', async(e) => {
        const chatItem = e.target.closest('.chat-item');
        if (chatItem) {
            const chatId = chatItem.dataset.chatId;
            MessagesController.definirChatActif(chatId);
            MessagesController.afficherConversation(chatId);

            await BadgeController.marquerCommeLu(chatId);
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

document.addEventListener('click', async(e) => {
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
        const userId = sessionStorage.getItem("userId");
        const response = await fetch(`${url}/${userId}`);
        const userData = await response.json();
        const contact = userData.contacts.find(c => c.id === chatId) ||
            userData.groupes.find(g => g.id === chatId);

        const menu = document.createElement('div');
        menu.className = 'menu-contextuel';
        menu.innerHTML = Components.menuContextuel(chatId, contact);
        const rect = trigger.getBoundingClientRect();
        const parentRect = trigger.closest('.chat-item').getBoundingClientRect();

        menu.style.top = `${rect.bottom - parentRect.top}px`;
        menu.style.left = `${rect.left - parentRect.left}px`;

        trigger.closest('.chat-item').appendChild(menu);
        const modifierBtn = menu.querySelector('.modifier-contact');
        if (modifierBtn) {
            modifierBtn.addEventListener('click', () => {
                menu.remove();
            });
        }

        const supprimerBtn = menu.querySelector('.supprimer-contact');
        if (supprimerBtn) {
            supprimerBtn.addEventListener('click', async() => {
                try {
                    await supprimerContact(chatId);
                    menu.remove();
                    MessagesController.afficherAllMessages();
                } catch (error) {
                    console.error('Erreur lors de la suppression:', error);
                }
            });
        }

        const gererGroupeBtn = menu.querySelector('.gerer-groupe');
        if (gererGroupeBtn) {
            gererGroupeBtn.addEventListener('click', async() => {
                menu.remove();
                await GroupeAdminController.afficherGestionGroupe(chatId);
            });
        }
    }
});

optionDuContact.addEventListener("click", async(e) => {
    const trigger = optionDuContact;
    if (trigger) {
        e.preventDefault();
        e.stopPropagation();

        const rect = trigger.getBoundingClientRect();
        const parentRect = trigger.closest('#optionContact').getBoundingClientRect();

        const chatId = MessagesController.chatActif;
        if (!chatId) {
            console.error('Aucune conversation active');
            return;
        }

        const userId = sessionStorage.getItem("userId");
        const response = await fetch(`${url}/${userId}`);
        const userData = await response.json();

        let type = "contact";
        let cible = userData.contacts.find(c => c.id === chatId);

        if (!cible) {
            cible = userData.groupes.find(g => g.id === chatId);
            if (!cible) {
                console.error('Contact ou groupe non trouvé');
                return;
            }
            type = "groupe";
        }

        const menu = document.createElement('div');
        menu.className = 'menu-contextuel';
        menu.innerHTML = optionContact.option(chatId, cible, type);

        menu.style.top = `${(rect.bottom + 15) - parentRect.top}px`;
        menu.style.right = `${rect.right - parentRect.left}px`;
        menu.style.position = "absolute";
        menu.style.zIndex = 1000;

        if (e.target.closest('.bloquer-contact')) await BloquerContact(e);
        if (e.target.closest('.debloquer-contact')) await DebloquerContact(e);

        trigger.closest('#optionContact').appendChild(menu);

        const ClickOutside = (event) => {
            if (!menu.contains(event.target) && !trigger.contains(event.target)) {
                menu.remove();
                document.removeEventListener('click', ClickOutside);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', ClickOutside);
        }, 100);
    }
});

document.body.addEventListener('click', async(e) => {
    if (e.target.closest('.modifier-contact')) ModifierContact(e);
    if (e.target.closest('.bloquer-contact')) await BloquerContact(e);
    if (e.target.closest('.debloquer-contact')) await DebloquerContact(e);
    if (e.target.closest('.supprimer-contact')) PopupSuppression(e);
    if (e.target.id === 'annuler-suppression') AnnulerSuppression();
    if (e.target.id === 'confirmer-suppression') await ConfirmerSuppression(e);
});

function ModifierContact(e) {
    const chatId = e.target.closest('.modifier-contact').dataset.chatId;
    const contactToEdit = dbData.contact.find(c => c.id === chatId);
    if (!contactToEdit) return;

    ListeMessages.innerHTML = Components.AjoutContact({
        mode: 'edition',
        contact: contactToEdit
    });

    setupFormModification(chatId);
    setupRetourListe();
    removeMenuContextuel();
}

function setupFormModification(chatId) {
    const formContact = document.querySelector('#form-contact');
    if (!formContact) return;

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
            if (success) MessagesController.afficherAllMessages();
        } catch (error) {
            console.error('Erreur lors de la modification:', error);
        }
    });
}

function setupRetourListe() {
    const retourListe = document.querySelector('#backButton');
    if (retourListe) {
        retourListe.addEventListener('click', () => {
            MessagesController.afficherAllMessages();
        });
    }
}

async function BloquerContact(e) {
    const chatId = e.target.closest('.bloquer-contact').dataset.chatId;
    if (await actionContact.bloquerContact(chatId)) {
        MessagesController.afficherAllMessages();
    }
    removeMenuContextuel();
}

async function DebloquerContact(e) {
    const chatId = e.target.closest('.debloquer-contact').dataset.chatId;
    if (await actionContact.debloquerContact(chatId)) {
        MessagesController.afficherAllMessages();
    }
    removeMenuContextuel();
}

function PopupSuppression(e) {
    const chatId = e.target.closest('.supprimer-contact').dataset.chatId;
    document.body.insertAdjacentHTML('beforeend', Components.PopupSuppression(chatId));
    removeMenuContextuel();
}

function AnnulerSuppression() {
    const popup = document.querySelector('#popup-overlay');
    if (popup) popup.remove();
}

async function ConfirmerSuppression(e) {
    const chatId = e.target.dataset.chatId;
    const userId = sessionStorage.getItem('userId');
    try {
        const response = await fetch(`${url}/${userId}`);
        if (!response.ok) throw new Error('Erreur de récupération des données');

        const userData = await response.json();
        userData.contacts = userData.contacts.filter(c => c.id !== chatId);

        await updateContacts(userId, userData.contacts);
        removePopup();
        MessagesController.afficherAllMessages();
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
}

async function updateContacts(userId, contacts) {
    const updateResponse = await fetch(`${url}/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts })
    });
    if (!updateResponse.ok) throw new Error('Erreur lors de la mise à jour');
}

function removePopup() {
    const popup = document.querySelector('#popup-overlay');
    if (popup) popup.remove();
}

function removeMenuContextuel() {
    const menuContextuel = document.querySelector('.menu-contextuel');
    if (menuContextuel) menuContextuel.remove();
}

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
                epingler: false,
                nbreNonLu: 0,
                messages: [],
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

function NewContactClique() {
    const ListeMessages = document.querySelector('#ListeMessages');
    ListeMessages.innerHTML = Components.AjoutContact({ mode: 'creation' });

    const formContact = document.querySelector('#form-contact');
    const retourListe = document.querySelector('#backButton');

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

async function ModifierContactClick(e) {
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
        NewContactClique();
    }

    if (e.target.id === 'creationGroupe' || e.target.closest('#creationGroupe')) {
        NewGroupeClique(recharger);
    }

    if (e.target.closest('.modifier-contact')) {
        await ModifierContactClick(e);
    }

    if (e.target.id === 'backButton' || e.target.closest('#backButton')) {
        handleBackButtonClick();
    }
});

profil.addEventListener("click", (e) => {
    if (e.target.id === 'profil' || e.target.closest("#profil")) {
        ProfilController.afficherModificationProfil();
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
recharger()

function renderContactsUI() {
    gauche.innerHTML = layout.gauche();
    MessagesController.afficherAllMessages();
    attacherEventListener();
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

search.addEventListener("keyup", Recherche);

nosMessages.addEventListener("click", () => {
    MessagesController.afficherAllMessages();
})

document.addEventListener('DOMContentLoaded', () => {
    messageVocal.ajouterInterfaceEnregistrement();
});

sendPlus.addEventListener('click', (e) => {
    const bx = document.querySelector(".boxIm");
    bx.style.transform = (bx.style.transform === 'rotate(45deg)') ? 'rotate(0deg)' : 'rotate(45deg)';
    const trigger = sendPlus;
    if (trigger) {
        e.preventDefault();
        e.stopPropagation();

        const menuExistant = document.querySelector('.menu-plus');
        if (menuExistant) {
            menuExistant.remove();
        }
        trigger.style.backgroundColor = "green";
        trigger.style.borderRadius = "50px"
        trigger.style.width = trigger.style.height = "40px"
        trigger.style.display = "flex";
        trigger.style.justifyContent = "center";
        trigger.style.alignItems = "center";
        const menu = document.createElement('div');
        menu.className = 'menu-plus';
        menu.innerHTML = sendFichier.sendPlus();

        const rect = trigger.getBoundingClientRect();
        const parentRect = trigger.closest('#sendFichier').getBoundingClientRect();
        menu.style.position = 'absolute';
        menu.style.left = `${(rect.left+520) - parentRect.left}px`;
        menu.style.bottom = `${parentRect.bottom - rect.top + 20}px`;
        menu.style.zIndex = '1000';

        trigger.closest('#sendFichier').appendChild(menu);
        selectFile()

        const handleClickOutside = (event) => {
            if (!menu.contains(event.target) && !trigger.contains(event.target)) {
                menu.remove();
                document.removeEventListener('click', handleClickOutside);
                trigger.style.backgroundColor = "";
            }
        };

        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0);
    }
});