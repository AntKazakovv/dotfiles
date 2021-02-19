import {DOCUMENT} from '@angular/common';
import {
    Directive,
    Input,
    HostListener,
    Output,
    EventEmitter,
} from '@angular/core';

import {ConfigService} from 'wlc-engine/modules/core';

@Directive({
    selector: '[wlc-copy-to-clipboard]',
})
export class CopyToClipboardDirective {
    @Input('wlc-copy-to-clipboard')
    protected payload: string;

    @Output()
    public copied: EventEmitter<string> = new EventEmitter();

    private textarea: HTMLTextAreaElement;

    constructor(
        protected configService: ConfigService,
    ) {}

    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent): void {
        event.preventDefault();

        if (!this.payload) {
            return;
        }

        this.copy();
    }

    private createTextarea(): void {
        const textarea = this.textarea = document.createElement('textarea');
        const styles = textarea.style;

        styles.position = 'fixed';
        styles.top = styles.opacity = '0';
        styles.left = '-999em';

        textarea.setAttribute('aria-hidden' ,'true');
        textarea.value = this.payload;
        document.body.appendChild(textarea);
    }

    private copy(): void {
        this.createTextarea();

        const textarea = this.textarea;
        let successful = false;

        try {
            if (textarea) {
                const currentFocus = document.activeElement as HTMLElement;

                textarea.select();
                textarea.setSelectionRange(0, textarea.value.length);
                successful = document.execCommand('copy');

                if (currentFocus) {
                    currentFocus.focus();
                }
            }
        } catch (error) {
            // beer or not to beer...
        } finally {
            this.copied.emit(this.payload);
            this.destroy();
        }
    }

    private destroy(): void {
        const textarea = this.textarea;

        if (textarea) {
            if (textarea.parentNode) {
                textarea.parentNode.removeChild(textarea);
            }

            this.textarea = undefined;
        }
    }
}
