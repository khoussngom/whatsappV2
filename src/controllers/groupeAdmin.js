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
        const retourBtn = document.getElementById('retourGroupe');
        if (retourBtn) {
            retourBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }

        document.addEventListener('click', async(e) => {
            const promouvoirBtn = e.target.closest('.promouvoir-admin');
            if (promouvoirBtn) {
                const memberId = promouvoirBtn.dataset.memberId;
                await this.promouvoirAdmin(groupeId, memberId);
            }

            const retirerAdminBtn = e.target.closest('.retirer-admin');
            if (retirerAdminBtn) {
                const memberId = retirerAdminBtn.dataset.memberId;
                await this.retirerAdmin(groupeId, memberId);
            }

            const retirerMembreBtn = e.target.closest('.retirer-membre');
            if (retirerMembreBtn) {
                const memberId = retirerMembreBtn.dataset.memberId;
                await this.retirerMembre(groupeId, memberId);
            }
        });

        const modifierNomBtn = document.getElementById('modifierNomGroupe');
        if (modifierNomBtn) {
            modifierNomBtn.addEventListener('click', () => {
                this.afficherPopupModifierNom(groupeId, groupe.nom);
            });
        }
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

            if (userData.groupes[groupeIndex].membres) {
                userData.groupes[groupeIndex].membres = userData.groupes[groupeIndex].membres.filter(id => id !== memberId);
            }

            if (userData.groupes[groupeIndex].admin) {
                userData.groupes[groupeIndex].admin = userData.groupes[groupeIndex].admin.filter(id => id !== memberId);
            }

            await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupes: userData.groupes })
            });

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

        const annulerBtn = document.getElementById('annuler-modification');
        if (annulerBtn) {
            annulerBtn.addEventListener('click', () => {
                const popupElem = document.getElementById('popup-modifier-nom');
                if (popupElem) popupElem.remove();
            });
        }

        const confirmerBtn = document.getElementById('confirmer-modification');
        if (confirmerBtn) {
            confirmerBtn.addEventListener('click', async() => {
                const nouveauNomInput = document.getElementById('nouveauNomGroupe');
                const nouveauNom = nouveauNomInput ? nouveauNomInput.value.trim() : '';
                if (nouveauNom) {
                    await this.modifierNomGroupe(groupeId, nouveauNom);
                    const popupElem = document.getElementById('popup-modifier-nom');
                    if (popupElem) popupElem.remove();
                }
            });
        }
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

            this.afficherGestionGroupe(groupeId);

            popupMessage.message("Succès", "Nom du groupe modifié avec succès");
        } catch (error) {
            console.error('Erreur lors de la modification:', error);
            popupMessage.message("Erreur", "Impossible de modifier le nom du groupe");
        }
    }
}))();