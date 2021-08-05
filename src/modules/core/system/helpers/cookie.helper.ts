export class CookieHelper {

    /**
     * Get cookie by name
     *
     * @param {string} name Cookie's identification
     * @returns {string} result Cookie's value
     */
    public static get(name: string): string {
        return window.WlcCookie.get(name);
    };

    /**
     * Save cookie
     *
     * @param {string} name Cookie's identification
     * @param {string} value Cookie's value
     * @param {number} days Cookie's expiration date in days from now
     */
    public static set(name: string, value: string, days?: number): void {
        window.WlcCookie.set(name, value, days);
    };

    /**
     * Removes specified Cookie
     *
     * @param  {string} name Cookie's identification
     */
    public static delete(name: string): void {
        window.WlcCookie.delete(name);
    };
}
