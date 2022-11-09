import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';
import {
    ConfigService,
    FilesService,
} from 'wlc-engine/modules/core';
import {
    BetradarGameModel,
    BetradarService,
    SportsbookService,
} from 'wlc-engine/modules/sportsbook';
import * as Params from './betradar-daily-match.params';

import _trim from 'lodash-es/trim';

@Component({
    selector: '[wlc-betradar-daily-match]',
    templateUrl: './betradar-daily-match.component.html',
    styleUrls: ['./styles/betradar-daily-match.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetradarDailyMatchComponent extends AbstractComponent implements OnInit {

    public $params: Params.IBetradarDailyMatchCParams;
    public inited: boolean = false;
    public initFailed: boolean = false;
    public imagePath: string;
    public dailyMatch: BetradarGameModel;

    protected imagesDir: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBetradarDailyMatchCParams,
        protected cdr: ChangeDetectorRef,
        protected betradarService: BetradarService,
        protected sportsbookService: SportsbookService,
        protected configService: ConfigService,
        protected fileService: FilesService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.init();
    }

    protected async init(): Promise<void> {
        try {
            this.dailyMatch = await this.betradarService.getDailyMatch();
            if (this.dailyMatch) {
                if (this.configService.get<boolean>('$sportsbook.betradar.widgets.dailyMatch.showImage')) {
                    this.initImagesDir();
                    this.imagePath = await this.getImage(this.dailyMatch);
                }
                await this.dailyMatch.checkLogoImages();
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
     * Get image
     *
     * @param {BetradarGameModel} game
     * @returns {string}
     */
    protected async getImage(game: BetradarGameModel): Promise<string> {
        if (!game) {
            return '';
        }

        const fileName: string = `${game.sportAlias}.jpg`;
        if (this.imagesDir) {
            const filePath: string = this.imagesDir + fileName;
            const file = await this.fileService.getFile(filePath);

            if (file?.url) {
                return file.url;
            }
        }
        return this.$params.fallbackImagesDir + fileName;
    }

    /**
     * Init dir of background images
     */
    protected initImagesDir(): void {
        const imagesDir: string = this.configService.get<string>('$sportsbook.betradar.widgets.dailyMatch.imagesDir');
        if (imagesDir) {
            this.imagesDir = _trim(imagesDir, '/') + '/';
        }
    }
}
