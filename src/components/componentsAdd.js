export const ComponentsAdd = {
        nouveauMenu(dbData) {
            return `
            <div id="liste-Contacts" class="flex flex-col">
                <div class="p-4 ">
                    <div class="flex items-center gap-3 mb-6">
                        <button class="text-gray-500 hover:text-white" id="backButton">
                            <i class='bx bx-arrow-back text-xl'></i>
                        </button>
                        <h2 class="text-xl text-white">Nouvelle discussion</h2>
                    </div>
                    
                    <div class="flex flex-col space-y-2">
                        <button id="creationGroupe" class="flex items-center gap-4 p-3 hover:bg-green-600 rounded-lg w-full transition-colors" id="newGroup">
                            <div class="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                                <i class='bx bxs-group text-2xl text-white'></i>
                            </div>
                            <span class="text-white">Nouveau groupe</span>
                        </button>
                        
                        <button class="flex items-center gap-4 p-3 hover:bg-green-600 rounded-lg w-full transition-colors" id="newContact">
                            <div class="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                                <i class='bx bxs-user-plus text-2xl text-white'></i>
                            </div>
                            <span class="text-white">Nouveau contact</span>
                        </button>
                        
                        <button class="flex items-center gap-4 p-3 hover:bg-green-600 rounded-lg w-full transition-colors" id="newCommunity">
                            <div class="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                                <i class='bx bx-group text-2xl text-white'></i>
                            </div>
                            <span class="text-white">Nouvelle communauté</span>
                        </button>
                    </div>
                </div>

                <div class="px-4 pt-4 border-t border-green-600">
                    <h3 class="text-gray-500 mb-3">Contacts sur WhatsApp</h3>
                    
                    <!-- Votre profil -->
                    <div class="flex items-center gap-4 p-3 hover:bg-green-600 rounded-lg cursor-pointer">
                        <div class="w-12 h-12 bg-gray-text-gray-500 rounded-full flex items-center justify-center">
                            <i class='bx bxs-user text-2xl text-white'></i>
                        </div>
                        <div>
                            <div class="text-white">Dialibatoul Marakhib (vous)</div>
                            <div class="text-white text-sm">Envoyez-vous un message</div>
                        </div>
                    </div>

                    <!-- Liste des contacts -->
                    ${dbData.contact.map(contact => `
                        <div class="flex items-center gap-4 p-3 hover:bg-green-600 rounded-lg cursor-pointer chat-item" data-chat-id="${contact.id}">
                            <div class="w-12 h-12 bg-gray-text-gray-500 rounded-full flex items-center justify-center">
                                <i class='bx bxs-user text-2xl text-white'></i>
                            </div>
                            <div>
                                <div class="text-white">${contact.prenom} ${contact.nom}</div>
                                <div class="text-white text-sm">${contact.numero}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

};