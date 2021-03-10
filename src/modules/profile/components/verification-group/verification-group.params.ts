import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IVerificationGroupCParams extends IComponentParams<Theme, Type, ThemeMod> {
    maxSize: number; // MB
    fileTypes: string[];
    maxDocsCount: number;
}

export const defaultParams: Partial<IVerificationGroupCParams> = {
    class: 'wlc-verification-group',
    componentName: 'wlc-verification-group',
};
