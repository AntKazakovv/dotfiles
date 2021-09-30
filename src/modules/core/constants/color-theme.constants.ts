/**
 * A bunch of color theme feature default values
 *
 * @param changeEvent color theme change event name
 * @param altThemeName alternative color theme name. Can be redefined
 * with config `$base.colorThemeSwitching.altName`
 * @param configName config name of `ConfigService`
 * @param localStoreName local storage config name. Is used by script `_body-class.ts`
 * @param tagName name value of meta tag
 * @param defThemeColor default content value of theme-color meta tag.
 * Can be redefined with config `$base.colorThemeSwitching.metaColorConfig`
 */
export enum ColorThemeValues {
    changeEvent = 'THEME_CHANGE',
    altThemeName = 'alt',
    configName = 'colorTheme',
    localStoreName = 'colortheme',
    tagName = 'theme-color',
    defThemeColor = '#000',
};
