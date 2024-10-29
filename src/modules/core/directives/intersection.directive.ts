import {
    Directive,
    ElementRef,
    EventEmitter,
    OnDestroy,
    Input,
    Output,
    OnInit,
    HostBinding,
    inject,
} from '@angular/core';

import {
    Observable,
    Subscription,
    debounceTime,
    distinctUntilChanged,
} from 'rxjs';

import {
    ILazyLoadingIntersectionObserver,
    TIntersectionVisibility,
} from 'wlc-engine/modules/core/system/interfaces/base-config/optimization.interface';
import {ConfigService} from 'wlc-engine/modules/core/system/services';

@Directive({
    selector: '[wlc-observer-element]',
    exportAs: 'intersection',
})
export class IntersectionDirective implements OnInit, OnDestroy {

    @HostBinding('style.visibility') public visibility: TIntersectionVisibility = '';

    @Input() protected root: HTMLElement | null = null;
    @Input() protected rootMargin: string | null = null;
    @Input() protected threshold: number | number[] | null = null;

    /** Default - after one intersection there will be unsubscribe */
    @Input() protected isContinuous: boolean | null = null;
    /** isVisibility = true - visibility will be set to 'hidden' if element is not viewport  */
    @Input() protected useVisibility: boolean | null = null;

    @Output() public isIntersecting = new EventEmitter<boolean>();

    public isIntersectingFlag: boolean = false;

    protected elementRef: ElementRef = inject(ElementRef);
    protected configService: ConfigService = inject(ConfigService);

    protected subscription$!: Subscription;

    public ngOnInit(): void {
        const baseConfig = this.configService
            .get<ILazyLoadingIntersectionObserver>('$base.optimization.lazyLoadingIntersectionObserver');
        const isUse = !!baseConfig?.use || false;

        if (!isUse) {
            // stop init directive
            return;
        }

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

        if (this.useVisibility) {
            this.visibility = 'hidden';
        }

        return new Observable<boolean>(subscriber => {

            const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
                const {isIntersecting} = entries[0];
                subscriber.next(isIntersecting);
                const isDisconnect: boolean = isIntersecting && !this.isContinuous && !this.useVisibility;

                if (isDisconnect) {
                    observer.disconnect();
                }

            }, options);

            observer.observe(this.elementRef.nativeElement);

            return {
                unsubscribe(): void {
                    observer.disconnect();
                },
            };
        })
            .pipe(
                distinctUntilChanged(),
                debounceTime(100))
            .subscribe((status: boolean) => {
                this.isIntersecting.emit(status);
                this.isIntersectingFlag = status;

                if (this.useVisibility) {
                    this.visibility = status ? 'visible' : 'hidden';
                }
            });
    }
}
