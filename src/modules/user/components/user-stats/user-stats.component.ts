import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {StateService} from '@uirouter/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import * as Params from './user-stats.params';

import _isUndefined from 'lodash-es/isUndefined';
import _each from 'lodash-es/each';
import _get from 'lodash-es/get';

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
    @Input() public type: string = 'default';
    @Input() public useDepositBtn: boolean = true;
    @Input() public inlineParams: Params.IUserStatsCParams;
    public $params: Params.IUserStatsCParams;
    public shownUserStats: IIndexing<IUserStatsItem> = {};

    private userStats: UserInfo;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IUserStatsCParams,
        protected configService: ConfigService,
        protected UserService: UserService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        private stateService: StateService,
    ) {
        super(
            <IMixedParams<Params.IUserStatsCParams>>{injectParams: injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.prepareParams());

        switch (this.type) {
            case 'short':
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

        this.userStats = this.UserService.userInfo;
        this.UserService.userInfo$
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
        return this.inlineParams;
    }

    private fillUserStatsFields(): void {
        const shownUserStats = {};
        _each(this.$params.fields, (field) => {
            shownUserStats[field] = {
                ...Params.shownUserStatsConfig[field],
                value: _get(this.userStats, Params.shownUserStatsConfig[field].path),
            };
        });
        this.shownUserStats = shownUserStats;
        this.cdr.detectChanges();
    }
}
