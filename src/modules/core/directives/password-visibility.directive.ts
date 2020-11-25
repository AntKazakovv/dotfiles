import {Directive, ElementRef, AfterViewInit} from '@angular/core';

@Directive({
    selector: '[wlc-password-visibility]',
})
export class PasswordVisibilityDirective implements AfterViewInit {

    constructor(
        protected element: ElementRef,
    ) {
    }

    public ngAfterViewInit(): void {
        const field = this.element.nativeElement.querySelector('.wlc-input');
        const icon = this.element.nativeElement.querySelector('.field-icon');

        this.setEvents(icon, field);
    }

    protected setEvents(icon: Element, field: HTMLInputElement): void {
        icon.addEventListener('mousedown', this.toggleType.bind(this, field, 'text'));

        icon.addEventListener('mouseup', this.toggleType.bind(this, field, 'password'));
    }

    protected toggleType(filed: HTMLInputElement, type: string): void {
        filed.type = type;
    }
}
