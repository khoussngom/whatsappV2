export const BadgeNonLu = (() => ({
    creerBadge(nombre) {
        if (nombre <= 0) return '';
        
        return `
        <div class="bg-green-600 text-white rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-medium px-1 animate-pulse">
            ${nombre > 99 ? '99+' : nombre}
        </div>`;
    },

    mettreAJourBadge(chatId, nombre) {
        const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`);
        if (!chatElement) return;

        const badgeContainer = chatElement.querySelector('.badge-container');
        if (badgeContainer) {
            badgeContainer.innerHTML = this.creerBadge(nombre);
        }
    },

    marquerCommeLu(chatId) {
        this.mettreAJourBadge(chatId, 0);
    }
}))();