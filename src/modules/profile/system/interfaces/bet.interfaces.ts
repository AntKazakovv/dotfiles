export type TBets = IBet[];

export interface IBet {
    Amount: string;
    Currency: string;
    Date: string;
    DateISO: string;
    GameID: string;
    GameName: string;
    Merchant: string;
}
