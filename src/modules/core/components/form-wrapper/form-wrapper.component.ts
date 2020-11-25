import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    Input,
    OnInit,
} from '@angular/core';
import {AsyncValidatorFn, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {TransitionService, UIRouterGlobals} from '@uirouter/core';
import {ConfigService} from 'wlc-engine/modules/core';
import {IWrapperCParams, WrapperComponent} from 'wlc-engine/modules/core/components/wrapper/wrapper.component';
import {
    EventService,
    LayoutService,
    ValidationService,
} from 'wlc-engine/modules/core/services';
import {
    IValidatorListItem,
    IValidatorSettings,
    ValidatorType,
} from 'wlc-engine/modules/core/services/validation/validation.service';
import {IInputCParams} from 'wlc-engine/modules/core/components/input/input.params';
import {ITextareaCParams} from 'wlc-engine/modules/core/components/textarea/textarea.params';
import {ISelectParams} from 'wlc-engine/modules/core/components/select/select.params';
import {IButtonParams} from 'wlc-engine/modules/core/components/button/button.params';

import {
    assign as _assign,
    merge as _merge,
    isObject as _isObject,
    forEach as _forEach,
} from 'lodash';

export interface IControls {
    [key: string]: FormControl;
}

export interface IGlobalValidators {
    validators: ValidatorFn[];
    asyncValidators: AsyncValidatorFn[];
}

export interface IFormComponent {
    name: string;
    params:  IInputCParams | ITextareaCParams | ISelectParams | IButtonParams | any;
}

export interface IFormWrapperCParams extends IWrapperCParams {
    components: IFormComponent[];
    validators?: ValidatorType[];
}

@Component({
    selector: '[wlc-form-wrapper]',
    templateUrl: './form-wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormWrapperComponent extends WrapperComponent implements OnInit {
    @Input() public ngSubmit: unknown;
    @Input() private config: IFormWrapperCParams;

    public form: FormGroup;
    private controls: IControls = {};
    private globalValidators = {
        validators: [],
        asyncValidators: [],
    };

    constructor(
        ConfigService: ConfigService,
        layoutService: LayoutService,
        cdr: ChangeDetectorRef,
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

    public getInjector(component: any): Injector {

        _assign(component.params, {
            control: this.form?.controls[component.params.name],
        });

        return super.getInjector(component);
    }

    private initForm() {

        _forEach(this.params.components, component => {
            const validators: ValidatorFn[] = [];
            const asyncValidators: AsyncValidatorFn[] = [];

            _forEach(component.params.validators, validator => {
                const validationRule = this.getValidator(validator);

                if (validationRule.async) {
                    asyncValidators.push(validationRule.validator);
                } else {
                    validators.push(validationRule.validator);
                }
            });

            this.controls[component.params.name] = new FormControl(
                component.params.value || '',
                validators,
                asyncValidators,
            );
        });

        _forEach(this.params.validators, validator => {
            const validationRule = this.getValidator(validator);

            if (validationRule.async) {
                this.globalValidators.asyncValidators.push(validationRule.validator);
            } else {
                this.globalValidators.validators.push(validationRule.validator);
            }
        });

        this.form = new FormGroup(this.controls, this.globalValidators);
    }

    private getValidator(validatorSettings: string | IValidatorSettings): IValidatorListItem {
        if (_isObject(validatorSettings)) {
            const changeValidator = this.validationService.getValidator(validatorSettings.name);
            changeValidator.validator = changeValidator.validator(validatorSettings.options);
            return changeValidator;
        }
        return this.validationService
            .getValidator(validatorSettings);
    }

    private prepareParams(): void {
        this.params = _merge(this.config, this.params);
    }
}
