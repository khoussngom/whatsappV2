import { GroupeAdmin } from '../components/componentGroupeAdmin.js';
import { popupMessage } from '../components/popupMessage.js';

const url = "https://backendwhatsapp-twxo.onrender.com/utilisateurs";

export const GroupeAdminController = (() => ({
    async afficherGestionGroupe(groupeId) {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const userData = await response.json();
            
            const groupe = userData.groupes.find(g => g.id === groupeId);
            if (!groupe) {
                throw new Error('Groupe non trouvé');
            }

            const gauche = document.querySelector('#gauche');
            gauche.innerHTML = GroupeAdmin.gestionGroupe(groupeId, groupe);
            
            this.attacherEvenements(groupeId, groupe);
        } catch (error) {
            console.error('Erreur lors de l\'affichage de la gestion:', error);
            popupMessage.message("Erreur", "Impossible de charger la gestion du groupe");
        }
    },

    attacherEvenements(groupeId, groupe) {
        // Retour
        document.getElementById('retourGroupe')?.addEventListener('click', () => {
            // Retourner à la liste des messages
            window.location.reload();
        });

        // Promouvoir admin
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.promouvoir-admin')) {
                const memberId = e.target.closest('.promouvoir-admin').dataset.memberId;
                await this.promouvoirAdmin(groupeId, memberId);
            }
        });

        // Retirer admin
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.retirer-admin')) {
                const memberId = e.target.closest('.retirer-admin').dataset.memberId;
                await this.retirerAdmin(groupeId, memberId);
            }
        });

        // Retirer membre
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.retirer-membre')) {
                const memberId = e.target.closest('.retirer-membre').dataset.memberId;
                await this.retirerMembre(groupeId, memberId);
            }
        });

        // Modifier nom du groupe
        document.getElementById('modifierNomGroupe')?.addEventListener('click', () => {
            this.afficherPopupModifierNom(groupeId, groupe.nom);
        });
    },

    async promouvoirAdmin(groupeId, memberId) {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const userData = await response.json();
            
            const groupeIndex = userData.groupes.findIndex(g => g.id === groupeId);
            if (groupeIndex === -1) throw new Error('Groupe non trouvé');

            if (!userData.groupes[groupeIndex].admin) {
                userData.groupes[groupeIndex].admin = [];
            }
            
            if (!userData.groupes[groupeIndex].admin.includes(memberId)) {
                userData.groupes[groupeIndex].admin.push(memberId);
            }

            await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupes: userData.groupes })
            });

            // Recharger l'interface
            this.afficherGestionGroupe(groupeId);
            
            popupMessage.message("Succès", `${memberId} est maintenant administrateur`);
        } catch (error) {
            console.error('Erreur lors de la promotion:', error);
            popupMessage.message("Erreur", "Impossible de promouvoir le membre");
        }
    },

    async retirerAdmin(groupeId, memberId) {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const userData = await response.json();
            
            const groupeIndex = userData.groupes.findIndex(g => g.id === groupeId);
            if (groupeIndex === -1) throw new Error('Groupe non trouvé');

            if (userData.groupes[groupeIndex].admin) {
                userData.groupes[groupeIndex].admin = userData.groupes[groupeIndex].admin.filter(id => id !== memberId);
            }

            await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupes: userData.groupes })
            });

            // Recharger l'interface
            this.afficherGestionGroupe(groupeId);
            
            popupMessage.message("Succès", `${memberId} n'est plus administrateur`);
        } catch (error) {
            console.error('Erreur lors de la rétrogradation:', error);
            popupMessage.message("Erreur", "Impossible de retirer les droits d'admin");
        }
    },

    async retirerMembre(groupeId, memberId) {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const userData = await response.json();
            
            const groupeIndex = userData.groupes.findIndex(g => g.id === groupeId);
            if (groupeIndex === -1) throw new Error('Groupe non trouvé');

            // Retirer des membres
            if (userData.groupes[groupeIndex].membres) {
                userData.groupes[groupeIndex].membres = userData.groupes[groupeIndex].membres.filter(id => id !== memberId);
            }

            // Retirer des admins aussi si c'était un admin
            if (userData.groupes[groupeIndex].admin) {
                userData.groupes[groupeIndex].admin = userData.groupes[groupeIndex].admin.filter(id => id !== memberId);
            }

            await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupes: userData.groupes })
            });

            // Recharger l'interface
            this.afficherGestionGroupe(groupeId);
            
            popupMessage.message("Succès", `${memberId} a été retiré du groupe`);
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            popupMessage.message("Erreur", "Impossible de retirer le membre");
        }
    },

    afficherPopupModifierNom(groupeId, nomActuel) {
        const popup = GroupeAdmin.popupModifierNom(nomActuel);
        document.body.insertAdjacentHTML('beforeend', popup);

        // Événements du popup
        document.getElementById('annuler-modification')?.addEventListener('click', () => {
            document.getElementById('popup-modifier-nom')?.remove();
        });

        document.getElementById('confirmer-modification')?.addEventListener('click', async () => {
            const nouveauNom = document.getElementById('nouveauNomGroupe')?.value.trim();
            if (nouveauNom) {
                await this.modifierNomGroupe(groupeId, nouveauNom);
                document.getElementById('popup-modifier-nom')?.remove();
            }
        });
    },

    async modifierNomGroupe(groupeId, nouveauNom) {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const userData = await response.json();
            
            const groupeIndex = userData.groupes.findIndex(g => g.id === groupeId);
            if (groupeIndex === -1) throw new Error('Groupe non trouvé');

            userData.groupes[groupeIndex].nom = nouveauNom;

            await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupes: userData.groupes })
            });

            // Recharger l'interface
            this.afficherGestionGroupe(groupeId);
            
            popupMessage.message("Succès", "Nom du groupe modifié avec succès");
        } catch (error) {
            console.error('Erreur lors de la modification:', error);
            popupMessage.message("Erreur", "Impossible de modifier le nom du groupe");
        }
    }
}))();