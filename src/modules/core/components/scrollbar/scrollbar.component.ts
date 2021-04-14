import {
    AfterViewInit,
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

import _get from 'lodash-es/get';

SwiperCore.use([Scrollbar]);
@Component({
    selector: '[wlc-scrollbar]',
    templateUrl: './scrollbar.component.html',
    styleUrls: ['./styles/scrollbar.component.scss'],
})
export class ScrollbarComponent extends AbstractComponent implements OnInit, AfterViewInit {

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

    public ngAfterViewInit(): void {
        this.initEventHandlers();
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

    protected initEventHandlers(): void {
        const elem: HTMLElement = _get(this.swiper, 'elementRef.nativeElement');
        if (elem) {
            elem.onwheel = (event) => {
                event.preventDefault();
            };
        }

        this.swiper.s_progress.subscribe((swiper) => {
            this.removeModifiers(['on-start', 'on-end', 'on-progress']);
            if (swiper.isBeginning) {
                this.addModifiers('on-start');
            } else if (swiper.isEnd) {
                this.addModifiers('on-end');
            } else {
                this.addModifiers('on-progress');
            }
        });
    }
}
