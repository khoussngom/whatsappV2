import { PreviewImage } from '../components/componentPreviewImage.js';
import { MessagesController } from './message.js';

export const PreviewController = (() => ({
    selectedFiles: [],

    afficherPreview(files) {
        this.selectedFiles = Array.from(files);
        const previewHTML = PreviewImage.creerPreview(this.selectedFiles);
        document.body.insertAdjacentHTML('beforeend', previewHTML);
        
        this.attacherEvenements();
    },

    attacherEvenements() {
        // Fermer la preview
        document.getElementById('fermer-preview')?.addEventListener('click', () => {
            this.fermerPreview();
        });

        document.getElementById('annuler-envoi')?.addEventListener('click', () => {
            this.fermerPreview();
        });

        // Supprimer un fichier de la preview
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-preview')) {
                const index = parseInt(e.target.closest('.remove-preview').dataset.index);
                this.supprimerFichier(index);
            }
        });

        // Confirmer l'envoi
        document.getElementById('confirmer-envoi')?.addEventListener('click', () => {
            this.confirmerEnvoi();
        });

        // Fermer en cliquant à l'extérieur
        document.getElementById('preview-overlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'preview-overlay') {
                this.fermerPreview();
            }
        });
    },

    supprimerFichier(index) {
        this.selectedFiles.splice(index, 1);
        
        if (this.selectedFiles.length === 0) {
            this.fermerPreview();
            return;
        }

        // Recréer la preview sans le fichier supprimé
        const previewContainer = document.getElementById('preview-container');
        if (previewContainer) {
            const newPreviews = this.selectedFiles.map((file, newIndex) => {
                const url = URL.createObjectURL(file);
                const isVideo = file.type.startsWith('video/');
                
                return `
                <div class="preview-item relative" data-index="${newIndex}">
                    ${isVideo ? 
                        `<video src="${url}" class="max-w-full max-h-64 rounded-lg" controls></video>` :
                        `<img src="${url}" alt="Preview" class="max-w-full max-h-64 rounded-lg">`
                    }
                    <button class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 remove-preview" data-index="${newIndex}">
                        ×
                    </button>
                    <div class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        ${PreviewImage.formatFileSize(file.size)}
                    </div>
                </div>`;
            }).join('');
            
            previewContainer.innerHTML = newPreviews;
        }
    },

    async confirmerEnvoi() {
        const caption = document.getElementById('caption-input')?.value.trim() || '';
        
        try {
            for (const file of this.selectedFiles) {
                if (file.size > 16 * 1024 * 1024) {
                    alert(`Le fichier ${file.name} est trop volumineux. Taille maximum: 16MB`);
                    continue;
                }

                const base64 = await this.fileToBase64(file);
                const messageType = file.type.startsWith('image/') ? 'image' : 'video';

                const nouveauMessage = {
                    type: messageType,
                    media: {
                        base64: base64,
                        type: file.type,
                        name: file.name
                    }
                };

                await MessagesController.envoyerMessage(caption, messageType, nouveauMessage);
            }

            this.fermerPreview();
            
            // Fermer le menu plus si ouvert
            const menuPlus = document.querySelector('.menu-plus');
            if (menuPlus) {
                menuPlus.remove();
            }
            
            const sendPlus = document.querySelector('#sendFichier');
            if (sendPlus) {
                sendPlus.style.backgroundColor = "";
                const bx = document.querySelector(".boxIm");
                if (bx) {
                    bx.style.transform = 'rotate(0deg)';
                }
            }

        } catch (error) {
            console.error("Erreur lors de l'envoi des médias:", error);
            alert("Erreur lors de l'envoi des fichiers");
        }
    },

    fermerPreview() {
        const overlay = document.getElementById('preview-overlay');
        if (overlay) {
            // Libérer les URLs d'objets
            this.selectedFiles.forEach(file => {
                const url = URL.createObjectURL(file);
                URL.revokeObjectURL(url);
            });
            
            overlay.remove();
            this.selectedFiles = [];
        }
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