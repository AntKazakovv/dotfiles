import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {EventService, ModalService} from 'wlc-engine/modules/core/system/services';
import {IIndexing, IUserInfo} from 'wlc-engine/modules/core/system/interfaces';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {Subscription} from 'rxjs';
import {StateService} from '@uirouter/core';
import * as Params from './user-stats.params';

export interface IUserStatsItem {
    name: string,
    value: string | number,
}

@Component({
    selector: '[wlc-user-stats]',
    templateUrl: './user-stats.component.html',
    styleUrls: ['./styles/user-stats.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserStatsComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: any;
    @Input() public type: string = 'default';
    public $params: any;
    public userStats: IUserInfo;
    public shownUserStats: IIndexing<IUserStatsItem>;
    private userInfoHandler: Subscription;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IUserStatsCParams,
        protected configService: ConfigService,
        protected UserService: UserService,
        protected EventService: EventService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        private translate: TranslateService,
        private stateService: StateService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.userStats = this.UserService.userInfo?.data;
        this.userInfoHandler = this.EventService.subscribe({
            name: 'USER_INFO',
        }, (info: IData) => {
            this.userStats = info?.data as IUserInfo;
            this.fillUserStatsFields();
            this.cdr.markForCheck();
        });
        this.fillUserStatsFields();
        this.cdr.markForCheck();
    }

    ngOnDestroy() {
        this.userInfoHandler?.unsubscribe();
    }

    public logout(): void {
        //TODO
        //  this.modalService.showModal('logout');
        this.UserService.logout();
    }

    private fillUserStatsFields(): void {
        if (!this.userStats) {
            return;
        }

        this.shownUserStats = {
            balance: {
                name: gettext('Real balance'),
                value: this.userStats.balance,
            },
            bonusBalance: {
                name: gettext('Bonus balance'),
                value: this.userStats.loyalty.Balance,
            },

            points: {
                name: gettext('Points'),
                value: this.userStats.loyalty.Points,
            },
            level: {
                name: gettext('Level'),
                value: this.userStats.loyalty.Level,
            },
            email: {
                name: gettext('Email'),
                value: this.userStats.email,
            },
            firstName: {
                name: gettext('First name'),
                value: this.userStats.firstName,
            },
            lastName: {
                name: gettext('Last name'),
                value: this.userStats.lastName,
            },
            levelName: {
                name: gettext('Level name'),
                value: this.userStats.loyalty.LevelName[this.translate.currentLang || 'en'],
            },
            login: {
                name: gettext('Login'),
                value: this.userStats.loyalty.Login,
            },
            nextLvlPoints: {
                name: gettext('Next Level Points'),
                value: this.userStats.loyalty.NextLevelPoints,
            },
        };
    }

    public depositAction(): void {
        this.stateService.go('app.profile.cash.deposit');
    }
}
