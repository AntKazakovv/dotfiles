import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    Subject,
    timer,
} from 'rxjs';
import {
    takeUntil,
    filter,
} from 'rxjs/operators';

import _random from 'lodash-es/random';
import _shuffle from 'lodash-es/shuffle';

import {
    ActionService,
    ConfigService,
    DeviceType,
    ModalService,
    AbstractComponent,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    ISlide,
    ISliderCParams,
} from 'wlc-engine/modules/promo';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {GameThumbComponent} from 'wlc-engine/modules/games/components/game-thumb/game-thumb.component';
import {IGameThumbCParams} from 'wlc-engine/modules/games/components/game-thumb/game-thumb.params';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {TSwiperEvent} from 'wlc-engine/modules/promo/components/slider/slider.params';

import * as Params from './games-slider.params';

@Component({
    selector: '[wlc-games-slider]',
    templateUrl: './games-slider.component.html',
    styleUrls: ['./styles/games-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesSliderComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.IGamesSliderCParams;
    public $params: Params.IGamesSliderCParams;
    public slides: ISlide[] = [];
    public ready: boolean = false;
    public isMobile: boolean = false;
    public isActive: boolean = false;
    public mockGamesList: Game[] = [];
    public gamesList: Game[] = [];
    public sliderConfig: IWrapperCParams;

    protected sliderEvents: Subject<TSwiperEvent> = new Subject<TSwiperEvent>();

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGamesSliderCParams,
        protected gamesCatalogService: GamesCatalogService,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected actionService: ActionService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.isMobile = this.configService.get<boolean>('appConfig.mobile');
        await this.gamesCatalogService.ready;
        this.fillGamesList();

        if (!this.isMobile || this.$params.isModal) {
            this.createSlides();
        } else {
            this.getGamesForMock();
        }

        this.ready = true;
        this.checkDeviceType();
        this.cdr.markForCheck();
    }

    /**
     * Method calculates index for element of mobile preview
     *
     * @method setIndex
     */
    public setIndex(index: number, abs: boolean): number {
        const newIndex: number = index - Math.floor(this.mockGamesList.length / 2);
        return abs ? Math.abs(newIndex) : newIndex;
    }

    /**
     * Method starts autoscrolling games in slider for several seconds
     *
     * @method startScrollingSwiper
     */
    public startScrollingSwiper(): void {
        this.isActive = true;
        this.sliderEvents.next('start');

        timer(_random(this.$params.minTimer, this.$params.maxTimer))
            .pipe(takeUntil(this.$destroy))
            .subscribe((): void => {
                this.sliderEvents.next('stop');
                this.isActive = false;
                this.cdr.markForCheck();
            });
    }

    /**
     * Method opens modal with games slider
     *
     * @method showModal
     */
    public showModal(): void {
        this.modalService.showModal('gamesSlider');
    }

    protected createSlides(): void {
        if (this.gamesList.length >= this.$params.minAmount) {
            this.slides = _shuffle(this.gamesList).map((game: Game): ISlide => {
                return {
                    component: GameThumbComponent,
                    componentParams: <IGameThumbCParams>{
                        theme: 'default',
                        type: 'games-slider',
                        common: {game},
                    },
                };
            });

            this.setSliderConfig();
        }
    }

    protected setSliderConfig(): void {
        this.sliderConfig = {
            class: `${this.$class}__wrapper`,
            components: [
                {
                    name: 'promo.wlc-slider',
                    params: <ISliderCParams>{
                        ...this.$params.sliderParams,
                        class: `${this.$class}__slider`,
                        slides: this.slides,
                        events: this.sliderEvents,
                    },
                },
            ],
        };

        this.cdr.markForCheck();
    }

    protected fillGamesList(): void {
        const allGames: Game[] = this.gamesCatalogService.getGameList(this.$params.filter);

        const listSize: number = allGames.length;

        if (listSize >= this.$params.minAmount) {

            if (listSize >= this.$params.maxAmount) {
                const startIndex: number = _random(listSize - this.$params.maxAmount);
                this.gamesList = allGames.slice(startIndex, startIndex + this.$params.maxAmount);
            } else {
                this.gamesList = allGames;
            }
        }
    }

    protected checkDeviceType(): void {
        this.actionService.deviceType()
            .pipe(
                takeUntil(this.$destroy),
                filter((type: DeviceType): boolean => this.isMobile !== (type !== DeviceType.Desktop)),
            ).subscribe((type: DeviceType): void => {
                this.isMobile = type !== DeviceType.Desktop;

                if (this.isMobile && !this.$params.isModal && !this.mockGamesList.length) {
                    this.getGamesForMock();
                } else if(!this.slides.length) {
                    this.createSlides();
                }

                this.cdr.detectChanges();
            });
    }

    protected getGamesForMock(): void {
        this.mockGamesList = this.$params.minAmount <= 9
            ? this.gamesList.slice(0, this.$params.minAmount)
            : this.gamesList.slice(0, 9);
    }
}
