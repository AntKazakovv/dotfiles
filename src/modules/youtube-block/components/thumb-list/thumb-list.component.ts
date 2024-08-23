import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
    Input,
} from '@angular/core';

import _merge from 'lodash-es/merge';
import _random from 'lodash-es/random';
import {Subject} from 'rxjs';

import {
    AbstractComponent,
    ConfigService,
    IWrapperCParams,
    ISlide,
    ISliderCParams,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';

import {ThumbItemComponent} from 'wlc-engine/modules/youtube-block/components/thumb-item/thumb-item.component';
import {IYoutubeVideoModel} from 'wlc-engine/modules/youtube-block/system/models/youtube-block.model';
import {IThumbItemCParams} from 'wlc-engine/modules/youtube-block/components/thumb-item/thumb-item.params';
import {TVideoEvent} from 'wlc-engine/modules/youtube-block/system/interfaces';

import * as Params from './thumb-list.params';

@Component({
    selector: '[wlc-thumb-list]',
    templateUrl: './thumb-list.component.html',
    styleUrls: ['./styles/thumb-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThumbListComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IThumbListCParams;
    @Input() protected thumbs: IYoutubeVideoModel[];
    @Input() protected events$: Subject<TVideoEvent>;

    public override $params: Params.IThumbListCParams;
    public thumbsSlides: ISlide[] = [];
    public thumbsSliderConfig: IWrapperCParams = {components: []};
    public navigationId: string = _random(10000000).toString(16);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IThumbListCParams,
        configService: ConfigService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        await this.prepareGrid();
    }

    protected async prepareGrid(): Promise<void> {
        if (this.$params.showAsSwiper?.useNavigation) {
            this.$params.showAsSwiper.sliderParams.swiper.navigation = {
                prevEl: `.wlc-swiper-button-prev-${this.navigationId}`,
                nextEl: `.wlc-swiper-button-next-${this.navigationId}`,
            };
        }

        this.thumbsSlides = this.thumbs.map((thumb: IYoutubeVideoModel) => {
            return {
                component: ThumbItemComponent,
                componentParams: <IThumbItemCParams>{
                    video: thumb,
                    events$: this.events$,
                },
            };
        });

        this.thumbsSliderConfig = this.createConfigSliders(this.thumbsSlides);
    }

    protected createConfigSliders(slides: ISlide[]): IFormWrapperCParams {
        return {
            components: [
                {
                    name: 'core.wlc-slider',
                    params: <ISliderCParams>_merge({slides}, this.$params.showAsSwiper?.sliderParams),
                },
            ],
        };
    }
}
