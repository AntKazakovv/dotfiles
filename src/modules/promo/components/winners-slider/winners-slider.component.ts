import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    ViewChild,
    TemplateRef,
} from '@angular/core';
import {SwiperOptions} from 'swiper';
import {takeUntil} from 'rxjs/operators';

import {AbstractComponent, ConfigService} from 'wlc-engine/modules/core';
import {ISlide, ISliderCParams} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {WinnerComponent} from 'wlc-engine/modules/promo/components/winner/winner.component';
import {WinnerModel} from 'wlc-engine/modules/promo/system/models/winner.model';
import {WinnersService} from 'wlc-engine/modules/promo/system/services';
import * as Params from './winners-slider.params';

import {
    merge as _merge,
    clone as _clone,
} from 'lodash-es';

@Component({
    selector: '[wlc-winners-slider]',
    templateUrl: './winners-slider.component.html',
    styleUrls: ['./styles/winners-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnersSliderComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.IWinnersSliderCParams;
    public $params: Params.IWinnersSliderCParams;

    public sliderParams: ISliderCParams = {
        swiper: {},
    };
    public slides: ISlide[] = [];

    public ready: boolean = false;
    @ViewChild('winner') winner: TemplateRef<WinnerModel>;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IWinnersSliderCParams,
        protected configService: ConfigService,
        protected winnersService: WinnersService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareSliderParams();

        if (!this.$params.title) {
            this.addModifiers('headless');
        }

        this.initSubscribers();
    }

    protected initSubscribers(): void {

        if (this.$params.type === 'biggest') {
            this.winnersService.biggestWinsObserver
                .pipe(takeUntil(this.$destroy))
                .subscribe((winners: WinnerModel[]) => {
                    this.responseToSlides(winners);
                });
        } else {
            this.winnersService.latestWinsObserver
                .pipe(takeUntil(this.$destroy))
                .subscribe((winners: WinnerModel[]) => {
                    this.responseToSlides(winners);
                });
        }
    }

    protected responseToSlides(response: WinnerModel[]): void {

        this.slides = response.map((item: WinnerModel) => {
            return {
                component: WinnerComponent,
                componentParams: _merge(
                    {theme: this.$params.theme},
                    this.$params.winner,
                    {winner: item},
                    {
                        winnerType: this.$params.type,
                        wlcElement: 'block_item-' + this.$params.type + '-wins',
                    },
                ),
            };
        });

        if (!this.ready) {
            this.ready = true;
        }

        this.cdr.markForCheck();
    }

    protected prepareSliderParams(): void {

        let swiper: SwiperOptions = _clone(Params.swiperParamsDefault[this.$params.theme])
                                        || _clone(Params.swiperParamsDefault.default);

        if (this.$params.swiper) {
            swiper = _merge({}, swiper, this.$params.swiper);
        }

        this.sliderParams.swiper = swiper;
        this.sliderParams.wlcElement = 'list_' + this.$params.type + '-wins';
        this.cdr.markForCheck();
    }
}
