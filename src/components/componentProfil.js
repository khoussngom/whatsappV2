export const ProfilAvance = (() => ({
    interfaceModification() {
        const userId = sessionStorage.getItem("userId");
        
        return `
        <div class="bg-black text-white min-h-screen flex flex-col">
            <div class="bg-black px-4 py-3 flex items-center space-x-4 border-b border-gray-700">
                <button id="retourProfil" class="text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <h1 class="text-lg font-medium">Modifier le profil</h1>
            </div>

            <div class="flex-1 p-6 space-y-6">
                <!-- Avatar -->
                <div class="flex flex-col items-center space-y-4">
                    <div class="relative">
                        <div class="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden" id="avatar-container">
                            <i class='bx bxs-user text-6xl text-white' id="avatar-icon"></i>
                            <img id="avatar-preview" class="w-full h-full object-cover hidden" alt="Avatar">
                        </div>
                        <button class="absolute bottom-0 right-0 bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-700" id="changer-avatar">
                            <i class='bx bx-camera text-xl'></i>
                        </button>
                        <input type="file" id="avatar-input" accept="image/*" class="hidden">
                    </div>
                </div>

                <!-- Informations -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-300 mb-2">Nom</label>
                        <div class="flex items-center space-x-2">
                            <input type="text" id="nom-utilisateur" 
                                class="flex-1 bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                placeholder="Votre nom">
                            <button id="modifier-nom" class="text-green-400 hover:text-green-300">
                                <i class='bx bx-edit text-xl'></i>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-gray-300 mb-2">Statut</label>
                        <div class="flex items-center space-x-2">
                            <input type="text" id="statut-utilisateur" 
                                class="flex-1 bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                placeholder="Hey! J'utilise WhatsApp">
                            <button id="modifier-statut" class="text-green-400 hover:text-green-300">
                                <i class='bx bx-edit text-xl'></i>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-gray-300 mb-2">Numéro de téléphone</label>
                        <input type="text" id="numero-utilisateur" 
                            class="w-full bg-gray-600 text-gray-400 p-3 rounded-lg cursor-not-allowed"
                            value="${userId}" readonly>
                        <small class="text-gray-500">Le numéro ne peut pas être modifié</small>
                    </div>
                </div>

                <!-- Présence -->
                <div class="bg-gray-800 rounded-lg p-4">
                    <h3 class="text-white font-medium mb-3">Paramètres de présence</h3>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-300">Afficher quand je suis en ligne</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="toggle-presence" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>

                <!-- Bouton de sauvegarde -->
                <button id="sauvegarder-profil" class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
                    <i class='bx bx-save mr-2'></i>Sauvegarder les modifications
                </button>
            </div>
        </div>`;
    }
}))();