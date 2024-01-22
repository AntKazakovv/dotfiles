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
    OnDestroy,
} from '@angular/core';

import {takeUntil} from 'rxjs/operators';
import _map from 'lodash-es/map';
import _merge from 'lodash-es/merge';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    EventService,
    DeviceType,
    DeviceOrientation,
    ActionService,
    IResizeEvent,
    ISlide,
    ISliderCParams,
    SliderComponent,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {BonusesFilterType} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';
import {BonusItemComponent} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.component';
import {IBonusItemCParams} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.params';
import {
    BonusesListController,
    IBonusesListController,
} from 'wlc-engine/modules/bonuses/system/classes/bonuses-list.controller';

import * as Params from './game-dashboard-bonuses.params';

@Component({
    selector: '[wlc-game-dashboard-bonuses]',
    templateUrl: './game-dashboard-bonuses.component.html',
    styleUrls: ['./styles/game-dashboard-bonuses.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameDashboardBonusesComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(SliderComponent) public slider: SliderComponent;
    @ViewChild('bonus') tplBonus: TemplateRef<ElementRef>;

    public landscapeOrientation: boolean = false;
    public bonuses: Bonus[] = [];
    public isAuth: boolean;
    public isMobile: boolean;
    public isReady: boolean = false;
    public slides: ISlide[] = [];
    public override $params: Params.IGameDashboardBonusesCParams;

    public defaultSliderConfig: ISliderCParams = {};
    public landscapeSliderConfig: ISliderCParams = {};

    protected filter: BonusesFilterType = 'all';
    protected bonusesListController: IBonusesListController;

    constructor(
        @Inject('injectParams') protected params: Params.IGameDashboardBonusesCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected eventService: EventService,
        protected actionService: ActionService,
        protected bonusesService: BonusesService,
    ) {
        super(
            <IMixedParams<Params.IGameDashboardBonusesCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);

        this.bonusesListController = new BonusesListController(
            this.bonusesService,
            this.configService,
        );
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.landscapeOrientation = this.actionService.device.orientation === DeviceOrientation.Landscape;
        this.setDeviceModificators();

        this.initEventHandlers();
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        this.bonusesListController.destroy();
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
        this.isReady = false;
        this.bonusesListController.ready$
            .pipe(takeUntil(this.$destroy))
            .subscribe((ready: boolean): void => {
                this.bonuses = this.bonusesListController.bonuses;

                if (this.bonuses.length) {
                    this.bonusesToSlides(this.bonuses, true);
                    this.initSliderComponents();
                }
                this.isReady = ready;
                this.cdr.detectChanges();
            });

        this.bonusesListController.getBonuses({
            subscribeParams: {
                useQuery: true,
                type: 'any',
            },
            filter: this.filter,
            sort: this.$params.sortOrder,
        });
    }

    /**
     * Transform bonuses to slides
     *
     */
    protected bonusesToSlides(bonuses: Bonus[], scroll: boolean = false): void {
        this.slides = _map(bonuses, (bonus: Bonus): ISlide => ({
            component: BonusItemComponent,
            componentParams: <IBonusItemCParams>{
                bonus,
                theme: 'long',
            },
        }));
        if (this.slider?.swiper && scroll) {
            this.slider.swiper.slideTo(0);
        }
        this.cdr.detectChanges();
    }

    protected initSliderComponents(): void {

        this.defaultSliderConfig = _merge<ISliderCParams, ISliderCParams>(
            this.$params.defaultSliderParams,
            {slides: this.slides},
        );

        this.landscapeSliderConfig = _merge<ISliderCParams, ISliderCParams>(
            this.$params.landscapeSliderParams,
            {slides: this.slides},
        );
    }

    /**
     * Init event handlers
     */
    protected initEventHandlers(): void {
        this.actionService.windowResize()
            .pipe(takeUntil(this.$destroy))
            .subscribe((event: IResizeEvent) => {
                const landscapeOrientation = !event.device.isDesktop
                    && event.device.orientation == DeviceOrientation.Landscape;
                if (this.landscapeOrientation !== landscapeOrientation) {
                    this.landscapeOrientation = landscapeOrientation;
                    this.bonusesToSlides(this.bonuses);
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
                this.bonusesToSlides(this.bonuses);
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
