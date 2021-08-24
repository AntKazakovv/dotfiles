import {
    Input,
    Inject,
    OnInit,
    Component,
} from '@angular/core';

import {
    IPaysystem,
    ConfigService,
} from 'wlc-engine/modules/core';
import {IconListAbstract} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';

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

    public $params: Params.IIconPaymentsListCParams;

    protected payments: IPaysystem[];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IIconPaymentsListCParams,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        await this.configService.ready;
        this.getPaymentsList();
        this.$params.iconComponentParams.items =
            this.prepareIconsParams('payments', this.$params.iconComponentParams, this.payments);

        if (this.$params.items?.length) {
            this.$params.iconComponentParams.items =
                _concat(this.$params.iconComponentParams.items, this.$params.items);
        }
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
                    Alias: {},
                    Init: '',
                });
            }
        });
    }
}
