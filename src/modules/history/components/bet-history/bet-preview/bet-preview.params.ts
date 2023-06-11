import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IBet} from 'wlc-engine/modules/profile/system/interfaces/bet.interfaces';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IDateFormat {
    desktop: string;
    /** for mobile with width less than 480px */
    mobile: string;
}

export interface IBetPreviewParams extends IComponentParams<Theme, Type, ThemeMod> {
    bet?: IBet;
    dateFormat?: IDateFormat;
}

export const defaultParams: IBetPreviewParams = {
    moduleName: 'profile',
    componentName: 'wlc-bet-preview',
    class: 'wlc-bet-preview',
    dateFormat: {
        desktop: 'dd-MM-yyyy HH:mm:ss',
        mobile: 'HH:mm dd-MM',
    },
};
