import { MessagesController } from './message.js';

const ListeMessages = document.querySelector("#ListeMessages");
const url = "https://backendwhatsapp-twxo.onrender.com/utilisateurs";
// const url = "http://localhost:3000/utilisateurs";


export const messageVocal = (() => {
    let mediaRecorder;
    let audioChunks = [];

    return {

        base64ToAudioUrl(base64) {
            try {
                const matches = base64.match(/^data:(audio\/\w+);base64,(.+)$/);
                if (!matches) {
                    console.error("Format base64 audio invalide !");
                    return null;
                }

                const mimeType = matches[1];
                const base64Data = matches[2];

                const byteString = atob(base64Data);
                const arrayBuffer = new Uint8Array(byteString.length);

                for (let i = 0; i < byteString.length; i++) {
                    arrayBuffer[i] = byteString.charCodeAt(i);
                }

                const blob = new Blob([arrayBuffer], { type: mimeType });
                return URL.createObjectURL(blob);
            } catch (error) {
                console.error("Erreur lors de la conversion base64 en URL audio :", error);
                return null;
            }
        },

        async initVocalMessage() {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async() => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                const audioUrl = URL.createObjectURL(audioBlob);
                await this.envoyerMessageVocal(audioBlob, audioUrl);
                audioChunks = [];
            };
        },

        async envoyerMessageVocal(audioBlob, audioUrl) {
            try {
                const reader = new FileReader();
                const audioBase64Promise = new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(audioBlob);
                });
                const audioBase64 = await audioBase64Promise;

                const userId = sessionStorage.getItem("userId");
                const chatId = MessagesController.chatActif;

                const response = await fetch(`${url}/${userId}`);
                const userData = await response.json();

                const nouveauMessage = {
                    id: Date.now().toString(),
                    type: 'audio',
                    audio: audioBase64,
                    timestamp: new Date().toISOString(),
                    envoyeur: userId,
                    statut: 'envoyé'
                };

                let conversation = userData.contacts.find(c => c.id === chatId) ||
                    userData.groupes.find(g => g.id === chatId);

                if (!conversation) {
                    throw new Error('Conversation non trouvée');
                }

                if (!conversation.messages) {
                    conversation.messages = [];
                }
                conversation.messages.push(nouveauMessage);
                conversation.lastMessage = "Message vocal";

                await fetch(`${url}/${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                await this.updateAudioResponse(audioUrl, true, nouveauMessage.id);

                const destinataire = userData.contacts.find(c => c.id === chatId);
                if (destinataire) {
                    const destinataireResponse = await fetch(`${url}/${chatId}`);
                    const destinataireData = await destinataireResponse.json();

                    let conversationDestinataire = destinataireData.contacts.find(c => c.id === userId);

                    if (conversationDestinataire) {
                        if (!conversationDestinataire.messages) {
                            conversationDestinataire.messages = [];
                        }

                        conversationDestinataire.messages.push(nouveauMessage);
                        conversationDestinataire.lastMessage = "Message vocal";

                        await fetch(`${url}/${chatId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(destinataireData)
                        });
                    }
                }
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message vocal:', error);
            }
        },

        ajouterInterfaceEnregistrement() {
            const messageInput = document.querySelector('#messageInput');
            const vocalButton = document.querySelector('#sendMessageVocal');
            let isRecording = false;
            let recordingTimer;
            let recordingTime = 0;

            vocalButton.addEventListener('mousedown', async() => {
                try {
                    await this.initVocalMessage();
                    isRecording = true;
                    mediaRecorder.start();

                    vocalButton.innerHTML = `
                        <div class="flex items-center">
                            <i class='bx bx-stop-circle text-red-500 text-2xl'></i>
                            <span class="ml-2" id="recordingTime">0:00</span>
                        </div>
                    `;

                    const timeLabel = document.querySelector('#recordingTime');

                    recordingTimer = setInterval(() => {
                        recordingTime++;
                        const minutes = Math.floor(recordingTime / 60);
                        const seconds = recordingTime % 60;
                        if (timeLabel) {
                            timeLabel.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                        }
                    }, 1000);

                } catch (error) {
                    console.error('Erreur lors de l\'accès au micro:', error);
                }
            });

            vocalButton.addEventListener('mouseup', () => {
                if (isRecording) {
                    mediaRecorder.stop();
                    isRecording = false;
                    clearInterval(recordingTimer);
                    recordingTime = 0;

                    vocalButton.innerHTML = `<i class='bx bx-microphone text-2xl'></i>`;
                }
            });
        },

        updateAudioResponse(audioUrl, estEnvoyeur = true, messageId = null) {
            const messagesContainer = document.querySelector('#messagesContainer');
            if (messagesContainer) {
                const messageHTML = `
                    <div class="flex ${estEnvoyeur ? 'justify-end' : 'justify-start'} mb-4" data-message-id="${messageId}">
                        <div class="max-w-[70%] ${estEnvoyeur ? 'bg-blue-600' : 'bg-gray-600'} rounded-lg p-3">
                            <div class="flex items-center gap-2">
                                <button class="play-btn text-white">
                                    <i class='bx bx-play-circle text-2xl'></i>
                                </button>
                                <div class="flex-1">
                                    <audio class="hidden" preload="auto">
                                        <source src="${audioUrl}" type="audio/mp3">
                                        Votre navigateur ne supporte pas l'élément audio.
                                    </audio>
                                    <div class="h-2 bg-gray-300 rounded">
                                        <div class="progress-bar h-full w-0 bg-green-500 rounded"></div>
                                    </div>
                                </div>
                                <span class="duration text-white text-sm">0:00</span>
                                <span class="current-time text-white text-sm hidden">0:00</span>
                            </div>
                            <div class="text-xs text-white text-right mt-1">
                                ${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                                ${estEnvoyeur ? '<i class="bx bx-check"></i>' : ''}
                            </div>
                        </div>
                    </div>
                `;
                messagesContainer.insertAdjacentHTML('beforeend', messageHTML);

                const lastMessage = messagesContainer.lastElementChild;
                this.ajouterControlsAudio(lastMessage);

                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        },

        ajouterControlsAudio(messageElement) {
            const audio = messageElement.querySelector('audio');
            const playBtn = messageElement.querySelector('.play-btn');
            const progressBar = messageElement.querySelector('.progress-bar');
            const durationElement = messageElement.querySelector('.duration');
            let currentTimeElement = messageElement.querySelector('.current-time');
            let isPlaying = false;
            let totalDuration = 0;

            const formatTime = (seconds) => {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = Math.floor(seconds % 60);
                return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            };

            if (!currentTimeElement) {
                currentTimeElement = durationElement;
            }

            audio.addEventListener('loadedmetadata', () => {
                totalDuration = audio.duration;
                durationElement.textContent = formatTime(totalDuration);
                messageElement.setAttribute('data-duration-loaded', 'true');
                messageElement.setAttribute('data-total-duration', totalDuration.toString());
            });

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
                if (totalDuration > 0) {
                    const progress = (audio.currentTime / totalDuration) * 100;
                    progressBar.style.width = `${progress}%`;

                    if (isPlaying) {
                        durationElement.textContent = formatTime(audio.currentTime);
                    }
                }
            });

            audio.addEventListener('ended', () => {
                isPlaying = false;
                playBtn.innerHTML = '<i class="bx bx-play-circle text-2xl"></i>';
                progressBar.style.width = '0%';
                durationElement.textContent = formatTime(totalDuration);
            });

            audio.addEventListener('pause', () => {
                if (totalDuration > 0) {
                    durationElement.textContent = formatTime(totalDuration);
                }
            });

            if (messageElement.hasAttribute('data-duration-loaded')) {
                const savedDuration = parseFloat(messageElement.getAttribute('data-total-duration'));
                if (savedDuration > 0) {
                    totalDuration = savedDuration;
                    durationElement.textContent = formatTime(totalDuration);
                }
            }
        },

        saveAudioStates() {
            const audioStates = new Map();
            document.querySelectorAll('[data-message-id]').forEach(msgElement => {
                const messageId = msgElement.getAttribute('data-message-id');
                const audio = msgElement.querySelector('audio');
                const durationElement = msgElement.querySelector('.duration');

                if (messageId && audio && durationElement) {
                    audioStates.set(messageId, {
                        duration: msgElement.getAttribute('data-total-duration') || '0',
                        currentTime: audio.currentTime || 0,
                        isLoaded: msgElement.hasAttribute('data-duration-loaded'),
                        displayDuration: !isNaN(audio.duration) && audio.duration > 0 ?
                            this.formatTime(audio.duration) : durationElement.textContent
                    });
                }
            });
            return audioStates;
        },

        // Méthode pour restaurer l'état des audios
        restoreAudioStates(audioStates, messageElement) {
            const messageId = messageElement.getAttribute('data-message-id');
            const savedState = audioStates.get(messageId);

            if (savedState && savedState.isLoaded) {
                const audio = messageElement.querySelector('audio');
                const durationElement = messageElement.querySelector('.duration');

                messageElement.setAttribute('data-duration-loaded', 'true');
                messageElement.setAttribute('data-total-duration', savedState.duration);

                if (durationElement && savedState.displayDuration !== '0:00') {
                    durationElement.textContent = savedState.displayDuration;
                }

                if (audio && savedState.currentTime > 0) {
                    const restoreTime = () => {
                        audio.currentTime = savedState.currentTime;
                    };

                    if (audio.readyState >= 1) {
                        restoreTime();
                    } else {
                        audio.addEventListener('loadedmetadata', restoreTime, { once: true });
                    }
                }
            }
        },

        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    };
})();