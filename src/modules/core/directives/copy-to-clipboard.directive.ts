import {
    Directive,
    Input,
    HostBinding,
    HostListener,
    Output,
    EventEmitter,
} from '@angular/core';


@Directive({
    selector: '[wlc-copy-to-clipboard]',
})
export class CopyToClipboardDirective {
    @Input('wlc-copy-to-clipboard')
    protected payload: string;

    @Output()
    public copied: EventEmitter<string> = new EventEmitter();

    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent): void {
        event.preventDefault();

        if (!this.payload) {
            return;
        }

        const listener = (e: ClipboardEvent) => {
            let clipboard = e.clipboardData || window['clipboardData'];
            clipboard.setData('text', this.payload);
            e.preventDefault();
            this.copied.emit(this.payload);
        };

        document.addEventListener('copy', listener, false);
        document.execCommand('copy');
        document.removeEventListener('copy', listener, false);
    }
}
