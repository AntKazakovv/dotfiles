import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IVerificationCParams extends IComponentParams<Theme, Type, ThemeMod> {
    maxSize: number; // MB
    fileTypes: string[];
    maxDocsCount: number;
    selectModeFrom: number;
    iconPath: string;
}

export const defaultParams: Partial<IVerificationCParams> = {
    class: 'wlc-verification',
    componentName: 'wlc-verification',
    selectModeFrom: 4,
    iconPath: 'wlc/icons/doc-icons/',
};
