import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    Inject,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
    ModalService,
} from 'wlc-engine/modules/core';

import * as Params from './lucky-button.params';

@Component({
    selector: '[wlc-lucky-button]',
    templateUrl: './lucky-button.component.html',
    styleUrls: ['./styles/lucky-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LuckyButtonComponent extends AbstractComponent implements OnInit {
    public $params: Params.IFeelingLuckyButtonCParams;

    constructor(
        public elementRef: ElementRef,
        @Inject('injectParams') protected injectParams: Params.IFeelingLuckyButtonCParams,
        protected configService: ConfigService,
        protected modalSerice: ModalService,
    ) {
        super(
            <IMixedParams<Params.IFeelingLuckyButtonCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    // TODO https://tracker.egamings.com/issues/352977 сделать открытие модалки после данного тикета
    @HostListener('click')
    protected showModal(): void {
        console.error('https://tracker.egamings.com/issues/352977 сделать открытие модалки после данного тикета');
    }
}
