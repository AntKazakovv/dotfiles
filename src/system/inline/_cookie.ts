/* eslint-disable no-restricted-globals */

export class WlcCookie {

    /**
     * Get cookie by name
     *
     * @param {string} name Cookie's identification
     * @returns {string} result Cookie's value
     */
    public static get(name: string): string {
        const nameEQ: string = name + '=',
            ca = document.cookie.split(';');

        for (let c of ca) {
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return '';
    };

    /**
     * Save cookie
     *
     * @param {string} name Cookie's identification
     * @param {string} value Cookie's value
     * @param {number} days Cookie's expiration date in days from now
     */
    public static set(name: string, value: string, days?: number): void {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires = ' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    };

    /**
     * Removes specified Cookie
     *
     * @param  {string} name Cookie's identification
     */
    public static delete(name: string): void {
        this.set(name, '', -1);
    };
}

window.WlcCookie = WlcCookie;
