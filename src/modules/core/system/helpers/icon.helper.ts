import {ThemeToDirectory} from 'wlc-engine/modules/core/system/config/base/icons.config';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {
    TIconShowAs,
    TIconColorBg,
} from 'wlc-engine/modules/core/system/interfaces/core.interface';

export class IconHelper {

    /**
     * Creates path to paysystem or merchant images.
     * @param {string} name - Name of paysystem or alias of merchant
     * @param {string} pathDirectory ThemeToDirectory path
     * @param {TIconShowAs} showAs how to show icon as 'img' or 'svg'
     * @param {TIconColorBg} colorIconBg background color depedency tag ('dark' or 'light')
     * @returns {string} The path to image.
     */
    public static getIconPath(
        name: string,
        pathDirectory: string,
        showAs: TIconShowAs,
        colorIconBg?: TIconColorBg,
    ): string {
        const rootPath = showAs === 'svg' ? '' : '/gstatic';
        const color = showAs === 'svg' ? 'black' : 'color';
        const colorBg = (color === 'color' && colorIconBg) ? 'color/' + colorIconBg : null;

        return `${rootPath}/${ThemeToDirectory[pathDirectory]}/${colorBg || color}/`
            +`${GlobalHelper.toSnakeCase(name)}.svg`;
    }

    /**
     * Get color dependency tag by current theme
     * @param {TIconColorBg} defaultIconsColor default background color dependency tag
     * @param {boolean} altSiteTheme alternate theme sign
     * @returns {TIconColorBg} background color dependency tag by current theme
     */
    public static getColorThemeBgType(
        defaultIconsColor: TIconColorBg,
        altSiteTheme: boolean = true,
    ): TIconColorBg {
        if (altSiteTheme) {
            return defaultIconsColor === 'dark' ? 'light' : 'dark';
        }
        return defaultIconsColor;
    }
}
