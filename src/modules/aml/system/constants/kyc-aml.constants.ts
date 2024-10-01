import {IIndexing} from 'wlc-engine/modules/core';

export const statusDesc: IIndexing<string> = {
    uncommitted: gettext('Verification is not passed yet'),
    processing: gettext('The documents are being processed'),
    completed: gettext('The documents have been verified successfully'),
    failed: gettext('Verification has been declined'),
    retry: gettext('Your verification request has been declined. Please try again'),
    deleted: gettext('Time for uploading documents has expired'),
};

export const questionnaireStatusText: IIndexing<string> = {
    AwaitingValidation: gettext('KYC questionnaire is being processed'),
    FailedValidation: gettext('KYC questionnaire has been declined. Please try again'),
    Validated: gettext('The KYC questionnaire has been successfully verified'),
};
