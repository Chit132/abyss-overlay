window.$ = window.jQuery = require('jquery');

const ModalWindow = {
    getHTML: function(HTMLoptions) {
        return `
        <div class="modal_overlay">
            <div class="modal_window">
                <div class="modal_titlebar" style="background: ${HTMLoptions.colors.background}">
                    <span class="modal_icon material-icons" style="color: ${HTMLoptions.colors.title}">${HTMLoptions.icon}</span>
                    <span class="modal_title" style="color: ${HTMLoptions.colors.title}">${HTMLoptions.title}</span>
                    <p class="modal_close material-icons">close</p>
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
        options = Object.assign({
            title: 'Modal window',
            content: 'Hello! Umm this should not have showed up. Ignore it please <3',
            hasContent: !options.content ? 'display: none' : ''
        }, options);

        $(document.body).append(this.getHTML(options));
    },

    close: function() {
        console.log($(this).parent().parent().parent().hasClass('modal_overlay'))
        $(this).parent().parent().parent().remove();
    }
};

$(document.body).on('click', '.modal_close', ModalWindow.close);

module.exports = { ModalWindow };