window.$ = window.jQuery = require('jquery');

const ModalWindow = {
    HyThrottle: false,
    backendThrottle: false,
    APIdown: false,
    DBdown: false,
    invalidKey: false,

    getHTML: function(HTMLoptions) {
        return `
        <div class="modal_overlay ${HTMLoptions.class}">
            <div class="modal_window">
                <div class="modal_titlebar" style="background: ${HTMLoptions.colors.background}">
                    <span class="modal_icon material-icons" style="color: ${HTMLoptions.colors.title}">${HTMLoptions.icon}</span>
                    <span class="modal_title" style="color: ${HTMLoptions.colors.title}">${HTMLoptions.title}</span>
                    ${HTMLoptions.block ? '' : '<p class="modal_close material-icons">close</p>'}
                </div>
                <div class="modal_content" style="${HTMLoptions.hasContent}">${HTMLoptions.content}</div>
            </div>
        </div>
        `;
    },

    open: function(options = {}) {
        if (options.type === -1) {
            options.colors = {
                background: '#ca5c30',
                title: 'rgb(88, 0, 0)'
            };
            options.icon = 'cancel';
        } else if (options.type === 1) {
            options.colors = {
                background: '#30ca74',
                title: 'rgb(3, 88, 0)'
            };
            options.icon = 'check_circle';
        } else if (options.type === -2) {
            options.colors = {
                background: '#f7ce5e',
                title: 'rgb(117, 70, 0)'
            };
            options.icon = 'warning';
        } else {
            options.colors = {
                background: '#e9e9e9',
                title: 'rgb(77, 77, 77)'
            };
            options.icon = 'info';
        }
        if (options.class === -1) {
            if (this.HyThrottle) return;
            options.class = 'err-key-throttle';
            this.HyThrottle = true;
        } else if (options.class === -2) {
            if (this.APIdown) return;
            options.class = 'err-api-down';
            this.APIdown = true;
        } else if (options.class === -3) {
            if (this.DBdown) return;
            options.class = 'err-db-down';
            this.DBdown = true;
        } else if (options.class === -4) {
            if (this.invalidKey) return;
            options.class = 'err-invalid-key';
            this.invalidKey = true;
        } else if (options.class === -5) {
            if (this.backendThrottle) return;
            options.class = 'err-key-throttle';
            this.backendThrottle = true;
        } else {
            options.class = '';
        }
        if (options?.focused){
            options.class += ' focused';
        }
        options = Object.assign({
            title: 'Modal window',
            content: 'Hello! Umm this should not have showed up. Ignore it please <3',
            hasContent: !options.content ? 'display: none' : '',
            block: false
        }, options);

        $(document.body).append(this.getHTML(options));
        return true;
    },

    close: function() {
        $(this).parent().parent().parent().remove();
    },

    initialize: function() {
        $(document.body).on('click', '.modal_close', this.close);
    }
};

module.exports = { ModalWindow };