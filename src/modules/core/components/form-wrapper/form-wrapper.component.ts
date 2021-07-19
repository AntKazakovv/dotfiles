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
import {BehaviorSubject} from 'rxjs';
import {takeWhile} from 'rxjs/operators';

import {
    EventService,
    LayoutService,
    ValidationService,
    ConfigService,
    WrapperComponent,
    IWrapperCParams,
    IValidatorListItem,
    IValidatorSettings,
    ValidatorType,
    IInputCParams,
    ITextareaCParams,
    ISelectCParams,
    IButtonCParams,
    IIndexing,
    IPushMessageParams,
    NotificationEvents,
    InjectionService,
} from 'wlc-engine/modules/core';

import _assign from 'lodash-es/assign';
import _each from 'lodash-es/each';
import _isObject from 'lodash-es/isObject';
import _merge from 'lodash-es/merge';
import _find from 'lodash-es/find';
import _get from 'lodash-es/get';
import _includes from 'lodash-es/includes';
import _clone from 'lodash-es/clone';
import _isUndefined from 'lodash-es/isUndefined';
import _isArray from 'lodash-es/isArray';
import _set from 'lodash-es/set';

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
    @Input() private beforeSubmit: (form: FormGroup) => boolean;
    @Input() private config: IFormWrapperCParams;
    @Input() private formData: BehaviorSubject<IIndexing<any>>;

    @Output() public form$ = new EventEmitter<FormGroup>();

    public $params: IFormWrapperCParams;
    public form: FormGroup;
    private controls: IControls = {};
    private allControls: IControls = {};
    private globalValidators: IGlobalValidators;
    private formDataStorage: IIndexing<any> = {};

    private locked: string[] = [];

    constructor(
        @Inject('injectParams') protected params: IFormWrapperCParams,
        ConfigService: ConfigService,
        layoutService: LayoutService,
        transition: TransitionService,
        injector: Injector,
        uiRouter: UIRouterGlobals,
        eventService: EventService,
        protected validationService: ValidationService,
        protected elRef: ElementRef,
        protected cdr: ChangeDetectorRef,
        protected injectionService: InjectionService,
    ) {
        super(
            params,
            ConfigService,
            layoutService,
            cdr,
            transition,
            injector,
            uiRouter,
            eventService,
            injectionService,
        );
    }

    public async ngOnInit() {
        this.prepareParams();
        this.initForm();

        super.ngOnInit();
    }

    // Don't delete this because without it the app will crash
    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    public ngOnChanges(changes: SimpleChanges): void {
        if (this.form && changes.config) {
            this.formDataStorage = _assign({}, this.formDataStorage, this.form.value);
            this.controls = {};
            this.ngOnInit();
        }
    }

    public getInjector(component: any): Injector {

        if (component.params.components) {
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
        if (this.beforeSubmit && !this.beforeSubmit(this.form)) {
            return;
        }

        if (this.form.valid) {
            if (await this.ngSubmit(this.form)) {
                this.form.controls.currentPassword.setValue('');
                this.form.markAsPristine();
                this.form.markAsUntouched();
            }
        } else {
            let errorFound = false;

            for (const controlName in this.form.controls) {
                const control = this.form.controls[controlName];
                control.markAsTouched();
                control.updateValueAndValidity();

                if (!errorFound && control.errors) {
                    this.elRef.nativeElement.querySelector(`#${controlName}`)?.focus();
                    errorFound = true;
                }
            }

            if (this.form.pending) {
                await this.form.statusChanges
                    .pipe(takeWhile((status) => status === 'PENDING'))
                    .toPromise();
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
            } else if (this.hasAnyError) {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        title: gettext('Error filling form'),
                        message: gettext('Check the correctness of filling out the form fields'),
                        wlcElement: 'notification_form-fields-error',
                    },
                });
            }
        }
        this.cdr.detectChanges();
    }

    protected get hasRequiredError(): boolean {
        return !!_find(this.controls, (control) => control.errors?.required);
    }

    protected get hasAnyError(): boolean {
        return !!_find(this.controls, (control) => !!control.errors);
    }

    protected prepareParams(): void {
        this.$params = _merge(this.config, this.params);
    }

    private initForm(): void {

        this.prepareComponents(this.$params.components);
        this.prepareValidators();

        this.form = new FormGroup(this.controls, this.globalValidators);
        this.form$.emit(this.form);

        this.dataSubscription();
    }

    private prepareComponents(components: IFormComponent[]): void {
        const controls = {};
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
                    component.params.validators.push(tagReg, maxLength, emojiReg);
                    break;
                case 'core.wlc-textarea':
                    component.params.validators.push(tagReg, emojiReg);
                    break;
                default:
                    break;
            }

            _each(component.params.validators, (validator) => {
                const validationRule = this.getValidator(validator);
                if (!validationRule) {
                    console.error('Validator not found: ', validator);
                    return;
                }

                if (validationRule?.async) {
                    asyncValidators.push(validationRule.validator);
                } else {
                    validators.push(validationRule.validator);
                }
            });

            if (_isArray(component.params.name)) {
                _each(component.params.name, (field: string) => {

                    if (!this.allControls[field] || component.alwaysNew) {
                        this.allControls[field] = new FormControl(
                            {
                                value: _get(this.formData?.value, field, ''),
                                disabled: component.params.disabled,
                            },
                            validators,
                            asyncValidators,
                        );

                        if (component.alwaysNew?.saveValue && this.formDataStorage[field]) {
                            this.allControls[field].setValue(this.formDataStorage[field]);
                            this.allControls[field].markAsTouched();
                        }
                    }

                    controls[field] = this.allControls[field];

                    if (component.params.locked) {
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
            const validationRule = this.getValidator(validator);

            if (!validationRule) {
                console.error('Validator not found: ', validator);
                return;
            }

            if (validationRule?.async) {
                this.globalValidators.asyncValidators.push(validationRule.validator);
            } else {
                this.globalValidators.validators.push(validationRule.validator);
            }
        });
    }

    private dataSubscription(): void {
        this.formData?.subscribe((data) => {
            _each(this.form.controls, (control, key) => {
                const value = _get(data, key);
                if (!_isUndefined(value)) {
                    control.setValue(value);
                }

                if (_includes(this.locked, key) && value) {
                    control.disable();
                }
            });
            this.cdr.markForCheck();
        });
    }

    private getValidator(validatorSettings: string | IValidatorSettings): IValidatorListItem {
        if (_isObject(validatorSettings)) {
            const changeValidator = _clone(this.validationService.getValidator(validatorSettings.name));
            changeValidator.validator = changeValidator.validator(validatorSettings.options);

            return changeValidator;
        }
        return this.validationService.getValidator(validatorSettings);
    }
}
