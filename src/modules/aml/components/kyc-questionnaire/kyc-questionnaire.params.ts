import {
    IComponentParams,
    CustomType,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';
import {kycQStepsConfig} from './kyc-questionnaire.config';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export type TKycQSteps = Record<`${number}` | `${number}:${string}:${string}`, IFormWrapperCParams>;

export interface IKycQuestionnaireCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    steps?: TKycQSteps;
    stepsRelations?: Record<`${number}`, string>;
};

export const defaultParams: IKycQuestionnaireCParams = {
    class: 'wlc-kyc-questionnaire',
    componentName: 'wlc-kyc-questionnaire',
    moduleName: 'aml',
    stepsRelations: {
        '2': 'employmentStatus',
    },
    steps: {
        '1': kycQStepsConfig.step1,
        '2:employmentStatus:Employed': kycQStepsConfig.step2employed,
        '2:employmentStatus:Self-Employed': kycQStepsConfig.step2selfEmployed,
        '2:employmentStatus:Other': kycQStepsConfig.step2other,
        '3': kycQStepsConfig.step3,
        '4': kycQStepsConfig.step4,
    },
};
