export const Profil = (() => ({
    profil() {
        return `<div class="flex flex-col justify-start items-center gap-8 h-full w-full">
                
                    <div  class="flex flex-row justify-between items-center h-[5%] w-full p-4 pt-8">
                        <button id="retour" class="text-wa-text hover:bg-wa-hover p-2 rounded-full" >
                            <i  class='bx bx-arrow-back text-2xl'>  </i>
                        </button>
                    </div>

                    <div class="flex flex-row justify-center items-center h-[20%] w-full p-4">
                        <span class="bg-white w-[120px] h-[120px] rounded-full"></span>
                    </div>

                    <div class="text-[14px] text-white h-[5%] w-full px-4">Votre nom</div>

                    <div class="flex flex-row justify-between items-center h-[5%] w-full p-4">
                        <div class="text-2xl text-white font-bold">Khouss Ngom</div>
                        <div class="text-base text-white"><i class='bx  bx-pencil text-2xl'></i></div>
                    </div>

                    <div class="h-[5%] w-full text-[12px] text-white px-4">
                        Il ne s'agit pas de votre nom de profil ou de votre code PIN. Ce nom sera visible par vos contacts WhatsApp.
                    </div>
    
                </div>`

    },
}))()