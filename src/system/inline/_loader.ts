(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const loader = document.getElementById('app-preload') || document.querySelector('.wlc-app__preload');

        if (loader) {

            const messageHandler = (event: MessageEvent<any>): void => {
                if (event.data?.app === 'app-ready') {
                    const loader = document.getElementById('app-preload')
                        || document.querySelector('.wlc-app__preload');

                    if (loader) {
                        loader.parentElement?.removeChild(loader);
                    }

                    // eslint-disable-next-line no-restricted-globals
                    window.removeEventListener('message', messageHandler);
                }
            };

            // eslint-disable-next-line no-restricted-globals
            window.addEventListener('message', messageHandler);
        }
    });
})();
