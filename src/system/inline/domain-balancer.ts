// @ts-nocheck
/* eslint-disable no-restricted-globals */
(function (): void {
    // eslint-disable-next-line
    window.mirrorDomains.map(tryLoadFromMirror);

    function tryLoadFromMirror(mirror): void {
        const img = new Image();
        img.src = '//' + mirror + '/static/images/logo.svg';
        img.onload = function (): void {
            startRedirect(mirror);
        };
        img.onerror = function (): void {
            event.preventDefault();
        };
    }

    function startRedirect(host): void {
        const redirectLocation = '//' + host + location.pathname + location.search;
        window.location.replace(redirectLocation);
    }
}
());
