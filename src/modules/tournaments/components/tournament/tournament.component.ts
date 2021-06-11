import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectorRef,
} from '@angular/core';

import {UIRouter} from '@uirouter/core';

import {BehaviorSubject} from 'rxjs';
import {
    skipWhile,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    GlobalHelper,
    IMixedParams,
    ConfigService,
    ModalService,
} from 'wlc-engine/modules/core';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {
    Tournament,
    TournamentsService,
    ITournamentDetailCParams,
} from 'wlc-engine/modules/tournaments';
import {TournamentConditionComponent} from './components/tournament-condition/tournament-condition.component';
import {TournamentDetailComponent} from './components/tournament-detail/tournament-detail.component';
import {ITournamentConditionCParams} from 'wlc-engine/modules/tournaments';
import {IActionParams} from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-promo/tournament-promo.params';

import * as Params from 'wlc-engine/modules/tournaments/components/tournament/tournament.params';

import _union from 'lodash-es/union';

@Component({
    selector: '[wlc-tournament]',
    templateUrl: './tournament.component.html',
    styleUrls: ['./styles/tournament.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentComponent
    extends AbstractComponent
    implements OnInit {

    @Input() public inlineParams: Params.ITournamentCParams;
    @Input() public type: Params.ComponentType;
    @Input() public theme: Params.ComponentTheme;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public customMod: Params.CustomMod;
    @Input() public tournament: Tournament;

    public $params: Params.ITournamentCParams;
    public isAuth: boolean;
    public isTournamentSelected: boolean;
    public instance: TournamentComponent;
    public pending$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public detailParams: ITournamentDetailCParams;
    public actionParams: IActionParams = null;

    protected userInfo: UserInfo;

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentCParams,
        protected modalService: ModalService,
        protected tournamentsService: TournamentsService,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected userService: UserService,
        protected router: UIRouter,
    ) {
        super(
            <IMixedParams<Params.ITournamentCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this,
            ['tournament', 'type', 'theme', 'themeMod', 'customMod']));
        this.prepareModifiers();

        if (this.$params?.tournament || this.$params?.common?.tournament) {
            this.tournament = this.$params.tournament || this.$params.common.tournament;
        }

        if (this.type) {
            this.$params.type = this.type;
        }

        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');
        this.isTournamentSelected = this.tournamentsService.isTournamentSelected;
        this.instance = this;

        if (this.type === 'active') {
            this.isTournamentSelected = true;
        }

        this.prepareActionParams();

        this.getUserInfo();
    }

    public getDashboardImage(): string {
        return this.tournament.imageDashboard || '/gstatic/wlc/tournaments/tournament-decor.png';
    }

    public join(): void {
        if (!this.isAuth) {
            this.modalService.showModal('signup');
            return;
        }
        this.checkSubscribeConditions(this.tournament);
    }

    public leave(): void {
        this.showConditionModal(
            undefined,
            undefined,
            undefined,
            gettext('Leave'),
            gettext('Tournament fee will not be returned to your account. Are you sure you want to leave?'),
            'leave',
        );
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customMod) {
            modifiers = _union(modifiers, this.$params.common.customMod.split(' '));
        }
        this.addModifiers(modifiers);
    }

    protected getUserInfo(): void {
        this.userService.userInfo$
            .pipe(
                skipWhile(v => !v),
                takeUntil(this.$destroy),
            )
            .subscribe((userInfo) => {
                this.userInfo = userInfo;
            });
    }

    protected showConditionModal(
        tournament: Tournament,
        userBalance: number,
        feeCurrency: string,
        modalTitle: string,
        modalMessage: string,
        actionType: string,
    ): void {
        this.modalService.showModal({
            id: 'tournament-condition-modal',
            modifier: 'tournament-condition',
            component: TournamentConditionComponent,
            componentParams: <ITournamentConditionCParams>{
                common: {
                    feeAmount: tournament?.feeAmount,
                    userBalance,
                    feeCurrency,
                    text: modalMessage,
                    actionType,
                },
            },
            modalTitle,
            size: 'md',
            backdrop: 'static',
            showFooter: true,
            textAlign: 'center',
            confirmBtnText: this.setConfirmBtnText(actionType),
            showConfirmBtn: true,
            rejectBtnVisibility: false,
            onConfirm: () => {
                this.onConfirm(actionType);
            },
        });
    }

    public checkSubscribeConditions(tournament: Tournament): void {
        if (tournament.feeAmount === 0) {
            this.joinTournament();
        } else if (tournament.feeType === 'balance' && this.userInfo?.realBalance >= tournament.feeAmount) {
            this.showConditionModal(
                tournament,
                this.userInfo?.realBalance,
                tournament.feeCurrency,
                gettext('Subscribe'),
                gettext('Let\'s play?'),
                'join',
            );
        } else if (tournament.feeType === 'loyalty' && +this.userInfo?.loyalty.Balance >= tournament.feeAmount) {
            this.showConditionModal(
                tournament,
                +this.userInfo?.loyalty.Balance,
                tournament.feeCurrency,
                gettext('Subscribe'),
                gettext('Let\'s play?'),
                'join',
            );
        } else if (tournament.feeType === 'balance' && this.userInfo?.realBalance < tournament.feeAmount) {
            this.showConditionModal(
                tournament,
                this.userInfo?.realBalance,
                tournament.feeCurrency,
                gettext('You can`t subscribe'),
                gettext('Sorry, not today. Deposit more money and join this tournament!'),
                'deposit',
            );
        } else if (tournament.feeType === 'loyalty' && +this.userInfo?.loyalty.Balance < tournament.feeAmount) {
            this.showConditionModal(
                tournament,
                +this.userInfo?.loyalty.Balance,
                tournament.feeCurrency,
                gettext('You can`t subscribe'),
                gettext('Sorry, not today. Bet more to earn bitcoins and join this tournament!'),
                'deposit',
            );
        }
    }

    public readMore(actionParams: IActionParams, selector: string): void {
        if (actionParams.modal) {
            this.showDetailModal(selector);
        } else if (actionParams.url) {
            this.goTo(actionParams);
        }
    }

    protected onConfirm(actionType: string): void {
        switch (actionType) {
            case 'join':
                this.joinTournament();
                break;
            case 'leave':
                this.leaveTournament();
                break;
            case 'deposit':
                return;
        }
    }

    protected setConfirmBtnText(actionType: string): string {
        switch (actionType) {
            case 'join':
                return gettext('Let\'s play!');
            case 'leave':
                return gettext('Leave');
            case 'deposit':
                return gettext('Ok!');
        }
    }

    protected async joinTournament(): Promise<void> {
        try {
            this.isTournamentSelected = false;
            this.pending$.next(true);

            const tournament = await this.tournamentsService.joinTournament(this.tournament);

            if (tournament) {
                this.tournament = tournament;
                this.cdr.markForCheck();
            }
        } finally {
            this.isTournamentSelected = true;
            this.pending$.next(false);
            this.cdr.markForCheck();
        }
    }

    protected async leaveTournament(): Promise<void> {
        try {
            this.pending$.next(true);

            const tournament = await this.tournamentsService.leaveTournament(this.tournament);

            if (tournament) {
                this.tournament = tournament;
                this.cdr.markForCheck();
                this.cdr.detectChanges();
            }
        } finally {
            this.isTournamentSelected = false;
            this.pending$.next(false);
            this.cdr.markForCheck();
        }
    }

    protected showDetailModal(scrollToSelector): void {
        this.modalService.showModal({
            id: 'tournament-detail-modal',
            modifier: 'tournament-detail',
            component: TournamentDetailComponent,
            componentParams: <ITournamentDetailCParams>{
                parentInstance: this.instance,
                common: {
                    tournament: this.tournament,
                    scrollToSelector,
                },
            },
            size: 'xl',
        });
    }

    protected goTo(actionParams: IActionParams): void {
        this.router.stateService.go(actionParams.url.path, actionParams.url.params);
    }

    protected prepareActionParams(): void {
        this.actionParams = {
            url: {
                path: 'app.profile.loyalty-tournaments.detail',
                params: {tournamentId: this.tournament.id},
            },
            selector: '.wlc-tournament-detail__prizepool',
        };
    }
}
