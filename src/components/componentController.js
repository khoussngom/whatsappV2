export const ComponentController = {
    contactMenuHTML(contact) {
        return `
            <div class="flex items-center gap-4 p-3 hover:bg-wa-hover rounded-lg cursor-pointer">
                <div class="w-12 h-12 bg-wa-text-secondary rounded-full">
                    <i class='bx bxs-user text-2xl text-wa-text'></i>
                </div>
                <div>
                    <div class="text-wa-text">${contact.prenom} ${contact.nom}</div>
                    <div class="text-wa-text-secondary text-sm">${contact.numero}</div>
                </div>
            </div>
        `;
    },

    contactsListeHTML(dbData) {
        let contactsHTML = `
            <h3 class="text-wa-text-secondary mb-3">Contacts sur WhatsApp</h3>
            <div class="flex items-center gap-4 p-3 hover:bg-wa-hover rounded-lg cursor-pointer">
                <div class="w-12 h-12 bg-wa-text-secondary rounded-full"></div>
                <div>
                    <div class="text-wa-text">Dialibatoul Marakhib (vous)</div>
                    <div class="text-wa-text-secondary text-sm">Envoyez-vous un message</div>
                </div>
            </div>
        `;
        dbData.contact.forEach(contact => {
            contactsHTML += this.contactMenuHTML(contact);
        });

        return contactsHTML;
    }
};