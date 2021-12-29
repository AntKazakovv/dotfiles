export interface IMocksConfig {
    base?: {
        jackpots?: boolean;
        wins?: boolean;
        topWins?: boolean;
        bonuses?: boolean;
        tournaments?: boolean;
    },
    custom?: [ICustomMock, ...ICustomMock[]],
}

interface ICustomMock {
    route: string;
    source: string;
}
