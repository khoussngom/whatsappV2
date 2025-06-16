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

            // Remplir les champs
            const nomInput = document.getElementById('nom-utilisateur');
            const statutInput = document.getElementById('statut-utilisateur');
            const presenceToggle = document.getElementById('toggle-presence');

            if (nomInput) nomInput.value = userData.nom || userData.prenom || '';
            if (statutInput) statutInput.value = userData.status || "Hey! J'utilise WhatsApp";
            if (presenceToggle) presenceToggle.checked = userData.presence?.showOnline !== false;

            // Charger l'avatar si disponible
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
        // Retour
        document.getElementById('retourProfil')?.addEventListener('click', () => {
            window.location.reload();
        });

        // Changer avatar
        document.getElementById('changer-avatar')?.addEventListener('click', () => {
            document.getElementById('avatar-input')?.click();
        });

        document.getElementById('avatar-input')?.addEventListener('change', (e) => {
            this.changerAvatar(e.target.files[0]);
        });

        // Sauvegarder
        document.getElementById('sauvegarder-profil')?.addEventListener('click', () => {
            this.sauvegarderProfil();
        });
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
            const nom = document.getElementById('nom-utilisateur')?.value.trim();
            const statut = document.getElementById('statut-utilisateur')?.value.trim();
            const showOnline = document.getElementById('toggle-presence')?.checked;
            const avatarSrc = document.getElementById('avatar-preview')?.src;

            const updateData = {
                nom: nom || '',
                status: statut || "Hey! J'utilise WhatsApp",
                presence: {
                    showOnline: showOnline,
                    isOnline: true,
                    lastSeen: new Date().toISOString()
                }
            };

            // Ajouter l'avatar s'il a été modifié
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
            
            // Retourner à l'écran principal après 2 secondes
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            popupMessage.message("Erreur", "Impossible de sauvegarder le profil");
        }
    }
}))();