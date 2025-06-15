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


    async envoyerMessage(texte, type = 'text', audioData = null) {
        try {
            if (!this.chatActif) {
                throw new Error('Aucune conversation active');
            }

            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                throw new Error('Utilisateur non connecté');
            }

            let audioUrl = null;
            if (type === 'audio' && audioData) {
                if (typeof audioData === 'string' && audioData.startsWith('data:audio')) {
                    audioUrl = audioData;
                } else {
                    audioUrl = await this.blobToBase64(audioData);
                }
            }

            const nouveauMessage = {
                id: Date.now().toString(),
                type: type,
                timestamp: new Date().toISOString(),
                envoyeur: userId,
                statut: 'envoyé',
                texte: type === 'text' ? texte : '',
                audio: audioUrl
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

                const existingAudios = messagesContainer.querySelectorAll('audio');
                existingAudios.forEach(audio => {
                    if (audio.src && audio.src.startsWith('blob:')) {
                        URL.revokeObjectURL(audio.src);
                    }
                });

                const messagesHTML = source.messages.map(msg => {
                    if (msg.type === 'audio' && msg.audio) {
                        const audioUrl = this.base64ToAudioUrl(msg.audio);
                        if (!audioUrl) return '';

                        return `
                                <div class="flex ${msg.envoyeur === userId ? 'justify-end' : 'justify-start'} mb-4">
                                    <div class="max-w-[70%] ${msg.envoyeur === userId ? 'bg-blue-600' : 'bg-gray-600'} rounded-lg p-3">
                                        <div class="flex items-center gap-2">
                                            <button class="play-btn text-white">
                                                <i class='bx bx-play-circle text-2xl'></i>
                                            </button>
                                            <div class="flex-1">
                                                <audio class="hidden" preload="metadata">
                                                    <source src="${audioUrl}" type="audio/mp3">
                                                </audio>
                                                <div class="h-2 bg-gray-300 rounded">
                                                    <div class="progress-bar h-full w-0 bg-green-500 rounded"></div>
                                                </div>
                                            </div>
                                            <span class="duration text-white text-sm">0:00</span>
                                        </div>
                                        <div class="text-xs text-white text-right mt-1">
                                            ${new Date(msg.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                                            ${msg.envoyeur === userId ? '<i class="bx bx-check"></i>' : ''}
                                        </div>
                                    </div>
                                </div>
                            `;
                    } else {
                        return `
                                <div class="flex ${msg.envoyeur === userId ? 'justify-end' : 'justify-start'} mb-4">
                                    <div class="max-w-[70%] ${msg.envoyeur === userId ? 'bg-blue-600' : 'bg-gray-600'} rounded-lg p-3">
                                        <div class="text-white break-words">${msg.texte || ''}</div>
                                        <div class="text-xs text-white text-right mt-1">
                                            ${new Date(msg.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                                            ${msg.envoyeur === userId ? '<i class="bx bx-check"></i>' : ''}
                                        </div>
                                    </div>
                                </div>
                            `;
                    }
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
        if (
            msg.type === "audio" &&
            typeof msg.audio === "string" &&
            msg.audio.startsWith("data:audio") &&
            msg.audio.split(',')[1] && msg.audio.split(',')[1].trim() !== ""
        ) {
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
                            ${new Date(msg.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
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
                            ${new Date(msg.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
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
        const messagesContainer = document.querySelector('#messagesContainer');
        if (!messagesContainer) return;

        const estEnvoyeur = message.envoyeur === sessionStorage.getItem('userId');
        const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        }) : '';

        let messageHTML = '';

        if (message.type === "audio" && typeof message.audio === "string" && message.audio.startsWith("data:audio")) {

            const audioUrl = this.base64ToAudioUrl(message.audio);

            messageHTML = `
                    <div class="flex ${estEnvoyeur ? 'justify-end' : 'justify-start'} mb-4">
                        <div class="max-w-[70%] ${estEnvoyeur ? 'bg-blue-600' : 'bg-gray-600'} rounded-lg p-3">
                            <div class="flex items-center gap-2">
                                <button class="play-btn text-white">
                                    <i class='bx bx-play-circle text-2xl'></i>
                                </button>
                                <div class="flex-1">
                                    <audio class="hidden">
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
                                ${estEnvoyeur ? '<i class="bx bx-check"></i>' : ''}
                            </div>
                        </div>
                    </div>
                `;

            messagesContainer.insertAdjacentHTML('beforeend', messageHTML);

            const lastMessage = messagesContainer.lastElementChild;
            this.ajouterControlsAudio(lastMessage);
        } else {
            messageHTML = `
                    <div class="flex ${estEnvoyeur ? 'justify-end' : 'justify-start'} mb-4">
                        <div class="max-w-[70%] ${estEnvoyeur ? 'bg-blue-600' : 'bg-gray-600'} rounded-lg p-3">
                            <div class="text-white break-words">${message.texte || ''}</div>
                            <div class="text-xs text-white text-right mt-1">
                                ${timestamp}
                                ${estEnvoyeur ? '<i class="bx bx-check"></i>' : ''}
                            </div>
                        </div>
                    </div>
                `;

            messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        }

        this.scrollToBottom();
    },

    base64ToBlob(base64) {
        const [header, data] = base64.split(',');
        const bytes = atob(data);
        const array = new Uint8Array(bytes.length);

        for (let i = 0; i < bytes.length; i++) {
            array[i] = bytes.charCodeAt(i);
        }

        return new Blob([array], { type: 'audio/mp3' });
    },

    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    },

    ajouterControlsAudio(messageElement) {
        const audio = messageElement.querySelector('audio');
        const playBtn = messageElement.querySelector('.play-btn');
        const progressBar = messageElement.querySelector('.progress-bar');
        const durationSpan = messageElement.querySelector('.duration');
        let isPlaying = false;
        let audioDuration = 0;

        const formatTime = (timeInSeconds) => {
            if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) {
                return '0:00';
            }
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = Math.floor(timeInSeconds % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };

        audio.addEventListener('loadedmetadata', () => {
            audioDuration = audio.duration;
            durationSpan.textContent = formatTime(audioDuration);
        });

        audio.addEventListener('timeupdate', () => {
            if (isNaN(audioDuration) || !isFinite(audioDuration)) return;
            const progress = (audio.currentTime / audioDuration) * 100;
            progressBar.style.width = `${progress}%`;
            durationSpan.textContent = formatTime(audio.currentTime);

            messageElement.dataset.progress = audio.currentTime;
        });

        const savedProgress = messageElement.dataset.progress;
        if (savedProgress) {
            audio.currentTime = parseFloat(savedProgress);
            const progress = (audio.currentTime / audioDuration) * 100;
            progressBar.style.width = `${progress}%`;
            durationSpan.textContent = formatTime(audio.currentTime);
        }

        playBtn.addEventListener('click', () => {
            if (!audio.src) return;

            if (isPlaying) {
                audio.pause();
                playBtn.innerHTML = '<i class="bx bx-play-circle text-2xl"></i>';
            } else {
                audio.play().catch(error => {
                    console.error('Erreur de lecture audio:', error);
                });
                playBtn.innerHTML = '<i class="bx bx-pause-circle text-2xl"></i>';
            }
            isPlaying = !isPlaying;
        });

        audio.addEventListener('ended', () => {
            isPlaying = false;
            playBtn.innerHTML = '<i class="bx bx-play-circle text-2xl"></i>';
            progressBar.style.width = '0%';
            durationSpan.textContent = formatTime(audioDuration);
            messageElement.dataset.progress = '0';
        });

        audio.addEventListener('error', (e) => {
            console.error('Erreur audio:', e);
            durationSpan.textContent = '0:00';
        });
    }
};