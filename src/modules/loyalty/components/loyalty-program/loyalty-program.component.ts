import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';

import {UIRouter} from '@uirouter/core';
import {BehaviorSubject} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    first,
    map,
    takeUntil,
} from 'rxjs/operators';
import _map from 'lodash-es/map';
import _merge from 'lodash-es/merge';

import {
    AbstractComponent,
    ActionService,
    ConfigService,
    DeviceType,
    ModalService,
    ISlide,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {LoyaltyLevelComponent} from 'wlc-engine/modules/loyalty/components/loyalty-level/loyalty-level.component';
import {ILoyaltyLevelCParams} from 'wlc-engine/modules/loyalty/components/loyalty-level/loyalty-level.params';
import {LoyaltyLevelsService} from 'wlc-engine/modules/loyalty/system/services/loyalty-levels/loyalty-levels.service';
import {LoyaltyLevelModel} from 'wlc-engine/modules/loyalty/system/models/loyalty-level.model';
import {
    UserInfo,
    UserService,
} from 'wlc-engine/modules/user';

import * as Params from './loyalty-program.params';

@Component({
    selector: '[wlc-loyalty-program]',
    templateUrl: './loyalty-program.component.html',
    styleUrls: ['./styles/loyalty-program.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyProgramComponent extends AbstractComponent implements OnInit {
    public override $params: Params.ILoyaltyProgramCParams;
    public levels: LoyaltyLevelModel[] = [];
    public userLevel: string | null = null;
    public ready = false;
    public slides: ISlide[] = [];
    public isMobile: boolean = false;
    public sliderConfig: IWrapperCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyProgramCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        private actionService: ActionService,
        private loyaltyLevelsService: LoyaltyLevelsService,
        private modalService: ModalService,
        private router: UIRouter,
        private userService: UserService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        const sliderTheme = (this.$params.theme in Params.sliderDefaultParams) ? this.$params.theme : 'default';
        this.$params.sliderParams = _merge(
            Params.sliderDefaultParams[sliderTheme],
            this.$params.sliderParams,
        );

        await this.configService.ready;
        this.$params.title ??= this.configService.get<string>('$loyalty.loyalty.programTitle');
        this.levels = await this.loyaltyLevelsService.getLoyaltyLevelsSafely();

        switch (this.$params.theme) {
            case 'wolf':
                this.watchForUserAuth();
                break;
            case 'default':
            default:
                this.levels = this.levels.splice(0, this.$params.levelsLimit);
                this.watchForOrientation();
        }

        this.initSlides();
        this.ready = true;
        this.cdr.detectChanges();
    }

    /**
     * redirects to the profile page to the site levels, if not logged in - shows modal
     */
    public readMore(): void {
        this.modalService.showModal('loyaltyInfo');
    }

    /**
     * @returns string
     * sets how many points you need to get to the next level
     */
    public setLoyaltyPoints(index: number): string {
        return (
            `${this.levels[index].currentLevelPoints}` +
            `${this.levels[index].isLast ? 
                this.levels[index].nextLevelPoints || '+' : 
                ' - ' + this.levels[index].nextLevelPoints
            }`
        );
    }

    /**
     * Creates slide list for slider from level models
     */
    protected initSlides(): void {
        this.slides = _map(this.levels, (level: LoyaltyLevelModel, idx) => ({
            component: LoyaltyLevelComponent,
            componentParams: this.getLoyaltyLevelParams(level, idx),
        }));
    }

    /**
     * Aggregating inline params for loyalty levels list item
     *
     * @param {LoyaltyLevelModel} level - model representing info about the level
     * @param {number} idx - ordinal number of level
     * @returns {ILoyaltyLevelCParams} `inlineParams` for `[wlc-loyalty-level]` component
     */
    public getLoyaltyLevelParams(level: LoyaltyLevelModel, idx: number): ILoyaltyLevelCParams {
        return {
            theme: this.$params.theme,
            name: level.name,
            level: String(level.level),
            points: this.setLoyaltyPoints(idx),
            description: level.description,
            image: level.image || this.loyaltyLevelsService.getLevelIcon(level.level),
            isUserLevel: String(level.level) === this.userLevel,
        };
    }

    /**
     * Watches for device orientation changes
     */
    protected watchForOrientation(): void {
        this.actionService.deviceType()
            .pipe(
                filter((type) => !!type),
                distinctUntilChanged(),
                takeUntil(this.$destroy),
            )
            .subscribe((type) => {
                this.isMobile = type !== DeviceType.Desktop;
                this.cdr.markForCheck();
            });
    }

    /**
     * Watches for user login/logout for detect user level changes
     */
    protected watchForUserAuth(): void {
        this.configService.get<BehaviorSubject<boolean>>('$user.isAuth$')
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.$destroy),
            ).subscribe((isAuth) => {
                if (isAuth) {
                    this.userService.userInfo$.pipe(
                        first((userInfo: UserInfo) => !!userInfo?.loyalty?.Level),
                        map((userInfo: UserInfo) => userInfo.loyalty.Level),
                        takeUntil(this.$destroy),
                    ).subscribe((level) => {
                        this.userLevel = level;
                        this.initSlides();
                        this.cdr.markForCheck();
                    });
                } else {
                    if (this.userLevel === null) return;
                    this.userLevel = null;
                    this.initSlides();
                    this.cdr.markForCheck();
                }
            });
    }
}
