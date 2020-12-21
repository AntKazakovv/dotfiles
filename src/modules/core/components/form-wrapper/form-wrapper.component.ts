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
    ISelectParams,
    IButtonParams,
    IIndexing,
} from 'wlc-engine/modules/core';

import {
    assign as _assign,
    merge as _merge,
    isObject as _isObject,
    each as _each,
    get as _get,
    includes as _includes,
    isUndefined as _isUndefined,
    clone as _clone,
} from 'lodash';

export interface IControls extends IIndexing<FormControl>{
}

export interface IGlobalValidators {
    validators: ValidatorFn[];
    asyncValidators: AsyncValidatorFn[];
}

export interface IFormComponent {
    name: string;
    params: IInputCParams | ITextareaCParams | ISelectParams | IButtonParams | any;
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
    @Input() private config: IFormWrapperCParams;
    @Input() private formData: BehaviorSubject<IIndexing<any>>;

    public $params: IFormWrapperCParams;
    public form: FormGroup;
    private controls: IControls = {};
    private globalValidators = {
        validators: [],
        asyncValidators: [],
    };

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

    public ngOnChanges(changes: SimpleChanges): void {
    }

    public getInjector(component: any): Injector {

        _assign(component.params, {
            control: this.form?.controls[component.params.name],
        });

        return super.getInjector(component);
    }

    public async submit(): Promise<void> {
        if (this.form.valid) {
            if (await this.ngSubmit(this.form)) {
                this.form.markAsPristine();
                this.form.markAsUntouched();
            }
        } else {
            _each(this.form.controls, (control) => {
                control.markAsTouched();
            });
            this.cdr.markForCheck();
        }
    }

    protected prepareParams(): void {
        this.$params = _merge(this.config, this.params);
    }

    private initForm(): void {

        this.prepareComponents();
        this.prepareValidators();

        this.form = new FormGroup(this.controls, this.globalValidators);

        this.dataSubscription();
    }

    private prepareComponents(): void {
        _each(this.$params.components, component => {

            if (!component.params?.name) { return; }

            const validators: ValidatorFn[] = [];
            const asyncValidators: AsyncValidatorFn[] = [];

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

            this.controls[component.params.name] = new FormControl(
                {
                    value: _get(this.formData?.value, component.params.name) || component.params.value || '',
                    disabled: component.params.disabled,
                },
                validators,
                asyncValidators,
            );

            if (component.params.locked) {
                this.locked.push(component.params.name);
            }
        });
    }

    private prepareValidators(): void {
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
        });
    }

    private getValidator(validatorSettings: string | IValidatorSettings): IValidatorListItem {
        if (_isObject(validatorSettings)) {
            const changeValidator = _clone(this.validationService.getValidator(validatorSettings.name));
            changeValidator.validator = changeValidator.validator(validatorSettings.options);

            return changeValidator;
        }
        return this.validationService
            .getValidator(validatorSettings);
    }
}
