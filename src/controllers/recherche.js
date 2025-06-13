let valFiltre = [];

url
export function recherche() {
    const contacts = models.listerContact();
    const cle = recherche.value.trim().toLowerCase();

    valFiltre = models.rechercherContact(contacts, cle === '' ? '*' : cle);

    if (valFiltre.length < 1) {
        listeMessages.innerHTML = "pas de contact avec ce nom ou ce numero !";
        return;
    }
}
recherche.addEventListener("keyup", () => {
    const contacts = models.listerContact();
    const cle = recherche.value.trim().toLowerCase();

    valFiltre = models.rechercherContact(contacts, cle === '' ? '*' : cle);

    if (valFiltre.length < 1) {
        listeMessages.innerHTML = "pas de contact avec ce nom ou ce numero !";
        return;
    }
    allMessages();
});