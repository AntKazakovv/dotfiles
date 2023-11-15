import {Injectable} from '@angular/core';

import {UIRouter} from '@uirouter/core';
import _filter from 'lodash-es/filter';

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IInteractiveText} from 'wlc-engine/modules/core/system/interfaces/base-config/interactiveText.interface';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';

export enum InteractiveTextEvents {
    ChangeText = 'CHANGE_INTERACTIVE_TEXT',
}

@Injectable({
    providedIn: 'root',
})
export class InteractiveTextService {

    public readonly ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });

    private $resolve: () => void;
    private interactiveText: IInteractiveText[];
    private gamesCatalogService: GamesCatalogService;

    constructor(
        private configService: ConfigService,
        private injectionService: InjectionService,
        private eventService: EventService,
        private router: UIRouter,
    ) {
        this.init();
    }

    /**
     * @ngdoc method
     * @name getInteractiveText
     * @returns {IInteractiveText} current interactive texts
     * @description
     *
     * return current interactive texts
     */

    public getInteractiveText(): IInteractiveText {
        if (!this.interactiveText.length) return;

        const randomIndex = GlobalHelper.randomNumber(0, this.interactiveText.length - 1);

        return this.interactiveText[randomIndex];
    }

    private async init(): Promise<void> {
        this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');
        await this.gamesCatalogService.ready;

        this.interactiveText = this.prepareInteractiveText();

        this.router.transitionService.onSuccess({}, () => {
            this.eventService.emit({name: InteractiveTextEvents.ChangeText});
        });

        this.$resolve();
    }

    private prepareInteractiveText(): IInteractiveText[] {
        const interactiveText = this.configService.get<IInteractiveText[]>('$modules.core.interactiveText')
            || this.configService.get<IInteractiveText[]>('$base.interactiveText') || [];
        const useTournaments = this.configService.get<boolean>('$base.tournaments.use');
        const useStore = this.configService.get<boolean>('$base.profile.store.use');


        return _filter(interactiveText, (item) => {
            if (!useTournaments && item.useFor === 'tournaments' || !useStore && item.useFor === 'store') {
                return false;
            }

            if (item.actionParams.url.path === 'app.catalog' || item.actionParams.url.path === 'app.catalog.child') {
                return this.gamesCatalogService.checkInteractiveGame(item);
            }

            return true;
        });
    }
}
