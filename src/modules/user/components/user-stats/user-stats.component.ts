import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {takeUntil} from 'rxjs/operators';
import {StateService} from '@uirouter/core';
import _isUndefined from 'lodash-es/isUndefined';
import _each from 'lodash-es/each';
import _get from 'lodash-es/get';

import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';

import * as Params from './user-stats.params';

export interface IUserStatsItem extends Params.IUserStatsItemConfig {
    value: string | number;
}

/**
 * Show user info component.
 *
 * @example
 *
 * {
 *     name: 'user.wlc-user-stats',
 * }
 *
 */
@Component({
    selector: '[wlc-user-stats]',
    templateUrl: './user-stats.component.html',
    styleUrls: ['./styles/user-stats.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserStatsComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() public type: Params.ComponentType = 'default';
    @Input() public useDepositBtn: boolean = true;
    @Input() public inlineParams: Params.IUserStatsCParams;
    public override $params: Params.IUserStatsCParams;
    public shownUserStats: IIndexing<IUserStatsItem> = {};

    private userStats: UserInfo;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IUserStatsCParams,
        configService: ConfigService,
        protected userService: UserService,
        cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected translateService: TranslateService,
        private stateService: StateService,
    ) {
        super(
            <IMixedParams<Params.IUserStatsCParams>>{injectParams: injectParams, defaultParams: Params.defaultParams},
            configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.prepareParams());

        switch (this.type) {
            case 'short':
            case 'mobile':
                this.$params.fields = [
                    'balance',
                    'bonusBalance',
                ];
                break;
            case 'store':
                this.$params.fields = [
                    'points',
                    'expPoints',
                ];
                break;
        }

        if (this.configService.get('$base.app.type') === 'kiosk') {
            this.$params.fields = [
                'balance',
                'bonusBalance',
            ];
            this.$params.useDepositBtn = false;
        }

        this.userService.userInfo$
            .pipe(takeUntil(this.$destroy))
            .subscribe((userInfo) => {
                this.userStats = userInfo;
                this.fillUserStatsFields();
                this.cdr.detectChanges();
            });

        if (!_isUndefined(this.$params.useDepositBtn)) {
            this.useDepositBtn = this.$params.useDepositBtn;
            this.cdr.markForCheck();
        }
    }

    /**
     * Go to deposit state
     */
    public depositAction(): void {
        this.stateService.go('app.profile.cash.deposit');
    }

    /**
     * Show modal with description internal casino currencies
     */
    public descriptionCasinosCurrency(): void {
        this.modalService.showModal('descriptionCasinosCurrency');
    }

    protected prepareParams(): Params.IUserStatsCParams {
        if (this.injectParams?.type) {
            this.type = this.injectParams.type;
        }
        if (this.inlineParams?.type) {
            this.type = this.inlineParams.type;
        }
        return this.inlineParams;
    }

    protected fieldName(field: string): string {
        switch (this.$params.fieldsView) {
            case 'abbreviation':
                return Params.shownUserStatsConfig[field].abbreviation;
            case 'fullWithAbbreviation':
                return this.translateService.instant(Params.shownUserStatsConfig[field].name)
                    + ' (' + Params.shownUserStatsConfig[field].abbreviation + ')';
            default:
                return this.translateService.instant(Params.shownUserStatsConfig[field].name);
        }
    }

    protected getUserBalance(): number {
        if (this.userStats?.displayConsolidatedBalanceToStreamer) {
            return Number(this.shownUserStats.balance?.value) + Number(this.shownUserStats.bonusBalance?.value);
        } else {
            return Number(this.shownUserStats.balance?.value);
        }
    }

    protected getUserBonusBalance(): number {
        if (this.userStats?.displayConsolidatedBalanceToStreamer) {
            return 0;
        } else {
            return Number(this.shownUserStats.bonusBalance?.value);
        }
    }

    protected getBalanceValueByField(field: string): number {
        if (field === 'balance') {
            return this.getUserBalance();
        }

        if (field === 'bonusBalance') {
            return this.getUserBonusBalance();
        }

        return Number(this.shownUserStats[field]?.value);
    }

    private fillUserStatsFields(): void {
        const shownUserStats: IIndexing<IUserStatsItem> = {};
        _each(this.$params.fields, (field) => {
            shownUserStats[field] = {
                ...Params.shownUserStatsConfig[field],
                name: this.fieldName(field),
                value: _get(this.userStats, Params.shownUserStatsConfig[field].path),
            };

            if (field === 'bonusBalance') {
                shownUserStats[field] = {
                    ...shownUserStats[field],
                    currency: this.userService.userProfile.bonusCurrency,
                    modification: 'customCurrency',
                };
            }
        });
        this.shownUserStats = shownUserStats;
        this.cdr.detectChanges();
    }
}
