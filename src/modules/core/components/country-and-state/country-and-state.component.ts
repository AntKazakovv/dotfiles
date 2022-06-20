import {BehaviorSubject} from 'rxjs';
import {
    distinctUntilChanged,
    takeUntil,
} from 'rxjs/operators';

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    ConfigService,
    IIndexing,
    IState,
} from 'wlc-engine/modules/core';

import {UserProfile} from 'wlc-engine/modules/user';
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
    protected states: IIndexing<IState[]>;

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
        this.checkUserData();
        this.setListeners();
    }

    protected provideParams(): void {
        this.$params.countryCode['theme'] = this.$params.theme;
        this.$params.stateCode['theme'] = this.$params.theme;
    }

    protected checkUserData(): void {

        const userProfile: UserProfile =
            this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$').getValue();

        if (userProfile?.countryCode) {
            this.updateStates(
                this.configService.get<BehaviorSubject<IIndexing<IState[]>>>('states')
                    ?.getValue()[userProfile.countryCode],
            );
        }

    }

    protected setListeners(): void {
        this.$params.countryCode.control.valueChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.$destroy),
            )
            .subscribe((countryCode: string) => {
                this.$params.stateCode.control.setValue('');
                const selectedCountryStates: IState[] =
                    this.configService.get<BehaviorSubject<IIndexing<IState[]>>>('states')?.getValue()[countryCode];
                this.updateStates(selectedCountryStates);
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

    protected updateStates(states: IState[]): void {
        if (states?.length) {
            this.configService.get<BehaviorSubject<IState[]>>('countryStates')
                .next(states);
            this.showState = true;
        } else {
            this.showState = false;
        }
        this.cdr.markForCheck();
    }
}
