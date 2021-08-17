export interface IColorThemeSwitchingConfig {
    /**
     * If true, application follows for the theme-switcher component.
     */
    use?: boolean;
    /**
     * `alt` - by default. Name of alternative color theme. Store in localStorage and
     * used by bodyClassService with prefix 'wlc-body--theme-'
     */
    altName?: string;
    /**
     * If defined - emit changing theme-color meta tag on switching theme
     */
    metaColorConfig?: {
        /** `#000` - by default */
        default?: string,
        /** #000 - by default */
        alt?: string,
    };
};
