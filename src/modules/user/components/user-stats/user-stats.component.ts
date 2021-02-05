import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy,
} from '@angular/core';
import {Subscription} from 'rxjs';
import {StateService} from '@uirouter/core';
import {TranslateService} from '@ngx-translate/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import * as Params from './user-stats.params';

import {
    union as _union,
    get as _get,
    isUndefined as _isUndefined,
    keys as _keys,
    forEach as _forEach,
} from 'lodash-es';

export interface IUserStatsItem {
    name: string,
    value: string | number,
    modification?: string;
    wlcElement?: string;
}

@Component({
    selector: '[wlc-user-stats]',
    templateUrl: './user-stats.component.html',
    styleUrls: ['./styles/user-stats.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserStatsComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() public type: string = 'default';
    @Input() public useDepositBtn: boolean = true;
    @Input() public inlineParams: Params.IUserStatsCParams;
    public $params: Params.IUserStatsCParams;
    public userStats: UserInfo;
    public shownUserStats: IIndexing<IUserStatsItem> = {};
    private userInfoHandler: Subscription;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IUserStatsCParams,
        protected configService: ConfigService,
        protected UserService: UserService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        private translate: TranslateService,
        private stateService: StateService,
        protected ConfigService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IUserStatsCParams>>{injectParams: injectParams, defaultParams: Params.defaultParams}, ConfigService);
    }

    ngOnInit(): void {
        super.ngOnInit(this.prepareParams());
        this.userStats = this.UserService.userInfo;
        this.userInfoHandler = this.UserService.userInfo$.subscribe((userInfo) => {
            this.userStats = userInfo;
            this.fillUserStatsFields();
            this.cdr.detectChanges();
        });

        if (!_isUndefined(this.$params.useDepositBtn)) {
            this.useDepositBtn = this.$params.useDepositBtn;
        }
    }

    ngOnDestroy() {
        this.userInfoHandler?.unsubscribe();
    }

    private fillUserStatsFields(): void {

        this.shownUserStats = {
            balance: {
                name: gettext('Real balance'),
                value: this.userStats?.realBalance,
                modification: 'amount',
                wlcElement: 'block_user-stat-balance-real',
            },
            bonusBalance: {
                name: gettext('Bonus balance'),
                value: this.userStats?.bonusBalance,
                modification: 'amount',
                wlcElement: 'block_user-stat-balance-bonus',
            },
            points: {
                name: gettext('LP'),
                value: this.userStats?.loyalty?.Balance,
                wlcElement: 'block_user-stat-points',
            },
            level: {
                name: gettext('Level'),
                value: this.userStats?.loyalty?.Level,
                wlcElement: 'block_user-stat-level',
            },
            email: {
                name: gettext('Email'),
                value: this.userStats?.email,
                wlcElement: 'block_user-stat_email',
            },
            firstName: {
                name: gettext('First name'),
                value: this.userStats?.firstName,
                wlcElement: 'block_user-stat_firstname',
            },
            lastName: {
                name: gettext('Last name'),
                value: this.userStats?.lastName,
                wlcElement: 'block_user-stat_lastname',
            },
            levelName: {
                name: gettext('Level name'),
                value: this.userStats?.levelName,
                modification: 'string',
                wlcElement: 'block_user-stat_level-name',
            },
            login: {
                name: gettext('Login'),
                value: this.userStats?.loyalty?.Login,
                modification: 'string',
                wlcElement: 'block_user-stat_login',
            },
            nextLvlPoints: {
                name: gettext('Next Level Points'),
                value: this.userStats?.loyalty?.NextLevelPoints,
                wlcElement: 'block_user-stat_next-level-points',
            },
            expPoints: {
                name: gettext('EXP'),
                value: this.userStats?.loyalty?.Points,
                wlcElement: 'block_user-stat_expirience-points',
            },
            expPointsTotal: {
                name: gettext('Experience points all time'),
                value: this.userStats?.loyalty?.TotalPoints,
                wlcElement: 'block_user-stat_expirience-points-total',
            },
            levelCoef: {
                name: gettext('Level coefficient'),
                value: this.userStats?.loyalty?.LevelCoef,
                wlcElement: 'block_user-stat_level-coef',
            },
            depositCount: {
                name: gettext('Deposit count'),
                value: this.userStats?.loyalty?.DepositsCount,
                wlcElement: 'block_user-stat_deposit-count',
            },
            freespins: {
                name: gettext('Freespins'),
                value: this.userStats?.freespins,
                wlcElement: 'block_user-stat_freespins-count',
            },
        };
        this.cdr.detectChanges();
    }

    public depositAction(): void {
        this.stateService.go('app.profile.cash.deposit');
    }

    protected prepareParams(): Params.IUserStatsCParams {
        if (this.injectParams?.type) {
            this.type = this.injectParams.type;
        }
        return this.inlineParams;
    }
}
