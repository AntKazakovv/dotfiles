import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';

import {Observable} from 'rxjs';
import {
    distinctUntilChanged,
    map,
    skipWhile,
    startWith,
} from 'rxjs/operators';
import _find from 'lodash-es/find';
import _merge from 'lodash-es/merge';

import {
    AbstractComponent,
    ConfigService,
    GlobalHelper,
    ILayoutComponent,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {
    LoyaltyLevelModel,
    LoyaltyLevelsService,
} from 'wlc-engine/modules/loyalty';

import * as Params from './loyalty-progress.params';

@Component({
    selector: '[wlc-loyalty-progress]',
    templateUrl: './loyalty-progress.component.html',
    styleUrls: ['./styles/loyalty-progress.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyProgressComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILoyaltyProgressCParams;
    @Input() protected maxProgressText: string;
    @Input() protected showLevelIcon: boolean;
    @Input() protected showLinkToLevels: boolean;

    public override $params: Params.ILoyaltyProgressCParams;
    public levels: LoyaltyLevelModel[];
    public levelData$: Observable<Params.ILevelViewData> = this.userService.userInfo$.pipe(
        skipWhile(v => !v),
        distinctUntilChanged(),
        map(this.infoToViewData.bind(this)),
    ).pipe(startWith({}));

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyProgressCParams,
        configService: ConfigService,
        private userService: UserService,
        private loyaltyLevelsService: LoyaltyLevelsService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(GlobalHelper.prepareParams(this, ['maxProgressText', 'showLevelIcon', 'showLinkToLevels']));

        this.levels = await this.loyaltyLevelsService.getLoyaltyLevelsSafely();
    }

    private infoToViewData(userInfo: UserInfo): Params.ILevelViewData {
        let wrapperParams: IWrapperCParams = null;

        if (this.$params.common?.showLevelIcon && this.$params.common.levelIconComponent) {
            const customLevelIcon: string = _find(
                this.levels,
                (level: LoyaltyLevelModel): boolean => level.level === userInfo.level,
            )?.image;
            const defaultLevelIcon: string = this.loyaltyLevelsService.getLevelIcon(userInfo.level);

            const loyaltyLevelComponent: ILayoutComponent = _merge(
                this.$params.common.levelIconComponent,
                {
                    params: {
                        level: userInfo.level.toString(),
                        image: customLevelIcon || defaultLevelIcon,
                    },
                },
            );

            wrapperParams = {
                components: [
                    loyaltyLevelComponent,
                ],
            };
        }

        return {
            levelName: userInfo.levelName,
            userPoints: userInfo.points,
            nextLevelPoints: userInfo.nextLevelPoints,
            percentProgress: !userInfo.nextLevelPoints ? 100
                : userInfo.points / userInfo.nextLevelPoints * 100,
            wrapperParams,
        };
    }
}
