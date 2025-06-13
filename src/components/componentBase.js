export const Components = {
        ListeMessages: (chat) => {
                return `
        <div class="flex items-center p-4 hover:bg-green-600 cursor-pointer relative chat-item" data-chat-id="${chat.id}">
            <div class="relative mr-4">
                <div class="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                    ${chat.type === 'groupe' ?
                        `<i class='bx bxs-group text-2xl text-white'></i>` :
                        `<i class='bx bxs-user text-2xl text-white'></i>`
                    }
                </div>
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                    <div class="font-medium text-white truncate">
                        ${chat.type === 'groupe' ? chat.nom : `${chat.prenom} ${chat.nom}`}
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-white">
                            ${chat.messages && chat.messages.length > 0 ? 
                                new Date(chat.messages[chat.messages.length - 1].timestamp)
                                    .toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}) : 
                                ''
                            }
                        </span>
                        <button class="menu-trigger p-2 hover:bg-green rounded-full" data-chat-id="${chat.id}">
                            <i class='bx bx-chevron-down text-xl text-green-600'text'></i>
                        </button>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div class="text-sm text-white truncate">
                        ${chat.lastMessage || ''}
                    </div>
                    ${chat.nbreNonLu > 0 ? `
                        <div class="bg-green-600 text-white rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-medium px-1">
                            ${chat.nbreNonLu}
                        </div>` : ''
                    }
                </div>
            </div>
        </div>`;
    },

    menuContextuel(chatId,contact){
        return `
            <div class="menu-contextuel-option modifier-contact" data-chat-id="${chatId}">
                <i class='bx bx-edit mr-2'></i> Modifier le contact
            </div>
            <div class="menu-contextuel-option supprimer-contact" data-chat-id="${chatId}">
                <i class='bx bx-trash mr-2'></i> Supprimer le contact
            </div>
            <div class="menu-contextuel-option ${contact.blocked ? "debloquer-contact" : "bloquer-contact"}" data-chat-id="${chatId}">
                <i class='bx bx-${contact.blocked ? "lock-open" : "lock"} mr-2'></i>${contact.blocked ? "Débloquer le contact" : "Bloquer le contact"}
            </div>
        `;
    },

    AjoutContact: ({ mode = 'creation', contact = null }) => {
        return `
        <div class="h-full flex flex-col bg-black">
            <div class="bg-black p-4 flex items-center border-b border-green-600">
                <button class="text-white hover:bg-green-600 p-2 rounded-full" id="backButton">
                    <i class='bx bx-arrow-back text-2xl'></i>
                </button>
                <h2 class="text-white ml-4 text-xl">
                    ${mode === 'edition' ? 'Modifier le contact' : 'Nouveau contact'}
                </h2>
            </div>
            <div class="flex-1 p-6">
                <form id="form-contact" class="space-y-6">
                    <div>
                        <label class="block text-white mb-2">Prénom</label>
                        <input type="text" name="prenom" 
                            value="${contact?.prenom || ''}"
                            class="w-full bg-black text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required>
                    </div>
                    <div>
                        <label class="block text-white mb-2">Nom</label>
                        <input type="text" name="nom" 
                            value="${contact?.nom || ''}"
                            class="w-full bg-black text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required>
                    </div>
                    <div>
                        <label class="block text-white mb-2">Téléphone</label>
                        <input type="tel" name="numero" 
                            value="${contact?.numero || ''}"
                            class="w-full bg-black text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required>
                    </div>
                    <button type="submit" 
                        class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-opacity-80">
                        ${mode === 'edition' ? 'Modifier' : 'Ajouter'}
                    </button>
                </form>
            </div>
        </div>`;
    },

    PopupSuppression: (chatId) => {
        return `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="popup-overlay">
            <div class="bg-black rounded-lg p-6 max-w-sm w-full m-4">
                <h3 class="text-white text-lg font-medium mb-4">Supprimer le contact</h3>
                <p class="text-white mb-6">Êtes-vous sûr de vouloir supprimer ce contact ?</p>
                <div class="flex justify-end gap-4">
                    <button class="px-4 py-2 text-white hover:bg-green-600 rounded" id="annuler-suppression">
                        Annuler
                    </button>
                    <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" 
                        id="confirmer-suppression" 
                        data-chat-id="${chatId}">
                        Supprimer
                    </button>
                </div>
            </div>
        </div>`;
    }
};