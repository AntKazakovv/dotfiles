import {
    Input,
    Inject,
    OnInit,
    Component,
    ChangeDetectorRef,
} from '@angular/core';

import {
    IPaysystem,
    ConfigService,
    ColorThemeService,
} from 'wlc-engine/modules/core';
import {IconListAbstract} from 'wlc-engine/modules/icon-list/system/classes/icon-list-abstract.class';
import {IconModel} from 'wlc-engine/modules/icon-list/system/models/icon-list-item.model';

import * as Params from './icon-payments-list.params';

import _find from 'lodash-es/find';
import _each from 'lodash-es/each';
import _filter from 'lodash-es/filter';
import _concat from 'lodash-es/concat';
import _uniqBy from 'lodash-es/uniqBy';
import _includes from 'lodash-es/includes';

@Component({
    selector: '[wlc-icon-payments-list]',
    templateUrl: './icon-payments-list.component.html',
})
export class IconPaymentsListComponent extends IconListAbstract<Params.IIconPaymentsListCParams> implements OnInit {
    @Input() protected inlineParams: Params.IIconPaymentsListCParams;

    public items: IconModel[] = [];
    public $params: Params.IIconPaymentsListCParams;
    protected payments: IPaysystem[];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IIconPaymentsListCParams,
        protected configService: ConfigService,
        protected colorThemeService: ColorThemeService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, colorThemeService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        await this.configService.ready;

        this.getPaymentsList();

        if (this.configService.get<boolean>('$base.colorThemeSwitching.use')
        && this.$params.colorIconBg && this.$params.iconsType === 'color') {
            this.subscribeOnToggleSiteTheme(() => this.setItemsList());
        }

        this.setItemsList();
    }

    protected setItemsList(): void {
        const {iconsType, colorIconBg} = this.$params;
        const showIconAs = iconsType === 'black' ? 'svg' : 'img';

        const list = this.convertItemsToIconModel<IPaysystem>(
            this.payments,
            (item) => {
                return {
                    from: {
                        component: 'IconPaymentsListComponent',
                        method: 'setItemsList',
                    },
                    icon: this.merchantsPaymentsIterator('payments', {
                        showAs: showIconAs,
                        wlcElement: 'block_payment-' + this.wlcElementTail(item.Name),
                        sref: this.$params.itemsCommonLinkParams?.sref || null,
                        srefParams: this.$params.itemsCommonLinkParams?.srefParams || null,
                        href: this.$params.itemsCommonLinkParams?.href || null,
                        nameForPath: item.Name,
                        colorIconBg,
                    }),
                };
            },
        );

        if (this.$params.items?.length) {
            this.items = _concat(
                list,
                this.getConvertedCustomList({component: 'IconPaymentsListComponent', method: 'setItemsList'}),
            );
        } else {
            this.items = list;
        }

        this.cdr.markForCheck();
    }

    /**
     * Get payments list array from app config
     *
     * @returns {void}
     **/
    protected getPaymentsList(): void {
        this.payments = _uniqBy(this.configService.get('appConfig.siteconfig.payment_systems') || [],
            (item) => item.Name.toLowerCase());
        this.updateList();
    }

    /**
     * Update icon list array by include && exclude params
     *
     * @returns {void}
     **/
    protected updateList(): void {
        if (this.$params.exclude?.includes('all')) {
            this.payments = [];
        } else {
            this.payments = _filter(this.payments, (item: IPaysystem) =>
                !_includes(this.$params.exclude, item.Name.toLowerCase()));
        }

        _each(this.$params.include, (name) => {
            if (!_find(this.payments, (item: IPaysystem) => item.Name.toLowerCase() === name)) {
                this.payments.push({
                    Name: name,
                    Alias: '',
                    Init: '',
                });
            }
        });
    }
}
