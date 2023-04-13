import {
    ChangeDetectorRef,
    Directive,
} from '@angular/core';

import _isEqual from 'lodash-es/isEqual';
import _transform from 'lodash-es/transform';
import _keys from 'lodash-es/keys';

import {
    AbstractComponent,
    IIndexing,
    IMixedParams,
    ConfigService,
    ModalService,
    IFormWrapperCParams,
    LogService,
    IComponentParams,
    InjectionService,
} from 'wlc-engine/modules/core';
import {
    IFieldTemplate,
    PaymentSystem,
} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {
    IAddProfileInfoCParams,
} from 'wlc-engine/modules/user/components/add-profile-info';
import {TPaymentsMethods} from '../interfaces';

@Directive()
export abstract class AbstractDepositWithdrawComponent<T extends {mode: TPaymentsMethods}> extends AbstractComponent {

    public override $params: T & IComponentParams<unknown, unknown, unknown>;
    public currentSystem: PaymentSystem;
    public requiredFields: IIndexing<IFieldTemplate> = {};
    public requiredFieldsKeys: string[] = [];
    protected profileForm: IFormWrapperCParams;

    constructor(
        protected params: IMixedParams<unknown>,
        protected logService: LogService,
        protected modalService: ModalService,
        configService: ConfigService,
        protected injectionService: InjectionService,
        cdr: ChangeDetectorRef,
    ) {
        super(params, configService, cdr);
    }

    /**
     * show modal for edit required fields
     */
    public editProfile(): void {
        this.modalService.showModal({
            id: 'add-profile-info',
            modifier: 'add-profile-info',
            componentName: 'user.wlc-add-profile-info',
            componentParams: <IAddProfileInfoCParams>{
                formConfig: this.profileForm,
                themeMod: this.requiredFieldsKeys.length > 5 ? 'overflow' : '',
            },
            showFooter: false,
            dismissAll: true,
            backdrop: 'static',
        });
    }

    protected async checkUserProfileForPayment(): Promise<void> {
        if (!this.currentSystem) {
            return;
        }

        this.profileForm = undefined;
        const checkedRequiredFields = this.currentSystem.checkRequiredFields(this.$params.mode);

        if (!_isEqual(this.requiredFields, checkedRequiredFields)) {
            this.requiredFields = checkedRequiredFields;
        }

        this.requiredFieldsKeys = _keys(this.requiredFields);

        if (this.requiredFieldsKeys?.length) {
            const fields: IFormComponent[] = _transform(
                this.requiredFields,
                (result: IFormComponent[], item: IFieldTemplate) => {
                    if (FormElements[item.template]) {
                        result.push(FormElements[item.template]);
                    } else {
                        this.logService.sendLog({code: '1.4.41', data: `Field '${item.template}' does not exist!`});
                    }
                }, []);

            if (!await this.configService.get<Promise<boolean>>('$user.skipPasswordOnFirstUserSession')) {
                fields.push(FormElements.password);
            }

            fields.push(FormElements.submit);

            this.profileForm = {
                components: fields,
                validators: ['required'],
            };
        }

        this.cdr.markForCheck();
    }
}
