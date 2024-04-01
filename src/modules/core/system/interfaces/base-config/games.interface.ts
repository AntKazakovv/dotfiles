export interface IGamesConfig {
    playForReal?: boolean;
    jackpots?: {
        useRealJackpots?: boolean;
        requestCurrency?: string;
    };
    alwaysShowChoiceOfCurrency?: boolean;
    defaultThumbsConfigUrl?: string;
    verticalThumbsConfigUrl?: string;
}
