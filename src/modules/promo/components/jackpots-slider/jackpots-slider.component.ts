import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {AbstractComponent, ConfigService} from 'wlc-engine/modules/core';
import {ISlide} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {JackpotModel} from 'wlc-engine/modules/games/system/models/jackpot.model';
import {JackpotComponent} from 'wlc-engine/modules/promo/components/jackpot/jackpot.component';
import * as Params from './jackpots-slider.params';

import {
    merge as _merge,
    clone as _clone,
    map as _map,
} from 'lodash-es';

@Component({
    selector: '[wlc-jackpots-slider]',
    templateUrl: './jackpots-slider.component.html',
    styleUrls: ['./styles/jackpots-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JackpotsSliderComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.IJackpotsSliderCParams;
    public slides: ISlide[] = [];
    public ready: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IJackpotsSliderCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected gamesCatalogService: GamesCatalogService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.gamesCatalogService.subscribeJackpots
            .pipe(takeUntil(this.$destroy))
            .subscribe((jackpots: JackpotModel[]) => {
                this.responseToSlides(jackpots);
            });
    }

    protected responseToSlides(response: JackpotModel[]): void {

        this.slides = _map(response, item => ({
            component: JackpotComponent,
            componentParams: {
                theme: this.$params.theme,
                data: item,
            },
        }));

        if (!this.ready) {
            this.ready = true;
        }

        this.cdr.markForCheck();
    }
}
