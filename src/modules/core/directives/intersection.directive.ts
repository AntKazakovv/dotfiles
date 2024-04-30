import {
    Directive,
    ElementRef,
    EventEmitter,
    OnDestroy,
    Input,
    Output,
    OnInit,
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

    @Input() private root: HTMLElement | null = null;
    @Input() private rootMargin: string = '0px';
    @Input() private threshold: number | number[] = 0;

    /** Default - after one intersection there will be unsubscribe */
    @Input() private isContinuous: boolean = false;

    @Output() public isIntersecting = new EventEmitter<boolean>();

    public isIntersectingFlag: boolean = false;

    private subscription$!: Subscription;

    constructor(
        private el: ElementRef,
    ) {}

    public ngOnInit(): void {
        this.subscription$ = this.createAndObserve();
    }

    public ngOnDestroy(): void {
        if (this.subscription$) {
            this.subscription$.unsubscribe();
        }
    }

    private createAndObserve(): Subscription {
        const options: IntersectionObserverInit = {
            root: this.root,
            rootMargin: this.rootMargin,
            threshold: this.threshold,
        };

        return new Observable<boolean>(subscriber => {

            const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
                const {isIntersecting} = entries[0];
                subscriber.next(isIntersecting);

                if (isIntersecting && !this.isContinuous) {
                    observer.disconnect();
                }

            }, options);

            observer.observe(this.el.nativeElement);

            return {
                unsubscribe(): void {
                    observer.disconnect();
                },
            };
        })
            .pipe(debounceTime(100))
            .subscribe((status: boolean) => {
                this.isIntersecting.emit(status);
                this.isIntersectingFlag = status;
            });
    }
}
