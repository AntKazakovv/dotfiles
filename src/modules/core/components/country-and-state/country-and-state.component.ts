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


@Component({
    selector: '[wlc-country-and-state]',
    templateUrl: './country-and-state.component.html',
    styleUrls: ['./styles/country-and-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryAndStateComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ICountryAndStateCParams;
    public $params: Params.ICountryAndStateCParams;

    public showState: boolean = false;
    protected states: IIndexing<IState[]> = {};

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICountryAndStateCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.provideParams();
        this.setListeners();
        this.checkUserData();
    }

    protected provideParams(): void {
        this.$params.countryCode['theme'] = this.$params.theme;
        this.$params.stateCode['theme'] = this.$params.theme;
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

        this.$params.countryCode.control.statusChanges
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
        this.cdr.detectChanges();
    }
}
