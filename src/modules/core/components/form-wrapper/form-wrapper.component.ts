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
} from '@angular/core';
import {
    AsyncValidatorFn,
    FormControl,
    FormGroup,
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
    IValidatorSettings,
    IValidatorListItem,
} from 'wlc-engine/modules/core/system/services/validation/validation.service';
import {
    NotificationEvents,
    IPushMessageParams,
} from 'wlc-engine/modules/core/system/services/notification';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {IButtonCParams} from 'wlc-engine/modules/core/components/button/button.params';
import {ISelectCParams} from 'wlc-engine/modules/core/components/select/select.params';
import {ITextareaCParams} from 'wlc-engine/modules/core/components/textarea/textarea.params';
import {IInputCParams} from 'wlc-engine/modules/core/components/input/input.params';
import {
    IWrapperCParams,
    WrapperComponent,
} from 'wlc-engine/modules/core/components/wrapper/wrapper.component';
import {WINDOW} from 'wlc-engine/modules/app/system';

export interface IControls extends IIndexing<FormControl> {
}

export interface IGlobalValidators {
    validators: ValidatorFn[];
    asyncValidators: AsyncValidatorFn[];
}

export interface IFormComponent {
    name: string;
    params: IInputCParams | ITextareaCParams | ISelectCParams | IButtonCParams | any;
    alwaysNew?: {
        saveValue?: boolean;
    };
    blockName?: string;
}

export interface IFormWrapperCParams extends IWrapperCParams {
    components: IFormComponent[];
    validators?: ValidatorType[];
}

@Component({
    selector: '[wlc-form-wrapper]',
    templateUrl: './form-wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class FormWrapperComponent extends WrapperComponent implements OnInit, OnChanges {
    @Input() public ngSubmit: (form: FormGroup) => Promise<boolean>;
    @Input() private beforeSubmit: (form: FormGroup, initialFormValues?: IIndexing<any>) => boolean | Promise<boolean>;
    @Input() private config: IFormWrapperCParams;
    @Input() private formData: BehaviorSubject<IIndexing<any>>;
    @Input() private errors: Observable<IIndexing<string>>;

    @Output() public form$ = new EventEmitter<FormGroup>();

    public $params: IFormWrapperCParams;
    public form: FormGroup;
    private controls: IControls = {};
    private allControls: IControls = {};
    private globalValidators: IGlobalValidators;
    private formDataStorage: IIndexing<any> = {};
    private listErrors: IIndexing<IIndexing<string>> = {};
    private initialFormValues: IIndexing<any> = {};

    private locked: string[] = [];
    private initiated: boolean;

    constructor(
        @Inject('injectParams') protected params: IFormWrapperCParams,
        configService: ConfigService,
        layoutService: LayoutService,
        transition: TransitionService,
        injector: Injector,
        uiRouter: UIRouterGlobals,
        eventService: EventService,
        protected validationService: ValidationService,
        protected elRef: ElementRef,
        protected cdr: ChangeDetectorRef,
        protected injectionService: InjectionService,
        @Inject(WINDOW) protected window: Window,
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

    public async ngOnInit() {
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

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.form && changes.config) {
            this.formDataStorage = _assign({}, this.formDataStorage, this.form.value);
            this.controls = {};
            this.locked = [];
            this.ngOnInit();
        }
    }

    public getInjector(component: any): Injector {

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
            _assign(component.params, {
                control: this.form?.controls[component.params.name] || new FormControl(''),
            });
        }

        return super.getInjector(component);
    }

    public async submit(): Promise<void> {
        if (this.beforeSubmit && !await this.beforeSubmit(this.form, this.initialFormValues)) {
            return;
        }

        _each(this.form.controls, (control: FormControl) => {
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
            const formErrors = this.formErrors();
            let errorFound = false;

            for (const controlName in this.form.controls) {
                const control = this.form.controls[controlName];

                if (!errorFound && control.errors) {
                    this.elRef.nativeElement.querySelector(`#${controlName}`)?.focus();
                    errorFound = true;
                }
            }

            if (this.hasRequiredError) {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        title: gettext('Error filling form'),
                        message: gettext('Fill required fields'),
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
                            ? gettext('Check the correctness of filling out the form fields')
                            : _get(this.listErrors, formErrors[0], formErrors[0].replace(/^.+\./, 'validator-')),
                        wlcElement: 'notification_form-fields-error',
                    },
                });
            }
        }
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
        const errors = [];

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

    protected prepareParams(): void {
        this.$params = _merge(this.config, this.params);
        this.$params.components = this.filterNullComponents(this.$params.components);
    }

    private initForm(): void {
        this.prepareComponents(this.$params.components);
        this.prepareValidators();

        this.form = new FormGroup(
            this.controls,
            this.globalValidators.validators,
            this.globalValidators.asyncValidators,
        );
        this.form$.emit(this.form);
        this.initialFormValues = this.form.getRawValue();

        this.dataSubscription();
    }

    private prepareComponents(components: IFormComponent[]): void {
        const controls = {};

        components = this.filterNullComponents(components);
        _each(components, (component) => {
            if (component.params.components) {
                this.prepareComponents(component.params.components);
                return;
            }

            if (!component.params?.name) {
                return;
            }

            const validators: ValidatorFn[] = [];
            const asyncValidators: AsyncValidatorFn[] = [];
            const tagReg = {
                name: 'regExp',
                text: 'Such constructions are prohibited',
                options: /(<\?)|(\?>)|(<\/?(.*)>)/gi,
            };
            const maxLength = {
                name: 'maxLength',
                text: gettext('The field must be no more than 55 characters long'),
                options: 55,
            };
            const emojiReg = {
                name: 'regexpEmoji',
                text: 'Such constructions are prohibited',
            };

            if (!component.params.validators) {
                component.params.validators = [];
            }

            switch (component.name) {
                case 'core.wlc-input':
                    component.params.validators.push(tagReg, emojiReg);
                    if (!_find(component.params.validators, {name: 'maxLength'})) {
                        component.params.validators.push(maxLength);
                    }
                    break;
                case 'core.wlc-textarea':
                    component.params.validators.push(tagReg, emojiReg);
                    break;
                default:
                    break;
            }

            _each(component.params.validators, (validator) => {
                this.getValidator(validator, asyncValidators, validators);

                if (validator === 'required' && _isUndefined(component.params.locked)) {
                    component.params.locked = true;
                }
            });

            if (_isArray(component.params.name)) {
                _each(component.params.name, (field: string) => {

                    const fieldValidator: ValidatorFn[] = [];
                    const fieldAsyncValidators: AsyncValidatorFn[] = [];

                    if (_find(component.params.validatorsField, {name: field})) {
                        const validator = _find(component.params.validatorsField, {name: field})['validators'];
                        this.getValidator(validator, fieldAsyncValidators, fieldValidator);
                    }

                    if (!this.allControls[field] || component.alwaysNew) {
                        this.allControls[field] = new FormControl(
                            {
                                value: _get(this.formData?.value, field, ''),
                                disabled: component.params.disabled,
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

                    if (component.params.locked) {
                        if (_isArray(component.params.locked)) {
                            this.locked.push(...component.params.locked);
                            return;
                        }
                        this.locked.push(field);
                    }
                });
            } else {
                if (!this.allControls[component.params.name] || component.alwaysNew) {
                    this.allControls[component.params.name] = new FormControl(
                        {
                            value: _get(this.formData?.value, component.params.name, component.params.value) || '',
                            disabled: component.params.disabled,
                        },
                        validators,
                        asyncValidators,
                    );

                    if (component.alwaysNew?.saveValue && this.formDataStorage[component.params.name]) {
                        this.allControls[component.params.name].setValue(this.formDataStorage[component.params.name]);
                        this.allControls[component.params.name].markAsTouched();
                    }
                }

                controls[component.params.name] = this.allControls[component.params.name];
            }

            if (component.params.locked) {
                this.locked.push(component.params.name);
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

                if (!!value) {
                    control.setValue(value);
                }

                if (_includes(this.locked, key)) {
                    if (value) {
                        control.disable();
                    } else {
                        control.enable();
                    }
                }
            });

            this.initialFormValues = this.form.getRawValue();
            this.cdr.markForCheck();
        });
    }

    private getValidator(
        validatorSettings: string | IValidatorSettings,
        asyncValidators: AsyncValidatorFn[],
        validators: ValidatorFn[],
    ): void {

        let validationRule: IValidatorListItem;

        if (_isObject(validatorSettings)) {
            validationRule = _clone(this.validationService.getValidator(validatorSettings.name));
            validationRule.validator = validationRule.validator(validatorSettings.options);
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

            if (key === '0' && this.controls['registrationPromoCode']) {
                this.controls['registrationPromoCode'].setErrors({promocode: true});
            }

            const control: FormControl = this.controls[key];
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
