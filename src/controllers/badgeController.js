import { BadgeNonLu } from '../components/componentBadgeNonLu.js';

const url = "https://backendwhatsapp-twxo.onrender.com/utilisateurs";

export const BadgeController = (() => ({
    async mettreAJourBadges() {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const userData = await response.json();

            if (userData.contacts) {
                userData.contacts.forEach(contact => {
                    BadgeNonLu.mettreAJourBadge(contact.id, contact.nbreNonLu || 0);
                });
            }

            if (userData.groupes) {
                userData.groupes.forEach(groupe => {
                    BadgeNonLu.mettreAJourBadge(groupe.id, groupe.nbreNonLu || 0);
                });
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des badges:', error);
        }
    },

    async marquerCommeLu(chatId) {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const userData = await response.json();

            // Chercher dans les contacts
            const contactIndex = userData.contacts.findIndex(c => c.id === chatId);
            if (contactIndex !== -1) {
                userData.contacts[contactIndex].nbreNonLu = 0;
            } else {
                // Chercher dans les groupes
                const groupeIndex = userData.groupes.findIndex(g => g.id === chatId);
                if (groupeIndex !== -1) {
                    userData.groupes[groupeIndex].nbreNonLu = 0;
                }
            }

            await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            BadgeNonLu.marquerCommeLu(chatId);
        } catch (error) {
            console.error('Erreur lors du marquage comme lu:', error);
        }
    },

    async incrementerBadge(chatId) {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const userData = await response.json();

            // Chercher dans les contacts
            const contactIndex = userData.contacts.findIndex(c => c.id === chatId);
            if (contactIndex !== -1) {
                userData.contacts[contactIndex].nbreNonLu = (userData.contacts[contactIndex].nbreNonLu || 0) + 1;
                BadgeNonLu.mettreAJourBadge(chatId, userData.contacts[contactIndex].nbreNonLu);
            } else {
                // Chercher dans les groupes
                const groupeIndex = userData.groupes.findIndex(g => g.id === chatId);
                if (groupeIndex !== -1) {
                    userData.groupes[groupeIndex].nbreNonLu = (userData.groupes[groupeIndex].nbreNonLu || 0) + 1;
                    BadgeNonLu.mettreAJourBadge(chatId, userData.groupes[groupeIndex].nbreNonLu);
                }
            }

            await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        } catch (error) {
            console.error('Erreur lors de l\'incrémentation du badge:', error);
        }
    }
}))();