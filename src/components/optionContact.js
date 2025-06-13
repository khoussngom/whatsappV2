export const optionContact = (() => ({
    option(chatId, contact) {
        return `
                <div class="bg-gray-800 text-gray-300 rounded-lg shadow-xl w-64 py-2">
        <!-- Info du contact -->
        <div class="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm">Infos du contact</span>
        </div>

        <!-- Sélectionner des messages -->
        <div class="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm">Sélectionner des messages</span>
        </div>

        <!-- Mode silencieux -->
        <div class="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
            </svg>
            <span class="text-sm">Mode silencieux</span>
        </div>

        <!-- Messages éphémères -->
        <div class="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm">Messages éphémères</span>
        </div>

        <!-- Ajouter aux Favoris -->
        <div class="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <span class="text-sm">Ajouter aux Favoris</span>
        </div>

        <!-- Fermer la discussion -->
        <div class="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span class="text-sm">Fermer la discussion</span>
        </div>

        <!-- Signaler -->
        <div class="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0-4V9a5 5 0 0110 0v4m3 4v4m0-4V9a5 5 0 00-10 0v4"></path>
            </svg>
            <span class="text-sm">Signaler</span>
        </div>

        <!-- Bloquer -->
            <div class="menu-contextuel-option px-4 py-3 text-sm hover:bg-red-600 text-white cursor-pointer flex items-center space-x-3 ${contact.blocked ? "debloquer-contact" : "bloquer-contact"}" data-chat-id="${chatId}">
                <i class='bx bx-${contact.blocked ? "lock-open" : "lock"} text-white text-sm'></i><span>${contact.blocked ? "Débloquer le contact" : "Bloquer le contact"}</span>
            </div>

        <!-- Separator -->
        <div class="border-t border-gray-600 my-1"></div>

        <!-- Effacer la discussion -->
        <div class="px-4 py-3 hover:bg-red-600 cursor-pointer flex items-center space-x-3 text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            <span class="text-sm">Effacer la discussion</span>
        </div>

        <!-- Supprimer la discussion -->
        <div class="px-4 py-3 hover:bg-red-600 cursor-pointer flex items-center space-x-3 text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            <span class="text-sm">Supprimer la discussion</span>
        </div>
    </div>`
    },
}))()