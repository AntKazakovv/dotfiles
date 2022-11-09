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
    ValidationService,
} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './country-and-state.params';

@Component({
    selector: '[wlc-country-and-state]',
    templateUrl: './country-and-state.component.html',
    styleUrls: ['./styles/country-and-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: 'requiredValidator',
            useFactory: (validationService: ValidationService): ValidatorFn => {
                return validationService.getValidator('required').validator;
            },
            deps: [ValidationService],
        },
    ],
})
export class CountryAndStateComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ICountryAndStateCParams;
    public $params: Params.ICountryAndStateCParams;

    public showState: boolean = false;
    protected states: IIndexing<IState[]> = {};
    protected stateStartRequired: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICountryAndStateCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        @Inject('requiredValidator') protected requiredValidator: ValidatorFn,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.provideParams();
        this.setListeners();
        this.checkUserData();
    }

    protected get stateHasRequired(): boolean {
        return this.$params.stateCode.control.hasValidator(this.requiredValidator);
    }

    protected provideParams(): void {
        this.$params.countryCode['theme'] = this.$params.theme;
        this.$params.stateCode['theme'] = this.$params.theme;
        this.stateStartRequired = this.stateHasRequired;
    }

    protected checkUserData(): void {
        if (this.$params.countryCode.control?.value) {
            this.updateStates(this.$params.countryCode.control.value);
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
            });

        merge(
            this.$params.countryCode.control.statusChanges,
            this.$params.stateCode.control.valueChanges,
        )
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.$destroy),
            )
            .subscribe((): void => {
                this.cdr.markForCheck();
            });
    }

    protected updateStates(countryCode: string): void {
        const states = this.states[countryCode];
        if (states?.length) {
            this.configService
                .get<BehaviorSubject<IState[]>>('countryStates')
                .next(states);
            this.showState = true;
        } else {
            this.showState = false;
        }
        this.toggleStateRequired();
        this.cdr.detectChanges();
    }

    protected toggleStateRequired(): void {
        if (!this.stateStartRequired) {
            return;
        }
        const hasRequired = this.stateHasRequired;

        if (this.showState && !hasRequired) {
            this.$params.stateCode.control.addValidators(this.requiredValidator);
        } else if (!this.showState && hasRequired) {
            this.$params.stateCode.control.removeValidators(this.requiredValidator);
        }
    }
}
