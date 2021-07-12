import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    TemplateRef,
    ViewChild,
    ElementRef,
} from '@angular/core';
import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    EventService,
    DeviceType,
    DeviceOrientation,
    ActionService,
} from 'wlc-engine/modules/core';
import {takeUntil} from 'rxjs/operators';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services';
import {BonusesFilterType} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses.interface';
import {ISlide} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {SliderComponent} from 'wlc-engine/modules/promo/components/slider/slider.component';
import {IResizeEvent} from 'wlc-engine/modules/core/system/services/action/action.service';
import {IChangedTabEvent} from 'wlc-engine/modules/games/components/game-dashboard/game-dashboard.params';
import * as DashboardParams from 'wlc-engine/modules/games/components/game-dashboard/game-dashboard.params';
import * as Params from './game-dashboard-bonuses.params';

@Component({
    selector: '[wlc-game-dashboard-bonuses]',
    templateUrl: './game-dashboard-bonuses.component.html',
    styleUrls: ['./styles/game-dashboard-bonuses.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameDashboardBonusesComponent extends AbstractComponent implements OnInit, AfterViewInit {

    @ViewChild(SliderComponent) public slider: SliderComponent;
    @ViewChild('bonus') tplBonus: TemplateRef<ElementRef>;

    public landscapeOrientation: boolean = false;
    public bonuses: Bonus[] = [];
    public isAuth: boolean;
    public isMobile: boolean;
    public isReady: boolean = false;
    public slides: ISlide[] = [];
    public $params: Params.IGameDashboardBonusesCParams;

    protected filter: BonusesFilterType = 'all';

    constructor(
        @Inject('injectParams') protected params: Params.IGameDashboardBonusesCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected actionService: ActionService,
        protected bonusesService: BonusesService,
    ) {
        super(
            <IMixedParams<Params.IGameDashboardBonusesCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.landscapeOrientation = this.actionService.device.orientation === DeviceOrientation.Landscape;
        this.setDeviceModificators();

        this.initEventHandlers();
    }

    public ngAfterViewInit(): void {
        this.initBonuses();
    }

    /**
     * Check that bonuses more than 1 and check that device is not mobile and not landscape orientation
     */
    public get isDesktopAndSlidesLength(): boolean {
        return (!this.landscapeOrientation || !this.isMobile) && this.slides.length > 1;
    }

    /**
     * Init bonuses
     */
    protected initBonuses(): void {
        this.bonusesService.getSubscribe({
            useQuery: true,
            observer: {
                next: (bonuses: Bonus[]) => {
                    if (bonuses) {
                        this.bonuses = this.bonusesService.filterBonuses(bonuses, this.filter).slice(0, 9);
                        this.bonusesToSlides();
                        this.isReady = true;
                        this.cdr.markForCheck();
                    }
                },
            },
            type: 'any',
            until: this.$destroy,
        });
    }

    /**
     * Transform bonuses to slides
     *
     */
    protected bonusesToSlides(): void {
        this.slides = this.bonuses?.map((bonus: Bonus) => {
            const bonusItemParams = {
                theme: 'long',
                type: 'all',
                common: {
                    bonus: bonus,
                },
            };

            const templateParams = {
                item: {
                    bonus: bonus,
                    bonusItemParams: bonusItemParams,
                },
            };

            return {
                templateRef: this.tplBonus,
                templateParams: templateParams,
            };
        });
    }

    /**
     * Init event handlers
     */
    protected initEventHandlers(): void {
        this.actionService.windowResize()
            .pipe(takeUntil(this.$destroy))
            .subscribe((event: IResizeEvent) => {
                const landscapeOrientation = !event.device.isDesktop && event.device.orientation == DeviceOrientation.Landscape;
                if (this.landscapeOrientation !== landscapeOrientation) {
                    this.landscapeOrientation = landscapeOrientation;
                    this.bonusesToSlides();
                }
                this.setDeviceModificators();
                this.cdr.detectChanges();
            });

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                if (!type) {
                    return;
                }
                this.isMobile = type !== DeviceType.Desktop;
                this.bonusesToSlides();
                this.setDeviceModificators();
                this.cdr.markForCheck();
            });

        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this.isAuth = false;
            this.addModifiers('not-auth');
            this.cdr.markForCheck();
        });

        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            this.isAuth = true;
            this.removeModifiers('not-auth');
            this.cdr.markForCheck();
        });

        this.eventService.subscribe({
            name: DashboardParams.GameDashboardEvents.CHANED_TAB,
        }, (data: IChangedTabEvent) => {
            if (data.tab.id === 'bonuses') {
                setTimeout(() => {
                    this.slider.swiper.updateSwiper({});
                    this.cdr.markForCheck();
                });
            }
        });
    }

    /**
     * Set device modificators (landscape, mobile)
     */
    protected setDeviceModificators(): void {
        if (this.actionService.device.orientation == DeviceOrientation.Landscape) {
            this.addModifiers('landscape');
        } else {
            this.removeModifiers('landscape');
        }

        if (this.isMobile) {
            this.addModifiers('mobile');
        } else {
            this.removeModifiers('mobile');
        }
    }
}
