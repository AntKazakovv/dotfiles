import {Subject} from 'rxjs';

import {
    HooksService,
    IIndexing,
} from 'wlc-engine/modules/core';

export interface ISportsbookConfig {
    betradar?: IBetradar;
}

export interface ISportsbookSettings {
    id: string;
    merchantId: number,
    launchCode: string,
}

export interface ISportsbookSettingsFilter {
    id?: string,
    merchantId?: number,
}

export interface ISportsbookHook {
    hooksService: HooksService,
    disableHooks: Subject<void>,
}

export interface IBetradar {
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
        env: IIndexing<IBetradarWidgetEnvironment>;
        dailyMatch?: IBetradarDailyMatch;
        popularEvents?: IBetradarPopularEvents;
    };
}

export interface IBetradarDailyMatch {
    showImage?: boolean;
    imagesDir?: string;
}

export interface IBetradarPopularEvents {
    imagesDir?: string;
}

export interface IBetradarWidgetEnvironment {
    url: string;
    serverUrl: string;
}

interface ISportEvent {
    id: string;
    team_home_id: string;
    team_away_id: string;
    team_home_name: string;
    team_away_name: string;
    team_home_logo: string;
    team_away_logo: string;
    team_home_abbr: string;
    team_away_abbr: string;
    start_time: number;
    link: string;
    sport_alias: string;
    category_alias: string;
    tournament_alias: string;
    sport_name: string;
    category_name: string;
    tournament_name: string;
}

export interface IBetradarGame extends ISportEvent {
    market?: string;
    p1?: string;
    p2?: string;
    x?: string;
}

export interface IDailyMatchData extends ISportEvent {
    language: string;
}

export interface IPopularEventsData {
    games: ISportEvent[];
    language: string;
}

export enum MarketType {
    P1xP2 = 'p1xp2',
    P1P2 = 'p1p2'
}

export interface IMarketItem {
    name: string;
    value: string;
}

export enum IBetradarWidgets {
    DailyMath = 'DAILY_MATCH',
    PopularEvents = 'POPULAR_EVENTS'
}

export interface IMessageDataLocationChange {
    path: string;
}
