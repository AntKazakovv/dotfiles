/* eslint-disable no-restricted-globals */

(() => {
    const url = new URL(window.location.href);
    const xNonce: string | null = url.searchParams.get('xnonce');

    if (xNonce) {
        window.localStorage.setItem('ngx-webstorage|x-nonce', `"${xNonce}"`);
        url.searchParams.delete('xnonce');
        window.history.replaceState(null, '', url.href);
    }
})();
