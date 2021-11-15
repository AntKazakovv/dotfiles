import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IVerificationCParams extends IComponentParams<Theme, Type, ThemeMod> {
    iconPath: string;
    requirements: string[];
}

export const defaultParams: IVerificationCParams = {
    moduleName: 'profile',
    componentName: 'wlc-verification',
    class: 'wlc-verification',
    iconPath: 'wlc/icons/doc-icons/',
    requirements: [
        gettext('Both Front and Back of ID card must be received'),
        gettext('Document must be in date and not expired'),
        gettext('Document must be showing expiry date'),
        gettext('Document must show your unaltered photo'),
        gettext('Document must show your date of birth'),
        gettext('Water marks on documents must be visible'),
    ],
};
