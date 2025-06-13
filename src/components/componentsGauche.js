export const layout = {
    gauche() {
        return `<div id="gauche" class="w-[100%] border-r  border-green-600 overflow-y-auto flex flex-col">

            <div class="p-4 border-green-600 flex items-center justify-between">
                <div class="flex items-center gap-1">
                    <h1 class="text-xl font-normal text-white">WhatsApp</h1>
                </div>
                <div class="flex gap-4">

                    <button id="add" class="text-gray-600 hover:bg-gray-600 hover:bg-opacity-10 p-2 rounded-full transition-colors">
                        <i class='bx bx-plus w-5 h-5'></i>
                    </button>
                    <button class="text-gray-600 hover:bg-gray-600 hover:bg-opacity-10 p-2 rounded-full transition-colors">
                        <i class='bx bx-dots-vertical-rounded w-5 h-5'></i>
                    </button>
                </div>
            </div>


            <div class="p-4 ">
                <div class="bg-gray-900 border-2   rounded-xl flex items-center px-3 py-2">
                    <i class='bx bx-search w-5 h-5 text-gray-600 mr-3'></i>
                    <input id="recherche" type="text" placeholder="Rechercher ou démarrer une discussion" class="bg-transparent outline-none flex-1 text-white placeholder-gray-600">
                </div>
            </div>


            <div class="px-4 pb-4 ">
                <div class="flex gap-2">
                    <button class="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-80 transition-colors">Toutes</button>
                    <button class="text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-green-600 transition-colors">Non lues</button>
                    <button class="text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-green-600 transition-colors">Favoris</button>
                    <button class="text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-green-600 transition-colors">Groupes</button>
                </div>
            </div>




            <div class="flex-1 overflow-y-auto" id="ListeMessages">

            </div>
        </div>`
    },
    parametre() {
        return `<div class="bg-black text-white font-sans">
        <div class="max-w-md mx-auto overflow-y-auto bg-black h-[100%]">
            <!-- Header -->
            <div class="px-6 py-4 flex">
                <button id="retour" class="text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                </button>
            <h1 class="text-xl font-medium text-white">Paramètres</h1>
            </div>

            <!-- Search Bar -->
            <div class="px-6 mb-6">
            <div class="relative">
                <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                <i class="fas fa-search text-gray-400 text-sm"></i>
                </div>
                <input
                id="recherche"
                type="text"
                placeholder="Rechercher dans les paramètres"
                class="w-full bg-gray-700 text-white placeholder-gray-400 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>
            </div>

            <!-- Profile Section -->
            <div class="px-6 mb-6">
            <div
                class="flex items-center space-x-4 cursor-pointer hover:bg-gray-700 rounded-lg p-3 -mx-3"
            >
                <div
                class="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center"
                >
                <i class="fas fa-user text-white text-lg"></i>
                </div>
                <div>
                <h3 class="text-white font-medium">Khouss Ngom</h3>
                <p class="text-gray-400 text-sm">Salut ! J'utilise WhatsApp.</p>
                </div>
            </div>
            </div>

            <!-- Menu Items -->
            <div class="space-y-1 h-full">
            <!-- Compte -->
            <div class="flex items-center px-6 py-4 hover:bg-gray-700 cursor-pointer">
                <div class="w-6 flex justify-center mr-6">
                <i class="fas fa-key text-gray-300 text-lg"></i>
                </div>
                <div class="flex-1">
                <h3 class="text-white font-medium">Compte</h3>
                <p class="text-gray-400 text-sm">
                    Notifications de sécurité, informations de compte
                </p>
                </div>
            </div>

            <!-- Confidentialité -->
            <div class="flex items-center px-6 py-4 hover:bg-gray-700 cursor-pointer">
                <div class="w-6 flex justify-center mr-6">
                <i class="fas fa-lock text-gray-300 text-lg"></i>
                </div>
                <div class="flex-1">
                <h3 class="text-white font-medium">Confidentialité</h3>
                <p class="text-gray-400 text-sm">
                    Contacts bloqués, messages éphémères
                </p>
                </div>
            </div>

            <!-- Discussions -->
            <div class="flex items-center px-6 py-4 hover:bg-gray-700 cursor-pointer">
                <div class="w-6 flex justify-center mr-6">
                <i class="fas fa-comment text-gray-300 text-lg"></i>
                </div>
                <div class="flex-1">
                <h3 class="text-white font-medium">Discussions</h3>
                <p class="text-gray-400 text-sm">
                    Thème, fond d'écran, paramètres des discussions
                </p>
                </div>
            </div>

            <!-- Notifications -->
            <div class="flex items-center px-6 py-4 hover:bg-gray-700 cursor-pointer">
                <div class="w-6 flex justify-center mr-6">
                <i class="fas fa-bell text-gray-300 text-lg"></i>
                </div>
                <div class="flex-1">
                <h3 class="text-white font-medium">Notifications</h3>
                <p class="text-gray-400 text-sm">Notifications de messages</p>
                </div>
            </div>

            <!-- Raccourcis clavier -->
            <div class="flex items-center px-6 py-4 hover:bg-gray-700 cursor-pointer">
                <div class="w-6 flex justify-center mr-6">
                <i class="fas fa-keyboard text-gray-300 text-lg"></i>
                </div>
                <div class="flex-1">
                <h3 class="text-white font-medium">Raccourcis clavier</h3>
                <p class="text-gray-400 text-sm">Actions rapides</p>
                </div>
            </div>

            <!-- Aide -->
            <div class="flex items-center px-6 py-4 hover:bg-gray-700 cursor-pointer">
                <div class="w-6 flex justify-center mr-6">
                <i class="fas fa-question-circle text-gray-300 text-lg"></i>
                </div>
                <div class="flex-1">
                <h3 class="text-white font-medium">Aide</h3>
                <p class="text-gray-400 text-sm">
                    Pages d'aide, contactez-nous, politique de confidentialité
                </p>
                </div>
            </div>

            <!-- Se déconnecter -->
            <div id="logoutBtn" class="flex items-center px-6 py-4 hover:bg-gray-700 cursor-pointer mt-4">
                <div class="w-6 flex justify-center mr-6">
                <i class="fas fa-sign-out-alt text-red-400 text-lg"></i>
                </div>
                <div class="flex-1 justify-center items-center">
                                <button id="logoutBtn" class="w-[95%] flex items-center justify-center gap-1 px-2 py-2 rounded-xl bg-red-300 hover:bg-red-600 text-[14px] text-white">Se déconnecter
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    
                </button>
                </div>
            </div>
            </div>
        </div>

        <script>
            // Add click interactions
            document.querySelectorAll(".cursor-pointer").forEach((item) => {
            item.addEventListener("click", function () {
                // Add visual feedback
                this.style.transform = "scale(0.98)";
                setTimeout(() => {
                this.style.transform = "scale(1)";
                }, 100);
            });
            });

            // Search functionality
            const searchInput = document.querySelector('input[type="text"]');
            searchInput.addEventListener("focus", function () {
            this.parentElement.classList.add("ring-2", "ring-green-500");
            });

            searchInput.addEventListener("blur", function () {
            this.parentElement.classList.remove("ring-2", "ring-green-500");
            });

            
        </script>
        </div>
            }`
    }
}