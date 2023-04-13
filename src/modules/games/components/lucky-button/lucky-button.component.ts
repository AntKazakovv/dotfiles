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
        configService: ConfigService,
        gamesCatalogService: GamesCatalogService,
        eventService: EventService,
        modalService: ModalService,
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
                this.modalService.showModal('gamesSlider');
                break;
            case 'random-game':
            default:
                this.toRandomGame();
                break;
        }
    }
}
