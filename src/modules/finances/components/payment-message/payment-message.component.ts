import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    OnInit,
    Renderer2,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DOCUMENT} from '@angular/common';

import {TranslateService} from '@ngx-translate/core';
import {DateTime} from 'luxon';
import _cloneDeep from 'lodash-es/cloneDeep';
import _some from 'lodash-es/some';
import _map from 'lodash-es/map';
import _merge from 'lodash-es/merge';

import {
    IPaymentMessage,
} from 'wlc-engine/modules/finances/system/interfaces';
import {
    PaymentSystem,
} from 'wlc-engine/modules/finances/system/models';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {FinancesService} from 'wlc-engine/modules/finances/system/services/finances/finances.service';
import {
    AbstractComponent,
    ConfigService,
    IInputCParams,
    IMixedParams,
    ITimerCParams,
    IWrapperCParams,
    LogService,
    ModalService,
} from 'wlc-engine/modules/core';

import * as Params from './payment-message.params';

export type TMessageType = 'html'
    | 'pay_to_bank'
    | 'pay_to_xaddress'
    | 'pay_to_address_with_amount'
    | 'pay_via_invoice';

type TInputName = 'address' | 'invoice' | 'xadress' | 'memo' | 'tag';

interface IPatchOptions {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
}

@Component({
    selector: '[wlc-payment-message]',
    templateUrl: './payment-message.component.html',
    styleUrls: ['./styles/payment-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMessageComponent extends AbstractComponent implements OnInit, OnChanges {

    @Input() public system: PaymentSystem;
    @Input() public minAmount: number;
    @Input() public maxAmount: number;

    public $params: Params.IPaymentMessageCParams;
    public isError: boolean = false;
    public type: TMessageType | null;

    public inputParams: IInputCParams;
    public inputParamsXaddress: IInputCParams;
    public inputParamsTag: IInputCParams;
    public inputParamsMemo: IInputCParams;
    public imageLoaded: boolean = false;
    public html: string;
    public parseAmount: string;
    public parseRate: string;
    public metamaskButtonConfig: IWrapperCParams | null = null;

    public timerParams: ITimerCParams;
    public inputParamsLockedAmount: IInputCParams;
    public inputParamsCryptoAmount: IInputCParams;

    private patchOptions: IPatchOptions = {
        onlySelf: false,
        emitModelToViewChange: true,
        emitViewToModelChange: true,
    };

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPaymentMessageCParams,
        @Inject(DOCUMENT) protected document: Document,
        protected renderer: Renderer2,
        protected configService: ConfigService,
        protected logService: LogService,
        protected cdr: ChangeDetectorRef,
        protected translateService: TranslateService,
        protected modalService: ModalService,
        protected financesService: FinancesService,
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

    public get invoiceRate(): string {
        return `1 ${this.system.cryptoTicker} = ${this.message.cryptoRate} ${this.system.userCurrency}`;
    }

    public get timerValue(): DateTime {
        return DateTime.fromISO(this.message.dateEnd);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.system = this.$params?.system || this.system;
        this.minAmount ??= this.$params?.minAmount;
        this.maxAmount ??= this.$params?.maxAmount;
        this.isError = !this.system;

        if (this.system) {
            if (this.message.html) {
                this.type = 'html';
                this.loadHtml();
            } else {
                this.prepareMessage();
            }
        }

        this.cdr.markForCheck();
    }

    public ngOnChanges(): void {
        this.type = null;
        this.prepareMessage();
    }

    /**
     * Close payment message nodal via button inside component
     */
    public closePaymentMessageModal(): void {
        if (this.modalService.getActiveModal('payment-message')) {
            this.modalService.hideModal('payment-message');
        }
    }

    /**
     * Cancel invoice
     */
    public cancelInvoiceHandler(): void {
        this.financesService.cancelInvoiceHandler(this.system.id);
    }

    protected prepareMessage(): void {

        if (this.message.translate === 'pay_to_bank') {
            this.type = 'pay_to_bank';
            return;
        }

        if (this.inputParams) {
            this.inputParams.control.patchValue(this.message.address, this.patchOptions);
        } else {
            this.inputParams = this.getInputParams();
        }

        if (this.message.tag) {
            if (this.inputParamsTag) {
                this.inputParamsTag.control.patchValue(this.message.tag, this.patchOptions);
            } else {
                this.inputParamsTag = this.getInputParams('tag');
            }
        } else {
            this.inputParamsTag = null;
        }

        if (this.message.memo) {
            if (this.inputParamsMemo) {
                this.inputParamsMemo.control.patchValue(this.message.memo, this.patchOptions);
            } else {
                this.inputParamsMemo = this.getInputParams('memo');
            }
        } else {
            this.inputParamsMemo = null;
        }

        if (this.message.x_address) {
            if (this.inputParamsXaddress) {
                this.inputParamsXaddress.control.patchValue(this.message.x_address, this.patchOptions);
            } else {
                this.inputParamsXaddress = this.getInputParams('xadress');
            }
            this.type = 'pay_to_xaddress';
        } else {
            this.inputParamsXaddress = null;
            if (this.message.amount) {
                this.type = 'pay_to_address_with_amount';

                const parsItems: string[] =  this.message.amount.split('~');
                this.parseAmount = parsItems[0].trim();
                this.parseRate = parsItems[1].trim();
            }
        }

        if (this.message.dateEnd) {
            this.type = 'pay_via_invoice';

            const amount: IInputCParams = _merge(
                _cloneDeep(FormElements.amount.params),
                {
                    control: new FormControl(this.message.userAmount),
                    validators: null,
                },
            );
            amount.control.disable();
            this.inputParamsLockedAmount = amount;
            this.timerParams = _cloneDeep(Params.timerParams);
            this.inputParamsCryptoAmount = this.getInputParams('invoice');
        }

        if (this.message.metamask_account) {
            this.metamaskButtonConfig = {
                components: [{
                    name: 'metamask.wlc-metamask-button',
                    params: {
                        paymentMessage: this.message,
                    },
                }],
            };
        } else {
            this.metamaskButtonConfig = null;
        }
    }

    protected getInputParams(type?: TInputName): IInputCParams {
        const inputParams: IInputCParams = {
            name: type || 'address',
            theme: 'vertical',
            common: {
                readonly: true,
                placeholder: '',
                customModifiers: 'right-shift',
            },
            clipboard: true,
            control: null,
        };

        switch(type) {
            case 'tag':
                inputParams.common.placeholder = gettext('Tag');
                inputParams.control = new FormControl(this.message.tag);
                break;
            case 'memo':
                inputParams.common.placeholder = gettext('Memo');
                inputParams.control = new FormControl(this.message.memo);
                break;
            case 'xadress':
                inputParams.common.placeholder = gettext('X-addresses');
                inputParams.control = new FormControl(this.message.x_address);
                break;
            case 'invoice':
                inputParams.common.placeholder =
                    this.translateService.instant(gettext('Amount in'))
                    + ' ' + this.system.cryptoTicker;
                inputParams.control = new FormControl(this.message.cryptoAmount);
                break;
            default :
                inputParams.common.placeholder = gettext('Wallet casino');
                inputParams.control = new FormControl(this.message.address);
                break;
        }

        return inputParams;
    }

    protected async loadHtml(): Promise<void> {
        await this.loadScripts();

        if (this.message.html.indexOf('<body') !== -1) {
            const pattern = new RegExp('<body[^>]*>(.*?)</body>', 'm'),
                result = this.message.html.replace(/\r?\n/g, '').match(pattern);

            if (result && result[1]) {
                this.setHtmlData(result[1]);
            } else {
                this.isError = true;
                this.logService.sendLog({
                    code: '17.1.0',
                    from: {
                        component: 'PaymentMessageComponent',
                        method: 'loadHtml',
                    },
                    flog: {
                        paysystem: this.system.name,
                    },
                });
            }
        } else {
            this.setHtmlData(this.message.html);
        }
    }

    protected async loadScripts(): Promise<void[]> {
        if (!this.message.scripts.length) {
            return;
        }
        const existingScripts: NodeListOf<HTMLScriptElement> = this.document.head.querySelectorAll('script');

        const scriptsPromises: Promise<void>[] = _map(this.message.scripts, (src: string): Promise<void> => {
            if (_some(existingScripts, (script: HTMLScriptElement): boolean => script.src === src)) {
                return;
            }
            return this.createScript(src);
        });

        return Promise.all(scriptsPromises);
    }

    protected createScript(src: string): Promise<void> {
        return new Promise<void>((resolve: () => void) => {
            const script: HTMLScriptElement = this.renderer.createElement('script');
            script.type = 'text/javascript';
            script.onload = () => { resolve(); };
            script.onerror = () => {
                this.logService.sendLog({
                    code: '17.1.1',
                    from: {
                        component: 'PaymentMessageComponent',
                        method: 'loadScripts',
                    },
                    flog: {
                        src,
                    },
                });
                this.isError = true;
                resolve();
            };
            script.src = src;
            this.renderer.appendChild(this.document.head, script);
        });
    }

    protected setHtmlData(data: string): void {
        this.html = data;
        this.cdr.markForCheck();
    }
}
