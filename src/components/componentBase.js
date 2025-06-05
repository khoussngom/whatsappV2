export const Components = (() => {
            const ListeMessages = (chat) => {
                    const formatTime = (date) => {
                        return new Date(date).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    };

                    return `
            <div class="flex items-center p-4 hover:bg-wa-hover cursor-pointer transition-colors border-b border-wa-border chat-item" 
                data-chat-id="${chat.id}">
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
                        <div class="text-xs text-wa-text-secondary">${formatTime(new Date())}</div>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-wa-text-secondary truncate">${chat.lastMessage}</div>
                        <div class="flex items-center">
                            ${chat.epingler ? 
                                `<div class="text-wa-text-secondary mx-1">
                                    <i class='bx bxs-pin text-sm'></i>
                                </div>` : ''
                            }
                            ${chat.nbreNonLu > 0 ? 
                                `<div class="bg-wa-green text-white rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-medium px-1">
                                    ${chat.nbreNonLu > 999 ? '999+' : chat.nbreNonLu}
                                </div>` : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    return {
        ListeMessages
    };
})();