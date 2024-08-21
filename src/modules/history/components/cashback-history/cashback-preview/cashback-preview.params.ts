import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ICashbackHistory,
} from 'wlc-engine/modules/history/system/interfaces/cashback-history/cashback-history.interface';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IDateFormat {
    desktop: string;
    /** for mobile with width less than 480px */
    mobile: string;
}

export interface ICashbackPreviewParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    cashback?: ICashbackHistory;
    dateFormat?: IDateFormat;
}

export const defaultParams: ICashbackPreviewParams = {
    moduleName: 'cashback',
    componentName: 'wlc-cashback-preview',
    class: 'wlc-cashback-preview',
    dateFormat: {
        desktop: 'DD-MM-YYYY HH:mm:ss',
        mobile: 'DD-MM-YYYY HH:mm:ss',
    },
};
