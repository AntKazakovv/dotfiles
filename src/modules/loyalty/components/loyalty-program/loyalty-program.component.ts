import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';

import {UIRouter} from '@uirouter/core';
import {
    distinctUntilChanged,
    filter,
    takeUntil,
} from 'rxjs/operators';
import _map from 'lodash-es/map';

import {
    AbstractComponent,
    ActionService,
    ConfigService,
    DeviceType,
    IWrapperCParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    ISlide,
    ISliderCParams,
} from 'wlc-engine/modules/promo';
import {LoyaltyLevelComponent} from 'wlc-engine/modules/loyalty/components/loyalty-level/loyalty-level.component';
import {ILoyaltyLevelCParams} from 'wlc-engine/modules/loyalty/components/loyalty-level/loyalty-level.params';
import {LoyaltyLevelsService} from 'wlc-engine/modules/loyalty/system/services/loyalty-levels/loyalty-levels.service';
import {LoyaltyLevelModel} from 'wlc-engine/modules/loyalty/system/models/loyalty-level.model';

import * as Params from './loyalty-program.params';

@Component({
    selector: '[wlc-loyalty-program]',
    templateUrl: './loyalty-program.component.html',
    styleUrls: ['./styles/loyalty-program.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyProgramComponent extends AbstractComponent implements OnInit {
    public $params: Params.ILoyaltyProgramCParams;
    public levels: LoyaltyLevelModel[] = [];
    public ready = false;
    public isAuth: boolean;
    public slides: ISlide[] = [];
    public isMobile: boolean = false;
    public sliderConfig: IWrapperCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyProgramCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected loyaltyLevelsService: LoyaltyLevelsService,
        protected modalService: ModalService,
        protected actionService: ActionService,
        protected router: UIRouter,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();

        await this.configService.ready;
        this.isAuth = this.configService.get('$user.isAuthenticated');
        this.$params.title ??= this.configService.get<string>('$loyalty.loyalty.programTitle');
        this.levels = (await this.loyaltyLevelsService.getLoyaltyLevelsSafely()).splice(0, this.$params.levelsLimit);
        this.initSlides();
        this.watchForOrientation();
        this.initSliderComponent();

        this.ready = true;
        this.cdr.detectChanges();
    }

    /**
     * @returns string
     * creates a path from configuration parameters and level values
     */
    public imageLevel(level: number): string {
        return this.$params.imagePath ? `${this.$params.imagePath}${level}.${this.$params.imageType}` : '';
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
        return `${index ? this.levels[index - 1].nextLevelPoints : 0} - ${this.levels[index].nextLevelPoints}`;
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
            name: level.name,
            level: String(level.level),
            points: this.setLoyaltyPoints(idx),
            description: level.description,
            image: level.image,
            fallbackImage: this.imageLevel(level.level),
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

    protected initSliderComponent(): void {
        this.sliderConfig = {
            components: [
                {
                    name: 'promo.wlc-slider',
                    params: <ISliderCParams>{
                        slides: this.slides,
                        ...this.$params.sliderParams,
                    },
                },
            ],
        };
    }
}
