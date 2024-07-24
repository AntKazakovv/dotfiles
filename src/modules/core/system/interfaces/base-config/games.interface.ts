export interface IGamesConfig {
    playForReal?: boolean;
    jackpots?: {
        useRealJackpots?: boolean;
        requestCurrency?: string;
    };
    defaultThumbsConfigUrl?: string;
    verticalThumbsConfigUrl?: string;
}
