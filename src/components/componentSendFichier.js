export const sendFichier = (() => ({
    sendPlus() {
        return ` <!-- Popup Menu -->
    <div class="bg-gray-800 rounded-lg shadow-2xl py-2 w-64 text-white">
        
        <!-- Document -->
        <div class="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors">
            <div class="w-6 h-6 flex items-center justify-center mr-3">
                <i class='bx bxs-file text-purple-400'></i>
            </div>
            <span class="text-sm font-medium">Document</span>
        </div>
        
        <!-- Photos et vidéos -->
        <div class="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors">
            <div class="w-6 h-6 flex items-center justify-center mr-3">
                <i class='bx bxs-image text-blue-400'></i>
            </div>
            <span class="text-sm font-medium">Photos et vidéos</span>
        </div>
        
        <!-- Caméra -->
        <div class="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors">
            <div class="w-6 h-6 flex items-center justify-center mr-3">
                <i class='bx bxs-camera text-pink-500'></i>
            </div>
            <span class="text-sm font-medium">Caméra</span>
        </div>
        
        <!-- Audio -->
        <div class="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors">
            <div class="w-6 h-6 flex items-center justify-center mr-3">
                <i class='bx bxs-music text-orange-500'></i>
            </div>
            <span class="text-sm font-medium">Audio</span>
        </div>
        
        <!-- Contact -->
        <div class="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors">
            <div class="w-6 h-6 flex items-center justify-center mr-3">
                <i class='bx bxs-user text-blue-500'></i>
            </div>
            <span class="text-sm font-medium">Contact</span>
        </div>
        
        <!-- Sondage -->
        <div class="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors">
            <div class="w-6 h-6 flex items-center justify-center mr-3">
                <i class='bx bx-poll text-yellow-500'></i>
            </div>
            <span class="text-sm font-medium">Sondage</span>
        </div>
        
        <!-- Événement -->
        <div class="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors">
            <div class="w-6 h-6 flex items-center justify-center mr-3">
                <i class='bx bxs-calendar text-pink-500'></i>
            </div>
            <span class="text-sm font-medium">Événement</span>
        </div>
        
        <!-- Nouveau sticker -->
        <div class="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors">
            <div class="w-6 h-6 flex items-center justify-center mr-3">
                <i class='bx bxs-smile text-teal-400'></i>
            </div>
            <span class="text-sm font-medium">Nouveau sticker</span>
        </div>
        
    </div>


    <script>
        const toggleBtn = document.getElementById('toggleBtn');
        const popup = document.querySelector('.bg-gray-800');
        
        toggleBtn.addEventListener('click', () => {
            popup.classList.toggle('hidden');
        });
        
        // Add click handlers for menu items
        const menuItems = document.querySelectorAll('.cursor-pointer');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const text = item.querySelector('span').textContent;
            });
        });
    </script>`
    }
}))();