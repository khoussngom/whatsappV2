import { Components } from '../components/componentBase';
import dbData from '../database/db.json';
import { MessageSimulator } from '../utils/messageSimulator.js';
import { message } from '../models/message.js';

let valFiltre = [];
const ListeMessages = document.querySelector("#ListeMessages");
// const url = "https://backendwhatsapp-twxo.onrender.com/utilisateurs";
const url = "http://localhost:3000/utilisateurs";

export const MessagesController = {
        chatActif: null,
        onConversationLoaded: null,
        rafraichissementActif: false,
        rafraichissementInterval: null,

        definirChatActif(chatId) {
            this.chatActif = chatId;

            if (this.rafraichissementInterval) {
                clearInterval(this.rafraichissementInterval);
                this.rafraichissementActif = false;
            }
        },


        async envoyerMessage(texte) {
            try {
                if (!this.chatActif) {
                    throw new Error('Aucune conversation active');
                }

                const userId = sessionStorage.getItem('userId');
                if (!userId) {
                    throw new Error('Utilisateur non connecté');
                }

                alert(userId);

                const nouveauMessage = {
                    id: Date.now().toString(),
                    texte: texte,
                    timestamp: new Date().toISOString(),
                    envoyeur: userId,
                    statut: 'envoyé'
                };

                await message.response(this.chatActif, nouveauMessage, userId);

                const destinataireId = this.chatActif;
                await message.envoyerAuDestinataire(destinataireId, nouveauMessage);

                await message.updateResponse(texte, this.scrollToBottom);
                return true;
            } catch (error) {
                console.error('Erreur lors de l\'envoi:', error);
                return false;
            }
        },


        afficherMessages(chatId) {
            const messagesContainer = document.querySelector('#messagesContainer');
            if (!messagesContainer) return;

            const userId = sessionStorage.getItem('userId');
            if (!userId) return;

            fetch(`${url}/${userId}`)
                .then(response => response.json())
                .then(userData => {
                        let source = userData.groupes.find(g => g.id === chatId) ||
                            userData.contacts.find(c => c.id === chatId);

                        if (!source) return;

                        const messagesHTML = source.messages ? source.messages.map(msg => `
                            <div class="flex ${msg.envoyeur === 'moi' ? 'justify-end' : 'justify-start'} mb-4">
                                <div class="max-w-[70%] ${msg.envoyeur === 'moi' ? 'bg-blue-600' : 'bg-gray-600'} rounded-lg p-3">
                                    <div class="text-white break-words">${msg.texte}</div>
                                    <div class="text-xs text-white text-right mt-1">
                                        ${new Date(msg.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                                        ${msg.envoyeur === 'moi' ? `<i class='bx bx-check'></i>` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('') : '';

            messagesContainer.innerHTML = messagesHTML;
            this.scrollToBottom();

            if (!this.rafraichissementActif) {
                this.rafraichissementActif = true;

                this.rafraichissementInterval = setInterval(() => {
                    this.verifierNouveauxMessages(chatId, userId);
                }, 3000);
            }
        })
        .catch(error => console.error('Erreur lors du chargement des messages:', error));
    },


    verifierNouveauxMessages(chatId, userId) {
    fetch(`${url}/${userId}`)
        .then(response => response.json())
        .then(userData => {
            let source = userData.groupes.find(g => g.id === chatId) ||
                        userData.contacts.find(c => c.id === chatId);

            if (!source || !source.messages) return;

            const messagesContainer = document.querySelector('#messagesContainer');
            if (!messagesContainer) return;

            const currentMessages = messagesContainer.innerHTML;
            const newMessagesHTML = source.messages.map(msg => `
                <div class="flex ${msg.envoyeur === userId ? 'justify-end' : 'justify-start'} mb-4">
                    <div class="max-w-[70%] ${msg.envoyeur === userId ? 'bg-blue-600' : 'bg-gray-600'} rounded-lg p-3">
                        <div class="text-white break-words">${msg.texte}</div>
                        <div class="text-xs text-white text-right mt-1">
                            ${new Date(msg.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                            ${msg.envoyeur === userId ? `<i class='bx bx-check'></i>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');

            if (currentMessages !== newMessagesHTML) {
                messagesContainer.innerHTML = newMessagesHTML;
                this.scrollToBottom();
            }
        })
        .catch(error => console.error('Erreur lors de la vérification des nouveaux messages:', error));
},



    afficherAllMessages() {
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

        this.ajouterEcouteurs();

    },

    ajouterEcouteurs(){
        const chatItems = document.querySelectorAll('.chat-item');
        chatItems.forEach(item => {
            item.addEventListener('click', () => {
                const chatId = item.dataset.chatId;
            
                this.afficherConversation(chatId);
            });
        });
    },

    afficherConversation(chatId) {
        const welcomeScreen = document.querySelector('#welcomeScreen');
        const chatView = document.querySelector('#chatView');
        
        welcomeScreen.classList.add('hidden');
        chatView.classList.remove('hidden');
        
        const chat = [...dbData.contact, ...dbData.groupe].find(c => c.id === chatId);
        if (chat) {
            const chatName = chat.type === 'groupe' ? chat.nom : `${chat.prenom} ${chat.nom}`;
            document.querySelector('#chatContactName').textContent = chatName;
            
            this.afficherMessages(chatId);
            
            const messageInput = document.querySelector('#messageInput');
            messageInput.value = '';
            messageInput.focus();

            const sendButton = document.querySelector('#sendButton');
            
            sendButton.dataset.chatId = chatId;
        }
        if (typeof this.onConversationLoaded === 'function') {
            setTimeout(() => this.onConversationLoaded(), 0);
        }
    },

    scrollToBottom() {
        const messagesContainer = document.querySelector('#messagesContainer');
        if (messagesContainer) {
            requestAnimationFrame(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            });
            }
        }
};