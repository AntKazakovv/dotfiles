import dayjs from 'dayjs';
import _assign from 'lodash-es/assign';

import {
    AbstractModel,
    IFromLog,
} from 'wlc-engine/modules/core';
import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {
    IGame,
} from 'wlc-engine/modules/sportsbook/system/interfaces/betradar/widgets.interface';
import {MarketModel} from './market.model';

export class BetradarGameModel extends AbstractModel<IGame> {

    public market: MarketModel;
    public issetTeamHomeLogo: boolean = true;
    public issetTeamAwayLogo: boolean = true;

    constructor(
        from: IFromLog,
        data: IGame,
        protected configService: ConfigService,
        protected eventService: EventService,
    ) {
        super({from: _assign({model: 'BetradarGameModel'}, from)});
        this.data = data;
        this.init();
    }

    /**
     * Game id
     *
     * @returns {string}
     */
    public get id(): string | number {
        return this.data.id;
    }

    /**
     * Name of home team
     *
     * @returns {string}
     */
    public get teamHomeName(): string {
        return this.data.team_home_name;
    }

    /**
     * Name of away team
     *
     * @returns {string}
     */
    public get teamAwayName(): string {
        return this.data.team_away_name;
    }

    /**
     * Logo of home team
     *
     * @returns {string}
     */
    public get teamHomeLogo(): string {
        return this.data.team_home_logo;
    }

    /**
     * Logo of away team
     *
     * @returns {string}
     */
    public get teamAwayLogo(): string {
        return this.data.team_away_logo;
    }

    /**
     * Abbreviature of home team
     *
     * @returns {string}
     */
    public get teamHomeNameAbbr(): string {
        return this.data.team_home_abbr;
    }

    /**
     * Abbreviature of away team
     *
     * @returns {string}
     */
    public get teamAwayNameAbbr(): string {
        return this.data.team_away_abbr;
    }

    /**
     * Label of start time (today or tomorrow)
     *
     * @returns {string}
     */
    public get startTimeLabel(): string {
        const today = dayjs(),
            tomorrow = dayjs().add(1, 'day'),
            dataDate = dayjs(this.data.start_time);

        if (!today.diff(dataDate, 'day')) {
            return gettext('Today');
        } else if (!tomorrow.diff(dataDate, 'day')) {
            return gettext('Tomorrow');
        }
        return '';
    }

    public get link(): string {
        return this.data.link;
    }

    /**
     * Alias of sport
     *
     * @returns {string}
     */
    public get sportAlias(): string {
        return this.data.sport_alias;
    }

    /**
     * Check isset logo img for teams or not
     *
     * @returns {Promise<void>}
     */
    public async checkLogoImages(): Promise<void> {
        let teamHomeResult = await this.checkImageIsset(this.teamHomeLogo);
        if (!teamHomeResult) {
            this.issetTeamHomeLogo = false;
        }
        let teamAwayResult = await this.checkImageIsset(this.teamAwayLogo);
        if (!teamAwayResult) {
            this.issetTeamAwayLogo = false;
        }
    }

    /**
     * Start time of match
     *
     * @param {string} format
     * @returns {string}
     */
    public startTime(format: string = 'h:mm a'): string {
        return dayjs(this.data.start_time).format(format);
    }

    /**
     * Check isset img or not (used for check teams logo)
     *
     * @param {string} src
     * @returns {Promise<boolean>}
     */
    protected checkImageIsset(src: string): Promise<boolean> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const isset: boolean = !!(img.width > 10 && img.height > 10);
                resolve(isset);
            };
            img.onerror = () => {
                resolve(false);
            };
            img.src = src;
        });
    }

    protected async init() : Promise<void> {
        this.market = new MarketModel(
            {parentModel: 'BetradarGameModel', method: 'init'},
            this.data,
        );
    }
}
