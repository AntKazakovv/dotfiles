import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';

import {
    fromEvent,
    Subject,
    timer,
} from 'rxjs';
import {
    debounce,
    filter,
    takeUntil,
} from 'rxjs/operators';

import _min from 'lodash-es/min';
import _parseInt from 'lodash-es/parseInt';
import _random from 'lodash-es/random';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ActionService} from 'wlc-engine/modules/core/system/services';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './animate-sprite.params';

@Component({
    selector: '[wlc-animate-sprite]',
    templateUrl: './animate-sprite.component.html',
    styleUrls: ['./styles/animate-sprite.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimateSpriteComponent extends AbstractComponent implements OnInit, OnDestroy {
    @ViewChild('canvasRef', {static: true}) protected canvasRef: ElementRef<HTMLCanvasElement>;
    @ViewChild('imageRef', {static: true}) protected imageRef: ElementRef<HTMLImageElement>;

    @Input() public parentElementRef: HTMLElement;
    @Input() protected inlineParams: Params.IAnimateSpriteCParams;

    public $params: Params.IAnimateSpriteCParams;

    protected context: CanvasRenderingContext2D;
    protected frameWidth: number;
    protected frameHeight: number;
    protected imageSizes: Params.ISizes;

    protected playUntilMouseLeave: boolean = false;
    protected isPlaying: boolean = false;
    protected inited: boolean = false;
    protected shouldAnimationPlayFromOut: boolean = false;
    protected activeFrame: number = 0;
    protected rafID: ReturnType<typeof requestAnimationFrame>;
    protected currentCycleCount: number = 0;

    protected animationStop$: Subject<void> = new Subject();
    protected animationStart$: Subject<void> = new Subject();

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAnimateSpriteCParams,
        @Inject(WINDOW) protected window: Window,
        protected actionService: ActionService,
        protected configService: ConfigService,
        protected elementRef: ElementRef<HTMLElement>,
        protected cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.IAnimateSpriteCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.setSubscribes();
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        this.window.cancelAnimationFrame(this.rafID);
    }

    protected setSubscribes(): void {
        this.subscribeImageLoaded();
        this.subscribeAnimationStart();
        this.subscribeAnimationStop();
        this.subscribeOnEvent();
        this.subscribeOnEventFromOut();
        this.setAutoAnimating();
        this.subscribeResize();
    }

    protected runAnimate(): void {
        if (this.isPlaying || !this.inited) {
            return;
        }

        this.animationStart$.next();
        this.runRequestAnimationFrame(Date.now());
    }

    protected runRequestAnimationFrame(startDate: number): void {
        if (this.rafID) {
            this.window.cancelAnimationFrame(this.rafID);
        }

        this.rafID = this.window.requestAnimationFrame(() => this.stepAnimation(startDate));
    }

    protected stepAnimation(startDate: number): void {
        const dateNow = Date.now();

        if (startDate + this.$params.interval >= dateNow) {
            this.runRequestAnimationFrame(startDate);
            return;
        }

        const lastFrame = this.$params.framesCount - 1;
        this.drawImage();

        if (this.activeFrame < lastFrame && this.isPlaying) {
            this.activeFrame++;
            this.runRequestAnimationFrame(dateNow);
            return;
        }

        if (this.activeFrame >= lastFrame) {
            this.activeFrame = 0;
            this.currentCycleCount++;
            this.animationStop$.next();
        }
    }

    protected subscribeOnEventFromOut(): void {
        if (this.parentElementRef) {
            fromEvent<MouseEvent>(this.parentElementRef, 'mouseenter')
                .pipe(takeUntil(this.$destroy))
                .subscribe(() => {
                    this.shouldAnimationPlayFromOut = true;
                    this.playUntilMouseLeave = this.$params.animateUntilMouseLeave;
                    this.runAnimate();
                });

            fromEvent<MouseEvent>(this.parentElementRef, 'mouseleave')
                .pipe(takeUntil(this.$destroy))
                .subscribe(() => {
                    this.shouldAnimationPlayFromOut = false;
                    this.playUntilMouseLeave = false;
                    this.stopOnCycleIsNotFull();
                });
        }
    }

    protected subscribeOnEvent(): void {
        if (this.$params.useEventsOnCanvas) {
            fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mouseenter')
                .pipe(takeUntil(this.$destroy))
                .subscribe(() => {
                    this.playUntilMouseLeave = this.$params.animateUntilMouseLeave;
                    this.runAnimate();
                });

            fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mouseleave')
                .pipe(
                    takeUntil(this.$destroy),
                    filter(() => !this.shouldAnimationPlayFromOut))
                .subscribe(() => {
                    this.playUntilMouseLeave = false;
                    this.stopOnCycleIsNotFull();
                });
        }
    }

    protected subscribeImageLoaded(): void {
        fromEvent(this.imageRef.nativeElement, 'load')
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => {
                this.calc();
                this.inited = true;
            });
    }

    protected subscribeResize(): void {
        if (this.$params.resize.use) {
            this.actionService.windowResize()
                .pipe(
                    debounce(() => timer(this.$params.resize.debounce)),
                    takeUntil(this.$destroy),
                )
                .subscribe(() => {
                    this.calc();
                    this.cdr.markForCheck();
                });
        }
    }

    protected setAutoAnimating(): void {
        const {use, intervalFrom, intervalTo} = this.$params.autoAnimating;

        if (use) {
            timer(_random(intervalFrom, intervalTo))
                .pipe(
                    takeUntil(this.animationStart$),
                    takeUntil(this.$destroy),
                )
                .subscribe(() => {
                    this.runAnimate();
                });
        }
    }

    protected subscribeAnimationStop(): void {
        this.animationStop$
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => {
                this.isPlaying = false;

                if (this.playUntilMouseLeave) {
                    this.runAnimate();
                    return;
                }

                if (this.$params.fullAnimatingCycle && this.currentCycleCount < this.$params.animationCycleCount) {
                    this.runAnimate();
                    return;
                }

                if (this.$params.fullAnimatingCycle && this.currentCycleCount >= this.$params.animationCycleCount) {
                    this.currentCycleCount = 0;
                }

                this.setAutoAnimating();
            });
    }

    protected subscribeAnimationStart(): void {
        this.animationStart$
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => this.isPlaying = true);
    }

    protected drawImage(): void {
        this.context.clearRect(0, 0, this.imageSizes.width, this.imageSizes.height);

        this.context.drawImage(
            this.imageRef.nativeElement,
            0, this.activeFrame * this.frameHeight,
            this.frameWidth, this.frameHeight,
            0, 0,
            this.imageSizes.width, this.imageSizes.height,
        );
    }

    protected stopOnCycleIsNotFull(): void {
        if (this.$params.fullAnimatingCycle) {
            return;
        }

        this.animationStop$.next();
    }

    protected calc(): void {
        const canvas = this.canvasRef.nativeElement;
        const thisElementStyles = getComputedStyle(this.elementRef.nativeElement);
        this.frameWidth = this.imageRef.nativeElement.naturalWidth;
        this.frameHeight = this.imageRef.nativeElement.naturalHeight / this.$params.framesCount;

        const thisElementSizes: Params.ISizes = {
            width: _parseInt(thisElementStyles.width),
            height: _parseInt(thisElementStyles.height),
        };

        const ratio = _min([
            thisElementSizes.width / this.frameWidth,
            thisElementSizes.height / this.frameHeight,
        ]);

        this.imageSizes = {
            width: this.frameWidth * ratio,
            height: this.frameHeight * ratio,
        };

        canvas.width = this.imageSizes.width;
        canvas.height = this.imageSizes.height;
        this.context = canvas.getContext('2d');
        this.drawImage();
    }
}
