import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';

import {
    Observable,
    distinctUntilChanged,
    map,
    skipWhile,
    startWith,
    mergeMap,
    takeUntil,
    filter,
    firstValueFrom,
} from 'rxjs';
import _find from 'lodash-es/find';
import _merge from 'lodash-es/merge';
import _isEqual from 'lodash-es/isEqual';

import {
    AbstractComponent,
    ConfigService,
    GlobalHelper,
    ILayoutComponent,
    InjectionService,
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

    protected userService: UserService = inject(UserService);
    protected injectionService: InjectionService = inject(InjectionService);
    protected loyaltyLevelsService: LoyaltyLevelsService;
    protected nextLevel: string = '';
    protected nextLevelName: string = '';

    public override $params: Params.ILoyaltyProgressCParams;
    public levels: LoyaltyLevelModel[];
    public levelData$: Observable<Params.ILevelViewData> = this.userService.userInfo$.pipe(
        mergeMap(async (userInfo: UserInfo): Promise<UserInfo> => {
            if (!this.levels) {
                this.loyaltyLevelsService = await this.injectionService.getService('loyalty.loyalty-levels-service');
                this.levels =
                    await firstValueFrom(this.loyaltyLevelsService.getLoyaltyLevelsObserver().pipe(filter(v => !!v)));
            }
            return userInfo;
        }),
        skipWhile((userInfo: UserInfo) => !userInfo?.data?.loyalty?.Level),
        map((userInfo: UserInfo): Params.ILoyaltyData => ({
            level: userInfo.level,
            levelName: userInfo.levelName,
            points: userInfo.points,
            nextLevelPoints: userInfo.nextLevelPoints,
        })),
        distinctUntilChanged(_isEqual),
        map(this.infoToViewData.bind(this)),
        takeUntil(this.$destroy),
    ).pipe(startWith({}));

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyProgressCParams,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this, ['maxProgressText', 'showLevelIcon']));
    }

    private infoToViewData(loyaltyData: Params.ILoyaltyData): Params.ILevelViewData {
        let wrapperParams: IWrapperCParams = null;

        if (this.$params.common?.showLevelIcon && this.$params.common.levelIconComponent) {
            const customLevelIcon: string = _find(
                this.levels,
                (level: LoyaltyLevelModel): boolean => level.level === loyaltyData.level,
            )?.image;
            const defaultLevelIcon: string = this.loyaltyLevelsService.getLevelIcon(loyaltyData.level);

            const loyaltyLevelComponent: ILayoutComponent = _merge(
                this.$params.common.levelIconComponent,
                {
                    params: {
                        level: loyaltyData.level.toString(),
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

        if (this.levels[loyaltyData.level]) {
            this.nextLevel = this.levels[loyaltyData.level].level.toString();
            this.nextLevelName = this.levels[loyaltyData.level].name;
        }

        return {
            level: loyaltyData.level,
            levelName: loyaltyData.levelName,
            userPoints: loyaltyData.points,
            nextLevel: this.nextLevel,
            nextLevelName: this.nextLevelName,
            nextLevelPoints: loyaltyData.nextLevelPoints,
            percentProgress: !loyaltyData.nextLevelPoints
                ? 100
                : loyaltyData.points / (loyaltyData.nextLevelPoints || 1) * 100,
            wrapperParams,
        };
    }
}
