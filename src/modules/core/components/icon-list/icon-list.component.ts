import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    ViewEncapsulation,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    LogService,
} from 'wlc-engine/modules/core';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {
    IconModel,
    IIconParams,
} from 'wlc-engine/modules/core/system/models/icon-list-item.model';
import {gamesEvents} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {IPaysystem} from 'wlc-engine/modules/core/system/services/config/app-config.model';

import * as Params from './icon-list.params';

import {
    map as _map,
    sortedUniqBy as _sortedUniqBy,
    find as _find,
    filter as _filter,
    includes as _includes,
} from 'lodash';

@Component({
    selector: '[wlc-icon-list]',
    templateUrl: './icon-list.component.html',
    styleUrls: ['./styles/icon-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class IconListComponent extends AbstractComponent implements OnInit {
    public items: IconModel[];
    public $params: Params.IIconListCParams;

    @Input() protected inlineParams: Params.IIconListCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IIconListCParams,
        protected logService: LogService,
        protected gamesCatalogService: GamesCatalogService,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        switch (this.$params.theme) {
            case ('merchants'):
                await this.setMerchantsLst();
                this.cdr.markForCheck();
                break;
            case ('payments'):
                this.setPaymentsLst();
                this.cdr.markForCheck();
                break;
            default:
                this.setCustomLst();
                this.cdr.markForCheck();
                break;
        }
    }

    protected async setMerchantsLst(): Promise<void> {

        this.eventService.subscribe({
            name: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED,
        }, () => {
            const merchants: MerchantModel[] = _sortedUniqBy(this.gamesCatalogService.getMerchants(),
                (item: MerchantModel) => item.alias);

            const showAs = this.$params.type == 'svg' ? 'svg' : 'img';
            this.items = _map<MerchantModel, IconModel>(merchants, (item: MerchantModel): IconModel => {

                const itemParams: IIconParams = {
                    showAs: showAs,
                    iconUrl: this.getPath(item.alias),
                    alt: item.name,
                    modifier: this.getItemModifier(this.toSnakeCase(item.alias)),
                };
                return new IconModel(itemParams);
            });

            this.cdr.markForCheck();
        });
    }

    protected setPaymentsLst(): void {
        let payments: IPaysystem[] = this.configService.get('appConfig.siteconfig.payment_systems') || [];

        if (this.$params.common.payment?.exclude?.length) {

            if (this.$params.common.payment.exclude[0] === 'all') {
                payments = [];
            } else {
                payments = _filter(payments, (item) => {
                    return !_includes(this.$params.common.payment.exclude, item.Name.toLocaleLowerCase());
                });
            }
        }

        if (this.$params.common.payment?.include?.length) {
            this.$params.common.payment.include.forEach((item) => {
                if (!_find(payments, (i) => i.Name.toLocaleLowerCase() === item)) {
                    payments.push({
                        Name: item,
                        Alias: {},
                        Init: '',
                    });
                }
            });
        }

        const showAs = this.$params.type == 'svg' ? 'svg' : 'img';
        this.items = _map<IPaysystem, IconModel>(payments, (item: IPaysystem): IconModel => {

            const itemParams: IIconParams = {
                showAs: showAs,
                iconUrl: this.getPath(item.Name),
                alt: item.Name,
                modifier: this.getItemModifier(this.toSnakeCase(item.Name)),
            };
            return new IconModel(itemParams);
        });
    }

    protected setCustomLst(): void {
        if (this.$params.items?.length) {
            this.createItemsList(this.$params.items);
        } else {
            console.error('[wlc-icon-list] component requires "items" param on theme "custom"');
        }
    }

    protected createItemsList(items: IIconParams[]) {
        this.items = _map<IIconParams, IconModel>(items, (item: IIconParams): IconModel => {
            return new IconModel(item);
        });
    }

    protected getItemModifier(mod: string): string {
        return mod ? `${this.$class}__item--${mod.replace(' ', '-')}` : '';
    }

    protected toSnakeCase(name: string): string {
        return name.toLowerCase().replace(/\s+|\s/g, '_').replace(/[()]/g, '');
    }

    protected getPath(name: string): string {
        const {type, theme} = this.$params;
        const rootPath = type === 'svg' ? '' : '/gstatic';
        const color = type === 'svg' ? 'black' : 'color';

        if (theme === 'payments') {
            return `${rootPath}/paysystems/V2/svg/${color}/${this.toSnakeCase(name)}.svg`;
        } else {
            return `${rootPath}/merchants/svg/${color}/${this.toSnakeCase(name)}.svg`;
        }
    }
}
