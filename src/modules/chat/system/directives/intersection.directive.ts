import {
    Directive,
    ElementRef,
    EventEmitter,
    OnDestroy,
    Input,
    Output,
    OnInit,
    Renderer2,
} from '@angular/core';
import {
    Observable,
    Subscription,
    debounceTime,
} from 'rxjs';

@Directive({
    selector: '[wlc-observer-element]',
    exportAs: 'intersection',
})

export class IntersectionDirective implements OnInit, OnDestroy {
    @Input() protected rootMargin: string = '0px';
    @Input() protected threshold: number | number[] = 1;

    @Output() public isIntersecting = new EventEmitter<boolean>();

    public isIntersectingFlag: boolean = false;
    protected subscription$!: Subscription;

    constructor(
        protected renderer: Renderer2,
        protected el: ElementRef,
    ) {}

    public ngOnInit(): void {
        this.subscription$ = this.createAndObserve();
    }

    public ngOnDestroy(): void {
        if (this.subscription$) {
            this.subscription$.unsubscribe();
        }
    }

    protected createAndObserve(): Subscription {

        const options: IntersectionObserverInit = {
            root: this.renderer.parentNode(this.el.nativeElement),
            rootMargin: this.rootMargin,
            threshold: this.threshold,
        };

        return new Observable<boolean>(subscriber => {

            const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
                const {isIntersecting} = entries[0];
                subscriber.next(isIntersecting);
            }, options);

            observer.observe(this.el.nativeElement);

            return {
                unsubscribe() {
                    observer.disconnect();
                },
            };
        })
            .pipe(debounceTime(100))
            .subscribe(status => {
                this.isIntersecting.emit(status);
                this.isIntersectingFlag = status;
            });
    }
}
