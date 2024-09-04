import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcVerification {
    export const def: ILayoutComponent = {
        name: 'profile.wlc-verification',
    };

    export const shuftiProKycaml: ILayoutComponent = {
        name: 'aml.wlc-shufti-pro-kycaml',
    };

    export const wolfShuftiProKycaml: ILayoutComponent = {
        name: 'aml.wlc-shufti-pro-kycaml',
        params: {
            theme: 'wolf',
        },
    };

    export const kycQuestionnaire: ILayoutComponent = {
        name: 'aml.wlc-kyc-questionnaire-info',
    };

    export const themeWolf: ILayoutComponent = {
        name: 'profile.wlc-verification',
        params: {
            theme: 'wolf',
            iconPath: 'wlc/icons/doc-icons/v3/',
        },
    };
}
