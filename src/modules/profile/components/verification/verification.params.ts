import {
    CustomType,
    IComponentParams,
    IWrapperCParams,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | 'wolf' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IVerificationCParams extends IComponentParams<Theme, Type, ThemeMod> {
    iconPath: string;
    requirements: string[];
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
}

export const defaultParams: IVerificationCParams = {
    moduleName: 'profile',
    componentName: 'wlc-verification',
    class: 'wlc-verification',
    iconPath: 'wlc/icons/doc-icons/',
    requirements: [
        gettext('Both the front and the back of an ID card must be present'),
        gettext('Document must be in date and not expired'),
        gettext('The document must show the expiry date'),
        gettext('Document must show your unaltered photo'),
        gettext('Document must show your date of birth'),
        gettext('Water marks on documents must be visible'),
    ],
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('Verification not available'),
                },
            },
        ],
    },
};
