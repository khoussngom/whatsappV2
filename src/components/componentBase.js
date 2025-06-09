export const Components = {
        ListeMessages: (chat) => {
                const getTypeIcon = (type) => {
                    switch (type) {
                        case 'group':
                            return `<svg class="w-5 h-5 text-wa-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L12 13v7h8zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 15v-7H9V9.5C9 8.12 7.88 7 6.5 7S4 8.12 4 9.5V14h2v7h1.5z"/>
                    </svg>`;
                        case 'business':
                            return `<svg class="w-5 h-5 text-wa-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>`;
                        default:
                            return '';
                    }
                };

                return `
        <div class="flex items-center p-4 hover:bg-wa-hover cursor-pointer transition-colors border-b border-wa-border chat-item" data-chat-id="${chat.id}">
            <div class="relative mr-4">
                <div class="w-12 h-12 bg-wa-text-secondary rounded-full flex items-center justify-center">
                    ${chat.type === 'group' ?
                        `<svg class="w-6 h-6 text-wa-text" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L12 13v7h8zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 15v-7H9V9.5C9 8.12 7.88 7 6.5 7S4 8.12 4 9.5V14h2v7h1.5z"/>
                        </svg>` :
                        `<i class='bx bxs-user text-2xl text-wa-text'></i>`
                    }
                </div>
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                    <div class="font-medium text-wa-text truncate">
                        ${chat.type === 'groupe' ? chat.nom : `${chat.prenom} ${chat.nom}`}
                    </div>
                    <div class="text-xs text-wa-text-secondary">
                        ${new Date(chat.messages?.[chat.messages?.length - 1]?.timestamp || Date.now()).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div class="text-sm text-wa-text-secondary truncate">
                        ${chat.lastMessage || ''}
                    </div>
                    ${chat.nbreNonLu > 0 ? `
                    <div class="bg-wa-green text-white rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-medium px-1">
                        ${chat.nbreNonLu}
                    </div>` : ''}
                </div>
            </div>
        </div>`;
    }
};