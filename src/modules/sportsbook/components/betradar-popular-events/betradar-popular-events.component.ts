import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    TemplateRef,
    ViewChild,
    ElementRef,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';
import {
    ConfigService,
    FilesService,
    IIndexing, IWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    ISlide,
} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {
    BetradarGameModel,
    BetradarService,
    SportsbookService,
} from 'wlc-engine/modules/sportsbook';
import * as Params from './betradar-popular-events.params';

import _get from 'lodash-es/get';
import _set from 'lodash-es/set';
import _trim from 'lodash-es/trim';

@Component({
    selector: '[wlc-betradar-popular-events]',
    templateUrl: './betradar-popular-events.component.html',
    styleUrls: ['./styles/betradar-popular-events.component.scss'],
})
export class BetradarPopularEventsComponent extends AbstractComponent implements OnInit {

    @ViewChild('popularEventsSlide') tplPopularEventsSlide: TemplateRef<ElementRef>;

    public $params: Params.IBetradarPopularEventsCParams;
    public slides: ISlide[] = [];
    public sliderConfig: IWrapperCParams = {};
    public inited: boolean = false;
    public initFailed: boolean = false;

    protected imagesDir: string;
    protected fallbackImagesDir: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBetradarPopularEventsCParams,
        protected cdr: ChangeDetectorRef,
        protected betradarService: BetradarService,
        protected sportsbookService: SportsbookService,
        protected configService: ConfigService,
        protected fileService: FilesService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.init();
    }

    public async init(): Promise<void> {
        try {
            const games: BetradarGameModel[] = await this.betradarService.getPopularEvents();
            if (games) {
                this.initImagesDir();
                await this.gamesToSlides(games);
                this.sliderConfig = {
                    components: [
                        {
                            name: 'promo.wlc-slider',
                            params: {
                                swiper: this.$params.common?.swiper || {},
                                slides: this.slides,
                            },
                        },
                    ],
                };
                this.inited = true;
            } else {
                this.initFailed = true;
            }
        } catch (err) {
            this.initFailed = true;
        }
        this.inited = true;
        this.cdr.detectChanges();
    }

    /**
     * Open game in sportsbook
     *
     * @param {BetradarGameModel} game
     */
    public openGame(game: BetradarGameModel): void {
        this.sportsbookService.goToPageByLink(game.link);
    }

    /**
     * Get image path (from gstatic or project directory)
     *
     * @param {BetradarGameModel} game
     * @param {number} slideIndex
     * @returns {Promise<string>}
     */
    public async getImage(game: BetradarGameModel, slideIndex: number): Promise<string> {
        if (!game) {
            return '';
        }

        if (this.imagesDir) {
            const fileName: string = `${game.sportAlias}_${slideIndex}.jpg`;
            const filePath: string = this.imagesDir + fileName;
            const file = await this.fileService.getFile(filePath);

            if (file?.url) {
                return file.url;
            }
        }

        const fileName: string = `${game.sportAlias}${slideIndex}.jpg`;
        return this.fallbackImagesDir + fileName;
    }

    /**
     * Init dir of background images for slides
     */
    protected initImagesDir(): void {
        const imagesDir: string = this.configService.get<string>(`$sportsbook.betradar.widgets.popularEvents.imagesDir`);
        if (imagesDir) {
            this.imagesDir = _trim(imagesDir, '/') + '/';
        }
        const env: string = this.configService.get(`appConfig.env`);
        const domain: string = this.configService.get(`$sportsbook.betradar.widgets.env.${env}.serverUrl`) || '';
        this.fallbackImagesDir =  `${domain}/static/widgets/images/popular-events/`;
    }

    /**
     * Transform games to slides
     *
     * @param {BetradarGameModel[]} games
     * @returns {Promise<void>}
     */
    protected async gamesToSlides(games: BetradarGameModel[]): Promise<void> {
        const imageIndex: IIndexing<number> = {};
        const slides: ISlide[] = [];
        for (const game of games) {
            const index: number = _get(imageIndex, game.sportAlias, 0) + 1;
            const imagePath: string = await this.getImage(game, index);

            _set(imageIndex, game.sportAlias, index);
            slides.push({
                templateRef: this.tplPopularEventsSlide,
                templateParams: {
                    game: game,
                    imagePath: imagePath,
                },
            });
        }
        this.slides = slides;
    }

}
