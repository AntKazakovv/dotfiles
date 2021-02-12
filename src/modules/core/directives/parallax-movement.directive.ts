import {
    Directive,
    Input,
    ElementRef,
    AfterViewInit, OnInit,
} from '@angular/core';
import {fromEvent} from "rxjs/internal/observable/fromEvent";

import {
    each as _each,
} from 'lodash-es';

@Directive({
    selector: '[wlc-parallax]',
})
export class ParallaxMovementDirective implements OnInit,
    AfterViewInit {

    @Input() parentElement: string = '.wlc-slider[wlc-banners-slider]';
    @Input() bgParallax: string = '.banner_bg img';
    @Input() decorParallax: string = '.banner__decor img';

    protected elementsParallaxImg: HTMLElement[] = [];
    protected bg: HTMLElement;

    constructor(private elementRef: ElementRef) {

    }

    public ngOnInit(): void {
        if (!window.matchMedia('hover:hover')) {
            return;
        }
    }

    public ngAfterViewInit(): void {
        this.getElements();

        fromEvent(document.querySelector(`${this.parentElement}`), 'mousemove')
            .subscribe((e: MouseEvent) => {
                this.mouseMovement(e);
            });

        fromEvent(document.querySelector(`${this.parentElement}`), 'mouseleave')
            .subscribe((e: MouseEvent) => {
                this.mouseLeave();
            });
    }

    protected getElements(): void {
        this.elementsParallaxImg = this.elementRef.nativeElement.querySelectorAll(this.decorParallax);
        this.bg = this.elementRef.nativeElement.querySelector(this.bgParallax);
    }

    protected mouseLeave(): void {
        this.bg.style.transform = 'initial';
    }

    protected mouseMovement(e: MouseEvent): void {
        const width = window.innerWidth / 2, height = window.innerHeight / 2;
        const mouseX = e.clientX, mouseY = e.clientY;
        const depth = `${(mouseX - width) * 0.008}px, ${(mouseY - height) * 0.008}px`;
        const depthBg = `${(mouseX - width) * 0.002}% , ${(mouseY - height) * 0.002}%`;

        _each(this.elementsParallaxImg, (element: HTMLElement) => {
            if (element) {
                element.style.transform = `translate(${depth})`;
            }
        });

        this.bg.style.transform = `translate(${depthBg}) scale(1.05)`;
        e.stopPropagation();
    }
}
