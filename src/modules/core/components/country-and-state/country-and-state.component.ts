import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {ValidatorFn} from '@angular/forms';

import {
    BehaviorSubject,
    EMPTY,
    merge,
} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    takeUntil,
} from 'rxjs/operators';
import _isEmpty from 'lodash-es/isEmpty';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isObject from 'lodash-es/isObject';

import {
    ConfigService,
    IIndexing,
    IInputCParams,
    IState,
    IValidatorListItem,
    ValidationService,
    ValidatorType,
} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import * as Params from './country-and-state.params';

const listCountryForCpfFields: string[] = ['bra', 'rou'];

/**
 * @description Using cpf field requires `$base.profile.autoFields.cpf.use` setting to be `true` (`false` by default)
 * @description By default in profile: cpf required, stateCode - not required
 * @example
 * <IFormComponent>{
        name: 'core.wlc-country-and-state',
        params: {
            name: ['countryCode', 'stateCode', 'cpf'],
            locked: ['countryCode', 'cpf'],
            validatorsField: [
                {
                    name: 'countryCode',
                    validators: 'required',
                },
            ],
        },
    }
 * @description In profile with all required
 * @example
 * <IFormComponent>{
        name: 'core.wlc-country-and-state',
        params: {
            name: ['countryCode', 'stateCode', 'cpf'],
            locked: ['countryCode', 'stateCode', 'cpf'],
            validatorsField: [
                {
                    name: 'countryCode',
                    validators: 'required',
                },
                {
                    name: 'stateCode',
                    validators: 'required',
                },
            ],
        },
    }
 * @description Use in registration with all required and NO StateCode
 * @example
* <IFormComponent>{
        name: 'core.wlc-country-and-state',
        params: {
            name: ['countryCode', 'cpf'],
            locked: ['countryCode', 'cpf'],
            validatorsField: [
                {
                    name: 'countryCode',
                    validators: 'required',
                },
            ],
        },
    }
 */
@Component({
    selector: '[wlc-country-and-state]',
    templateUrl: './country-and-state.component.html',
    styleUrls: ['./styles/country-and-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryAndStateComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ICountryAndStateCParams;
    public override $params: Params.ICountryAndStateCParams;

    public showState: boolean = false;
    public showCpf: boolean = false;
    protected states: IIndexing<IState[]> = {};
    protected useCpf: boolean = false;
    protected defaultCpfParams: IInputCParams;
    protected defaultCnpParams: IInputCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICountryAndStateCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
        protected validationService: ValidationService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.defaultCpfParams = this.$params.cpf;
        this.defaultCnpParams = this.$params.cnp;

        if (this.configService.get<boolean>('$base.profile.autoFields.cpf.use')
            || this.configService.get<string>('appConfig.license') === 'romania'
        ) {
            this.useCpf = true;
        }

        this.provideParams();
        this.setListeners();
        this.checkUserData();
    }

    protected provideParams(): void {
        this.$params.countryCode['theme'] = this.$params.theme;
        this.$params.stateCode['theme'] = this.$params.theme;
        this.$params.cpf['theme'] = this.$params.theme;

        this.$params.stateCode.control?.disable();
        this.$params.cpf.control?.disable();
    }

    protected checkUserData(): void {
        if (this.$params.countryCode.control?.value) {
            this.updateStates(this.$params.countryCode.control.value);
            this.updateCpf(this.$params.countryCode.control.value);
        }
    }

    protected setListeners(): void {
        this.configService.get<BehaviorSubject<IIndexing<IState[]>>>('states')
            .pipe(
                filter((states) => !_isEmpty(states)),
                takeUntil(this.$destroy),
            )
            .subscribe((states) => {
                this.states = states;
                this.updateStates(this.$params.countryCode.control.value);
            });

        this.$params.countryCode.control.valueChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.$destroy),
            )
            .subscribe((countryCode: string) => {
                this.updateStates(countryCode);
                this.updateCpf(countryCode);
            });

        this.$params.cpf.control.statusChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.$destroy),
            )
            .subscribe(() => {
                if (!this.showCpf && this.$params.cpf.control.enabled) {
                    this.toggleFieldRequired('cpf', this.showCpf);
                }
            });

        if (this.$params.stateCode.control || (this.$params.cpf.control && this.useCpf)) {
            merge(
                this.$params.countryCode.control.statusChanges,
                this.$params.stateCode.control?.valueChanges || EMPTY,
                this.useCpf ? this.$params.cpf.control?.valueChanges : EMPTY,
            )
                .pipe(
                    distinctUntilChanged(),
                    takeUntil(this.$destroy),
                )
                .subscribe((): void => {
                    this.cdr.markForCheck();
                });
        }

        this.$params.cpf.control.statusChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.$destroy),
            )
            .subscribe(() => {
                if (!this.showCpf && this.$params.cpf.control.enabled) {
                    this.toggleFieldRequired('cpf', this.showCpf);
                }
            });
    }

    protected updateStates(countryCode: string): void {
        if (!this.$params.stateCode.control) {
            return;
        }

        const states = this.states[countryCode];
        if (states?.length) {
            this.configService
                .get<BehaviorSubject<IState[]>>('countryStates')
                .next(states);
            this.showState = true;
        } else {
            this.showState = false;
        }
        this.toggleFieldRequired('stateCode', this.showState);
        this.cdr.detectChanges();
    }

    protected updateCpf(countryCode: string): void {
        if (this.useCpf && this.$params.cpf.control) {
            this.showCpf = listCountryForCpfFields.includes(countryCode);

            if (this.showCpf) {
                const formControl = this.$params.cpf.control;

                if (countryCode === 'bra' && this.configService.get<boolean>('$base.profile.autoFields.cpf.use')) {
                    this.$params.cpf = _cloneDeep(this.defaultCpfParams);
                } else if (countryCode === 'rou' && this.configService.get<string>('appConfig.license') === 'romania') {
                    this.$params.cpf = _cloneDeep(this.defaultCnpParams);
                }

                this.$params.cpf.control = formControl;
                this.$params.cpf.control.clearValidators();
                this.$params.cpf.control.setValidators(this.getValidators(this.$params.cpf.validators));
                this.$params.cpf.control.updateValueAndValidity({emitEvent: false});
            }

            this.toggleFieldRequired('cpf', this.showCpf);
            this.cdr.markForCheck();
        }
    }

    protected getValidators(validators: ValidatorType[]): ValidatorFn[] {
        const listValidators: ValidatorFn[] = [];
        validators.forEach((validator: ValidatorType) => {
            let validationRule: IValidatorListItem;
            if (_isObject(validator)) {
                validationRule = _cloneDeep(this.validationService.getValidator(validator.name));
                validationRule.validator = validationRule.validator(validator.options);
            } else {
                validationRule = this.validationService.getValidator(validator);
            }
            listValidators.push(validationRule.validator);
        });

        return listValidators;
    }

    protected toggleFieldRequired(field: Params.TDependentFields, show: boolean): void {
        const control = this.$params[field].control;

        if (!control) {
            return;
        }

        if (show) {
            if ((!control.value && control.disabled) || this.$params[field].locked === false) {
                control.enable();
            }
        } else {
            control.patchValue('', {emitEvent: false});
            control.disable();
        }
    }
}
