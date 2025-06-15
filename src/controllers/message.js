import { Components } from '../components/componentBase';
import dbData from '../database/db.json';
import { MessageSimulator } from '../utils/messageSimulator.js';
import { message } from '../models/message.js';
import { messageVocal } from './messagesVocal.js';

let valFiltre = [];
const ListeMessages = document.querySelector("#ListeMessages");
const url = "https://backendwhatsapp-twxo.onrender.com/utilisateurs";
// const url = "http://localhost:3000/utilisateurs";


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


    async envoyerMessage(texte, type = 'text', mediaData = null) {
        try {
            if (!this.chatActif) {
                throw new Error('Aucune conversation active');
            }

            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                throw new Error('Utilisateur non connecté');
            }

            const nouveauMessage = {
                id: Date.now().toString(),
                type: type,
                timestamp: new Date().toISOString(),
                envoyeur: userId,
                statut: 'envoyé',
                texte: type === 'text' ? texte : '',
                media: type === 'text' ? null : mediaData.media
            };

            await message.response(this.chatActif, nouveauMessage, userId);
            this.afficherMessage(nouveauMessage);
            await message.envoyerAuDestinataire(this.chatActif, nouveauMessage);

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

                if (!source || !source.messages) return;

                const messagesHTML = source.messages.map(msg => {

                    if (msg.type === 'image' || msg.type === 'video') {
                        if (!msg.media || !msg.media.base64) {
                            console.warn(`Message ${msg.type} reçu sans données media valides`);
                            return this.createTextMessage(msg, userId);
                        }
                    }

                    return this.createMessageHTML(msg, userId);
                }).join('');

                messagesContainer.innerHTML = messagesHTML;


                messagesContainer.querySelectorAll('.play-btn').forEach(btn => {
                    const messageElement = btn.closest('.flex');
                    if (messageElement) {
                        this.ajouterControlsAudio(messageElement);
                    }
                });

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

                const currentMessageIds = Array.from(messagesContainer.querySelectorAll('[data-message-id]'))
                    .map(el => el.getAttribute('data-message-id'));

                const newMessages = source.messages.filter(msg =>
                    !currentMessageIds.includes(msg.id.toString())
                );

                if (newMessages.length === 0) return;

                newMessages.forEach(msg => {
                    const messageHTML = this.createMessageHTML(msg, userId);
                    if (messageHTML) {
                        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);

                        const newMessageElement = messagesContainer.lastElementChild;
                        if (newMessageElement.querySelector('.play-btn')) {
                            messageVocal.ajouterControlsAudio(newMessageElement);
                        }
                    }
                });

                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            })
            .catch(error => console.error('Erreur lors de la vérification des nouveaux messages:', error));
    },

    createMessageHTML(msg, userId) {

        const formattedTime = new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        if (msg.type === "audio" &&
            typeof msg.audio === "string" &&
            msg.audio.startsWith("data:audio")) {
            const audioUrl = messageVocal.base64ToAudioUrl(msg.audio);
            if (!audioUrl) return '';

            return `
                <div class="flex ${msg.envoyeur === userId ? 'justify-end' : 'justify-start'} mb-4" data-message-id="${msg.id}">
                    <div class="max-w-[70%] ${msg.envoyeur === userId ? 'bg-blue-600' : 'bg-gray-600'} rounded-lg p-3">
                        <div class="flex items-center gap-2">
                            <button class="play-btn text-white">
                                <i class='bx bx-play-circle text-2xl'></i>
                            </button>
                            <div class="flex-1">
                                <audio class="hidden" preload="auto">
                                    <source src="${audioUrl}" type="audio/mp3">
                                </audio>
                                <div class="h-2 bg-gray-300 rounded">
                                    <div class="progress-bar h-full w-0 bg-green-500 rounded"></div>
                                </div>
                            </div>
                            <span class="duration text-white text-sm">0:00</span>
                        </div>
                        <div class="text-xs text-white text-right mt-1">
                            ${formattedTime}
                            ${msg.envoyeur === userId ? '<i class="bx bx-check"></i>' : ''}
                        </div>
                    </div>
                </div>
                `;

        } else if (msg.type === "image") {
            if (msg.media &&
                typeof msg.media === 'object' &&
                msg.media.base64 &&
                typeof msg.media.base64 === 'string') {

                return `
                    <div class="flex ${msg.envoyeur === userId ? 'justify-end' : 'justify-start'} mb-4" data-message-id="${msg.id}">
                        <div class="max-w-[70%] ${msg.envoyeur === userId ? 'bg-blue-600' : 'bg-gray-600'} rounded-lg p-3">
                            <img src="${msg.media.base64}" alt="Image" class="w-[300px]  rounded-lg">
                            <div class="text-xs text-white text-right mt-1">
                                ${formattedTime}
                                ${msg.envoyeur === userId ? '<i class="bx bx-check"></i>' : ''}
                            </div>
                        </div>
                    </div>
                `;
            } else {
                console.warn('Message image reçu sans données media valides:', msg.id);
                return this.createTextMessage({
                    ...msg,
                    texte: "Image non disponible"
                }, userId);
            }

        } else if (msg.type === "video" && msg.media && typeof msg.media.base64 === "string") {
            return `
                <div class="flex ${msg.envoyeur === userId ? 'justify-end' : 'justify-start'} mb-4" data-message-id="${msg.id}">
                    <div class="max-w-[70%] ${msg.envoyeur === userId ? 'bg-blue-600' : 'bg-gray-600'} rounded-lg p-3">
                        <video controls class="max-w-full rounded-lg">
                            <source src="${msg.media.base64}" type="${msg.media.type}">
                            Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                        <div class="text-xs text-white text-right mt-1">
                            ${formattedTime}
                            ${msg.envoyeur === userId ? '<i class="bx bx-check"></i>' : ''}
                        </div>
                    </div>
                </div>
                `;
        } else {
            return `
                <div class="flex ${msg.envoyeur === userId ? 'justify-end' : 'justify-start'} mb-4" data-message-id="${msg.id}">
                    <div class="max-w-[70%] ${msg.envoyeur === userId ? 'bg-blue-600' : 'bg-gray-600'} rounded-lg p-3">
                        <div class="text-white break-words">${msg.texte || ''}</div>
                        <div class="text-xs text-white text-right mt-1">
                            ${formattedTime}
                            ${msg.envoyeur === userId ? '<i class="bx bx-check"></i>' : ''}
                        </div>
                    </div>
                </div>
                `;
        }
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
    },
    base64ToAudioUrl(base64) {
        try {
            const byteString = atob(base64.split(',')[1]);
            const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
            const arrayBuffer = new Uint8Array(byteString.length);

            for (let i = 0; i < byteString.length; i++) {
                arrayBuffer[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([arrayBuffer], { type: mimeString });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Erreur de conversion base64 vers URL:', error);
            return null;
        }
    },

    afficherMessage(message) {
        const estEnvoyeur = message.envoyeur === sessionStorage.getItem("username");
        const timestamp = new Date(message.horodatage).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        let messageHTML = '';

        switch (message.type) {
            case 'audio':
                if (message.audio && message.audio.startsWith('data:audio')) {
                    const audioUrl = this.base64ToAudioUrl(message.audio);
                    if (audioUrl) {
                        messageHTML = `
                            <div class="flex ${estEnvoyeur ? 'justify-end' : 'justify-start'} mb-4">
                                <div class="max-w-[70%] ${estEnvoyeur ? 'bg-green-600' : 'bg-gray-600'} rounded-lg p-3">
                                    <div class="flex items-center gap-2">
                                        <button class="play-btn text-white">
                                            <i class='bx bx-play-circle text-2xl'></i>
                                        </button>
                                        <div class="flex-1">
                                            <audio class="hidden" preload="auto">
                                                <source src="${audioUrl}" type="audio/mp3">
                                            </audio>
                                            <div class="h-2 bg-gray-300 rounded">
                                                <div class="progress-bar h-full w-0 bg-green-500 rounded"></div>
                                            </div>
                                        </div>
                                        <span class="duration text-white text-sm">0:00</span>
                                    </div>
                                    <div class="text-xs text-white text-right mt-1">
                                        ${timestamp}
                                        ${estEnvoyeur ? '<i class="bx bx-check-double"></i>' : ''}
                                    </div>
                                </div>
                            </div>
                        `;

                        // Ajouter les contrôles audio après l'insertion du message
                        setTimeout(() => {
                            const lastMessage = document.querySelector('#messages .flex:last-child');
                            if (lastMessage) {
                                this.ajouterControlsAudio(lastMessage);
                            }
                        }, 0);
                    }
                }
                break;

            case 'image':

                console.log('Message image complet:', message);

                function getImageSource(msg) {
                    if (msg.media && msg.media.base64) {
                        return msg.media.base64;
                    }
                    if (msg.base64) {
                        return msg.base64;
                    }
                    if (msg.image) {
                        return msg.image;
                    }
                    if (typeof msg === 'object') {
                        for (let key in msg) {
                            if (typeof msg[key] === 'string' && msg[key].startsWith('data:image/')) {
                                return msg[key];
                            }
                        }
                    }
                    return null;
                }

                const imageSource = getImageSource(message);

                if (imageSource) {
                    messageHTML = `
        <div class="flex ${estEnvoyeur ? 'justify-end' : 'justify-start'} mb-4">
            <div class="max-w-[70%] ${estEnvoyeur ? 'bg-green-600' : 'bg-gray-600'} rounded-lg p-3">
                <img src="${imageSource}" alt="Image" class="max-w-full rounded-lg">
                <div class="text-xs text-white text-right mt-1">
                    ${timestamp}
                    ${estEnvoyeur ? '<i class="bx bx-check-double"></i>' : ''}
                </div>
            </div>
        </div>
    `;
                } else {
                    console.warn('Message image reçu sans données media valides:', message);

                    console.log('Structure du message:', JSON.stringify(message, null, 2));

                    messageHTML = this.createTextMessage(message, estEnvoyeur, timestamp);
                }
                break;

            case 'video':

                console.log('Message video complet:', message);


                function getVideoSource(msg) {
                    if (msg.media && msg.media.base64) {
                        return { source: msg.media.base64, type: msg.media.type || 'video/mp4' };
                    }
                    if (msg.base64) {
                        return { source: msg.base64, type: msg.type || 'video/mp4' };
                    }
                    if (msg.video) {
                        return { source: msg.video, type: msg.type || 'video/mp4' };
                    }

                    if (typeof msg === 'object') {
                        for (let key in msg) {
                            if (typeof msg[key] === 'string' && msg[key].startsWith('data:video/')) {
                                return { source: msg[key], type: msg.type || 'video/mp4' };
                            }
                        }
                    }
                    return null;
                }

                const videoData = getVideoSource(message);

                if (videoData) {
                    messageHTML = `
        <div class="flex ${estEnvoyeur ? 'justify-end' : 'justify-start'} mb-4">
            <div class="max-w-[70%] ${estEnvoyeur ? 'bg-green-600' : 'bg-gray-600'} rounded-lg p-3">
                <video controls class="max-w-full rounded-lg">
                    <source src="${videoData.source}" type="${videoData.type}">
                    Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
                <div class="text-xs text-white text-right mt-1">
                    ${timestamp}
                    ${estEnvoyeur ? '<i class="bx bx-check-double"></i>' : ''}
                </div>
            </div>
        </div>
    `;
                } else {
                    console.warn('Message vidéo reçu sans données media valides:', message);
                    console.log('Structure du message:', JSON.stringify(message, null, 2));
                    messageHTML = this.createTextMessage(message, estEnvoyeur, timestamp);
                }
                break;

            default:
                messageHTML = this.createTextMessage(message, estEnvoyeur, timestamp);
        }

        const messagesContainer = document.querySelector('#messages');
        if (messagesContainer) {
            messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    },

    createTextMessage(message, estEnvoyeur, timestamp) {
        return `
        <div class="flex ${estEnvoyeur ? 'justify-end' : 'justify-start'} mb-4">
            <div class="max-w-[70%] ${estEnvoyeur ? 'bg-green-600' : 'bg-gray-600'} rounded-lg p-3">
                <p class="text-white">${message.texte || 'Message non disponible'}</p>
                <div class="text-xs text-white text-right mt-1">
                    ${timestamp}
                    ${estEnvoyeur ? '<i class="bx bx-check-double"></i>' : ''}
                </div>
            </div>
        </div>
    `;
    },

    ajouterControlsAudio(messageElement) {
        const playBtn = messageElement.querySelector('.play-btn');
        const audio = messageElement.querySelector('audio');
        const progressBar = messageElement.querySelector('.progress-bar');
        const durationDisplay = messageElement.querySelector('.duration');

        if (!playBtn || !audio || !progressBar || !durationDisplay) return;

        let isPlaying = false;

        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                playBtn.innerHTML = '<i class="bx bx-play-circle text-2xl"></i>';
            } else {
                audio.play();
                playBtn.innerHTML = '<i class="bx bx-pause-circle text-2xl"></i>';
            }
            isPlaying = !isPlaying;
        });

        audio.addEventListener('timeupdate', () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progress}%`;

            const minutes = Math.floor(audio.currentTime / 60);
            const seconds = Math.floor(audio.currentTime % 60);
            durationDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        });

        audio.addEventListener('ended', () => {
            isPlaying = false;
            playBtn.innerHTML = '<i class="bx bx-play-circle text-2xl"></i>';
            progressBar.style.width = '0%';
            durationDisplay.textContent = '0:00';
        });
    }
}