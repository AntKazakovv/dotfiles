/* eslint-disable no-restricted-globals */
export class WlcHelper {

    /**
     * Used mobile device or not. True if mobile
     *
     * @type {boolean}
     */
    public static usedMobileDevice: boolean = new RegExp('Tablet|Mobile|Android|IOS|iP(hone|od|ad)', 'i')
        .test(window.navigator.userAgent);

    /**
     * Used device with touch screen
     *
     * @returns {boolean}
     */
    public static touchSupported(): boolean {
        return window.matchMedia('(pointer: coarse)').matches;
    }

    /**
     * Device uses PC emulation mode
     *
     * @returns {boolean} True if used pc emulation
     */
    public static usedPcEmulation(): boolean {
        return window.screen.availWidth <= 1024
            && !WlcHelper.usedMobileDevice
            && WlcHelper.touchSupported();
    }

    /**
     * Checks if app was run inside iframe or not
     *
     * @returns {boolean} True if app was run inside iframe
     */
    public static isIframe(): boolean {
        return window !== window.top || window !== window.parent || document !== top.document;
    }
}

window.WlcHelper = WlcHelper;
