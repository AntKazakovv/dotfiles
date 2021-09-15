import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IVerificationCParams extends IComponentParams<Theme, Type, ThemeMod> {
    iconPath: string;
}

export const defaultParams: IVerificationCParams = {
    moduleName: 'profile',
    componentName: 'wlc-verification',
    class: 'wlc-verification',
    iconPath: 'wlc/icons/doc-icons/',
};
