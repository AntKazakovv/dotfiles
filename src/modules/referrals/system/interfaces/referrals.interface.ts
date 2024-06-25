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
    from: string;
    to: string;
}
export interface IRefDateFilter {
    field: 'year' | 'month',
    value: string,
}

export interface IRefList{
    referrals: IRefItem[];
}
