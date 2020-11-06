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
import * as Params from './icon-list.params';
import {IMerchant} from 'wlc-engine/modules/games/interfaces/games.interfaces';
import {GamesCatalogService} from 'wlc-engine/modules/games/services/games-catalog.service';
import {
    ConfigService,
} from 'wlc-engine/modules/core';

import {
    map as _map,
    sortedUniqBy as _sortedUniqBy,
    get as _get,
} from 'lodash';

export * from './icon-list.params';

@Component({
    selector: '[wlc-icon-list]',
    templateUrl: './icon-list.component.html',
    styleUrls: ['./styles/icon-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconListComponent extends AbstractComponent implements OnInit {
    public items: IconModel[];
    public $params: Params.IIconListComponentParams;

    @Input() protected inlineParams: Params.IIconListComponentParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IIconListComponentParams,
        protected filesService: FilesService,
        protected sanitizer: DomSanitizer,
        protected logService: LogService,
        protected gamesCatalogService: GamesCatalogService,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
    ){
        super(
            <IMixedParams<Params.IIconListComponentParams>>
                {injectParams, defaultParams: Params.defaultParams});
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
        const payments: Params.IPayment[] = this.configService.get('appConfig.siteconfig.payment_systems') || [];
        this.items = _map<Params.IPayment, IconModel>(payments, (item: Params.IPayment): IconModel => {
            const image = `/gstatic/paysystems/V2/${this.$params.common.iconsColor}/${item.Name.toLowerCase()}.png`;

            const itemParams: IIconParams = {
                svgName: this.$params.theme === 'svg' ? item.Name.toLowerCase() : undefined,
                iconUrl: this.$params.theme === 'svg' ? undefined : image,
                alt: item.Name,
                modifier: this.getItemModifier(item.Name.toLowerCase()),
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
