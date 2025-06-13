// const url = "https://backendwhatsapp-twxo.onrender.com/utilisateurs"
const url = "http://localhost:3000/utilisateurs";


export const actionContact = (() => ({
    async bloquerContact(contactId) {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const utilisateur = await response.json();

            const contactIndex = utilisateur.contacts.findIndex(c => c.id === contactId);
            if (contactIndex === -1) throw new Error('Contact non trouvé');

            utilisateur.contacts[contactIndex].blocked = true;

            const updateResponse = await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contacts: utilisateur.contacts
                })
            });

            if (!updateResponse.ok) throw new Error('Erreur lors du blocage');

            const event = new CustomEvent('contactBlocked', {
                detail: { contactId }
            });
            document.dispatchEvent(event);

            return true;
        } catch (error) {
            console.error('Erreur lors du blocage:', error);
            return false;
        }
    },

    async debloquerContact(contactId) {
        try {
            const userId = sessionStorage.getItem("userId");
            const response = await fetch(`${url}/${userId}`);
            const utilisateur = await response.json();

            const contactIndex = utilisateur.contacts.findIndex(c => c.id === contactId);
            if (contactIndex === -1) throw new Error('Contact non trouvé');

            utilisateur.contacts[contactIndex].blocked = false;

            const updateResponse = await fetch(`${url}/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contacts: utilisateur.contacts
                })
            });

            if (!updateResponse.ok) throw new Error('Erreur lors du déblocage');

            const event = new CustomEvent('contactUnblocked', {
                detail: { contactId }
            });
            document.dispatchEvent(event);

            return true;
        } catch (error) {
            console.error('Erreur lors du déblocage:', error);
            return false;
        }
    }
}))();