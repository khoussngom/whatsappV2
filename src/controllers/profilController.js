import { ProfilAvance } from '../components/componentProfil.js';
import { popupMessage } from '../components/popupMessage.js';

const url = "https://backendwhatsapp-twxo.onrender.com/utilisateurs";

export const ProfilController = (() => ({
    async afficherModificationProfil() {
        try {
            const gauche = document.querySelector('#gauche');
            gauche.innerHTML = ProfilAvance.interfaceModification();

            await this.chargerDonneesProfil();
            this.attacherEvenements();
        } catch (error) {
            console.error('Erreur lors de l\'affichage du profil:', error);
            popupMessage.message("Erreur", "Impossible de charger le profil");
        }
    },

    async chargerDonneesProfil() {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const userData = await response.json();

            const nomInput = document.getElementById('nom-utilisateur');
            const statutInput = document.getElementById('statut-utilisateur');
            const presenceToggle = document.getElementById('toggle-presence');

            if (nomInput) nomInput.value = userData.nom || userData.prenom || '';
            if (statutInput) statutInput.value = userData.status || "Hey! J'utilise WhatsApp";
            if (presenceToggle) presenceToggle.checked = userData.presence && userData.presence.showOnline !== false;

            if (userData.avatar) {
                const avatarPreview = document.getElementById('avatar-preview');
                const avatarIcon = document.getElementById('avatar-icon');
                if (avatarPreview && avatarIcon) {
                    avatarPreview.src = userData.avatar;
                    avatarPreview.classList.remove('hidden');
                    avatarIcon.classList.add('hidden');
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    },

    attacherEvenements() {
        const retourProfil = document.getElementById('retourProfil');
        if (retourProfil) {
            retourProfil.addEventListener('click', () => {
                window.location.reload();
            });
        }

        const changerAvatar = document.getElementById('changer-avatar');
        if (changerAvatar) {
            changerAvatar.addEventListener('click', () => {
                const avatarInput = document.getElementById('avatar-input');
                if (avatarInput) avatarInput.click();
            });
        }

        const avatarInput = document.getElementById('avatar-input');
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                this.changerAvatar(e.target.files[0]);
            });
        }

        const sauvegarderProfil = document.getElementById('sauvegarder-profil');
        if (sauvegarderProfil) {
            sauvegarderProfil.addEventListener('click', () => {
                this.sauvegarderProfil();
            });
        }
    },

    changerAvatar(file) {
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            popupMessage.message("Erreur", "L'image est trop volumineuse (max 5MB)");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const avatarPreview = document.getElementById('avatar-preview');
            const avatarIcon = document.getElementById('avatar-icon');

            if (avatarPreview && avatarIcon) {
                avatarPreview.src = e.target.result;
                avatarPreview.classList.remove('hidden');
                avatarIcon.classList.add('hidden');
            }
        };
        reader.readAsDataURL(file);
    },

    async sauvegarderProfil() {
        try {
            const userId = sessionStorage.getItem("userId");
            const nomInput = document.getElementById('nom-utilisateur');
            const statutInput = document.getElementById('statut-utilisateur');
            const presenceToggle = document.getElementById('toggle-presence');
            const avatarPreview = document.getElementById('avatar-preview');

            const nom = nomInput ? nomInput.value.trim() : '';
            const statut = statutInput ? statutInput.value.trim() : '';
            const showOnline = presenceToggle ? presenceToggle.checked : false;
            const avatarSrc = avatarPreview ? avatarPreview.src : '';

            const updateData = {
                nom: nom || '',
                status: statut || "Hey! J'utilise WhatsApp",
                presence: {
                    showOnline: showOnline,
                    isOnline: true,
                    lastSeen: new Date().toISOString()
                }
            };

            if (avatarSrc && avatarSrc.startsWith('data:')) {
                updateData.avatar = avatarSrc;
            }

            const response = await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

            popupMessage.message("Succès", "Profil mis à jour avec succès");

            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            popupMessage.message("Erreur", "Impossible de sauvegarder le profil");
        }
    }
}))();