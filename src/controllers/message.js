import { Components } from '../components/componentBase';
import dbData from '../database/db.json';
import { MessageSimulator } from '../utils/messageSimulator.js';

const ListeMessages = document.querySelector("#ListeMessages");

export const MessagesController = {
        chatActif: null,
        onConversationLoaded: null,

        definirChatActif(chatId) {
            this.chatActif = chatId;
            console.log('Chat actif défini:', chatId);
        },

        async envoyerMessage(texte) {
            try {
                console.log('Début envoi message:', texte);

                if (!this.chatActif) {
                    throw new Error('Aucune conversation active');
                }

                const userId = sessionStorage.getItem('userId');
                if (!userId) {
                    throw new Error('Utilisateur non connecté');
                }

                const nouveauMessage = {
                    id: Date.now().toString(),
                    texte: texte,
                    timestamp: new Date().toISOString(),
                    envoyeur: 'moi',
                    statut: 'envoyé'
                };

                const response = await fetch(`http://localhost:3000/utilisateurs/${userId}`);
                if (!response.ok) throw new Error('Erreur de récupération des données');

                const userData = await response.json();
                const contactIndex = userData.contacts.findIndex(c => c.id === this.chatActif);

                if (contactIndex === -1) throw new Error('Contact non trouvé');

                if (!userData.contacts[contactIndex].messages) {
                    userData.contacts[contactIndex].messages = [];
                }
                userData.contacts[contactIndex].messages.push(nouveauMessage);
                userData.contacts[contactIndex].lastMessage = texte;

                const updateResponse = await fetch(`http://localhost:3000/utilisateurs/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contacts: userData.contacts
                    })
                });

                if (!updateResponse.ok) throw new Error('Erreur de sauvegarde');

                const messagesContainer = document.querySelector('#messagesContainer');
                if (messagesContainer) {
                    const messageHTML = `
                    <div class="flex justify-end mb-4">
                        <div class="max-w-[70%] bg-wa-green rounded-lg p-3">
                            <div class="text-wa-text break-words">${texte}</div>
                            <div class="text-xs text-wa-text-secondary text-right mt-1">
                                ${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                                <i class='bx bx-check'></i>
                            </div>
                        </div>
                    </div>
                `;
                    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
                    this.scrollToBottom();
                }

                setTimeout(async() => {
                    const reponse = await MessageSimulator.simulerReponse(this.chatActif);

                    const nouveauMessage = {
                        id: Date.now().toString(),
                        texte: reponse,
                        timestamp: new Date().toISOString(),
                        envoyeur: 'autre',
                        statut: 'lu'
                    };

                    const userResponse = await fetch(`http://localhost:3000/utilisateurs/${userId}`);
                    const userData = await userResponse.json();

                    const contactIndex = userData.contacts.findIndex(c => c.id === this.chatActif);
                    if (contactIndex !== -1) {
                        userData.contacts[contactIndex].messages.push(nouveauMessage);
                        userData.contacts[contactIndex].lastMessage = reponse;

                        await fetch(`http://localhost:3000/utilisateurs/${userId}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                contacts: userData.contacts
                            })
                        });

                        const messagesContainer = document.querySelector('#messagesContainer');
                        if (messagesContainer) {
                            const messageHTML = `
                                <div class="flex justify-start mb-4">
                                    <div class="max-w-[70%] bg-wa-darker rounded-lg p-3">
                                        <div class="text-wa-text break-words">${reponse}</div>
                                        <div class="text-xs text-wa-text-secondary text-right mt-1">
                                            ${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                                        </div>
                                    </div>
                                </div>
                            `;
                            messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
                            this.scrollToBottom();
                        }
                    }
                }, 1000);

                console.log('Message envoyé avec succès');
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

            fetch(`http://localhost:3000/utilisateurs/${userId}`)
                .then(response => response.json())
                .then(userData => {
                        const contact = userData.contacts.find(c => c.id === chatId);
                        if (!contact) return;

                        const messagesHTML = contact.messages ? contact.messages.map(msg => `
                    <div class="flex ${msg.envoyeur === 'moi' ? 'justify-end' : 'justify-start'} mb-4">
                        <div class="max-w-[70%] ${msg.envoyeur === 'moi' ? 'bg-wa-green' : 'bg-wa-darker'} rounded-lg p-3">
                            <div class="text-wa-text break-words">${msg.texte}</div>
                            <div class="text-xs text-wa-text-secondary text-right mt-1">
                                ${new Date(msg.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                                ${msg.envoyeur === 'moi' ? `<i class='bx bx-check'></i>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('') : '';

                    messagesContainer.innerHTML = messagesHTML;
                    this.scrollToBottom();
                })
                .catch(error => console.error('Erreur lors du chargement des messages:', error));
    },
  

    afficherAllMessages() {
        if (!ListeMessages) return;
        
        ListeMessages.innerHTML = '';
        
        if (dbData.contact && dbData.contact.length > 0) {
            dbData.contact.forEach(contact => {
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

        const setupMessageForm = () => {
            const messageForm = document.querySelector('#messageForm');
            const messageInput = document.querySelector('#messageInput');
            const sendButton = document.querySelector('#sendMessageBtn');

            if (!messageForm || !messageInput || !sendButton) {
                console.error('Éléments du formulaire non trouvés');
                return;
            }

            const envoyerMessage = async (e) => {
                e.preventDefault();
                const message = messageInput.value.trim();
                if (!message) return;

                if (!this.chatActif) {
                    console.error('Pas de chat actif');
                    return;
                }

                const success = await this.envoyerMessage(message);
                if (success) {
                    messageInput.value = '';
                    messageInput.focus();
                }
            };

            const newForm = messageForm.cloneNode(true);
            messageForm.parentNode.replaceChild(newForm, messageForm);

            const updatedForm = document.querySelector('#messageForm');
            const updatedInput = document.querySelector('#messageInput');

            updatedForm.addEventListener('submit', envoyerMessage);
            updatedInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    envoyerMessage(e);
                }
            });

        };

        setTimeout(setupMessageForm, 100);

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