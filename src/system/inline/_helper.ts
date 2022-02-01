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
}

window.WlcHelper = WlcHelper;
