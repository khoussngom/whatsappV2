import { groupe } from "../components/componentGroupe";
import { ComponentController } from '../components/componentController';
import dbData from '../database/db.json';

let contactsSelectionnes = [];

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

function form() {

    const btnCreerGroupe = document.querySelector('#createGroupBtn');

    btnCreerGroupe.addEventListener('click', async(e) => {
        e.preventDefault();

        if (contactsSelectionnes.length === 0) {
            alert("no")
            return;
        }

        const nomGroupe = document.querySelector('#groupNameInput').value;
        if (!nomGroupe.trim()) {
            return;
        }

        const nouveauGroupe = {
            id: Date.now().toString(),
            nom: nomGroupe,
            type: 'groupe',
            membres: Array.from(contactsSelectionnes),
            messages: [],
            lastMessage: '',
            nbreNonLu: 0
        };
    });

}