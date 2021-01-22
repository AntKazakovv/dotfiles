import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    ViewChild,
    TemplateRef,
    Self,
    Optional,
} from '@angular/core';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {takeUntil} from 'rxjs/operators';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {WinnersService} from 'wlc-engine/modules/promo/system/services';
import {ConfigService} from 'wlc-engine/modules/core';
import {ISlide, ISliderCParams} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {WinnerModel} from 'wlc-engine/modules/promo/system/models/winner.model';

import * as Params from './winners-slider.params';

import {
    merge as _merge,
    clone as _clone,
    cloneDeep as _cloneDeep,
} from 'lodash';
import {WinnerComponent} from 'wlc-engine/modules/promo/components/winner/winner.component';

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

    protected responseToSlides(responce: WinnerModel[]): void {

        this.slides = responce.map((item: WinnerModel) => {
            return {
                component: WinnerComponent,
                componentParams: _merge(
                    {theme: this.$params.theme},
                    this.$params.winner,
                    {winner: item},
                ),
            };
        });

        if (!this.ready && this.slides.length) {
            this.ready = true;
        }

        this.cdr.markForCheck();
    }

    protected prepareSliderParams(): void {

        let swiper: SwiperConfigInterface = _clone(Params.swiperParamsDefault[this.$params.theme])
                                        || _clone(Params.swiperParamsDefault.default);

        if (this.$params.swiper) {
            swiper = _merge({}, swiper, this.$params.swiper);
        }

        this.sliderParams.swiper = swiper;

        this.cdr.markForCheck();
    }

}
