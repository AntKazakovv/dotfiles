import {
    TranslateService,
} from '@ngx-translate/core';

import {
    ConfigService,
    IIndexing,
} from 'wlc-engine/modules/core';
import {Games} from 'wlc-engine/modules/games/system/classes/games';
import {IAllSortsItemResponse} from 'wlc-engine/modules/games/system/interfaces/sorts.interfaces';

export interface IGamesSettings {

}

export class GamesBuilder {

    protected settings: IGamesSettings = {};

    public build(
        configService: ConfigService,
        translateService: TranslateService,
        sorts: IIndexing<IAllSortsItemResponse>,
    ): Games {
        return new Games(
            this.settings,
            sorts,
            configService,
            translateService,
        );
    }
}
