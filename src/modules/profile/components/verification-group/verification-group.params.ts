import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IVerificationGroupCParams extends IComponentParams<Theme, Type, ThemeMod> {
}

export const defaultParams: Partial<IVerificationGroupCParams> = {
    moduleName: 'profile',
    componentName: 'wlc-verification-group',
    class: 'wlc-verification-group',
};
