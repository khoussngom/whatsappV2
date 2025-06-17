export const StatutComponent = (() => ({
    creerInterfaceStatut() {
        return `
        <div class="bg-black text-white min-h-screen flex flex-col">
            <div class="bg-black px-4 py-3 flex items-center space-x-4 border-b border-gray-700">
                <button id="retourStatut" class="text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <h1 class="text-lg font-medium">Statuts</h1>
            </div>

            <!-- Mon statut -->
            <div class="p-4 border-b border-gray-700">
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <div class="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                            <i class='bx bxs-user text-2xl text-white'></i>
                        </div>
                        <button id="ajouterStatut" class="absolute -bottom-1 -right-1 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                            <i class='bx bx-plus text-lg'></i>
                        </button>
                    </div>
                    <div class="flex-1">
                        <div class="text-white font-medium">Mon statut</div>
                        <div class="text-gray-400 text-sm" id="monStatutTexte">Appuyez pour ajouter un statut</div>
                    </div>
                </div>
            </div>

            <!-- Statuts récents -->
            <div class="flex-1 p-4">
                <h3 class="text-gray-400 text-sm mb-4">Mises à jour récentes</h3>
                <div id="listeStatuts" class="space-y-4">
                    <!-- Les statuts seront ajoutés ici -->
                </div>
            </div>
        </div>`;
    },

    creerFormulaireStatut() {
        return `
        <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" id="formulaire-statut">
            <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full m-4">
                <h3 class="text-white text-lg font-medium mb-4">Ajouter un statut</h3>
                
                <div class="mb-4">
                    <label class="block text-gray-300 mb-2">Type de statut</label>
                    <div class="flex space-x-2">
                        <button class="statut-type-btn bg-green-600 text-white px-4 py-2 rounded" data-type="texte">Texte</button>
                        <button class="statut-type-btn bg-gray-600 text-white px-4 py-2 rounded" data-type="image">Image</button>
                    </div>
                </div>

                <div id="contenu-texte" class="mb-4">
                    <textarea id="texte-statut" placeholder="Que voulez-vous partager ?" 
                        class="w-full bg-gray-700 text-white p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-600" 
                        rows="4"></textarea>
                </div>

                <div id="contenu-image" class="mb-4 hidden">
                    <input type="file" id="image-statut" accept="image/*" class="hidden">
                    <button id="choisir-image" class="w-full bg-gray-700 text-white p-3 rounded-lg border-2 border-dashed border-gray-500 hover:border-green-600">
                        <i class='bx bx-image mr-2'></i>Choisir une image
                    </button>
                    <div id="preview-image" class="mt-2 hidden">
                        <img id="image-preview" class="w-full max-h-48 object-cover rounded-lg">
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-300 mb-2">Durée</label>
                    <select id="duree-statut" class="w-full bg-gray-700 text-white p-3 rounded-lg">
                        <option value="24">24 heures</option>
                        <option value="12">12 heures</option>
                        <option value="6">6 heures</option>
                        <option value="1">1 heure</option>
                    </select>
                </div>

                <div class="flex justify-end gap-4">
                    <button class="px-4 py-2 text-white hover:bg-gray-700 rounded" id="annuler-statut">
                        Annuler
                    </button>
                    <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" id="publier-statut">
                        Publier
                    </button>
                </div>
            </div>
        </div>`;
    },

    afficherStatut(statut) {
        const timeAgo = this.calculerTempsEcoule(statut.timestamp);
        return `
        <div class="flex items-center space-x-4 p-3 hover:bg-gray-700 rounded-lg cursor-pointer statut-item" 
             data-statut-id="${statut.id}">
            <div class="relative">
                <div class="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                    <i class='bx bxs-user text-xl text-white'></i>
                </div>
                <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-600 rounded-full border-2 border-black"></div>
            </div>
            <div class="flex-1">
                <div class="text-white font-medium">${statut.auteur}</div>
                <div class="text-gray-400 text-sm">${timeAgo}</div>
            </div>
        </div>`;
    },

    calculerTempsEcoule(timestamp) {
        const now = new Date();
        const statutDate = new Date(timestamp);
        const diffMs = now - statutDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffMins < 1) return "À l'instant";
        if (diffMins < 60) return `il y a ${diffMins} min`;
        if (diffHours < 24) return `il y a ${diffHours}h`;
        return `il y a ${Math.floor(diffHours / 24)}j`;
    }
}))();