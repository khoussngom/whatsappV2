const Components = (() => {
            const ListeMessages = (chat) => {
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
                                    `<svg class="w-6 h-6 text-wa-text" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>`
                                }
                            </div>
                            ${chat.pinned ? `<div class="absolute -top-1 -right-1 w-4 h-4 bg-wa-text-secondary rounded-full flex items-center justify-center">
                                <svg class="w-2 h-2 text-wa-text" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6h2v-6h5v-2l-2-2z"/>
                                </svg>
                            </div>` : ''}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between mb-1">
                                <div class="font-medium text-wa-text truncate flex items-center gap-2">
                                    ${chat.name}
                                    ${chat.type === 'business' ? `<svg class="w-4 h-4 text-wa-green" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>` : ''}
                                </div>
                                <div class="text-xs text-wa-text-secondary">${Utils.formatTime(chat.timestamp)}</div>
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="text-sm text-wa-text-secondary truncate">${chat.lastMessage}</div>
                                ${chat.unreadCount > 0 ? `<div class="bg-wa-green text-white rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-medium px-1 ml-2">
                                    ${chat.unreadCount > 999 ? '999+' : chat.unreadCount}
                                </div>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            };
            const MessageItem = (message) => {
                const isMe = message.sender === 'me';
                return `
                    <div class="flex ${isMe ? 'justify-end' : 'justify-start'} mb-4">
                        <div class="max-w-md ${isMe ? 'bg-wa-green' : 'bg-wa-darker'} rounded-lg p-3">
                            <div class="text-wa-text text-sm">${message.text}</div>
                            <div class="flex items-center justify-end gap-1 mt-1">
                                <span class="text-xs text-wa-text-secondary">${Utils.formatTime(message.timestamp)}</span>
                                ${isMe ? `<svg class="w-4 h-4 text-wa-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            };
            return {
                ChatListItem,
                MessageItem
            };
        })();