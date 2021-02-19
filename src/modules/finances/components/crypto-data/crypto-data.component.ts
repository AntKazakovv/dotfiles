import {
    Component,
    OnInit,
    Input,
    Inject,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnChanges,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import {PaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {
    AbstractComponent,
    ConfigService,
    IInputCParams,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {ICryptoMessage} from 'wlc-engine/modules/finances/system/interfaces/finances.interface';

import * as Params from './crypto-data.params';

@Component({
    selector: '[wlc-crypto-data]',
    templateUrl: './crypto-data.component.html',
    styleUrls: ['./styles/crypto-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CryptoDataComponent extends AbstractComponent implements OnInit, OnChanges {

    @Input() public system: PaymentSystem;

    public $params: Params.ICryptoDataCParams;
    public error: boolean = false;

    public inputParams: IInputCParams;
    public imageLoaded: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICryptoDataCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.ICryptoDataCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public get message(): ICryptoMessage {
        return (this.system.message as ICryptoMessage);
    }

    public get imgUrl(): string {
        return 'https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=' + 'bitcoin:' + this.message.address;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.system = this.$params?.system ? this.$params.system : this.system;
        this.error = !this.system;

        this.inputParams = {
            name: 'address',
            theme: 'vertical',
            common: {
                readonly: true,
                placeholder: gettext('Wallet casino'),
                customModifiers: 'right-shift',
            },
            clipboard: true,
            control: new FormControl(this.message.address),
        };
    }

    public ngOnChanges(): void {
        if (this.inputParams) {
            this.inputParams.control.patchValue(this.message.address, {
                onlySelf: true,
                emitModelToViewChange: true,
                emitViewToModelChange: true,
            });
        }
    }
}
