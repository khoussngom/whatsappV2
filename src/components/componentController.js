export const ComponentController = {
        contactsListeHTML(dbData) {
            return `
            <div class="contacts-list">
                ${dbData.contact.map(contact => `
                    <div class="contact-select-item flex items-center gap-4 p-3 hover:bg-wa-hover rounded-lg cursor-pointer transition-colors duration-200"
                        data-chat-id="${contact.id}">
                        <div class="flex justify-center items-center w-12 h-12 bg-wa-text-secondary rounded-full">
                            <i class='bx bxs-user text-2xl text-wa-text'></i>
                        </div>
                        <div>
                            <div class="text-wa-text">${contact.prenom} ${contact.nom}</div>
                            <div class="text-wa-text-secondary text-sm">${contact.numero}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};