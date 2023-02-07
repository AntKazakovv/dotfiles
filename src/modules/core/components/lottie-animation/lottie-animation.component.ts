import {
    Component,
    OnInit,
    OnDestroy,
    ElementRef,
    ChangeDetectionStrategy,
    Inject,
    Input,
    NgZone,
    Renderer2,
} from '@angular/core';

import {AnimationItem} from 'lottie-web';
import {AnimationOptions} from 'ngx-lottie';
import _forEach from 'lodash-es/forEach';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './lottie-animation.params';

@Component({
    selector: '[wlc-lottie-animation]',
    templateUrl: './lottie-animation.component.html',
    styleUrls: ['./styles/lottie-animation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LottieAnimationComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.ILottieAnimationCParams;

    public $params: Params.ILottieAnimationCParams;
    public lottieConfig: AnimationOptions;

    private _animationItem: AnimationItem;
    private _intersectionObserver: IntersectionObserver;
    private _mouseenterListener: () => void;
    private _mouseleaveListener: () => void;
    private _clickListener: () => void;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILottieAnimationCParams,
        protected configService: ConfigService,
        private ngZone: NgZone,
        private elementRef: ElementRef,
        private renderer2: Renderer2,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.prepareParams();
    }

    public ngOnDestroy(): void {
        this.removeListeners();
    }

    /**
     * Sets animationItem and adds missing params
     *
     * @param animationItem {AnimationItem} - animation instance
     */
    public animationCreatedHandler(animationItem: AnimationItem): void {
        this._animationItem = animationItem;

        this._animationItem.setSpeed(this.$params.speed);

        if (this.$params.loop) {
            this.initIntersectionObserver();
        }

        this.initListeners();
    }

    /**
     * Handle animation complete event
     */
    public completeHandler(): void {
        switch (this.$params.animationTriggerEvent) {
            case 'click':
                this._animationItem.goToAndStop(0);
                break;
            case 'hover':
                this._animationItem.setDirection(1);
                break;
        }
    }

    private prepareParams(): void {
        this.lottieConfig = {
            path: this.$params.jsonUrl,
            autoplay: this.$params.autoplay,
            loop: this.$params.loop,
        };
    }

    private initIntersectionObserver(): void {
        const observerOptions: IntersectionObserverInit = {
            rootMargin: '0px',
            threshold: 0.2,
        };

        this._intersectionObserver = new IntersectionObserver(
            this.intersectionHandler.bind(this),
            observerOptions,
        );

        this._intersectionObserver.observe(this.elementRef.nativeElement);
    }

    private intersectionHandler(entries: IntersectionObserverEntry[]): void {

        this.ngZone.runOutsideAngular(() => {
            _forEach(entries, ({isIntersecting}: IntersectionObserverEntry) => {
                if (isIntersecting) {
                    this._animationItem.play();
                } else {
                    this._animationItem.pause();
                }
            });
        });
    }

    private initListeners(): void {
        const el: HTMLElement = this.elementRef.nativeElement;

        if (this.$params.animationTriggerEvent === 'hover') {
            this._mouseenterListener = this.renderer2.listen(el, 'mouseenter', () => { this.onMouseenter(); });
            this._mouseleaveListener = this.renderer2.listen(el, 'mouseleave', () => { this.onMouseleave(); });
        }

        if (this.$params.animationTriggerEvent === 'click') {
            this._clickListener = this.renderer2.listen(el, 'click', () => { this.onClick(); });
        }
    }

    private removeListeners(): void {
        if (this._mouseenterListener) {
            this._mouseenterListener();
        }

        if (this._mouseleaveListener) {
            this._mouseleaveListener();
        }

        if (this._clickListener) {
            this._clickListener();
        }

        if (this._intersectionObserver) {
            this._intersectionObserver.disconnect();
        }
    }

    /**
     * Handle mouseenter event
     */
    private onMouseenter(): void {
        this.ngZone.runOutsideAngular(() => {
            this.animationItemPlay(true);
        });
    }

    /**
     * Handle mouseleave event
     */
    private onMouseleave(): void {
        this.ngZone.runOutsideAngular(() => {
            this._animationItem.setDirection(-1);
            this.animationItemPlay(false);
        });
    }

    private animationItemPlay(loopEnable: boolean): void {
        if (this.$params.loopOnHover) {
            this._animationItem.loop = loopEnable;
        }
        this._animationItem.play();
    }

    /**
     * Handle click event
     */
    private onClick(): void {
        if (this._animationItem.isPaused) {
            this.ngZone.runOutsideAngular(() => {
                this._animationItem.play();
            });
        }
    }
}
