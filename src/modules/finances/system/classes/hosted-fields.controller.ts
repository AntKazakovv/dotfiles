import _merge from 'lodash-es/merge';

import {GlobalDeps} from 'wlc-engine/modules/app/app.module';
import {
    Deferred,
    ILogObj,
} from 'wlc-engine/modules/core';
import {
    IHostedFields,
    IHostedField,
    IPaymentSystem,
    IHostedFormData,
} from 'wlc-engine/modules/finances/system/models/payment-system.model';

export interface IHostedFieldsParams {
    merchantId: string;
    hostedfieldsurl: string;
    fields: IHostedField[];
    styles: any;
    callback: () => void;
    onLoadCallback: () => void;
    el: string;
}

export interface IHostedFieldService {
    setup: (params: IHostedFieldsParams) => void;
    get: () => void;
    reset: () => void;
}

export interface IFormCallback {
    (formData: IHostedFormData): void;
}

export interface ISetupHostedFields {
    (
        formLoadedCallback: () => void,
        formCallback: IFormCallback,
        styles: string,
    ): void
}

export interface IHostedFieldsControllerM {
    hostedFields: IHostedFields;
    ready: Deferred<boolean>;
    resetHostedFields(): void;
    getHostedValue(): void;
    dropHostedFields(): void;
    validateHostedFields(): void;
    invalidateHostedFields(): void;
    loadedHostedFields(): void;
    setupHostedFields: ISetupHostedFields;
}

export class HostedFieldsControllerM implements IHostedFieldsControllerM {

    public ready: Deferred<boolean> = new Deferred();
    private hostedFieldService: IHostedFieldService;
    private hostedField: any;

    constructor(private data: IPaymentSystem) {
        this.importPackage();
    }

    public get hostedFields(): IHostedFields {
        return this.data.hostedFields as IHostedFields;
    }

    public resetHostedFields(): void {
        this.hostedFieldService.reset();
    }

    public getHostedValue(): void {
        this.hostedFieldService.get();
    }

    public dropHostedFields(): void {
        this.hostedFields.errors = null;
        this.hostedFields.loaded = false;
    }

    public validateHostedFields(): void {
        this.hostedFields.invalid = false;
        this.hostedFields.errors = null;
    }

    public invalidateHostedFields(): void {
        this.hostedFields.invalid = true;
        this.hostedFields.errors = true;
    }

    public loadedHostedFields(): void {
        this.hostedFields.invalid = true;
        this.hostedFields.loaded = true;
    }

    public setupHostedFields(
        formLoadedCallback: () => void,
        formCallback: (formData: IHostedFormData) => void,
        styles: string,
    ): void {
        const params: IHostedFieldsParams = {
            merchantId: this.hostedFields.merchantId,
            hostedfieldsurl: this.hostedFields.url,
            fields: this.hostedFields.fields,
            onLoadCallback: () => formLoadedCallback,
            styles: styles,
            callback: () => formCallback,
            el: '#wlc-hosted-fields',
        };

        params.fields = params.fields.map((conf: IHostedField) => {
            return new this.hostedField(
                conf.type,
                conf.name,
                conf.name,
                conf.label,
                conf.error,
                conf.helpKey,
                conf.visible,
                conf.required,
            );
        });
        this.hostedFieldService.setup(params);
    }

    private async importPackage(): Promise<void> {
        await import('hosted-fields-sdk')
            .then((m: any) => {
                this.hostedFieldService = m['HostedFields'];
                this.hostedField = m['Field'];
                this.ready.resolve(true);
            })
            .catch((error) => {
                this.ready.resolve(false);
                const logObj: ILogObj = {
                    code: '7.0.3',
                    flog: {
                        error: error.message ? error.message : error,
                    },
                };
                if (this.data.id) {
                    logObj.flog.id = this.data.id;
                }

                GlobalDeps.logService.sendLog(_merge({}, logObj, {
                    from: {
                        model: 'PaymentSystem',
                        method: 'HostedFieldsController.importPackage',
                    },
                }));
            });
    }
}
