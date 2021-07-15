import {DOCUMENT} from '@angular/common';
import {
    Directive,
    Output,
    EventEmitter,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges,
    Inject,
} from '@angular/core';
import {
    fromEvent,
    merge,
    Subscription,
} from 'rxjs';
import {first} from 'rxjs/operators';

@Directive({
    selector: '[wlc-click-outside]',
})
export class ClickOutsideDirective implements OnChanges {
    @Input('isOpened') isOpened: boolean = false;
    @Output() clickOutside = new EventEmitter<void>();
    protected $allEvents: Subscription;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        private elementRef: ElementRef<HTMLElement>,
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.isOpened.currentValue && (!this.$allEvents || this.$allEvents.closed)) {
            this.$allEvents = merge(
                    fromEvent(this.document, 'click'),
                    fromEvent(this.document, 'touchstart')
                )
                .pipe(
                    first((event) => {
                        const clickedInside = this.elementRef.nativeElement.contains(event.target as HTMLElement);
                        return !clickedInside ? !!event : null;
                    }),
                )
                .subscribe(() => {
                    this.clickOutside.emit();
                });
        }
    }
}
