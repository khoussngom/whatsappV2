export const ComponentController = {
        contactsListeHTML(dbData) {
            return `
            <div class="contacts-list">
                ${dbData.contact.map(contact => `
                    <div class="contact-select-item flex items-center gap-4 p-3 hover:bg-green-600 rounded-lg cursor-pointer transition-colors duration-200"
                        data-chat-id="${contact.id}">
                        <div class="flex justify-center items-center w-12 h-12 bg-gray-600 rounded-full">
                            <i class='bx bxs-user text-2xl text-white'></i>
                        </div>
                        <div>
                            <div class="text-white">${contact.prenom} ${contact.nom}</div>
                            <div class="text-white-secondary text-sm">${contact.numero}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};