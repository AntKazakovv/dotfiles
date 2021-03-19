import {
    ChangeDetectionStrategy,
    Component, Inject,
    Input,
    OnInit,
    ChangeDetectorRef,
} from '@angular/core';
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
import {ITournamentConditionCParams} from './components/tournament-condition/tournament-condition.params';
import {TournamentDetailComponent} from './components/tournament-detail/tournament-detail.component';
import * as Params from 'wlc-engine/modules/tournaments/components/tournament/tournament.params';
import {
    skipWhile,
    takeUntil,
} from 'rxjs/operators';

import {
    union as _union,
} from 'lodash-es';

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

    protected userInfo: UserInfo;

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentCParams,
        protected modalService: ModalService,
        protected tournamentsService: TournamentsService,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected userService: UserService,
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
        this.getUserInfo();
    }

    public getDashboardImage(): string {
        return this.tournament.imageDashboard || '/gstatic/wlc/tournaments/tournament-decor.png';
    }

    public openDescription(): void {
        this.modalService.showModal({
            id: 'tournament-condition-modal',
            modifier: 'tournament-condition',
            component: TournamentDetailComponent,
            componentParams: <ITournamentDetailCParams>{
                common: {
                    tournamentId: this.tournament.id,
                },
            },
            size: 'xl',
            backdrop: 'static',
        });

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
            gettext('Unsubscribe'),
            gettext('Tournament fee will not be returned to your account. Are you sure you want to unsubscribe?'),
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

    protected checkSubscribeConditions(tournament: Tournament): void {
        if (tournament.feeAmount === 0) {
            this.joinTournament();
            return;
        } else if (tournament.feeType === 'balance' && this.userInfo?.balance >= tournament.feeAmount) {
            this.showConditionModal(
                tournament,
                this.userInfo?.balance,
                gettext('Subscribe'),
                gettext('Let\'s play?'),
                'join',
            );

            return;
        } else if (tournament.feeType === 'loyalty' && this.userInfo?.points >= tournament.feeAmount) {
            this.showConditionModal(
                tournament,
                this.userInfo?.points,
                gettext('Subscribe'),
                gettext('Let\'s play?'),
                'join',
            );

            return;
        } else if (tournament.feeType === 'balance' && this.userInfo?.balance < tournament.feeAmount) {
            this.showConditionModal(
                tournament,
                this.userInfo?.balance,
                gettext('You can`t subscribe'),
                gettext('Sorry, not today. Deposit more money and join this tournament!'),
                'deposit',
            );

            return;
        } else if (tournament.feeType === 'loyalty' && this.userInfo?.points < tournament.feeAmount) {
            this.showConditionModal(
                tournament,
                this.userInfo?.points,
                gettext('You can`t subscribe'),
                gettext('Sorry, not today. Deposit more money and join this tournament!'),
                'deposit',
            );

            return;
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
        const tournament = await this.tournamentsService.joinTournament(this.tournament);
        if (tournament) {
            this.tournament = tournament;
            this.cdr.markForCheck();
        }
    }

    protected async leaveTournament(): Promise<void> {
        const tournament = await this.tournamentsService.leaveTournament(this.tournament);
        if (tournament) {
            this.tournament = tournament;
            this.cdr.markForCheck();
        }
    }
}
