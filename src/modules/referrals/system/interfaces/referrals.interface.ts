import {Dayjs} from 'dayjs';

export interface IRefInfo {
    link: string;
    total: string;
    available: Record<string, number>;
}

export interface IRefItem {
    ID: number;
    profit: number;
}

export interface IRefCurrency {
    currency: string;
    value: number;
};

export interface IRefListQueryParams {
    from: Dayjs;
    to: Dayjs;
}

export type TRefDateFilterInput = 'year' | 'month';

export interface IRefDateFilterParam {
    field: TRefDateFilterInput;
    value: number;
}

export interface IRefListResponse{
    referrals: IRefItem[];
}

export interface ITakeProfitResponse {
    result: boolean;
}
