import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input, ChangeDetectorRef,
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
    PAYMENTS,
    IPayment,
} from './icon-list.params';
import {IMerchant} from 'wlc-engine/modules/games/interfaces/games.interfaces';
import {GamesCatalogService} from 'wlc-engine/modules/games/services/games-catalog.service';

import {
    map as _map,
    sortedUniqBy as _sortedUniqBy,
} from 'lodash';

@Component({
    selector: '[wlc-icon-list]',
    templateUrl: './icon-list.component.html',
    styleUrls: ['./styles/icon-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconListComponent extends AbstractComponent implements OnInit {
    public items: IconModel[];
    public $params: IParams;

    @Input() protected inlineParams: IParams;

    constructor(
        @Inject('injectParams') protected injectParams: IParams,
        protected filesService: FilesService,
        protected sanitizer: DomSanitizer,
        protected logService: LogService,
        protected gamesCatalogService: GamesCatalogService,
        protected cdr: ChangeDetectorRef,
    ){
        super(<IMixedParams<IParams>>{injectParams,defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        switch (this.$params.type) {
            case ('merchants'):
                await this.setMerchantsLst();
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

    protected async setMerchantsLst(): Promise<void> {
        await this.gamesCatalogService.ready;
        const merchants: IMerchant[] = _sortedUniqBy(this.gamesCatalogService.getMerchants(), (item: IMerchant) => item.Alias);

        this.items = _map<IMerchant, IconModel>(merchants, (item: IMerchant): IconModel => {
            const image = this.$params.common.iconsColor === 'default'
                ? item.Image
                : `/gstatic/merchants/${this.$params.common.iconsColor}/${item.Alias.toLowerCase()}.png`;

            const itemParams: IIconParams = {
                svgName: this.$params.theme === 'svg' ? item.Alias.toLowerCase() : undefined,
                iconUrl: this.$params.theme === 'svg' ? undefined : image,
                alt: item.Name,
                modifier: this.getItemModifier(item.Alias.toLowerCase()),
            };
            return new IconModel(itemParams, this.filesService, this.sanitizer);
        });
        this.cdr.markForCheck();
    }

    protected setPaymentsLst(): void {
        const payments: IPayment[] = _sortedUniqBy(PAYMENTS, (item: IPayment) => item.alias);

        this.items = _map<IPayment, IconModel>(payments, (item: IPayment): IconModel => {
            const itemParams: IIconParams = {
                svgName: this.$params.theme === 'svg' ? item.alias.toLowerCase() : undefined,
                iconUrl: this.$params.theme === 'svg' ? undefined : item.image,
                alt: item.name,
                modifier: this.getItemModifier(item.alias.toLowerCase()),
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

    protected getItemModifier(mod: string): string {
        return mod ? `${this.$class}__item--${mod.replace(' ', '-')}` : '';
    }
}
