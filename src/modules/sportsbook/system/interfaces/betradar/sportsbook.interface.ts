import {
    IDailyMatch,
    IPopularEvents,
} from './widgets.interface';

export interface IBetradarConfig {
    /**
     * `cssfile: static/config/fileName.css` - gets the path to the style file in sportsbook
     */
    cssFile?: string;
    /**
     * `configFile: static/config/fileName.js` - gets the path to the js file with sportsbook configurations
     */
    configFile?: string;
    /**
     * `theme: v2` - the theme of the sportsbook that will be used by default.
     * If there is no field, the first topic will be selected.
     * To use the second theme, you need to register the value "v2".
     */
    theme?: string;
    widgets?: {
        dailyMatch?: IDailyMatch;
        popularEvents?: IPopularEvents;
    };
}
