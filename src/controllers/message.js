import { Components } from '../components/componentBase';
import dbData from '../database/db.json';

const ListeMessages = document.querySelector("#ListeMessages");

export const MessagesController = {
        async chargerDonnees() {
            try {
                const response = await fetch('http://localhost:3000/db');
                const data = await response.json();
                Object.assign(dbData, data);
                return true;
            } catch (error) {
                console.error('Erreur lors du chargement:', error);
                return false;
            }
        },

        async sauvegarderContact(nouveauContact) {
            try {
                const response = await fetch('http://localhost:3000/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nouveauContact)
                });

                if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

                const contactSauvegarde = await response.json();
                dbData.contact.push(contactSauvegarde);

                const event = new CustomEvent('donneesMisesAJour', {
                    detail: dbData
                });
                document.dispatchEvent(event);

                return true;
            } catch (error) {
                console.error('Erreur:', error);
                return false;
            }
        },

        async envoyerMessage(chatId, message) {
            const newMessage = {
                id: Date.now(),
                texte: message,
                timestamp: new Date().toISOString(),
                envoyeur: 'moi',
                statut: 'envoyé'
            };

            try {
                const response = await fetch(`http://localhost:3000/contact/${chatId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: [...dbData.contact.find(c => c.id === chatId).messages, newMessage],
                        lastMessage: message
                    })
                });

                if (!response.ok) throw new Error('Erreur lors de l\'envoi du message');

                const contact = dbData.contact.find(c => c.id === chatId);
                if (contact) {
                    contact.messages = [...contact.messages, newMessage];
                    contact.lastMessage = message;
                }

                const event = new CustomEvent('donneesMisesAJour', {
                    detail: dbData
                });
                document.dispatchEvent(event);

                this.afficherMessages(chatId);
                this.afficherAllMessages();
                this.simulerReponse(chatId);
            } catch (error) {
                console.error('Erreur:', error);
            }
        },

        afficherMessages(chatId) {
            const messagesContainer = document.querySelector('#messagesContainer');
            const chat = dbData.contact.find(c => c.id === chatId) ||
                dbData.groupe.find(g => g.id === chatId);

            if (chat && chat.messages) {
                const messagesHTML = chat.messages.map(msg => `
                    <div class="flex ${msg.envoyeur === 'moi' ? 'justify-end' : 'justify-start'} mb-4">
                        <div class="max-w-[70%] bg-${msg.envoyeur === 'moi' ? 'wa-green' : 'wa-darker'} rounded-lg p-3">
                            <div class="text-wa-text">${msg.texte}</div>
                            <div class="text-xs text-wa-text-secondary text-right">
                                ${new Date(msg.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                                ${msg.envoyeur === 'moi' ? `
                                    <span class="ml-1">
                                        <i class='bx ${msg.statut === 'lu' ? 'bxs-check-double text-blue-500' : 'bx-check'}'></i>
                                    </span>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('');

                messagesContainer.innerHTML = messagesHTML;

                requestAnimationFrame(() => {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                });
            }
        },

    afficherAllMessages() {
        ListeMessages.innerHTML = '';
        
        dbData.contact.forEach(contact => {
            const messageHTML = Components.ListeMessages({
                ...contact,
                type: 'contact'
            });
            ListeMessages.insertAdjacentHTML('beforeend', messageHTML);
        });

        dbData.groupe.forEach(groupe => {
            const messageHTML = Components.ListeMessages({
                ...groupe,
                type: 'groupe'
            });
            ListeMessages.insertAdjacentHTML('beforeend', messageHTML);
        });

        this.ajouterEcouteurs();
    },

    ajouterEcouteurs() {
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
    }
};