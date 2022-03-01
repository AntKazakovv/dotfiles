import {DOCUMENT} from '@angular/common';
import {
    Directive,
    Input,
    HostListener,
    Output,
    EventEmitter,
    Inject,
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
        @Inject(DOCUMENT) protected document: HTMLDocument,
    ) {}

    @HostListener('click', ['$event'])
    public async onClick(event: MouseEvent): Promise <void> {
        event.preventDefault();

        if (!this.payload) {
            return;
        }

        await this.copy();
    }

    private createTextarea(): void {
        const textarea = this.textarea = document.createElement('textarea');
        const styles = textarea.style;

        styles.position = 'fixed';
        styles.top = styles.opacity = '0';
        styles.left = '-999em';

        textarea.setAttribute('aria-hidden' ,'true');
        textarea.value = this.payload;
        this.document.body.appendChild(textarea);
    }

    private async copy(): Promise <void> {
        this.createTextarea();

        const textarea = this.textarea;

        try {
            if (textarea) {
                const currentFocus = this.document.activeElement as HTMLElement;

                textarea.select();
                textarea.setSelectionRange(0, textarea.value.length);

                if (currentFocus) {
                    currentFocus.focus();
                }
                await navigator.clipboard.writeText(this.payload);
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
