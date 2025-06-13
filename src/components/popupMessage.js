export const popupMessage = (() => ({
    message(erreur, message) {
        const popup = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="popup-overlay">
            <div class="bg-white rounded-lg p-6 max-w-sm w-full m-4">
                <h3 class="text-red-600 text-lg font-medium mb-4">${erreur}</h3>
                <p class="text-black text-2xl mb-6">${message}</p>
                <div class="flex justify-end gap-4">
                    <button class="px-4 py-2 text-white bg-gray-400 hover:bg-green-600 rounded" id="annuler-suppression">
                        D'accord
                    </button>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML("beforeend", popup);
    }
}))()