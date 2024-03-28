import {Ng2StateDeclaration} from '@uirouter/angular';

import {StateHelper} from 'wlc-engine/modules/core';

export const profileKycQuestionnaireState: Ng2StateDeclaration = {
    url: '/kyc-questionnaire',
    resolve: [
        StateHelper.profileStateResolver('appConfig.siteconfig.EnableKYCQuestionnaire'),
    ],
};
