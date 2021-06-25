import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';

import {skipWhile, takeUntil} from 'rxjs/operators';

import {AbstractComponent, ConfigService, ModalService} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';

import * as Params from './loyalty-progress.params';

@Component({
    selector: '[wlc-loyalty-progress]',
    templateUrl: './loyalty-progress.component.html',
    styleUrls: ['./styles/loyalty-progress.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyProgressComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.ILoyaltyProgressCParams;

    public $params: Params.ILoyaltyProgressCParams;
    public nextLevelPoints: number;
    public percentProgress: number;
    public userPoints: number;
    public levelName: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyProgressCParams,
        protected configService: ConfigService,
        protected UserService: UserService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.subscribeUserInfo();
    }

    /**
     * Subscribe user info to get loyalty progress
     * @method subscribeUserInfo
     * @returns {void} void
     */
    public subscribeUserInfo(): void {
        this.UserService.userInfo$
            .pipe(
                skipWhile(v => !v),
                takeUntil(this.$destroy),
            )
            .subscribe((userInfo) => {
                this.levelName = userInfo.levelName;
                this.userPoints = userInfo.points;
                this.nextLevelPoints = userInfo.nextLevelPoints;

                this.percentProgress = !this.nextLevelPoints
                    ? 100
                    : this.userPoints / this.nextLevelPoints * 100;

                this.cdr.markForCheck();
            });
    }
}
