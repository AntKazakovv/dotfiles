(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        try {
            const colorTheme = localStorage.getItem('ngx-webstorage|colortheme');

            if (colorTheme) {
                document.body.classList.add(`wlc-body--theme-${JSON.parse(colorTheme)}`);
            }
        } catch (err) {
            // do nothing
        }
    });
})();
