export const Presence = (() => ({
    afficherStatut(userId, isOnline = false, lastSeen = null) {
        if (isOnline) {
            return `<span class="text-green-400 text-sm flex items-center">
                <div class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                En ligne
            </span>`;
        }
        
        if (lastSeen) {
            const timeAgo = this.calculerTempsEcoule(lastSeen);
            return `<span class="text-gray-400 text-sm">Vu ${timeAgo}</span>`;
        }
        
        return `<span class="text-gray-500 text-sm">Hors ligne</span>`;
    },

    calculerTempsEcoule(timestamp) {
        const now = new Date();
        const lastSeenDate = new Date(timestamp);
        const diffMs = now - lastSeenDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "à l'instant";
        if (diffMins < 60) return `il y a ${diffMins} min`;
        if (diffHours < 24) return `il y a ${diffHours}h`;
        if (diffDays < 7) return `il y a ${diffDays}j`;
        
        return lastSeenDate.toLocaleDateString('fr-FR');
    },

    mettreAJourPresence(userId, isOnline) {
        const statusElements = document.querySelectorAll(`[data-user-id="${userId}"] .user-status`);
        statusElements.forEach(element => {
            element.innerHTML = this.afficherStatut(userId, isOnline, isOnline ? null : new Date().toISOString());
        });
    },

    demarrerSuiviPresence() {
        // Simuler la présence en ligne
        setInterval(() => {
            const userId = sessionStorage.getItem("userId");
            if (userId) {
                this.envoyerPresence(userId, true);
            }
        }, 30000); // Toutes les 30 secondes

        // Détecter quand l'utilisateur quitte la page
        window.addEventListener('beforeunload', () => {
            const userId = sessionStorage.getItem("userId");
            if (userId) {
                this.envoyerPresence(userId, false);
            }
        });

        // Détecter la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            const userId = sessionStorage.getItem("userId");
            if (userId) {
                this.envoyerPresence(userId, !document.hidden);
            }
        });
    },

    async envoyerPresence(userId, isOnline) {
        try {
            const url = "https://backendwhatsapp-twxo.onrender.com/utilisateurs";
            const response = await fetch(`${url}/${userId}`);
            const userData = await response.json();

            userData.presence = {
                isOnline: isOnline,
                lastSeen: new Date().toISOString()
            };

            await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ presence: userData.presence })
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la présence:', error);
        }
    }
}))();