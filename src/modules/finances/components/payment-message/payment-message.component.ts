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

import _some from 'lodash-es/some';
import _map from 'lodash-es/map';

import {
    IPaymentMessage,
} from 'wlc-engine/modules/finances/system/interfaces';
import {
    PaymentSystem,
} from 'wlc-engine/modules/finances/system/models';

import {
    AbstractComponent,
    ConfigService,
    IInputCParams,
    IMixedParams,
    LogService,
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
    public isError: boolean = false;
    public type: 'pay_to_address' | 'pay_to_bank' | 'html';

    public inputParams: IInputCParams;
    public inputParamsXaddress: IInputCParams;
    public imageLoaded: boolean = false;
    public html: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPaymentMessageCParams,
        @Inject(DOCUMENT) protected document: Document,
        protected renderer: Renderer2,
        protected configService: ConfigService,
        protected logService: LogService,
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
        this.isError = !this.system;

        if (this.system) {
            if (this.message.html) {
                this.type = 'html';
                this.loadHtml();
            } else {
                this.type = this.system.message['translate'];
            }
        }

        this.inputParams = this.getInputParams();

        if (this.message.x_address) {
            this.inputParamsXaddress = this.getInputParams(true);
        }
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

    protected getInputParams(isXaddress?: boolean): IInputCParams {
        return {
            name: 'address',
            theme: 'vertical',
            common: {
                readonly: true,
                placeholder: isXaddress ? gettext('X-addresses') : gettext('Wallet casino'),
                customModifiers: 'right-shift',
            },
            clipboard: true,
            control: isXaddress ? new FormControl(this.message.x_address) : new FormControl(this.message.address),
        };
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
