import {
    Component,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject,
    HostBinding,
} from '@angular/core';

import {Observable} from 'rxjs';
import _includes from 'lodash-es/includes';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {openCloseAnimations} from 'wlc-engine/modules/games/system/animations/search.animations';
import {SearchControllerDefault} from 'wlc-engine/modules/games/components/search-v2';

import * as Params from './search-merchant-list.params';

@Component({
    selector: '[wlc-search-merchant-list]',
    templateUrl: './search-merchant-list.component.html',
    styleUrls: ['./styles/search-merchant-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [openCloseAnimations],
})
export class SearchMerchantListComponent extends AbstractComponent {
    @HostBinding('@openClose') protected animation = true;

    constructor(
        @Inject (SearchControllerDefault) protected $searchControllerDefault: SearchControllerDefault,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public chooseMerchant(merchant?: MerchantModel): void {
        this.$searchControllerDefault.setValueChooseMerchant(merchant);
    }

    public isActiveMerchant(id: number | string): boolean {
        return _includes(this.$searchControllerDefault.filters.merchants, id);
    }

    public isActiveList(): boolean {
        return !this.$searchControllerDefault.filters.merchants?.length;
    }

    public getMerchants(): Observable<MerchantModel[]> {
        return this.$searchControllerDefault.merchants$;
    }
}
