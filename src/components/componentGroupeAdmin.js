export const GroupeAdmin = (() => ({
    gestionGroupe(groupeId, groupe) {
        const userId = sessionStorage.getItem("userId");
        const isAdmin = groupe.admin && groupe.admin.includes(userId);
        
        if (!isAdmin) {
            return `<div class="text-center text-gray-500 p-4">Vous n'êtes pas administrateur de ce groupe</div>`;
        }

        return `
        <div class="bg-black text-white min-h-screen flex flex-col">
            <div class="bg-black px-4 py-3 flex items-center space-x-4 border-b border-gray-700">
                <button id="retourGroupe" class="text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <h1 class="text-lg font-medium">Gestion du groupe</h1>
            </div>

            <div class="flex-1 p-4 space-y-4">
                <div class="bg-gray-800 rounded-lg p-4">
                    <h2 class="text-white font-medium mb-3">Membres du groupe</h2>
                    <div id="listeMembres" class="space-y-2">
                        ${this.afficherMembres(groupe)}
                    </div>
                </div>

                <div class="bg-gray-800 rounded-lg p-4">
                    <h2 class="text-white font-medium mb-3">Actions administrateur</h2>
                    <div class="space-y-2">
                        <button id="ajouterMembre" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                            <i class='bx bx-user-plus mr-2'></i>Ajouter un membre
                        </button>
                        <button id="modifierNomGroupe" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            <i class='bx bx-edit mr-2'></i>Modifier le nom du groupe
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    },

    afficherMembres(groupe) {
        const userId = sessionStorage.getItem("userId");
        let membresHTML = '';

        // Afficher les admins
        if (groupe.admin) {
            groupe.admin.forEach(adminId => {
                membresHTML += `
                <div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                            <i class='bx bxs-user text-white'></i>
                        </div>
                        <div>
                            <div class="text-white">${adminId === userId ? 'Vous' : adminId}</div>
                            <div class="text-green-400 text-sm">Administrateur</div>
                        </div>
                    </div>
                    ${adminId !== userId ? `
                    <div class="flex space-x-2">
                        <button class="retirer-admin text-yellow-400 hover:text-yellow-300" data-member-id="${adminId}">
                            <i class='bx bx-crown'></i>
                        </button>
                    </div>` : ''}
                </div>`;
            });
        }

        // Afficher les membres normaux
        if (groupe.membres) {
            groupe.membres.forEach(membreId => {
                if (!groupe.admin || !groupe.admin.includes(membreId)) {
                    membresHTML += `
                    <div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                                <i class='bx bxs-user text-white'></i>
                            </div>
                            <div>
                                <div class="text-white">${membreId}</div>
                                <div class="text-gray-400 text-sm">Membre</div>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button class="promouvoir-admin text-green-400 hover:text-green-300" data-member-id="${membreId}">
                                <i class='bx bx-crown'></i>
                            </button>
                            <button class="retirer-membre text-red-400 hover:text-red-300" data-member-id="${membreId}">
                                <i class='bx bx-user-minus'></i>
                            </button>
                        </div>
                    </div>`;
                }
            });
        }

        return membresHTML;
    },

    popupModifierNom(nomActuel) {
        return `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="popup-modifier-nom">
            <div class="bg-gray-800 rounded-lg p-6 max-w-sm w-full m-4">
                <h3 class="text-white text-lg font-medium mb-4">Modifier le nom du groupe</h3>
                <input type="text" id="nouveauNomGroupe" value="${nomActuel}" 
                    class="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 mb-4">
                <div class="flex justify-end gap-4">
                    <button class="px-4 py-2 text-white hover:bg-gray-700 rounded" id="annuler-modification">
                        Annuler
                    </button>
                    <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" id="confirmer-modification">
                        Modifier
                    </button>
                </div>
            </div>
        </div>`;
    }
}))();