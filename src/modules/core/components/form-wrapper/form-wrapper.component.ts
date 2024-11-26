import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    Input,
    OnInit,
    ViewEncapsulation,
    SimpleChanges,
    OnChanges,
    ElementRef,
    Output,
    EventEmitter,
    inject,
} from '@angular/core';
import {
    AbstractControl,
    AsyncValidatorFn,
    UntypedFormControl,
    UntypedFormGroup,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';
import {
    TransitionService,
    UIRouterGlobals,
} from '@uirouter/core';
import {
    BehaviorSubject,
    Observable,
} from 'rxjs';
import {
    takeUntil,
    takeWhile,
    filter,
} from 'rxjs/operators';

import _assign from 'lodash-es/assign';
import _each from 'lodash-es/each';
import _isObject from 'lodash-es/isObject';
import _merge from 'lodash-es/merge';
import _find from 'lodash-es/find';
import _get from 'lodash-es/get';
import _includes from 'lodash-es/includes';
import _clone from 'lodash-es/clone';
import _isArray from 'lodash-es/isArray';
import _set from 'lodash-es/set';
import _keys from 'lodash-es/keys';
import _filter from 'lodash-es/filter';
import _isUndefined from 'lodash-es/isUndefined';

import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LayoutService} from 'wlc-engine/modules/core/system/services/layout/layout.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {
    ValidationService,
    ValidatorType,
    IValidatorListItem,
} from 'wlc-engine/modules/core/system/services/validation/validation.service';
import {
    NotificationEvents,
    IPushMessageParams,
} from 'wlc-engine/modules/core/system/services/notification';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {IButtonCParams} from 'wlc-engine/modules/core/components/button/button.interfaces';
import {ISelectCParams} from 'wlc-engine/modules/core/components/select/select.params';
import {ITextareaCParams} from 'wlc-engine/modules/core/components/textarea/textarea.params';
import {IInputCParams} from 'wlc-engine/modules/core/components/input/input.params';
import {
    IWrapperCParams,
    WrapperComponent,
} from 'wlc-engine/modules/core/components/wrapper/wrapper.component';
import {FormValidators} from 'wlc-engine/modules/core/system/services/validation/validators';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {CustomHook} from 'wlc-engine/modules/core/system/decorators/hook.decorator';
import {FormsService} from 'wlc-engine/modules/core/system/services';

export interface IControls extends IIndexing<UntypedFormControl> {
}

export interface IGlobalValidators {
    validators: ValidatorFn[];
    asyncValidators: AsyncValidatorFn[];
}

export type TFormComponentParams = IInputCParams
    | ITextareaCParams
    | ISelectCParams
    | IButtonCParams
    | any;

export interface IFormComponent {
    name: string;
    params: TFormComponentParams | TFormCompositeComponent<any>;
    alwaysNew?: {
        saveValue?: boolean;
    };
    blockName?: string;
}

/**
 * Type for components which are compose multiple components with any inner logic
 */
export type TFormCompositeComponent<T extends string> = {
    name: T[],
    locked: T[],
    validatorsField: {
        name: T,
        validators: ValidatorType | ValidatorType[],
    }[]
} & Record<T, TFormComponentParams>;

export interface IFormWrapperCParams extends IWrapperCParams {
    components: IFormComponent[];
    validators?: ValidatorType[];
    validatorsAnyOf?: ValidatorType[];
    /**
     * if true inputs disables when it 'required' and it's locked is undefined
     */
    isStrictLocked?: boolean;
}

@Component({
    selector: '[wlc-form-wrapper]',
    templateUrl: './form-wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class FormWrapperComponent extends WrapperComponent implements OnInit, OnChanges {
    @Input() public ngSubmit: (form: UntypedFormGroup) => Promise<boolean> | boolean;
    @Input()
    private beforeSubmit: (form: UntypedFormGroup, initialFormValues?: IIndexing<any>) => boolean | Promise<boolean>;

    @Input() private config: IFormWrapperCParams;
    @Input() private formData: BehaviorSubject<IIndexing<any>>;
    @Input() private errors: Observable<IIndexing<string>>;

    @Output() public form$ = new EventEmitter<UntypedFormGroup>();

    public override $params: IFormWrapperCParams;
    public form: UntypedFormGroup;
    private controls: IControls = {};
    private allControls: IControls = {};
    private globalValidators: IGlobalValidators;
    private formDataStorage: IIndexing<any> = {};
    private listErrors: IIndexing<IIndexing<string>> = {};
    private initialFormValues: IIndexing<any> = {};
    private submitButtonPending$?: BehaviorSubject<boolean>;

    private locked: string[] = [];
    private initiated: boolean;

    protected formsService = inject(FormsService);

    constructor(
        @Inject('injectParams') params: IFormWrapperCParams,
        layoutService: LayoutService,
        transition: TransitionService,
        injector: Injector,
        uiRouter: UIRouterGlobals,
        eventService: EventService,
        configService: ConfigService,
        protected validationService: ValidationService,
        protected elRef: ElementRef,
        cdr: ChangeDetectorRef,
        injectionService: InjectionService,
        @Inject(WINDOW) window: Window,
    ) {
        super(
            params,
            configService,
            layoutService,
            cdr,
            transition,
            injector,
            uiRouter,
            eventService,
            injectionService,
            window,
        );
    }

    @CustomHook('core', 'formWrapperNgOnInit')
    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.prepareParams();
        this.initForm();
        this.collectionErrors(this.config?.components);

        if (!this.initiated) {
            this.initiated = true;
            this.errors?.pipe(
                filter(v => !!v),
                takeUntil(this.$destroy),
            ).subscribe((data: IIndexing<string>): void => {
                this.setErrors(data);
            });
        }
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        if (this.form && changes.config) {
            this.formDataStorage = _assign({}, this.formDataStorage, this.form.value);
            this.controls = {};
            this.locked = [];
            this.ngOnInit();
        }
    }

    public override getInjector(component: any): Injector {
        if (component.params.components) {
            component.params.components = this.filterNullComponents(component.params.components);
            _each(component.params.components, component => {
                this.getInjector(component);
            });
        }

        if (_isArray(component.params.name)) {
            _each(component.params.name, (field: string) => {
                _set(component.params, `${field}.control`, this.form?.controls[field]);
            });

        } else {
            const params = component.params?.hasOwnProperty('saName') ? component.params.saParams : component.params;

            _assign(params, {
                control: this.form?.controls[params.name] || new UntypedFormControl(''),
            });
        }

        const componentName: string | string[] = component.params?.name;
        if (componentName) {
            switch (typeof componentName) {
                case 'string':
                    const controlErrors: ValidationErrors = this.formsService.getControlError(componentName);

                    if (controlErrors && component.params.control) {
                        component.params.control.setErrors(controlErrors);
                        component.params.control.markAsTouched();
                        component.params.control.updateValueAndValidity();
                    }
                    break;
                case 'object':
                    for (const name of componentName) {
                        const errors: ValidationErrors = this.formsService.getControlError(name);
                        if (errors) {
                            component.params[name].control.setErrors(errors);
                            component.params[name].control.markAsTouched();
                            component.params[name].control.updateValueAndValidity();
                        }
                    }
            }
        }
        return super.getInjector(component);
    }

    public async submit(): Promise<void> {
        this.submitButtonPending$?.next(true);
        if (this.beforeSubmit && !await this.beforeSubmit(this.form, this.initialFormValues)) {
            this.submitButtonPending$?.next(false);
            return;
        }

        _each(this.form.controls, (control: UntypedFormControl) => {
            if (!control.touched || !control.valid) {
                control.markAsTouched();
                control.updateValueAndValidity();
            }
        });

        if (this.form.pending) {
            await this.form.statusChanges
                .pipe(takeWhile((status) => status === 'PENDING'))
                .toPromise();
        }

        if (this.form.valid) {
            if (await this.ngSubmit(this.form)) {
                this.form.controls.currentPassword?.setValue('');
                this.form.markAsPristine();
                this.form.markAsUntouched();
            }
        } else {
            const formErrors: string[] = this.formErrors();
            let errorFound: boolean = false;

            for (const controlName in this.form.controls) {
                const control: AbstractControl = this.form.controls[controlName];

                if (!errorFound && control.errors) {
                    this.elRef.nativeElement.querySelector(`#${controlName}`)?.focus();
                    errorFound = true;
                }
            }

            if (this.hasRequiredError || this.form.errors?.required) {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        title: gettext('Error filling form'),
                        message: gettext('Fill in the required fields'),
                        wlcElement: 'notification_form-filling-error',
                    },
                });
            } else if (formErrors.length) {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        title: gettext('Error filling form'),
                        message: formErrors.length > 1
                            ? gettext('Check the correctness of the filled-out fields')
                            : _get(this.listErrors, formErrors[0], formErrors[0].replace(/^.+\./, 'validator-')),
                        wlcElement: 'notification_form-fields-error',
                    },
                });
            }
        }

        this.submitButtonPending$?.next(false);
        this.cdr.detectChanges();
    }

    protected collectionErrors(components: IFormComponent[]): void {
        components = this.filterNullComponents(components);
        _each(components, (component) => {
            if (component.params.name) {
                _each(component.params.validators, (validator) => {
                    if (validator.name) {
                        _set(this.listErrors, `${component.params.name}.${validator.name}`, validator.text);
                    }
                });
            }

            if (component.name.includes('wlc-wrapper')) {
                this.collectionErrors(component.params.components);
            }
        });
    }

    protected get hasRequiredError(): boolean {
        return !!_find(this.controls, (control) => control.errors?.required);
    }

    protected formErrors(): string[] {
        const errors: string[] = [];

        _each(this.controls, (control, controlName) => {

            _each(control.errors, (_, errorName) => {
                errors.push(`${controlName}.${errorName}`);
            });

            if (errors.length > 1) {
                return false;
            }
        });

        return errors;
    }

    protected override prepareParams(): void {
        this.$params = _merge(this.config, this.params);
        this.$params.components = this.filterNullComponents(this.$params.components);
        this.setHostClass();
    }

    private initForm(): void {
        this.prepareComponents(this.$params.components);
        this.prepareValidators();

        this.form = new UntypedFormGroup(
            this.controls,
            this.globalValidators.validators,
            this.globalValidators.asyncValidators,
        );
        this.form$.emit(this.form);
        this.initialFormValues = this.form.getRawValue();

        this.dataSubscription();
    }

    private prepareComponents(components: IFormComponent[]): void {
        const controls: IIndexing<UntypedFormControl> = {};

        components = this.filterNullComponents(components);

        _each(components, (component) => {
            const componentParams: IIndexing<any> = component.params?.hasOwnProperty('saName')
                ? component.params.saParams
                : component.params;

            const componentName: string = component.params?.hasOwnProperty('saName')
                ? component.params.saName
                : component.name;

            if (componentParams.components) {
                this.prepareComponents(componentParams.components);
                return;
            }

            if (
                this.configService.get<boolean>('$base.useButtonPending')
                && componentParams.common?.typeAttr === 'submit'
            ) {
                this.submitButtonPending$ = new BehaviorSubject(false);
                _set(componentParams, 'pending$', this.submitButtonPending$);
            }

            if (!componentParams?.name) {
                return;
            }

            const validators: ValidatorFn[] = [];
            const asyncValidators: AsyncValidatorFn[] = [];

            if (!componentParams.validators) {
                componentParams.validators = [];
            }

            if (componentName) {

                if (componentName.includes('wlc-input')) {
                    componentParams.validators.push(FormValidators.tagReg, FormValidators.emojiReg);
                    if (!_find(componentParams.validators, {name: 'maxLength'})) {
                        componentParams.validators.push(FormValidators.maxLength);
                    }
                }

                if (componentName.includes('wlc-textarea')) {
                    componentParams.validators.push(FormValidators.tagReg, FormValidators.emojiReg);
                }
            }

            _each(componentParams.validators, (validator: ValidatorType) => {
                this.getValidator(validator, asyncValidators, validators);

                if (validator === 'required'
                    && _isUndefined(componentParams.locked)
                    && this.$params.isStrictLocked)
                {
                    componentParams.locked = true;
                }
            });
            _each(componentParams.validatorsAnyOf, (validator: ValidatorType) => {
                this.getValidator(validator, asyncValidators, validators);
            });

            if (_isArray(componentParams.name)) {
                _each(componentParams.name, (field: string) => {

                    const fieldValidator: ValidatorFn[] = [];
                    const fieldAsyncValidators: AsyncValidatorFn[] = [];

                    if (_find(componentParams.validatorsField, {name: field})) {
                        const validator: ValidatorType | ValidatorType[] =
                            _find(componentParams.validatorsField, {name: field})['validators'];

                        if (Array.isArray(validator)) {
                            _each(validator, (val: ValidatorType) => {
                                this.getValidator(val, fieldAsyncValidators, fieldValidator);
                            });
                        } else {
                            this.getValidator(validator, fieldAsyncValidators, fieldValidator);
                        }
                    }

                    if (!this.allControls[field] || component.alwaysNew) {
                        this.allControls[field] = new UntypedFormControl(
                            {
                                value: _get(this.formData?.value, field, componentParams[field]?.value) || '',
                                disabled: componentParams.disabled,
                            },
                            !!fieldValidator.length ? fieldValidator : validators,
                            !!fieldAsyncValidators.length ? fieldAsyncValidators : asyncValidators,
                        );

                        if (component.alwaysNew?.saveValue && this.formDataStorage[field]) {
                            this.allControls[field].setValue(this.formDataStorage[field]);
                            this.allControls[field].markAsTouched();
                        }
                    }

                    controls[field] = this.allControls[field];

                    if (componentParams.locked) {
                        if (_isArray(componentParams.locked)) {
                            this.locked.push(...componentParams.locked);
                            return;
                        }
                        this.locked.push(field);
                    }
                });
            } else {
                if (!this.allControls[componentParams.name] || component.alwaysNew) {
                    this.allControls[componentParams.name] = new UntypedFormControl(
                        {
                            value: _get(this.formData?.value, componentParams.name, componentParams.value) || '',
                            disabled: componentParams.disabled,
                        },
                        validators,
                        asyncValidators,
                    );

                    if (component.alwaysNew?.saveValue && this.formDataStorage[componentParams.name]) {
                        this.allControls[componentParams.name].setValue(this.formDataStorage[componentParams.name]);
                        this.allControls[componentParams.name].markAsTouched();
                    }
                }

                controls[componentParams.name] = this.allControls[componentParams.name];
            }

            if (componentParams.locked) {
                this.locked.push(componentParams.name);
            }
        });

        this.controls = _assign({}, this.controls, controls);
    }

    private prepareValidators(): void {
        this.globalValidators = {
            validators: [],
            asyncValidators: [],
        };

        _each(this.$params.validators, validator => {
            this.getValidator(validator, this.globalValidators.asyncValidators, this.globalValidators.validators);
        });
    }

    private dataSubscription(): void {
        this.formData?.subscribe((data: IIndexing<any>): void => {

            if (data?.resetForm) {
                this.form.reset();
                return;
            }

            _each(this.form.controls, (control, key): void => {
                const value = _get(data, key);

                if (!!value || value === '') {
                    control.setValue(value);
                }

                if (_includes(this.locked, key) && value) {
                    control.disable();
                }
            });

            this.initialFormValues = this.form.getRawValue();
            this.cdr.markForCheck();
        });
    }

    private getValidator(
        validatorSettings: ValidatorType,
        asyncValidators: AsyncValidatorFn[],
        validators: ValidatorFn[],
    ): void {

        let validationRule: IValidatorListItem;

        if (_isObject(validatorSettings)) {
            if (validatorSettings.projectType) {
                const projectType = this.configService.get<string>('appConfig.projectType');
                if (validatorSettings.projectType !== projectType) {
                    return;
                }
            }

            validationRule = _clone(this.validationService.getValidator(validatorSettings.name));
            validationRule.validator = validatorSettings.options
                ? validationRule.validator(validatorSettings.options)
                : validationRule.validator;
        } else {
            validationRule = this.validationService.getValidator(validatorSettings);
        }

        if (!validationRule) {
            console.error('Validator not found: ', validatorSettings);
            return;
        }

        if (validationRule?.async) {
            asyncValidators.push(validationRule.validator);
        } else {
            validators.push(validationRule.validator);
        }
    }

    private async setErrors(errors: IIndexing<string>): Promise<void> {
        if (this.form.disabled) {
            await this.form.statusChanges
                .pipe(takeWhile((status: string): boolean => status === 'DISABLED' || status === 'PENDING'))
                .toPromise();
        }

        _each(_keys(errors), (key: string): void => {
            const control: UntypedFormControl = this.controls[key];
            if (control) {
                control.setErrors({
                    incomingError: errors[key],
                });
            }
        });
    }

    private filterNullComponents(components: IFormComponent[]): IFormComponent[] {
        return _filter(components, (component: IFormComponent): boolean => {
            return _isObject(component) && !!component.name;
        });
    }
}
