import {
    ChangeDetectorRef,
    Directive,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
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
    IState,
} from 'wlc-engine/modules/core';
import {PaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {
    FormElements,
    IFieldTemplate,
} from 'wlc-engine/modules/core/system/config/form-elements';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {
    IAddProfileInfoCParams,
    UserHelper,
    UserProfile,
} from 'wlc-engine/modules/user';
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
        const profile: UserProfile = this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .getValue();

        if (!_isEqual(this.requiredFields, checkedRequiredFields)) {
            this.requiredFields = checkedRequiredFields;
        }

        this.requiredFieldsKeys = _keys(this.requiredFields);

        if (this.requiredFieldsKeys.includes('stateCode')
            && (this.requiredFieldsKeys.includes('countryCode') || (profile.countryCode
                && !this.configService.get<BehaviorSubject<IState[]>>('states').getValue()[profile.countryCode]))
        ) {
            this.requiredFieldsKeys = this.requiredFieldsKeys.filter((field) => field !== 'stateCode');
            delete this.requiredFields['stateCode'];
        }

        if (this.requiredFieldsKeys?.length) {
            const fields: IFormComponent[] = _transform(
                this.requiredFields,
                (result: IFormComponent[], item: IFieldTemplate) => {
                    if (FormElements[item.template]) {
                        const component: IFormComponent = FormElements[item.template];
                        UserHelper.setValidatorRequired(item.template, component);
                        result.push(component);
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
