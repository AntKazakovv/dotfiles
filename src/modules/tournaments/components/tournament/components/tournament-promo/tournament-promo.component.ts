import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {
    AbstractComponent,
    ConfigService,
    GlobalHelper,
    IMixedParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';

import {
    Tournament,
    TournamentsService,
} from 'wlc-engine/modules/tournaments';

import {TournamentPrizesComponent} from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-prizes/tournament-prizes.component';
import {TournamentConditionComponent} from '../tournament-condition/tournament-condition.component';

import {
    ITournamentPrizesCParams,
    PRIMARY_ROW_LIMIT,
} from '../tournament-prizes/tournament-prizes.params';

import * as Params
    from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-promo/tournament-promo.params';
import {takeUntil} from 'rxjs/operators';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {ITournamentConditionCParams} from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-condition/tournament-condition.params';

@Component({
    selector: '[wlc-tournament-promo]',
    templateUrl: './tournament-promo.component.html',
    styleUrls: ['./styles/tournament-promo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentPromoComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.ITournamentPromoCParams;
    @Input() public type: Params.ComponentType;
    @Input() public theme: Params.ComponentTheme;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public customMod: Params.CustomMod;
    @Input() public tournament: Tournament;

    public $params: Params.ITournamentPromoCParams;
    public isTournamentSelected: boolean;
    public rowLimit: number = PRIMARY_ROW_LIMIT;
    public pending: boolean = false;

    protected isAuth: boolean = false;
    protected userInfo: UserInfo;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentPromoCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected tournamentsService: TournamentsService,
        protected userService: UserService,
    ) {
        super(
            <IMixedParams<Params.ITournamentPromoCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this,
            ['tournament', 'type', 'theme', 'themeMod', 'customMod']));

        this.isTournamentSelected = this.tournamentsService.isTournamentSelected;
        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');
        this.getUserInfo();
    }

    public setTag(): string {
        return this.tournament.selected ? 'Active' : this.tournament.isTournamentStarts ? 'Available' : 'Coming soon';
    }

    public setDecorImage(): string {
        return this.$params.common.tournament?.imagePromo || '/gstatic/wlc/tournaments/tournament-decor.png';
    }

    public showAllPrizes(tournament: Tournament): void {
        this.modalService.showModal({
            id: 'prizes-board',
            modifier: 'prizes-board',
            modalTitle: tournament.name,
            size: 'md',
            backdrop: 'static',
            showFooter: false,
            dismissAll: true,
            component: TournamentPrizesComponent,
            componentParams: <ITournamentPrizesCParams>{
                common: {
                    tournament,
                    rowLimit: tournament.winningSpreadByPercent.length,
                },
            },
        });
    }

    public joinToTournament(): void {
        if (!this.isAuth) {
            this.modalService.showModal('login');

            return;
        }

        this.checkSubscribeConditions(this.$params.common.tournament);
    }

    public leaveFromTournament(): void {
        this.showConditionModal(
            undefined,
            undefined,
            gettext('Unsubscribe'),
            gettext('Tournament fee will not be returned to your account. Are you sure you want to unsubscribe?'),
            'leave',
        );
    }

    protected getUserInfo(): void {
        this.userService.userInfo$
            .pipe(takeUntil(this.$destroy))
            .subscribe((userInfo) => {
                if (!userInfo) return;

                this.userInfo = userInfo;
            });
    }

    protected async joinTournament(): Promise<void> {
        try {
            this.pending = true;

            await this.tournamentsService.joinTournament(this.$params.common.tournament);
            this.cdr.markForCheck();
        } catch (error) {
            console.error(error);
        } finally {
            this.pending = false;
            this.isTournamentSelected = true;
        }
    }

    protected async leaveTournament(): Promise<void> {
        try {
            this.pending = true;

            await this.tournamentsService.leaveTournament(this.$params.common.tournament);
            this.cdr.markForCheck();
        } catch (error) {
            console.error(error);
        } finally {
            this.pending = false;
        }
    }


    protected checkSubscribeConditions(tournament: Tournament): void {
        if (tournament.feeAmount === 0) {
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

    protected showConditionModal(
        tournament: Tournament,
        userBalance: number,
        modalTitle: string,
        modalMessage: string,
        actionType: string,
    ): void {
        this.modalService.showModal({
            id: 'some',
            modifier: 'some',
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
}


