export const NotificationComponent = (() => ({
    async demanderPermission() {
        if (!("Notification" in window)) {
            console.log("Ce navigateur ne supporte pas les notifications");
            return false;
        }

        if (Notification.permission === "granted") {
            return true;
        }

        if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            return permission === "granted";
        }

        return false;
    },

    async afficherNotification(titre, options = {}) {
        const hasPermission = await this.demanderPermission();
        
        if (!hasPermission) {
            console.log("Permission de notification refusée");
            return;
        }

        const defaultOptions = {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'whatsapp-message',
            requireInteraction: false,
            silent: false,
            ...options
        };

        try {
            const notification = new Notification(titre, defaultOptions);
            
            notification.onclick = () => {
                window.focus();
                notification.close();
                if (options.onClick) {
                    options.onClick();
                }
            };

            setTimeout(() => {
                notification.close();
            }, 5000);

            return notification;
        } catch (error) {
            console.error('Erreur lors de la création de la notification:', error);
        }
    },

    notifierNouveauMessage(expediteur, message, chatId) {
        const titre = `Nouveau message de ${expediteur}`;
        const options = {
            body: message.length > 50 ? message.substring(0, 50) + '...' : message,
            icon: '/favicon.ico',
            tag: `message-${chatId}`,
            onClick: () => {
                // Ouvrir la conversation
                if (window.MessagesController) {
                    window.MessagesController.afficherConversation(chatId);
                }
            }
        };

        this.afficherNotification(titre, options);
    },

    notifierNouveauStatut(auteur) {
        const titre = "Nouveau statut";
        const options = {
            body: `${auteur} a publié un nouveau statut`,
            icon: '/favicon.ico',
            tag: 'nouveau-statut'
        };

        this.afficherNotification(titre, options);
    },

    creerNotificationInterne(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 
            type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'
        } text-white`;
        
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class='bx ${
                    type === 'success' ? 'bx-check-circle' : 
                    type === 'error' ? 'bx-error-circle' : 
                    type === 'warning' ? 'bx-error' : 'bx-info-circle'
                }'></i>
                <span>${message}</span>
                <button class="ml-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class='bx bx-x'></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto-suppression après 5 secondes
        setTimeout(() => {
            notification.style.transform = 'translateX(full)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
}))();