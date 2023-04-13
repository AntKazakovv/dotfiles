import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import _isNaN from 'lodash-es/isNaN';

import {SwiperComponent} from 'swiper/angular';
import SwiperCore, {
    FreeMode,
    Swiper,
} from 'swiper';

import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './scrollbar.params';

SwiperCore.use([FreeMode]);

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-scrollbar]',
    templateUrl: './scrollbar.component.html',
    styleUrls: ['./styles/scrollbar.component.scss'],
})
export class ScrollbarComponent extends AbstractComponent implements OnInit, AfterViewInit {

    @ViewChild(SwiperComponent) protected swiper: SwiperComponent;
    @Input() protected inlineParams: Params.IScrollbarCParams;
    @Input() protected update: Subject<void>;
    @Output() protected swiperProgress: EventEmitter<number> = new EventEmitter();

    public override $params: Params.IScrollbarCParams;

    constructor(
        configService: ConfigService,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngAfterViewInit(): void {
        this.initEventHandlers();
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    /**
     * Update swiper after resize
     * @return {void}
     */
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

    /**
     * @param progress {number} — Swiper progress (from 0 to 1)
     * @param speed {number} — Transition duration (in ms)
     * @return {void}
     */
    public setProgress(progress: number, speed?: number): void {
        this.swiper.swiperRef.setProgress(progress, speed);
    }

    protected initEventHandlers(): void {
        if (this.update) {
            this.update.pipe(takeUntil(this.$destroy)).subscribe((): void => {
                this.swiper.initSwiper();
            });
        }

        this.swiper.s_progress
            .pipe(takeUntil(this.$destroy))
            .subscribe(([swiper, progress]: [swiper: Swiper, progress: number]): void => {
                if (!_isNaN(progress)) {
                    this.swiperProgress.emit(progress);
                }

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
