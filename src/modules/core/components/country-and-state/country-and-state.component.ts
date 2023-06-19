import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

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

import {
    ConfigService,
    IIndexing,
    IState,
} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './country-and-state.params';


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
                {
                    name: 'cpf',
                    validators: ['required', FormValidators.cpf],
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
                {
                    name: 'cpf',
                    validators: ['required', FormValidators.cpf],
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
                {
                    name: 'cpf',
                    validators: ['required', FormValidators.cpf],
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
    protected useCpf: boolean = this.configService.get<boolean>('$base.profile.autoFields.cpf.use');

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICountryAndStateCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
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
            this.showCpf = countryCode === 'bra';
            this.toggleFieldRequired('cpf', this.showCpf);
            this.cdr.markForCheck();
        }
    }

    protected toggleFieldRequired(field: Params.TDependentFields, show: boolean): void {
        const control = this.$params[field].control;

        if (!control) {
            return;
        }

        if (show) {
            if (!control.value && control.disabled) {
                control.enable();
            }
        } else {
            control.patchValue('', {emitEvent: false});
            control.disable();
        }
    }
}
