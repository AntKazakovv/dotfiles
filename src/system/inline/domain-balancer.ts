// @ts-nocheck
/* eslint-disable no-restricted-globals */
(function () {
    // eslint-disable-next-line
    window.mirrorDomains.map(tryLoadFromMirror);

    function tryLoadFromMirror(mirror) {
        const img = new Image();
        img.src = '//' + mirror + '/static/images/logo.svg';
        img.onload = function () {
            startRedirect(mirror);
        };
        img.onerror = function () {
            event.preventDefault();
        };
    }

    function startRedirect(host) {
        const redirectLocation = '//' + host + location.pathname + location.search;
        window.location.replace(redirectLocation);
    }
}
());
