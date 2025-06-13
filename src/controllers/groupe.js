import { groupe } from "../components/componentGroupe";
import { ComponentController } from '../components/componentController';
import dbData from '../database/db.json';
import { popupMessage } from "../components/popupMessage.js";


let contactsSelectionnes = [];
const url = "https://backendwhatsapp-twxo.onrender.com/utilisateurs"

function ajouterDansGroupe(e) {
    e.preventDefault();
    e.stopPropagation();

    const contactElement = e.currentTarget;
    const chatId = contactElement.dataset.chatId;

    if (!chatId) {
        return;
    }

    const index = contactsSelectionnes.indexOf(chatId);
    if (index !== -1) {
        contactsSelectionnes.splice(index, 1);
        contactElement.classList.remove('bg-gray-600');
    } else {
        contactsSelectionnes.push(chatId);
        contactElement.classList.add('bg-gray-600');
    }

    updateSelectedCount();
}

function updateSelectedCount() {
    const compteur = document.querySelector('#selectedCount');
    if (compteur) {
        const texte = `${contactsSelectionnes.length} sélectionné(s)`;
        compteur.textContent = texte;
    } else {
        console.error('Élément compteur non trouvé');
    }
}

export function NewGroupeClique(recharger = () => {}) {

    contactsSelectionnes = [];

    const gauche = document.querySelector('#gauche');
    gauche.innerHTML = groupe.creerGroupe();

    const contactsContainer = document.querySelector("#lesContacts");
    if (contactsContainer) {

        const compteurHTML = `
            <div class="text-wa-text px-4 py-2">
                <span id="selectedCount">0 sélectionné(s)</span>
            </div>
        `;
        contactsContainer.insertAdjacentHTML('beforebegin', compteurHTML);


        contactsContainer.innerHTML = ComponentController.contactsListeHTML(dbData);

        const contacts = contactsContainer.querySelectorAll('.contact-select-item');
        contacts.forEach(contact => {
            contact.addEventListener('click', ajouterDansGroupe);
        });
    }

    setTimeout(() => {
        const input = document.querySelector('#groupNameInput');
        if (input) {
            input.focus();
        }
    }, 0);

    form();

    recharger();
}

async function form() {

    const btnCreerGroupe = document.querySelector('#createGroupBtn');

    btnCreerGroupe.addEventListener('click', async(e) => {
        e.preventDefault();

        if (contactsSelectionnes.length < 1) {
            const erreur = "Erreur de la creation du groupe !";
            const mess = "le groupe doit avoir au moins une personne ajoutée.";
            popupMessage.message(erreur, mess);
            return;
        }

        const nomGroupe = document.querySelector('#groupNameInput').value;
        if (!nomGroupe.trim()) {
            const erreur = "Erreur de la creation du groupe !";
            const mess = "le nom du groupe est obligatoire.";
            popupMessage.message(erreur, mess);
            return;
        }
        const userId = sessionStorage.getItem("userId");
        const nouveauGroupe = {
            id: Date.now().toString(),
            nom: nomGroupe,
            type: 'groupe',
            admin: [userId],
            membres: Array.from(contactsSelectionnes),
            messages: [],
            lastMessage: '',
            nbreNonLu: 0,
            epingler: false,
            archiver: false
        };

        const reponse = await fetch(`${url}/${userId}`);
        const utilisateur = await reponse.json()
        console.log(utilisateur.groupes)
        utilisateur.groupes.push(nouveauGroupe);

        const updateResponse = await fetch(`${url}/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupes: utilisateur.groupes })
        })

        dbData.Groupe = utilisateur.groupes;
    });

}