import {
    ChangeDetectorRef,
    Inject,
    Injectable,
} from '@angular/core';
import {
    StateService,
    UIRouterGlobals,
} from '@uirouter/core';

import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import _get from 'lodash-es/get';
import _forEach from 'lodash-es/forEach';
import _set from 'lodash-es/set';
import _merge from 'lodash-es/merge';

import {
    ConfigService,
    DataService,
    EventService,
    ModalService,
    LogService,
    IData,
} from 'wlc-engine/modules/core';

import {
    ILocationChange,
    ErrorCodes,
    IError,
} from 'wlc-engine/modules/sportsbook/system/interfaces/betradar/events.interface';
import {
    IBetradarConfig,
} from 'wlc-engine/modules/sportsbook/system/interfaces/betradar/sportsbook.interface';
import {
    IDailyMatchData,
    IPopularEventsData,
    IGame,
} from 'wlc-engine/modules/sportsbook/system/interfaces/betradar/widgets.interface';

import {BetradarGameModel} from 'wlc-engine/modules/sportsbook/system/models/betradar-game.model';
import {SportsbookService} from 'wlc-engine/modules/sportsbook/system/services/sportsbook/sportsbook.service';
import {WINDOW} from 'wlc-engine/modules/app/system';

export const BetradarEvents = {
    error: 'SPORTSBOOK_ERROR',
    scrollTop: 'SPORTSBOOK_SCROLL_TOP',
    loaded: 'SPORTSBOOK_LOADED',
    openPage: 'SPORTSBOOK_OPEN_PAGE',
    openLeftMenu: 'SPORTSBOOK_OPEN_LEFT_MENU',
    openRightMenu: 'SPORTSBOOK_OPEN_RIGHT_MENU',
    betsCountChanged: 'SPORTSBOOK_BETS_COUNT_CHANGED',
    hideMenu: 'SPORTSBOOK_HIDE_MENU',
    showMenu: 'SPORTSBOOK_SHOW_MENU',
    locationChange: 'SPORTSBOOK_LOCATION_CHANGE',
} as const;

@Injectable({
    providedIn: 'root',
})
export class BetradarService {

    constructor(
        protected router: UIRouterGlobals,
        protected stateService: StateService,
        protected sportsbookService: SportsbookService,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected logService: LogService,
        protected dataService: DataService,
        @Inject(WINDOW) private window: Window,
    ) {
        this.registerMethods();
    }

    /**
     * Init betradar sportsbook before run
     *
     * @param destroy Gameplay component destroy
     * @param cdr Gameplay component ChangeDetector
     */
    public initBetradar(destroy: Subject<void>, cdr: ChangeDetectorRef): void {
        this.setBetradarParams();
        this.initNavigation(destroy, cdr);
        this.initErrorHandlers(destroy);
    }

    /**
     * Get daily match
     *
     * @returns {Promise<BetradarGameModel>}
     */
    public async getDailyMatch(): Promise<BetradarGameModel> {
        try {
            const response: IData<IDailyMatchData> = await this.dataService.request('betradarWidgets/dailyMatch');
            if (response.data?.id) {
                return new BetradarGameModel(
                    {service: 'BetradarService', method: 'getDailyMatch'},
                    response.data,
                    this.configService,
                    this.eventService,
                );
            }
        } catch (error) {
            this.logService.sendLog({
                code: '29.1.0',
                data: error,
            });
        }
    }

    /**
     * Get popular events
     *
     * @returns {Promise<BetradarGameModel[]>}
     */
    public async getPopularEvents(): Promise<BetradarGameModel[]> {
        const games: BetradarGameModel[] = [];
        try {
            const response: IData<IPopularEventsData> = await this.dataService.request('betradarWidgets/popularEvents');
            if (response.data) {
                _forEach(response.data.games, (game: IGame) => {
                    games.push(new BetradarGameModel(
                        {service: 'BetradarService', method: 'getPopularEvents'},
                        game,
                        this.configService,
                        this.eventService,
                    ));
                });
            }
        } catch (error) {
            this.logService.sendLog({
                code: '29.1.1',
                data: error,
            });
        }
        return games;
    }

    /**
     * Saves parameters for navigation to the window object.
     * These parameters will be used when loading iframe page.
     */
    private setBetradarParams(): void {
        const urlParams: string[] = [];
        const stateParams = this.router.params;

        _forEach(this.sportsbookService.urlPathParams, (param: string) => {
            const stateParam = stateParams[param];
            if (stateParam) {
                urlParams.push(stateParam);
            }
        });
        this.window['SPORTSBOOK_URL_PATH'] = urlParams;

        const urlQueryParams: {
            [key: string]: string
        } = {};

        _forEach(this.sportsbookService.urlQueryParams, (param: string) => {
            const stateParamVal: string = stateParams[param];
            if (stateParamVal) {
                urlQueryParams[param] = stateParamVal;
            }
        });
        this.window['SPORTSBOOK_URL_QUERY_PARAMS'] = urlQueryParams;

        const {cssFile, configFile, theme} = this.configService.get<IBetradarConfig>('$sportsbook.betradar');

        if (cssFile) {
            this.window['SPORTSBOOK_CUSTOM_CSS'] = cssFile;
        }
        if (configFile) {
            this.window['SPORTSBOOK_CUSTOM_CONFIG'] = configFile;
        }
        if (theme) {
            this.window['SPORTSBOOK_THEME'] = theme;
        }
    }

    /**
     * Init handler for change url by navigation inside betradar iframe
     *
     * @param {Subject<void>} cancel
     */
    private initNavigation(cancel: Subject<void>, cdr: ChangeDetectorRef): void {
        this.sportsbookService.onIframeMessage(BetradarEvents.locationChange)
            .pipe(takeUntil(cancel))
            .subscribe((msg: ILocationChange) => {
                const locationPath: string = _get(msg, 'path');
                if (locationPath) {
                    _forEach(this.sportsbookService.urlPathParams, (param: string) => {
                        _set(this.router.params, param, '');
                    });

                    const stateParams = this.sportsbookService.generateStateParams(locationPath);
                    _merge(this.router.params, stateParams);

                    const stateName: string = this.router.current.name;
                    const urlEvent: string = this.stateService.href(stateName, stateParams);

                    this.eventService.emit({
                        name: 'BETRADAR_URL_CHANGE',
                        data: {
                            name: stateName,
                            url: urlEvent,
                        },
                    });

                    history.replaceState(null, null, urlEvent);
                    cdr.detectChanges();
                }
            });
    }

    /**
     * Init handler for sportsbook error messages
     *
     * @param {Subject<void>} cancel
     */
    private initErrorHandlers(cancel: Subject<void>): void {
        this.sportsbookService.onIframeMessage(BetradarEvents.error)
            .pipe(takeUntil(cancel))
            .subscribe((msg: IError) => {
                if (msg.code === ErrorCodes.UnserNotAuthorized) {
                    this.modalService.showModal('login');
                }
            });
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'dailyMatch',
            url: '/sportsbook/widgets',
            type: 'GET',
            system: 'betradarWidgets',
            params: {
                widget: 'daily-match',
                action: 'widgets',
            },
        });

        this.dataService.registerMethod({
            name: 'popularEvents',
            url: '/sportsbook/widgets',
            type: 'GET',
            system: 'betradarWidgets',
            params: {
                widget: 'popular-events',
                action: 'widgets',
            },
        });
    }
}
