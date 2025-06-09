export const MessageSimulator = {
    reponses: [
        "D'accord, je comprends",
        "Merci pour votre message",
        "Je reviens vers vous bientôt",
        "C'est noté",
        "Parfait !",
        "Je suis d'accord",
        "Intéressant...",
        "On peut en discuter plus tard ?"
    ],

    getRandomReponse() {
        const index = Math.floor(Math.random() * this.reponses.length);
        return this.reponses[index];
    },

    async simulerReponse(chatId) {
        ok
        const delai = Math.floor(Math.random() * 2000) + 1000;
        await new Promise(resolve => setTimeout(resolve, delai));
        return this.getRandomReponse();
    }
};