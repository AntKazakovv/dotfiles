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
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import * as Params from './user-stats.params';

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
    @Input() protected inlineParams: Params.IUserStatsCParams;
    public $params: any;
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
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.userStats = this.UserService.userInfo;
        this.userInfoHandler = this.UserService.userInfo$.subscribe((userInfo) => {
            this.userStats = userInfo;
            this.fillUserStatsFields();
            this.cdr.detectChanges();
        });
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
                wlcElement: 'block_user-stat-item_real',
            },
            bonusBalance: {
                name: gettext('Bonus balance'),
                value: this.userStats?.bonusBalance,
                modification: 'amount',
                wlcElement: 'block_user-stat-item_bonus',
            },
            points: {
                name: gettext('Points'),
                value: this.userStats?.loyalty?.Balance,
                wlcElement: 'block_user-stat-item_points',
            },
            level: {
                name: gettext('Level'),
                value: this.userStats?.loyalty?.Level,
                wlcElement: 'block_user-stat-item_level',
            },
            email: {
                name: gettext('Email'),
                value: this.userStats?.email,
            },
            firstName: {
                name: gettext('First name'),
                value: this.userStats?.firstName,
            },
            lastName: {
                name: gettext('Last name'),
                value: this.userStats?.lastName,
            },
            levelName: {
                name: gettext('Level name'),
                value: this.userStats?.loyalty?.LevelName[this.translate.currentLang || 'en'],
            },
            login: {
                name: gettext('Login'),
                value: this.userStats?.loyalty?.Login,
            },
            nextLvlPoints: {
                name: gettext('Next Level Points'),
                value: this.userStats?.loyalty?.NextLevelPoints,
            },
        };
        this.cdr.detectChanges();
    }

    public depositAction(): void {
        this.stateService.go('app.profile.cash.deposit');
    }
}
