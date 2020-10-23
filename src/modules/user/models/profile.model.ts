import {IUserProfile} from 'wlc-engine/interfaces';
import {TranslateService} from '@ngx-translate/core';
import {AbstractUserModel} from 'wlc-engine/modules/user/models/abstarct.model';

import {
    get as _get,
    reduce as _reduce,
    toString as _toString,
} from 'lodash';

export class UserProfile extends AbstractUserModel<IUserProfile> {

    constructor(
        protected translate: TranslateService,
        ) {
            super();
    }
}
