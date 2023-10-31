import {
    TranslateService,
} from '@ngx-translate/core';

import {BehaviorSubject} from 'rxjs';
import _filter from 'lodash-es/filter';
import _includes from 'lodash-es/includes';
import _union from 'lodash-es/union';

import {ConfigService} from 'wlc-engine/modules/core';
import {IMerchantsSettings} from 'wlc-engine/modules/games/system/builders/merchants.builder';
import {IDisableGameMerchants} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {
    Game,
    MerchantModel,
} from 'wlc-engine/modules/games';

export class Merchants {

    public disabledMerchantsOptions: IDisableGameMerchants;
    public disabledMerchants: number[] = [];
    public availableMerchants: MerchantModel[] = [];
    public allMerchants: MerchantModel[] = [];

    constructor(
        protected settings: IMerchantsSettings,
        protected configService: ConfigService,
        protected translateService: TranslateService,
    ) {
        this.init();
    }

    public setMerchants(merchants: MerchantModel[]): void {
        this.allMerchants = merchants;
    }

    public isExcludeMerchant(excludeMerchants: number[], id: number, subID: number): boolean {
        return _includes(excludeMerchants, id) || _includes(excludeMerchants, subID);
    }

    public setAvailableMerchants(availableGames: Game[]): void {
        this.availableMerchants = _filter(this.allMerchants, (merchant: MerchantModel) => {
            if (this.disabledMerchants && _includes(this.disabledMerchants, merchant.id)) {
                return false;
            }

            const merchantIds = new Set([]);

            for (const game of availableGames) {
                merchantIds.add(game.merchantID);

                if (game.subMerchantID) {
                    merchantIds.add(game.subMerchantID);
                }
            }
            return merchantIds.has(merchant.id);
        });
    }

    protected setDisabledMerchants(): void {
        if (this.disabledMerchantsOptions?.byDefault) {
            this.disabledMerchants = this.disabledMerchantsOptions.byDefault;
        }

        if (this.disabledMerchantsOptions?.forUnauthorisedUsers) {
            this.configService.get<BehaviorSubject<boolean>>('$user.isAuth$')
                .subscribe((isAuth: boolean) => {
                    if (isAuth) {
                        this.disabledMerchants = this.disabledMerchants.filter((merchant) => {
                            return !this.disabledMerchantsOptions.forUnauthorisedUsers.includes(merchant);
                        });
                    } else {
                        this.disabledMerchants = _union(
                            this.disabledMerchants, this.disabledMerchantsOptions.forUnauthorisedUsers,
                        );
                    }
                });
        }
    }

    protected init(): void {
        this.disabledMerchantsOptions = this.configService.get('$games.merchants.disable');
        this.setDisabledMerchants();
    }
}
