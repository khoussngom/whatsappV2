export const EmojiPicker = (() => ({
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
        <div class="emoji-picker bg-gray-800 rounded-lg shadow-2xl p-4 w-80 max-h-64 overflow-y-auto" style="display: none;">
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
            if (e.target.closest('.emoji-btn')) {
                const emoji = e.target.dataset.emoji;
                const messageInput = document.querySelector('#messageInput');
                if (messageInput) {
                    messageInput.value += emoji;
                    messageInput.focus();
                }
                this.fermerPicker();
            }

            if (e.target.closest('#emoji-trigger')) {
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
        if (picker) {
            picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
        }
    },

    fermerPicker() {
        const picker = document.querySelector('.emoji-picker');
        if (picker) {
            picker.style.display = 'none';
        }
    }
}))();