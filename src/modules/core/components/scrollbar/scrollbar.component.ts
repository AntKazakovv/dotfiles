
import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import {SwiperOptions} from 'swiper';
import {SwiperComponent} from 'swiper/angular';
import SwiperCore, {Scrollbar} from 'swiper/core';

import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import * as Params from './scrollbar.params';

SwiperCore.use([Scrollbar]);
@Component({
    selector: '[wlc-scrollbar]',
    templateUrl: './scrollbar.component.html',
    styleUrls: ['./styles/scrollbar.component.scss'],
})
export class ScrollbarComponent extends AbstractComponent implements OnInit {

    @ViewChild(SwiperComponent) swiper: SwiperComponent;

    @Input() protected inlineParams: Params.IScrollbarCParams;

    public swiperOptions: SwiperOptions = Params.defaultSwiperOptions;

    constructor(
        protected configService: ConfigService,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public contentResizeHandler(): void {
        if (this.swiper) {
            setTimeout(() => {
                this.swiper.updateSwiper({});
            }, 0);
            setTimeout(() => {
                this.swiper.updateSwiper({});
            }, 500);
        }
    }
}
