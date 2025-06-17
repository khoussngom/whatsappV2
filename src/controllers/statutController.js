import { StatutComponent } from '../components/componentStatut.js';
import { NotificationComponent } from '../components/componentNotification.js';

const url = "https://backendwhatsapp-twxo.onrender.com/utilisateurs";

export const StatutController = (() => ({
    async afficherStatuts() {
        try {
            const gauche = document.querySelector('#gauche');
            gauche.innerHTML = StatutComponent.creerInterfaceStatut();
            
            await this.chargerStatuts();
            this.attacherEvenements();
        } catch (error) {
            console.error('Erreur lors de l\'affichage des statuts:', error);
        }
    },

    async chargerStatuts() {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const userData = await response.json();

            // Charger mon statut
            if (userData.monStatut && !this.estExpire(userData.monStatut)) {
                const monStatutTexte = document.getElementById('monStatutTexte');
                if (monStatutTexte) {
                    monStatutTexte.textContent = userData.monStatut.type === 'texte' ? 
                        userData.monStatut.contenu : 'Photo';
                }
            }

            // Charger les statuts des contacts
            const listeStatuts = document.getElementById('listeStatuts');
            if (listeStatuts && userData.contacts) {
                let statutsHTML = '';
                
                for (const contact of userData.contacts) {
                    const contactResponse = await fetch(`${url}/${contact.id}`);
                    const contactData = await contactResponse.json();
                    
                    if (contactData.monStatut && !this.estExpire(contactData.monStatut)) {
                        statutsHTML += StatutComponent.afficherStatut({
                            id: contactData.monStatut.id,
                            auteur: `${contact.prenom} ${contact.nom}`,
                            timestamp: contactData.monStatut.timestamp
                        });
                    }
                }
                
                listeStatuts.innerHTML = statutsHTML || '<div class="text-gray-500 text-center">Aucun statut récent</div>';
            }
        } catch (error) {
            console.error('Erreur lors du chargement des statuts:', error);
        }
    },

    attacherEvenements() {
        // Retour
        document.getElementById('retourStatut')?.addEventListener('click', () => {
            window.location.reload();
        });

        // Ajouter statut
        document.getElementById('ajouterStatut')?.addEventListener('click', () => {
            this.afficherFormulaireStatut();
        });

        // Voir statut
        document.addEventListener('click', (e) => {
            const statutItem = e.target.closest('.statut-item');
            if (statutItem) {
                const statutId = statutItem.dataset.statutId;
                this.voirStatut(statutId);
            }
        });
    },

    afficherFormulaireStatut() {
        const formulaire = StatutComponent.creerFormulaireStatut();
        document.body.insertAdjacentHTML('beforeend', formulaire);

        // Événements du formulaire
        this.attacherEvenementsFormulaire();
    },

    attacherEvenementsFormulaire() {
        // Type de statut
        document.querySelectorAll('.statut-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.statut-type-btn').forEach(b => {
                    b.classList.remove('bg-green-600');
                    b.classList.add('bg-gray-600');
                });
                
                e.target.classList.remove('bg-gray-600');
                e.target.classList.add('bg-green-600');

                const type = e.target.dataset.type;
                document.getElementById('contenu-texte').classList.toggle('hidden', type !== 'texte');
                document.getElementById('contenu-image').classList.toggle('hidden', type !== 'image');
            });
        });

        // Choisir image
        document.getElementById('choisir-image')?.addEventListener('click', () => {
            document.getElementById('image-statut').click();
        });

        document.getElementById('image-statut')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const preview = document.getElementById('preview-image');
                    const img = document.getElementById('image-preview');
                    img.src = e.target.result;
                    preview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });

        // Annuler
        document.getElementById('annuler-statut')?.addEventListener('click', () => {
            document.getElementById('formulaire-statut')?.remove();
        });

        // Publier
        document.getElementById('publier-statut')?.addEventListener('click', () => {
            this.publierStatut();
        });
    },

    async publierStatut() {
        try {
            const typeActif = document.querySelector('.statut-type-btn.bg-green-600').dataset.type;
            const duree = parseInt(document.getElementById('duree-statut').value);
            
            let contenu = '';
            if (typeActif === 'texte') {
                contenu = document.getElementById('texte-statut').value.trim();
                if (!contenu) {
                    NotificationComponent.creerNotificationInterne('Veuillez saisir un texte', 'error');
                    return;
                }
            } else {
                const imageFile = document.getElementById('image-statut').files[0];
                if (!imageFile) {
                    NotificationComponent.creerNotificationInterne('Veuillez choisir une image', 'error');
                    return;
                }
                contenu = await this.fileToBase64(imageFile);
            }

            const nouveauStatut = {
                id: Date.now().toString(),
                type: typeActif,
                contenu: contenu,
                timestamp: new Date().toISOString(),
                duree: duree,
                vues: []
            };

            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const userData = await response.json();

            userData.monStatut = nouveauStatut;

            await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ monStatut: nouveauStatut })
            });

            document.getElementById('formulaire-statut')?.remove();
            NotificationComponent.creerNotificationInterne('Statut publié avec succès', 'success');
            
            // Recharger les statuts
            await this.chargerStatuts();

        } catch (error) {
            console.error('Erreur lors de la publication:', error);
            NotificationComponent.creerNotificationInterne('Erreur lors de la publication', 'error');
        }
    },

    estExpire(statut) {
        if (!statut || !statut.timestamp || !statut.duree) return true;
        
        const maintenant = new Date();
        const dateStatut = new Date(statut.timestamp);
        const dureeMs = statut.duree * 60 * 60 * 1000; // Convertir heures en millisecondes
        
        return (maintenant - dateStatut) > dureeMs;
    },

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
}))();