import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    Inject,
} from '@angular/core';

import {
    ConfigService,
    EventService,
    ModalService,
} from 'wlc-engine/modules/core';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {RandomGameAbstract} from 'wlc-engine/modules/games/system/classes/random-game.abstract';

import * as Params from './lucky-button.params';

@Component({
    selector: '[wlc-lucky-button]',
    templateUrl: './lucky-button.component.html',
    styleUrls: ['./styles/lucky-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LuckyButtonComponent extends RandomGameAbstract<Params.IFeelingLuckyButtonCParams> {

    constructor(
        public elementRef: ElementRef,
        @Inject('injectParams') protected injectParams: Params.IFeelingLuckyButtonCParams,
        protected configService: ConfigService,
        protected gamesCatalogService: GamesCatalogService,
        protected eventService: EventService,
        protected modalService: ModalService,
    ) {
        super(
            {
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
            modalService,
            eventService,
            gamesCatalogService,
        );
    }

    @HostListener('click')
    protected playRandomGame(): void {
        switch (this.$params.actionType) {
            case 'carousel':
                // TODO https://tracker.egamings.com/issues/352977 сделать открытие модалки после данного тикета
                console.error('https://tracker.egamings.com/issues/352977');
                break;
            case 'random-game':
            default:
                this.toRandomGame();
                break;
        }
    }
}
