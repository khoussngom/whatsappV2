export const message = {
        async envoyerMessage(chatId, contenu) {
            try {
                const response = await fetch(`http://localhost:3000/contact/${chatId}`);
                const contact = await response.json();

                const nouveauMessage = {
                    id: Date.now().toString(),
                    texte: contenu,
                    timestamp: new Date().toISOString(),
                    envoyeur: 'moi',
                    statut: 'envoyé'
                };
                console.log("je suis le dernier message");
                contact.messages = contact.messages || [];
                contact.messages.push(nouveauMessage);
                contact.lastMessage = contenu;

                const updateResponse = await fetch(`http://localhost:3000/contact/${chatId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contact)
                });

                if (!updateResponse.ok) {
                    throw new Error('Erreur lors de la mise à jour du contact');
                }

                return nouveauMessage;
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
                return null;
            }
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

                this.definirChatActif(chatId);

                this.afficherMessages(chatId);

                const messageInput = document.querySelector('#messageInput');
                const messageForm = document.querySelector('#messageForm');

                if (messageForm) {
                    messageForm.dataset.chatId = chatId;

                    const envoyerMessage = async(e) => {
                        e.preventDefault();
                        const message = messageInput.value.trim();
                        if (message) {
                            const success = await this.envoyerMessage(message);
                            if (success) {
                                messageInput.value = '';
                                messageInput.focus();
                                this.afficherAllMessages();
                            }
                        }
                    };

                    messageForm.removeEventListener('submit', envoyerMessage);
                    messageForm.addEventListener('submit', envoyerMessage);
                }

                messageInput.value = '';
                messageInput.focus();
            }
        },

        ConversationActive: (chat) => {
                return `
        <div class="flex flex-col h-full">
            <div class="bg-wa-container p-4 flex items-center border-b border-wa-border">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-wa-text-secondary rounded-full flex items-center justify-center mr-3">
                        <i class='bx bxs-user text-xl text-wa-text'></i>
                    </div>
                    <div class="text-wa-text font-medium">${chat.prenom} ${chat.nom}</div>
                </div>
            </div>

            <div id="messagesContainer" class="flex-1 overflow-y-auto p-4 bg-wa-background">
                ${chat.messages ? chat.messages.map(msg => `
                    <div class="flex ${msg.envoyeur === 'moi' ? 'justify-end' : 'justify-start'} mb-4">
                        <div class="max-w-[70%] ${msg.envoyeur === 'moi' ? 'bg-wa-green' : 'bg-wa-darker'} rounded-lg p-3">
                            <div class="text-wa-text break-words">${msg.texte}</div>
                            <div class="text-xs text-wa-text-secondary text-right mt-1 flex items-center justify-end gap-1">
                                ${new Date(msg.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                                ${msg.envoyeur === 'moi' ? `<i class='bx bx-check'></i>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('') : ''}
            </div>

            <form id="messageForm" class="p-4 border-t border-wa-border">
                <div class="flex items-center gap-4">
                    <button type="button" class="text-wa-text-secondary hover:text-wa-text">
                        <i class='bx bx-smile w-6 h-6'></i>
                    </button>
                    <div class="flex-1 rounded-lg bg-wa-darker">
                        <input type="text" 
                            id="messageInput" 
                            class="w-full bg-transparent outline-none px-4 py-2 text-wa-text placeholder-wa-text-secondary"
                            placeholder="Tapez un message">
                    </div>
                    <button type="submit" class="text-wa-text-secondary hover:text-wa-green">
                        <i class='bx bx-send w-6 h-6'></i>
                    </button>
                </div>
            </form>
        </div>`;
    }
};