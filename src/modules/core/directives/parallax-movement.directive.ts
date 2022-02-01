import {
    Directive,
    Input,
    ElementRef,
    AfterViewInit,
    OnInit,
    Inject,
    OnDestroy,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
    fromEvent,
    Subject,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {WINDOW} from 'wlc-engine/modules/app/system';

import _each from 'lodash-es/each';

@Directive({
    selector: '[wlc-parallax]',
})
export class ParallaxMovementDirective implements OnInit, AfterViewInit, OnDestroy {
    @Input() protected parentElement: string = '.wlc-slider[wlc-banners-slider]';
    @Input() protected bgParallax: string = '.banner_bg img';
    @Input() protected decorParallax: string = '.banner__decor img';
    @Input() protected widthCoefficient: number = 0.008;
    @Input() protected heightCoefficient: number = 0.002;
    @Input() protected onlyActiveSlide: boolean = true;

    protected elementsParallaxImg: HTMLElement[] = [];
    protected bg: HTMLElement;
    protected swiper: HTMLElement;
    protected $destroy: Subject<void> = new Subject();
    protected isActiveSLide: boolean;

    constructor(
        private elementRef: ElementRef,
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) protected window: Window,
    ) {}

    public ngOnInit(): void {
        if (this.window.matchMedia('(pointer: coarse)')) {
            return;
        }
    }

    public ngAfterViewInit(): void {
        this.getElements();
        this.subscribeEvents();
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    protected getElements(): void {
        this.swiper = this.elementRef.nativeElement.closest(this.parentElement);
        this.elementsParallaxImg = this.elementRef.nativeElement.querySelectorAll(this.decorParallax);
        this.bg = this.elementRef.nativeElement.querySelector(this.bgParallax);
    }

    protected subscribeEvents(): void {
        fromEvent(this.swiper, 'mousemove')
            .pipe(takeUntil(this.$destroy))
            .subscribe((e: MouseEvent) => {
                if (!this.onlyActiveSlide ||
                    (this.onlyActiveSlide && !!this.elementRef.nativeElement.closest('.swiper-slide-active'))) {
                    this.mouseMovement(e);
                }
            });

        fromEvent(this.swiper, 'mouseleave')
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => {
                this.mouseLeave();
            });
    }

    protected mouseLeave(): void {
        this.bg.style.transform = 'initial';
    }

    protected mouseMovement(e: MouseEvent): void {
        const width = this.window.innerWidth / 2, height = this.window.innerHeight / 2;
        const mouseX = e.clientX, mouseY = e.clientY;
        const deltaW = mouseX - width, deltaH = mouseY - height;
        const depth = `${deltaW * this.widthCoefficient}px, ${deltaH * this.widthCoefficient}px`;
        const depthBg = `${deltaW * this.heightCoefficient}%, ${deltaH * this.heightCoefficient}%`;

        _each(this.elementsParallaxImg, (element: HTMLElement) => {
            if (element) {
                element.style.transform = `translate(${depth})`;
            }
        });

        this.bg.style.transform = `translate(${depthBg}) scale(1.05)`;
        e.stopPropagation();
    }
}
