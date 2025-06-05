export const ComponentsAdd = {
        nouveauMenu(dbData) {
            return `
            <div class="flex flex-col">
                <div class="p-4">
                    <div class="flex items-center gap-3 mb-6">
                        <button class="text-wa-text-secondary hover:text-wa-text" id="backButton">
                            <i class='bx bx-arrow-back text-xl'></i>
                        </button>
                        <h2 class="text-xl text-wa-text">Nouvelle discussion</h2>
                    </div>
                    
                    <div class="flex flex-col space-y-2">
                        <button class="flex items-center gap-4 p-3 hover:bg-wa-hover rounded-lg w-full transition-colors" id="newGroup">
                            <div class="w-12 h-12 bg-wa-green rounded-full flex items-center justify-center">
                                <i class='bx bxs-group text-2xl text-wa-text'></i>
                            </div>
                            <span class="text-wa-text">Nouveau groupe</span>
                        </button>
                        
                        <button class="flex items-center gap-4 p-3 hover:bg-wa-hover rounded-lg w-full transition-colors" id="newContact">
                            <div class="w-12 h-12 bg-wa-green rounded-full flex items-center justify-center">
                                <i class='bx bxs-user-plus text-2xl text-wa-text'></i>
                            </div>
                            <span class="text-wa-text">Nouveau contact</span>
                        </button>
                        
                        <button class="flex items-center gap-4 p-3 hover:bg-wa-hover rounded-lg w-full transition-colors" id="newCommunity">
                            <div class="w-12 h-12 bg-wa-green rounded-full flex items-center justify-center">
                                <i class='bx bx-group text-2xl text-wa-text'></i>
                            </div>
                            <span class="text-wa-text">Nouvelle communauté</span>
                        </button>
                    </div>
                </div>

                <div class="px-4 pt-4 border-t border-wa-border">
                    <h3 class="text-wa-text-secondary mb-3">Contacts sur WhatsApp</h3>
                    
                    <!-- Votre profil -->
                    <div class="flex items-center gap-4 p-3 hover:bg-wa-hover rounded-lg cursor-pointer">
                        <div class="w-12 h-12 bg-wa-text-secondary rounded-full flex items-center justify-center">
                            <i class='bx bxs-user text-2xl text-wa-text'></i>
                        </div>
                        <div>
                            <div class="text-wa-text">Dialibatoul Marakhib (vous)</div>
                            <div class="text-wa-text-secondary text-sm">Envoyez-vous un message</div>
                        </div>
                    </div>

                    <!-- Liste des contacts -->
                    ${dbData.contact.map(contact => `
                        <div class="flex items-center gap-4 p-3 hover:bg-wa-hover rounded-lg cursor-pointer chat-item" data-chat-id="${contact.id}">
                            <div class="w-12 h-12 bg-wa-text-secondary rounded-full flex items-center justify-center">
                                <i class='bx bxs-user text-2xl text-wa-text'></i>
                            </div>
                            <div>
                                <div class="text-wa-text">${contact.prenom} ${contact.nom}</div>
                                <div class="text-wa-text-secondary text-sm">${contact.numero}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    popupNouveauContact() {
        return `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-popup">
                <div class="bg-wa-darker p-6 rounded-lg w-96">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl text-wa-text">Nouveau contact</h2>
                        <button id="closePopup" class="text-wa-text-secondary hover:text-wa-text">
                            <i class='bx bx-x text-2xl'></i>
                        </button>
                    </div>
                    <form id="contactForm" class="space-y-4">
                        <div>
                            <input type="text" name="prenom" placeholder="Prénom" required
                                class="w-full p-2 rounded bg-wa-panel text-wa-text placeholder-wa-text-secondary border border-wa-border focus:outline-none focus:border-wa-green">
                        </div>
                        <div>
                            <input type="text" name="nom" placeholder="Nom" required
                                class="w-full p-2 rounded bg-wa-panel text-wa-text placeholder-wa-text-secondary border border-wa-border focus:outline-none focus:border-wa-green">
                        </div>
                        <div>
                            <input type="tel" name="numero" placeholder="Numéro de téléphone" required
                                class="w-full p-2 rounded bg-wa-panel text-wa-text placeholder-wa-text-secondary border border-wa-border focus:outline-none focus:border-wa-green">
                        </div>
                        <div class="flex justify-end space-x-2 pt-4">
                            <button type="button" id="cancelButton"
                                class="px-4 py-2 text-wa-text-secondary hover:text-wa-text">
                                Annuler
                            </button>
                            <button type="submit"
                                class="px-4 py-2 bg-wa-green text-white rounded hover:bg-opacity-80">
                                Ajouter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
};