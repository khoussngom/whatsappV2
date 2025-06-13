import { MessageSimulator } from "../utils/messageSimulator.js";

// const url = "https://backendwhatsapp-twxo.onrender.com/utilisateurs";
const url = "http://localhost:3000/utilisateurs";


export const message = (() => ({
    async response(chatActif, nouveauMessage, userId) {
        const reponse = await fetch(`${url}/${userId}`);
        if (!reponse.ok) throw new Error('Erreur de récupération des données');

        const userData = await reponse.json();
        let contactIndex = null;

        contactIndex = userData.groupes.findIndex(c => c.id === chatActif)
        if (contactIndex !== -1) {
            contactIndex = userData.groupes.findIndex(c => c.id === chatActif);
            if (contactIndex === -1) throw new Error('Groupe non trouvé');

            if (!userData.groupes[contactIndex].messages) {
                userData.groupes[contactIndex].messages = [];
            }

            userData.groupes[contactIndex].messages.push(nouveauMessage);
            userData.groupes[contactIndex].lastMessage = nouveauMessage.texte;

            const updateReponse = await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    groupes: userData.groupes
                })
            });

            if (!updateReponse.ok) throw new Error('Erreur lors de la sauvegarde du message');

        } else {
            contactIndex = userData.contacts.findIndex(c => c.id === chatActif);
            if (contactIndex === -1) throw new Error('Contact non trouvé');

            if (!userData.contacts[contactIndex].messages) {
                userData.contacts[contactIndex].messages = [];
            }

            userData.contacts[contactIndex].messages.push(nouveauMessage);
            userData.contacts[contactIndex].lastMessage = nouveauMessage.texte;

            const updateReponse = await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contacts: userData.contacts
                })
            });

            if (!updateReponse.ok) throw new Error('Erreur lors de la sauvegarde du message');
        }
    },


    async updateResponse(texte, scrollBottom) {

        const messagesContainer = document.querySelector('#messagesContainer');
        if (messagesContainer) {
            const messageHTML = `
                    <div class="flex justify-end mb-4">
                        <div class="max-w-[70%] bg-blue-600  rounded-lg p-3">
                            <div class="text-wa-text break-words">${texte}</div>
                            <div class="text-xs text-white text-right mt-1">
                                ${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                                <i class='bx bx-check'></i>
                            </div>
                        </div>
                    </div>
                `;
            messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
            scrollBottom();
        }
    },

    simulerReponse(chatActif, userId, scrollBottom) {

        (async() => {
            const reponse = await MessageSimulator.simulerReponse();

            const nouveauMessage = {
                id: Date.now().toString(),
                texte: reponse,
                timestamp: new Date().toISOString(),
                envoyeur: 'autre',
                statut: 'lu'
            };
            const userResponse = await fetch(`${url}/${userId}`);
            const userData = await userResponse.json();

            const contactIndex = userData.contacts.findIndex(c => c.id === chatActif);
            if (contactIndex !== -1) {
                userData.contacts[contactIndex].messages.push(nouveauMessage);
                userData.contacts[contactIndex].lastMessage = reponse;

                await fetch(`${url}/${userId}`, {
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
                                        <div class="max-w-[70%] bg-gray-600 rounded-lg p-3">
                                            <div class="text-wa-text break-words">${reponse}</div>
                                            <div class="text-xs text-wa-text-secondary text-right mt-1">
                                                ${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                                            </div>
                                        </div>
                                    </div>
                                `;
                    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);

                    scrollBottom();
                }
            }
        })();
    },

    async envoyerAuDestinataire(destinataireId, message) {
        try {
            // Récupérer les données du destinataire
            const response = await fetch(`${url}/${destinataireId}`);
            if (!response.ok) throw new Error('Destinataire non trouvé');

            const destinataire = await response.json();
            const expediteurId = sessionStorage.getItem('userId');

            // Ajouter le message dans la conversation du destinataire
            if (!destinataire.messages) {
                destinataire.messages = [];
            }

            // Trouver la conversation avec l'expéditeur
            let conversation = destinataire.contacts.find(c => c.id === expediteurId);
            if (!conversation) {
                throw new Error('Conversation non trouvée');
            }

            if (!conversation.messages) {
                conversation.messages = [];
            }

            // Ajouter le message
            conversation.messages.push({
                ...message,
                envoyeur: expediteurId
            });

            // Mettre à jour le dernier message
            conversation.lastMessage = message.texte;

            // Sauvegarder les modifications
            await fetch(`${url}/${destinataireId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contacts: destinataire.contacts
                })
            });

            return true;
        } catch (error) {
            console.error('Erreur envoi au destinataire:', error);
            return false;
        }
    }
}))();