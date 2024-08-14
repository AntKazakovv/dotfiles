import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
export interface IAbstractHistoryNameItem {
    historyType: string;
}
export interface IHistoryNameItem extends IAbstractHistoryNameItem {
    name: string;
    status?: string;
    id?: string;
};

export interface IFinancialHistoryNameItem extends IAbstractHistoryNameItem {
    date: string;
    amount: string;
    currency?: string;
};

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

/** format of displaying date depends on user's device. Used in bets-history */
export interface IDateFormat {
    desktop: string;
    /** for mobile with width less than 480px */
    mobile: string;
}

export interface IHistoryNameParams extends IComponentParams<Theme, Type, ThemeMod> {
    item?: IHistoryNameItem | IFinancialHistoryNameItem,
    previewBetDateFormat?: IDateFormat,
}

export const defaultParams: IHistoryNameParams = {
    moduleName: 'history',
    componentName: 'wlc-history-name',
    class: 'wlc-history-name',
    previewBetDateFormat: {
        desktop: 'DD-MM-YYYY HH:mm:ss',
        mobile: 'DD-MM-YYYY HH:mm:ss',
    },
};
