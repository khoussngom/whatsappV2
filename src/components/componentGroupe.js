export const groupe = (() => ({
    creerGroupe() {
        return `
                <div id="creerGroupe" class="bg-black text-white min-h-screen flex flex-col">
                    <div class="bg-black px-4 py-3 flex items-center space-x-4">
                        <button id="retour" class="text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        </button>
                        <h1 class="text-lg font-medium">Nouveau groupe</h1>
                    </div>

                    <div class="px-4 py-3 bg-black border-b border-gray-700">
                        <div class="flex-1">
                            <input 
                                id="groupNameInput"
                                type="text" 
                                placeholder="Nom du groupe" 
                                class="bg-transparent border-0 border-b border-gray-600 outline-none text-white py-2 w-full placeholder-gray-400 focus:border-emerald-500"
                                autofocus
                            /> 
                        </div>
                    </div>


                    <div id="lesContacts" class="flex-1 flex flex-col gap-2 overflow-y-auto  px-4 py-4">
                        <!-- Les contacts  -->
                    </div>

                    <div class="p-4 bg-black border-t border-gray-700">
                        <button id="createGroupBtn" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200" > Créer le groupe </button>
                    </div>
                </div>`
    },
}))()