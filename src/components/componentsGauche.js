export const layout = {
    gauche() {
        return `<div id="gauche" class="w-[100%] border-r  border-wa-border overflow-y-auto flex flex-col">

            <div class="p-4 border-wa-border flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <h1 class="text-xl font-normal text-wa-text">WhatsApp</h1>
                </div>
                <div class="flex gap-4">

                    <button id="add" class="text-wa-text-secondary hover:bg-wa-text-secondary hover:bg-opacity-10 p-2 rounded-full transition-colors">
                        <i class='bx bx-plus w-5 h-5'></i>
                    </button>
                    <button class="text-wa-text-secondary hover:bg-wa-text-secondary hover:bg-opacity-10 p-2 rounded-full transition-colors">
                        <i class='bx bx-dots-vertical-rounded w-5 h-5'></i>
                    </button>
                </div>
            </div>


            <div class="p-4 ">
                <div class="bg-gray-900 border-2   rounded-xl flex items-center px-3 py-2">
                    <i class='bx bx-search w-5 h-5 text-wa-text-secondary mr-3'></i>
                    <input type="text" placeholder="Rechercher ou démarrer une discussion" class="bg-transparent outline-none flex-1 text-wa-text placeholder-wa-text-secondary">
                </div>
            </div>


            <div class="px-4 pb-4 ">
                <div class="flex gap-2">
                    <button class="bg-wa-hover text-wa-text px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-80 transition-colors">Toutes</button>
                    <button class="text-wa-text-secondary px-4 py-2 rounded-full text-sm hover:bg-wa-hover transition-colors">Non lues</button>
                    <button class="text-wa-text-secondary px-4 py-2 rounded-full text-sm hover:bg-wa-hover transition-colors">Favoris</button>
                    <button class="text-wa-text-secondary px-4 py-2 rounded-full text-sm hover:bg-wa-hover transition-colors">Groupes</button>
                </div>
            </div>




            <div class="flex-1 overflow-y-auto" id="ListeMessages">

            </div>
        </div>`
    }
}