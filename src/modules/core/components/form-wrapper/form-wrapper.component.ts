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
} from 'wlc-engine/modules/core';

import {
    assign as _assign,
    merge as _merge,
    find as _find,
    isObject as _isObject,
    each as _each,
    get as _get,
    includes as _includes,
    clone as _clone,
    some as _some,
    isArray as _isArray,
    set as _set,
} from 'lodash-es';

export interface IControls extends IIndexing<FormControl> {
}

export interface IGlobalValidators {
    validators: ValidatorFn[];
    asyncValidators: AsyncValidatorFn[];
}

export interface IFormComponent {
    name: string;
    params: IInputCParams | ITextareaCParams | ISelectCParams | IButtonCParams | any;
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

    public $params: IFormWrapperCParams;
    public form: FormGroup;
    private controls: IControls;
    private globalValidators:IGlobalValidators;

    private locked: string[] = [];

    constructor(
        ConfigService: ConfigService,
        layoutService: LayoutService,
        protected cdr: ChangeDetectorRef,
        transition: TransitionService,
        injector: Injector,
        uiRouter: UIRouterGlobals,
        eventService: EventService,
        @Inject('injectParams') protected params: IFormWrapperCParams,
        protected validationService: ValidationService,
        protected elRef: ElementRef,
    ) {
        super(
            ConfigService,
            layoutService,
            cdr,
            transition,
            injector,
            uiRouter,
            eventService,
            params,
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
        if (this.beforeSubmit) {
            if (!this.beforeSubmit(this.form)) {
                return;
            }
        }

        if (this.form.valid) {
            if (await this.ngSubmit(this.form)) {
                this.form.controls.currentPassword.setValue('');
                this.form.markAsPristine();
                this.form.markAsUntouched();
            }
        } else {
            _each(this.form.controls, (control) => {
                control.markAsTouched();
            });

            _some(this.config.components, (component) => {
                if (!!component.params.control?.errors) {
                    this.elRef.nativeElement.querySelector(`#${component.params.name}`).focus();
                }

                return !!component.params.control?.errors;
            });

            if (this.hasRequiredError) {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        title: gettext('Error filling form'),
                        message: gettext('Fill required fields'),
                        wlcElement: 'notifiсation_form-filling-error',
                    },
                });
            } else if (this.hasAnyError) {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        title: gettext('Error filling form'),
                        message: gettext('Check the correctness of filling out the form fields'),
                        wlcElement: 'notifiсation_form-fields-error',
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

        this.dataSubscription();
    }

    private prepareComponents(components: IFormComponent[]): void {
        this.controls = {};

        _each(components, component => {

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
                text: 'The field must be no more than 50 characters long',
                options: 50,
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
                    this.controls[field] = new FormControl(
                        {
                            value: _get(this.formData?.value, field, ''),
                            disabled: component.params.disabled,
                        },
                        validators,
                        asyncValidators,
                    );

                    if (component.params.locked) {
                        this.locked.push(field);
                    }
                });
            } else {
                this.controls[component.params.name] = new FormControl(
                    {
                        value: _get(this.formData?.value, component.params.name, component.params.value) || '',
                        disabled: component.params.disabled,
                    },
                    validators,
                    asyncValidators,
                );
            }

            if (component.params.locked) {
                this.locked.push(component.params.name);
            }
        });
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
                control.setValue(value);

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
