import { model } from "../models/model.js";
import { MessagesController } from "./message.js";
import { Components } from "../components/componentBase.js";
import dbData from '../database/db.json';

let valFiltre = [];

// const url = "https://backendwhatsapp-twxo.onrender.com/utilisateurs";
const url = "http://localhost:3000/utilisateurs";

const recherche = document.querySelector("#recherche");
const ListeMessages = document.querySelector("#ListeMessages");
const userId = sessionStorage.getItem("userId");

export async function Recherche() {
    const reponse = await fetch(`${url}/${userId}`);
    const utilisateur = await reponse.json();
    const cle = recherche.value.trim().toLowerCase();
    const contacts = utilisateur.contacts;

    valFiltre = model.rechercherContact(contacts, cle === '' ? '*' : cle);
    if (valFiltre.length < 1) {
        ListeMessages.innerHTML = "pas de contact avec ce nom ou ce numero !";

        return;
    }
    afficherAllMessages();

}

function afficherAllMessages() {
    const ListeMessages = document.querySelector("#ListeMessages");
    if (!ListeMessages) return;
    ListeMessages.innerHTML = '';

    if (dbData.contact && dbData.contact.length > 0) {

        const amis = (valFiltre.length < 1) ? dbData.contact : valFiltre;

        if (!amis || amis.length < 1) {
            ListeMessages.innerHTML = "pas de contact disponible !";
            return;
        }

        amis.forEach(contact => {
            const messageHTML = Components.ListeMessages({
                ...contact,
                type: 'contact'
            });
            ListeMessages.insertAdjacentHTML('beforeend', messageHTML);
        });
    }

    if (dbData.groupe && dbData.groupe.length > 0) {
        dbData.groupe.forEach(groupe => {
            const messageHTML = Components.ListeMessages({
                ...groupe,
                type: 'groupe'
            });
            ListeMessages.insertAdjacentHTML('beforeend', messageHTML);
        });
    }

    ajouterEcouteurs();

}

function ajouterEcouteurs() {
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            const chatId = item.dataset.chatId;

            this.afficherConversation(chatId);
        });
    });
}