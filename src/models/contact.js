import dbData from '../database/db.json';

const url = "http://localhost:3000/utilisateurs";

export const contact = (() => ({
    async chargerDonnees() {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const utilisateur = await response.json();

            if (utilisateur) {
                dbData.contact = utilisateur.contacts || [];
                dbData.groupe = utilisateur.groupes || [];
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            return false;
        }
    },

    async sauvegarderContact(nouveauContact) {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const utilisateur = await response.json();

            utilisateur.contacts.push(nouveauContact);

            const updateResponse = await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contacts: utilisateur.contacts
                })
            });

            if (!updateResponse.ok) throw new Error('Erreur lors de la sauvegarde');

            dbData.contact = utilisateur.contacts;

            const event = new CustomEvent('donneesMisesAJour', {
                detail: dbData
            });
            document.dispatchEvent(event);

            return true;
        } catch (error) {
            console.error('Erreur:', error);
            return false;
        }
    },

    async modifierContact(contactId, contactModifie) {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const utilisateur = await response.json();

            const index = utilisateur.contacts.findIndex(contact => contact.id === contactId);
            if (index === -1) throw new Error('Contact non trouvé');

            utilisateur.contacts[index] = {
                ...utilisateur.contacts[index],
                ...contactModifie
            };

            const updateResponse = await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contacts: utilisateur.contacts
                })
            });

            if (!updateResponse.ok) throw new Error('Erreur lors de la modification');

            dbData.contact = utilisateur.contacts;

            const event = new CustomEvent('donneesMisesAJour', {
                detail: dbData
            });
            document.dispatchEvent(event);

            return true;
        } catch (error) {
            console.error('Erreur:', error);
            return false;
        }
    },

    async supprimerContact(contactId) {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const utilisateur = await response.json();

            const index = utilisateur.contacts.findIndex(contact => contact.id === contactId);
            if (index === -1) throw new Error('Contact non trouvé');

            utilisateur.contacts.splice(index, 1);

            const updateResponse = await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contacts: utilisateur.contacts
                })
            });

            if (!updateResponse.ok) throw new Error('Erreur lors de la suppression');

            dbData.contact = utilisateur.contacts;

            const event = new CustomEvent('donneesMisesAJour', {
                detail: dbData
            });
            document.dispatchEvent(event);

            return true;
        } catch (error) {
            console.error('Erreur:', error);
            return false;
        }
    }
}))()