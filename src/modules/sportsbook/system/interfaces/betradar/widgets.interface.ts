export enum WidgetTypes {
    DailyMath = 'DAILY_MATCH',
    PopularEvents = 'POPULAR_EVENTS'
}

interface ISportEvent {
    id: string | number;
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

export interface IDailyMatch {
    showImage?: boolean;
    imagesDir?: string;
}

export interface IPopularEvents {
    imagesDir?: string;
}

export interface IDailyMatchData extends ISportEvent {
    language: string;
}

export interface IPopularEventsData {
    games: ISportEvent[];
    language: string;
}

export interface IGame extends ISportEvent {
    market?: string;
    p1?: string;
    p2?: string;
    x?: string;
    language?: string;
}

export enum MarketType {
    P1xP2 = 'p1xp2',
    P1P2 = 'p1p2'
}

export interface IMarketItem {
    name: string;
    value: string;
}
