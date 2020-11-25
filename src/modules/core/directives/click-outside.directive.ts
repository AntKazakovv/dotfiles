import {
    Directive,
    Output,
    EventEmitter,
    ElementRef,
    HostListener,
} from '@angular/core';

@Directive({
    selector: '[wlc-click-outside]',
})
export class ClickOutsideDirective {

    @Output() clickOutside = new EventEmitter<void>();

    constructor(private elementRef: ElementRef) {
    }

    @HostListener('document:click', ['$event.target'])
    @HostListener('document:touchstart', ['$event.target'])
    public onClick(target) {
        const clickedInside = this.elementRef.nativeElement.contains(target);
        if (!clickedInside) {
            this.clickOutside.emit();
        }
    }
}
