const contacts = [];
const groupes = [];

export const model = (() => ({
    creerContact(contact, infosSup = {}) {
        if (!contact || typeof contact !== 'object') return;
        const nouveauContact = {...contact, ...infosSup };
        contacts.push(nouveauContact);
        return nouveauContact;
    },

    modifierContact(numero, nouvellesInfos = {}) {
        const index = contacts.findIndex(c => c.numero === numero);
        if (index !== -1) {
            contacts[index] = {...contacts[index], ...nouvellesInfos };
        }
    },

    supprimerContact(numero) {
        const index = contacts.findIndex(c => c.numero === numero);
        if (index !== -1) {
            contacts.splice(index, 1);
        }
    },

    creerGroupe(groupeChild = {}) {
        groupes.push({...groupeChild, membres: [] });
        return groupes;
    },

    ajouterMembre(groupeObj, nouveauMembre = {}) {
        if (!groupeObj || !groupeObj.membres) return;
        groupeObj.membres.push(nouveauMembre);
    },

    retirerMembre(numero, groupeObj) {
        if (!groupeObj || !groupeObj.membres) return;
        const index = groupeObj.membres.findIndex(m => m.numero === numero);
        if (index !== -1) {
            groupeObj.membres.splice(index, 1);
        }
    },

    mettreAdmin(numero, groupeObj) {
        let membre = undefined;
        if (groupeObj && groupeObj.membres) {
            membre = groupeObj.membres.find(m => m.numero === numero);
        }
        if (membre) membre.role = "admin";
    },

    retirerAdmin(numero, groupeObj) {
        let membre;
        if (groupeObj && groupeObj.membres) {
            membre = groupeObj.membres.find(m => m.numero === numero);
        }
        if (membre) delete membre.role;
    },

    modifierNomGroupe(nom, groupeObj) {
        if (groupeObj && typeof nom === "string") {
            groupeObj.nom = nom;
        }
    },

    getContacts() {
        return contacts;
    },

    getGroupes() {
        return groupes;
    },

    rechercherContact(contactList, cle) {
        if (!Array.isArray(contactList)) return [];

        if (!cle || cle === "*") {
            return contactList.sort((a, b) => (a.prenom || '').localeCompare(b.prenom || ''));
        }

        return contactList.filter(element =>
            (element.prenom && element.prenom.toLowerCase().includes(cle)) ||
            (element.numero && element.numero.toLowerCase().includes(cle))
        );
    },




}))();