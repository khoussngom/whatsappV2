export const ServiceValidation = {
    validerNumero(numero) {
        if (!numero) {
            throw new Error("Le numéro est requis");
        }
        if (!/^\d{9}$/.test(numero)) {
            throw new Error("Le numéro doit contenir exactement 9 chiffres");
        }
        return true;
    },

    async verifierNumeroExistant(numero) {
        try {
            const response = await fetch('http://localhost:3000/utilisateurs');
            const utilisateurs = await response.json();
            if (utilisateurs.some(user => user.numero === numero)) {
                throw new Error("Ce numéro existe déjà");
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
};