export const Components = {
        ListeMessages: (chat) => {
                return `
        <div class="flex items-center p-4 hover:bg-wa-hover cursor-pointer relative chat-item" data-chat-id="${chat.id}">
            <div class="relative mr-4">
                <div class="w-12 h-12 bg-wa-text-secondary rounded-full flex items-center justify-center">
                    ${chat.type === 'groupe' ? 
                        `<i class='bx bxs-group text-2xl text-wa-text'></i>` : 
                        `<i class='bx bxs-user text-2xl text-wa-text'></i>`
                    }
                </div>
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                    <div class="font-medium text-wa-text truncate">
                        ${chat.type === 'groupe' ? chat.nom : `${chat.prenom} ${chat.nom}`}
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-wa-text-secondary">
                            ${chat.messages && chat.messages.length > 0 ? 
                                new Date(chat.messages[chat.messages.length - 1].timestamp)
                                    .toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}) : 
                                ''
                            }
                        </span>
                        <button class="menu-trigger p-2 hover:bg-wa-hover rounded-full" data-chat-id="${chat.id}">
                            <i class='bx bx-chevron-down text-xl text-wa-green'text-secondary'></i>
                        </button>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div class="text-sm text-wa-text-secondary truncate">
                        ${chat.lastMessage || ''}
                    </div>
                    ${chat.nbreNonLu > 0 ? `
                        <div class="bg-wa-green text-white rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-medium px-1">
                            ${chat.nbreNonLu}
                        </div>` : ''
                    }
                </div>
            </div>
        </div>`;
    },


    AjoutContact: ({ mode = 'creation', contact = null }) => {
        return `
        <div class="h-full flex flex-col bg-wa-container">
            <div class="bg-wa-container p-4 flex items-center border-b border-wa-border">
                <button class="text-wa-text hover:bg-wa-hover p-2 rounded-full" id="retour-liste">
                    <i class='bx bx-arrow-back text-2xl'></i>
                </button>
                <h2 class="text-wa-text ml-4 text-xl">
                    ${mode === 'edition' ? 'Modifier le contact' : 'Nouveau contact'}
                </h2>
            </div>
            <div class="flex-1 p-6">
                <form id="form-contact" class="space-y-6">
                    <div>
                        <label class="block text-wa-text mb-2">Prénom</label>
                        <input type="text" name="prenom" 
                            value="${contact?.prenom || ''}"
                            class="w-full bg-wa-darker text-wa-text p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-wa-green"
                            required>
                    </div>
                    <div>
                        <label class="block text-wa-text mb-2">Nom</label>
                        <input type="text" name="nom" 
                            value="${contact?.nom || ''}"
                            class="w-full bg-wa-darker text-wa-text p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-wa-green"
                            required>
                    </div>
                    <div>
                        <label class="block text-wa-text mb-2">Téléphone</label>
                        <input type="tel" name="numero" 
                            value="${contact?.numero || ''}"
                            class="w-full bg-wa-darker text-wa-text p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-wa-green"
                            required>
                    </div>
                    <button type="submit" 
                        class="w-full bg-wa-green text-white py-3 rounded-lg hover:bg-opacity-80">
                        ${mode === 'edition' ? 'Modifier' : 'Ajouter'}
                    </button>
                </form>
            </div>
        </div>`;
    },

    PopupSuppression: (chatId) => {
        return `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="popup-overlay">
            <div class="bg-wa-container rounded-lg p-6 max-w-sm w-full m-4">
                <h3 class="text-wa-text text-lg font-medium mb-4">Supprimer le contact</h3>
                <p class="text-wa-text-secondary mb-6">Êtes-vous sûr de vouloir supprimer ce contact ?</p>
                <div class="flex justify-end gap-4">
                    <button class="px-4 py-2 text-wa-text hover:bg-wa-hover rounded" id="annuler-suppression">
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