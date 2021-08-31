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
    /**
     * If project uses payment system with hosted fields, fill this parameter with alt css file name.
     *
     * Instruction how to add styles for alternative theme in `project_directory/src/app-styles/hosted.fields.scss`
     *
     * Recommended file name is`hosted.fields.alt.css`
     */
    altHostedFieldsStyles?: string;
};
