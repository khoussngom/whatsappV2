export const PreviewImage = (() => ({
    creerPreview(files) {
        const previews = Array.from(files).map((file, index) => {
            const url = URL.createObjectURL(file);
            const isVideo = file.type.startsWith('video/');
            
            return `
            <div class="preview-item relative" data-index="${index}">
                ${isVideo ? 
                    `<video src="${url}" class="max-w-full max-h-64 rounded-lg" controls></video>` :
                    `<img src="${url}" alt="Preview" class="max-w-full max-h-64 rounded-lg">`
                }
                <button class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 remove-preview" data-index="${index}">
                    ×
                </button>
                <div class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    ${this.formatFileSize(file.size)}
                </div>
            </div>`;
        }).join('');

        return `
        <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" id="preview-overlay">
            <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-white text-lg font-medium">Aperçu des fichiers</h3>
                    <button class="text-white hover:text-gray-300" id="fermer-preview">
                        <i class='bx bx-x text-2xl'></i>
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" id="preview-container">
                    ${previews}
                </div>
                
                <div class="mb-4">
                    <textarea id="caption-input" placeholder="Ajouter une légende..." 
                        class="w-full bg-gray-700 text-white p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-600" 
                        rows="3"></textarea>
                </div>
                
                <div class="flex justify-end gap-4">
                    <button class="px-4 py-2 text-white hover:bg-gray-700 rounded" id="annuler-envoi">
                        Annuler
                    </button>
                    <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center" id="confirmer-envoi">
                        <i class='bx bx-send mr-2'></i>Envoyer
                    </button>
                </div>
            </div>
        </div>`;
    },

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}))();