/* eslint-disable no-restricted-globals */
(() => {
    'use strict';

    if (window.WlcHelper.isIframe()) {
        window.parent.postMessage(JSON.stringify({event: 'WLC_LOAD_STARTED'}), '*');
    }
})();
