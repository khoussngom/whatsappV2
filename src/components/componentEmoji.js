export const EmojiPicker = {
        emojis: [
            '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
            '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
            '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
            '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
            '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
            '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
            '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
            '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
            '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
            '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾',
            '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿',
            '😾', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎',
            '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟',
            '👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙',
            '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋',
            '🖖', '👏', '🙌', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵'
        ],

        creerPicker() {
            return `
        <div class="emoji-picker bg-gray-800 rounded-lg shadow-2xl p-4 w-80 max-h-64 overflow-y-auto fixed hidden">
            <div class="grid grid-cols-8 gap-2">
                ${this.emojis.map(emoji => `
                    <button class="emoji-btn hover:bg-gray-700 rounded p-2 text-xl transition-colors duration-200"
                            data-emoji="${emoji}">
                        ${emoji}
                    </button>
                `).join('')}
            </div>
        </div>`;
    },

    attacherEvenements() {
        document.addEventListener('click', (e) => {
            const emojiTrigger = e.target.closest('#emoji-trigger');
            const emojiBtn = e.target.closest('.emoji-btn');
            const emojiPicker = document.querySelector('.emoji-picker');

            if (emojiBtn && emojiPicker) {
                const emoji = emojiBtn.dataset.emoji;
                const messageInput = document.querySelector('#messageInput');
                if (messageInput) {
                    messageInput.value += emoji;
                    messageInput.focus();
                }
            }

            if (emojiTrigger) {
                e.preventDefault();
                this.togglePicker();
            }

            if (!e.target.closest('.emoji-picker') && !e.target.closest('#emoji-trigger')) {
                this.fermerPicker();
            }
        });
    },

    togglePicker() {
        const picker = document.querySelector('.emoji-picker');
        const trigger = document.querySelector('#emoji-trigger');
        
        if (picker && trigger) {
            picker.classList.toggle('hidden');
            
            if (!picker.classList.contains('hidden')) {
                const rect = trigger.getBoundingClientRect();
                picker.style.bottom = `${window.innerHeight - rect.top + 10}px`;
                picker.style.left = `${rect.left}px`;
            }
        }
    },

    fermerPicker() {
        const picker = document.querySelector('.emoji-picker');
        if (picker) {
            picker.classList.add('hidden');
        }
    }
};