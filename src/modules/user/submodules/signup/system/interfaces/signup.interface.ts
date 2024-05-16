import {
    IFormWrapperCParams,
    IValidateData,
} from 'wlc-engine/modules/core';

export interface IDataForModification {
    shift: number;
    config: IFormWrapperCParams;
    selfExcludedText: string;
    enableRequirement: boolean;
}

export interface IRegFormDataForConfig {
    form: IValidateData;
}
