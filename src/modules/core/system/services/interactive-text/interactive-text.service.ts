import {Injectable} from '@angular/core';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IInteractiveText} from 'wlc-engine/modules/core/system/interfaces/base-config/interactiveText.interface';

import _filter from 'lodash-es/filter';
import {UIRouter} from '@uirouter/core';

export enum InteractiveTextEvents {
    ChangeText = 'CHANGE_INTERACTIVE_TEXT',
}

@Injectable({
    providedIn: 'root',
})
export class InteractiveTextService {
    private interactiveText: IInteractiveText[];

    constructor(
        private configService: ConfigService,
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

    private init(): void {
        this.interactiveText = this.prepareInteractiveText();

        this.router.transitionService.onSuccess({}, () => {
            this.eventService.emit({name: InteractiveTextEvents.ChangeText});
        });
    }

    private prepareInteractiveText(): IInteractiveText[] {
        const interactiveText = this.configService.get<IInteractiveText[]>('$modules.core.interactiveText')
            || this.configService.get<IInteractiveText[]>('$base.interactiveText') || [];
        const useTournaments = this.configService.get<boolean>('$base.tournaments.use');
        const useStore = this.configService.get<boolean>('$base.profile.store.use');

        return _filter(interactiveText, (item) =>
            !(!useTournaments && item.useFor === 'tournaments' || !useStore && item.useFor === 'store'));
    }
}
