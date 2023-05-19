import {
    Directive,
    ElementRef,
    EventEmitter,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';

import {ResizedEventModel} from 'wlc-engine/modules/core/system/models/resized.model';

@Directive({
    selector: '[wlc-resized]',
})
export class ResizedDirective implements OnInit, OnDestroy {

    private observer: ResizeObserver = new ResizeObserver((entries) => this.zone.run(() => this.observe(entries)));
    private oldRect?: DOMRectReadOnly;

    @Output('wlc-resized')
    public readonly resized = new EventEmitter<ResizedEventModel>();

    constructor(
        private readonly element: ElementRef,
        private readonly zone: NgZone,
    ) {}

    public ngOnInit(): void {
        this.observer.observe(this.element.nativeElement);
    }

    public ngOnDestroy(): void {
        this.observer.disconnect();
    }

    private observe(entries: ResizeObserverEntry[]): void {
        const domSize = entries[0];
        const resizedEvent = new ResizedEventModel(domSize.contentRect, this.oldRect);
        this.oldRect = domSize.contentRect;
        this.resized.emit(resizedEvent);
    }
}
