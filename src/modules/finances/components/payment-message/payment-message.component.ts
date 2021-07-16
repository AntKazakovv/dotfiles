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

import {
    PaymentSystem,
    IPaymentMessage,
} from 'wlc-engine/modules/finances';
import {
    AbstractComponent,
    ConfigService,
    IInputCParams,
    IMixedParams,
} from 'wlc-engine/modules/core';

import * as Params from './payment-message.params';

@Component({
    selector: '[wlc-payment-message]',
    templateUrl: './payment-message.component.html',
    styleUrls: ['./styles/payment-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMessageComponent extends AbstractComponent implements OnInit, OnChanges {

    @Input() public system: PaymentSystem;

    public $params: Params.IPaymentMessageCParams;
    public error: boolean = false;
    public type: 'pay_to_address' | 'pay_to_bank';

    public inputParams: IInputCParams;
    public imageLoaded: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPaymentMessageCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.IPaymentMessageCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public get message(): IPaymentMessage {
        return (this.system.message as IPaymentMessage);
    }

    public get imgUrl(): string {
        return 'https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=' + this.message.qrlink;
    }

    public get details(): string {
        return this.message.details || '';
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.system = this.$params?.system ? this.$params.system : this.system;
        this.error = !this.system;

        if (this.system) {
            this.type = this.system.message['translate'];
        }

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
