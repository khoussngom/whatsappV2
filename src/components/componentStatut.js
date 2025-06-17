export const StatutComponent = {
    creerInterfaceStatut() {
        return `
        <div class="flex flex-col h-full bg-gray-900">
            <div class="px-4 py-2 flex items-center border-b border-gray-700">
                <button id="retourStatut" class="text-gray-400 hover:text-white">
                    <i class='bx bx-arrow-back text-2xl'></i>
                </button>
                <h1 class="text-white text-lg font-medium ml-4">Statuts</h1>
            </div>

            <div class="p-4 border-b border-gray-700">
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <!-- Avatar avec anneau de progression -->
                        <div class="statut-ring">
                            <svg class="w-16 h-16">
                                <circle class="progress-ring" cx="32" cy="32" r="30" />
                            </svg>
                            <div class="w-14 h-14 rounded-full bg-gray-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                                <i class='bx bxs-user text-2xl text-gray-400'></i>
                            </div>
                        </div>
                        <button id="ajouterStatut" class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                            <i class='bx bx-plus'></i>
                        </button>
                    </div>
                    <div>
                        <h2 class="text-white font-medium">Mon statut</h2>
                        <p id="monStatutTexte" class="text-gray-400 text-sm">Appuyez pour ajouter un statut</p>
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto">
                <div class="p-4">
                    <h3 class="text-gray-400 text-sm font-medium mb-4">Statuts récents</h3>
                    <div id="listeStatuts" class="space-y-4">
                        <!-- Les statuts seront injectés ici -->
                    </div>
                </div>
            </div>
        </div>`;
    },

    afficherStatut(statut) {
        return `
        <div class="statut-item flex items-center space-x-4 p-2 hover:bg-gray-800 rounded-lg cursor-pointer" data-statut-id="${statut.id}">
            <div class="relative">
                <div class="statut-ring">
                    <svg class="w-16 h-16">
                        <circle class="progress-ring" cx="32" cy="32" r="30" />
                    </svg>
                    <div class="w-14 h-14 rounded-full bg-gray-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        <i class='bx bxs-user text-2xl text-gray-400'></i>
                    </div>
                </div>
            </div>
            <div>
                <h3 class="text-white font-medium">${statut.auteur}</h3>
                <p class="text-gray-400 text-sm">${this.formatTimestamp(statut.timestamp)}</p>
            </div>
        </div>`;
    },

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 3600000) { // moins d'une heure
            const minutes = Math.floor(diff / 60000);
            return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else if (diff < 86400000) { // moins d'un jour
            const hours = Math.floor(diff / 3600000);
            return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
        } else {
            return date.toLocaleDateString();
        }
    },

    creerFormulaireStatut() {
        return `
        <div id="formulaire-statut" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div class="bg-gray-900 w-96 rounded-lg shadow-xl">
                <div class="p-4 border-b border-gray-700">
                    <h2 class="text-white text-lg font-medium">Créer un statut</h2>
                </div>
                
                <div class="p-4">
                    <div class="flex space-x-4 mb-4">
                        <button class="statut-type-btn bg-green-600 text-white px-4 py-2 rounded-lg" data-type="texte">
                            Texte
                        </button>
                        <button class="statut-type-btn bg-gray-600 text-white px-4 py-2 rounded-lg" data-type="image">
                            Image
                        </button>
                    </div>

                    <div id="contenu-texte" class="mb-4">
                        <textarea id="texte-statut" class="w-full bg-gray-800 text-white rounded-lg p-3" rows="4" placeholder="Que voulez-vous partager ?"></textarea>
                    </div>

                    <div id="contenu-image" class="hidden mb-4">
                        <input type="file" id="image-statut" class="hidden" accept="image/*">
                        <button id="choisir-image" class="w-full bg-gray-800 text-white p-3 rounded-lg">
                            Choisir une image
                        </button>
                        <div id="preview-image" class="hidden mt-4">
                            <img id="image-preview" class="w-full rounded-lg" src="" alt="Aperçu">
                        </div>
                    </div>

                    <div class="mb-4">
                        <select id="duree-statut" class="w-full bg-gray-800 text-white rounded-lg p-3">
                            <option value="24">24 heures</option>
                            <option value="48">48 heures</option>
                            <option value="72">72 heures</option>
                        </select>
                    </div>

                    <div class="flex justify-end space-x-4">
                        <button id="annuler-statut" class="px-4 py-2 text-gray-400 hover:text-white">
                            Annuler
                        </button>
                        <button id="publier-statut" class="px-4 py-2 bg-green-600 text-white rounded-lg">
                            Publier
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    }
};