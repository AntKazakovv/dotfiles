import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/classes/abstract.component';
import {
    IconModel,
    IIconParams,
} from 'wlc-engine/modules/base/models/icon-list-item.model';
import {FilesService} from 'wlc-engine/modules/core';
import {LogService} from 'wlc-engine/modules/core/services';
import {
    IParams,
    defaultParams,
    MERCHANTS,
    PAYMENTS,
    IPayment,
} from './icon-list.params';
import {IMerchant} from './../../../games/interfaces/games.interfaces';

import {
    map as _map,
    sortedUniqBy as _sortedUniqBy,
} from 'lodash';

@Component({
    selector: '[wlc-icon-list]',
    templateUrl: './icon-list.component.html',
    styleUrls: ['./icon-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconListComponent extends AbstractComponent implements OnInit {
    public items: IconModel[];
    public $params: IParams;

    @Input() protected inlineParams: IParams;

    constructor(
        @Inject('injectParams') protected params: IParams,
        protected filesService: FilesService,
        protected sanitizer: DomSanitizer,
        protected logService: LogService,
    ){
        super(<IMixedParams<IParams>>{
            injectParams: params,
            defaultParams: defaultParams,
        });
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        switch (this.$params.type) {
            case ('merchants'):
                this.setMerchantsLst();
                break;
            case ('payments'):
                this.setPaymentsLst();
                break;
            case ('custom'):
                this.setCustomLst();
                break;
            default:
                console.error('[wlc-icon-list] component requires "type" param');
        }
    }

    protected setMerchantsLst(): void {
        const merchants: IMerchant[] = _sortedUniqBy(MERCHANTS, (item: IMerchant) => item.Alias);

        this.items = _map<IMerchant, IconModel>(merchants, (item: IMerchant): IconModel => {
            const itemParams: IIconParams = {
                svgName: this.$params.theme === 'svg' ? item.Alias.toLowerCase() : undefined,
                iconUrl: this.$params.theme === 'svg' ? undefined : item.Image,
                alt: item.Name,
                class: item.Alias.toLowerCase(),
            };
            return new IconModel(itemParams, this.filesService, this.sanitizer);
        });
    }

    protected setPaymentsLst(): void {
        const payments: IPayment[] = _sortedUniqBy(PAYMENTS, (item: IPayment) => item.alias);

        this.items = _map<IPayment, IconModel>(payments, (item: IPayment): IconModel => {
            const itemParams: IIconParams = {
                svgName: this.$params.theme === 'svg' ? item.alias.toLowerCase() : undefined,
                iconUrl: this.$params.theme === 'svg' ? undefined : item.image,
                alt: item.name,
                class: item.alias.toLowerCase(),
            };
            return new IconModel(itemParams, this.filesService, this.sanitizer);
        });
    }

    protected setCustomLst(): void {
        if (this.$params.items?.length) {
            this.createItemsList(this.$params.items);
        } else {
            console.error('[wlc-icon-list] component requires "items" param on type "custom"');
        }
    }

    protected createItemsList(items: IIconParams[]) {
        this.items = _map<IIconParams, IconModel>(items, (item: IIconParams): IconModel => {
            return new IconModel(item, this.filesService, this.sanitizer);
        });
    }
}
