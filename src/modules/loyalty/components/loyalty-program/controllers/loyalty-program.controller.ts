import {
    inject,
    Injectable,
    OnDestroy,
} from '@angular/core';

import {
    Subject,
    BehaviorSubject,
    firstValueFrom,
    Observable,
} from 'rxjs';
import {
    map,
    filter,
    takeUntil,
    tap,
} from 'rxjs/operators';
import {NavigationOptions} from 'swiper/types/modules/navigation';
import _merge from 'lodash-es/merge';
import _random from 'lodash-es/random';

import {
    ActionService,
    ConfigService,
    IButtonCParams,
    InjectionService,
    ISlide,
    ISliderCParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    UserInfo,
    UserService,
} from 'wlc-engine/modules/user';
import {LoyaltyLevelModel} from 'wlc-engine/modules/loyalty/system/models';
import {LoyaltyLevelsService} from 'wlc-engine/modules/loyalty/system/services';
import {
    ILoyaltyLevelCParams,
    LoyaltyLevelComponent,
    LoyaltyProgramDefaultComponent,
    LoyaltyProgramWolfComponent,
} from 'wlc-engine/modules/loyalty/components';
import {
    ComponentTheme,
} from 'wlc-engine/modules/loyalty/components/loyalty-program/loyalty-program.params';

export type TComponent = typeof LoyaltyProgramDefaultComponent | typeof LoyaltyProgramWolfComponent;

export interface IControllerProps {
    theme: ComponentTheme,
    title?: string;
    decorLeftPath?: string;
    decorRightPath?: string;
    levelsLimit?: number;
    emptyStateText?: string;
    sliderParams?: ISliderCParams;
    useNavigation?: boolean;
    btnParams?: IButtonCParams;
}

@Injectable()
export class LoyaltyProgramController implements OnDestroy  {

    public ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public $props: IControllerProps;
    public $component: TComponent;
    public slides$: BehaviorSubject<ISlide[] | null> = new BehaviorSubject(null);
    public isMobile$: Observable<boolean>;
    public navigationId: string = _random(10000000).toString(16);

    protected $destroy: Subject<void> = new Subject();
    protected userService: UserService;
    protected levels: LoyaltyLevelModel[];

    protected readonly configService: ConfigService = inject(ConfigService);
    protected readonly loyaltyLevelsService: LoyaltyLevelsService = inject(LoyaltyLevelsService);
    protected readonly injectionService: InjectionService = inject(InjectionService);
    protected readonly modalService: ModalService = inject(ModalService);
    protected readonly actionService: ActionService = inject(ActionService);

    public async init(props: IControllerProps): Promise<void> {
        this.$props = props;
        this.levels = await this.getLoyaltyLevels();

        switch (this.$props.theme) {
            case 'wolf':
                this.startSlidesUpdatingOnLevelChange();
                this.$component = LoyaltyProgramWolfComponent;
                break;
            case 'default':
            default:
                this.isMobile$ = this.actionService.isMobileDeviceType();
                this.slides$.next(this.generateSlides(this.levels, null));
                this.$component = LoyaltyProgramDefaultComponent;
        }

        this.ready$.next(true);
    }

    /**
     * Watches for user login/logout for detect user level changes
     * **/
    public startSlidesUpdatingOnLevelChange(): void {
        this.configService.get<BehaviorSubject<boolean>>('$user.isAuth$')
            .pipe(
                tap(async (isAuth: boolean): Promise<void> => {
                    if (isAuth) {
                        this.userService ??= await this.injectionService.getService<UserService>('user.user-service');

                        const userLevel: number = await firstValueFrom(this.userService.userInfo$.pipe(
                            filter((userInfo: UserInfo) => !!userInfo?.loyalty?.Level),
                            map((userInfo: UserInfo) => +userInfo.loyalty.Level),
                            takeUntil(this.$destroy),
                        ));

                        this.slides$.next(this.generateSlides(this.levels, userLevel));
                    } else {
                        this.slides$.next(this.generateSlides(this.levels, null));
                    }
                }),
                takeUntil(this.$destroy),
            ).subscribe();
    }

    public async getLoyaltyLevels(): Promise<LoyaltyLevelModel[]> {
        return firstValueFrom(this.loyaltyLevelsService.getLoyaltyLevelsObserver().pipe(filter(v => !!v)));
    }

    /**
     * redirects to the profile page to the site levels, if not logged in - shows modal
     */
    public readMore(): void {
        this.modalService.showModal('loyaltyInfo');
    }

    /**
     * @returns string
     * generate points string
     */
    public generateLoyaltyPointsDiapason(level: LoyaltyLevelModel): string {
        if (level.isLast && !level.nextLevelPoints) {
            return `${level.currentLevelPoints}+`;
        } else {
            return `${level.currentLevelPoints} - ${level.nextLevelPoints}`;
        }
    }

    /**
     * Generates slide list for slider from level models
     */
    public generateSlides(levels: LoyaltyLevelModel[], userLevel: number | null): ISlide[] {
        return levels?.map( (level: LoyaltyLevelModel): ISlide => ({
            component: LoyaltyLevelComponent,
            componentParams: <ILoyaltyLevelCParams>{
                theme: this.$props.theme,
                name: level.name,
                level: String(level.level),
                points: this.generateLoyaltyPointsDiapason(level),
                description: level.description,
                image: level.image || this.loyaltyLevelsService.getLevelIcon(level.level),
                isUserLevel: level.level === userLevel,
            },
        }));
    }

    public getSliderParams(componentSliderParams: ISliderCParams, useNavigation: boolean): ISliderCParams {
        const sliderParams: ISliderCParams = _merge(
            {},
            (componentSliderParams || {}),
            (this.$props.sliderParams || {}),
        );

        const navParams: NavigationOptions | {} =
            useNavigation ? {
                navigation: {
                    enabled: true,
                    nextEl: '.wlc-swiper-button-next-' + this.navigationId,
                    prevEl: '.wlc-swiper-button-prev-' + this.navigationId,
                },
            } : {};
        _merge(sliderParams.swiper, navParams);

        return sliderParams;
    }

    public getBtnParams(componentBtnParams: IButtonCParams): IButtonCParams {
        return _merge(
            {},
            (componentBtnParams || {}),
            (this.$props.btnParams || {}),
        );
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
