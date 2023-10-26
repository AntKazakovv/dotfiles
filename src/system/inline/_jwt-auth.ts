/* eslint-disable no-restricted-globals */

(() => {
    const url = new URL(window.location.href);
    const jwtAuthToken: string | null = url.searchParams.get('token');
    const jwtRefreshToken: string | null = url.searchParams.get('refresh');

    if (jwtAuthToken && jwtRefreshToken) {
        window.localStorage.setItem('ngx-webstorage|jwtauthtoken', `"${jwtAuthToken}"`);
        window.localStorage.setItem('ngx-webstorage|jwtauthrefreshtoken', `"${jwtRefreshToken}"`);
        url.searchParams.delete('token');
        url.searchParams.delete('refresh');
        window.history.replaceState(null, '', url.href);
    }
})();
