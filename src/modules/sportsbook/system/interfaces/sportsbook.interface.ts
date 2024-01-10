import {Subject} from 'rxjs';

import {HooksService} from 'wlc-engine/modules/core';
import {IBetradarConfig} from './betradar/sportsbook.interface';

export interface ISportsbookConfig {
    betradar?: IBetradarConfig;
    /**
     * Sportsbook merchant identifiers for redirect from sport bonus
     * Attention: sport bonuses currently works only with Betradar
     */
    merchantIdsForBonus?: number[];
}

export interface ISportsbookSettings {
    id: string;
    merchantId: number,
    launchCode: string,
}

export interface ISportsbookSettingsFilter {
    id?: string,
    merchantId?: number,
}

export interface ISportsbookHook {
    hooksService: HooksService,
    disableHooks: Subject<void>,
}
