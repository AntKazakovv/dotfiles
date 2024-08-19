import {DOCUMENT} from '@angular/common';
import {
    Directive,
    Input,
    HostListener,
    Output,
    EventEmitter,
    Inject,
    Renderer2,
    ElementRef,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

@Directive({
    selector: '[wlc-copy-to-clipboard]',
})
export class CopyToClipboardDirective {
    @Input('wlc-copy-to-clipboard')
    protected payload: UntypedFormControl | string;

    @Output()
    public copied: EventEmitter<string> = new EventEmitter();

    private textarea: HTMLTextAreaElement;
    private inputValue: string;

    constructor(
        protected configService: ConfigService,
        protected renderer: Renderer2,
        private el: ElementRef,
        @Inject(DOCUMENT) protected document: HTMLDocument,
    ) {}

    @HostListener('click', ['$event'])
    public async onClick(event: MouseEvent): Promise <void> {
        event.preventDefault();

        this.inputValue = (typeof(this.payload) === 'string') ? this.payload : this.payload.value;

        if (!this.inputValue) {
            return;
        }

        await this.copy();
    }

    private createTextarea(): void {
        const textarea = this.textarea = this.renderer.createElement('textarea');

        this.renderer.setStyle(textarea, 'position', 'fixed');
        this.renderer.setStyle(textarea, 'opacity', '0');
        this.renderer.setStyle(textarea, 'left', '-999em');

        this.renderer.setAttribute(textarea, 'aria-hidden' ,'true');
        textarea.value = this.inputValue;
        this.renderer.appendChild(this.el.nativeElement, textarea);
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
                await navigator.clipboard.writeText(this.inputValue);
            }
        } catch (error) {
            // beer or not to beer...
        } finally {
            this.copied.emit(this.inputValue);
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
