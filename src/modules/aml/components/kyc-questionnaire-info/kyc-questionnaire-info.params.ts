import {
    IComponentParams,
    CustomType,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {TLevel} from 'wlc-engine/modules/core/components/alert/alert.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export type TKYCQStatus = 'awaiting' | 'failed' | 'validated';

export interface IKYCQState {
    infoText?: string,
    statusLevel?: TLevel,
    showInfo?: boolean,
    showBtn?: boolean,
    showStatus?: boolean,
    statusText?: string,
    awaitingStatus?: boolean,
};

export interface IKycQuestionnaireInfoCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    button?: IButtonCParams;
};

export const defaultParams: IKycQuestionnaireInfoCParams = {
    class: 'wlc-kyc-questionnaire-info',
    componentName: 'wlc-kyc-questionnaire-info',
    moduleName: 'aml',
    button: {
        common: {
            text: gettext('Add info'),
        },
    },
};
