import { MessagesController } from "./message";


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

    for (const file of files) {
        try {
            if (file.size > 16 * 1024 * 1024) {
                alert("Le fichier est trop volumineux. Taille maximum: 16MB");
                continue;
            }

            const base64 = await fileToBase64(file);
            const messageType = file.type.startsWith('image/') ? 'image' : 'video';

            const nouveauMessage = {
                type: messageType,
                media: {
                    base64: base64,
                    type: file.type,
                    name: file.name
                }
            };

            await MessagesController.envoyerMessage('', messageType, nouveauMessage);

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
            console.error("Erreur lors de l'envoi du média:", error);
        }
    }

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