import { MessagesController } from "./message.js";
import { PreviewController } from "./previewController.js";

export function selectFile() {
    document.querySelector("#mediaInpute").addEventListener('click', (e) => {
        const photoVideoBtn = e.target.closest('[data-action="photo-video"]');
        if (photoVideoBtn) {
            const mediaInput = document.querySelector('#mediaInput');
            mediaInput.click();
        }
    });
}

const mediaInput = document.querySelector('#mediaInput');
mediaInput.addEventListener('change', async(e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Vérifier la taille des fichiers
    const oversizedFiles = files.filter(file => file.size > 16 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
        alert(`${oversizedFiles.length} fichier(s) trop volumineux. Taille maximum: 16MB`);
        // Filtrer les fichiers trop volumineux
        const validFiles = files.filter(file => file.size <= 16 * 1024 * 1024);
        if (validFiles.length === 0) {
            e.target.value = '';
            return;
        }
    }

    // Afficher la prévisualisation
    PreviewController.afficherPreview(files);
    
    // Réinitialiser l'input
    e.target.value = '';
});

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}