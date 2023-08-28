import {
    TranslateService,
} from '@ngx-translate/core';

import {ConfigService} from 'wlc-engine/modules/core';
import {Merchants} from 'wlc-engine/modules/games/system/classes/merchants';

export interface IMerchantsSettings {

}

export class MerchantsBuilder {

    protected settings: IMerchantsSettings = {};

    public build(
        configService: ConfigService,
        translateService: TranslateService,
    ): Merchants {
        return new Merchants(
            this.settings,
            configService,
            translateService,
        );
    }
}
