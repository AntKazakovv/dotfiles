import {ChangeDetectorRef, Injectable} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {SportsbookService} from 'wlc-engine/modules/sportsbook/system/services/sportsbook/sportsbook.service';
import {IIndexing} from 'wlc-engine/modules/core';

import {takeUntil} from 'rxjs/operators';
import {Observable, Subject, Subscription} from 'rxjs';

import {
    forEach as _forEach,
    get as _get,
    set as _set,
    merge as _merge,
} from 'lodash-es';

export interface IMessageDataLocationChange {
    path: string;
}

@Injectable({
    providedIn: 'root',
})
export class BetradarService {

    protected events = {
        scrollTop: 'SPORTSBOOK_SCROLL_TOP',
        loaded: 'SPORTSBOOK_LOADED',
        openPage: 'SPORTSBOOK_OPEN_PAGE',
        openLeftMenu: 'SPORTSBOOK_OPEN_LEFT_MENU',
        openRightMenu: 'SPORTSBOOK_OPEN_RIGHT_MENU',
        betsCountChanged: 'SPORTSBOOK_BETS_COUNT_CHANGED',
        hideMenu: 'SPORTSBOOK_HIDE_MENU',
        showMenu: 'SPORTSBOOK_SHOW_MENU',
        locationChange: 'SPORTSBOOK_LOCATION_CHANGE',
    };

    constructor(
        protected router: UIRouter,
        protected sportsbookService: SportsbookService,
    ) {

    }

    /**
     * @ngdoc method
     * @name service.service#setBetradarParams
     * @methodOf angular-wlc-theme.service:SportsbookService
     * @description
     *
     * Saves parameters for navigation to the window object.
     * These parameters will be used when loading iframe page.
     */
    public setBetradarParams(): void {
        const urlParams: string[] = [];
        const stateParams = this.router.stateService.params;

        _forEach(this.sportsbookService.urlPathParams, (param: string) => {
            const stateParam = stateParams[param];
            if (stateParam) {
                urlParams.push(stateParam);
            }
        });
        window['SPORTSBOOK_URL_PATH'] = urlParams;

        const urlQueryParams: {
            [key: string]: string
        } = {};

        _forEach(this.sportsbookService.urlQueryParams, (param: string) => {
            const stateParamVal: string = stateParams[param];
            if (stateParamVal) {
                urlQueryParams[param] = stateParamVal;
            }
        });
        window['SPORTSBOOK_URL_QUERY_PARAMS'] = urlQueryParams;
    }

    /**
     * Init handler for change url by navigation inside betradar iframe
     *
     * @param {Subject<void>} cancel
     */
    public initNavigation(cancel: Subject<void>, cdr: ChangeDetectorRef): void {
        this.sportsbookService.onIframeMessage(this.events.locationChange)
            .pipe(takeUntil(cancel))
            .subscribe((msg: IMessageDataLocationChange) => {
                const locationPath: string = _get(msg, 'path');
                if (locationPath) {
                    _forEach(this.sportsbookService.urlPathParams, (param: string) => {
                        _set(this.router.stateService.params, param, '');
                    });

                    const stateParams = this.sportsbookService.generateStateParams(locationPath);
                    _merge(this.router.stateService.params, stateParams);

                    let stateName: string = _get(this.router.stateService , '$current.self.name');
                    const urlEvent: string = this.router.stateService.href(stateName, stateParams);
                    history.replaceState(null, null, urlEvent);
                    cdr.detectChanges();
                }
            });
    }
}
