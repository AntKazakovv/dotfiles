import {
    Pipe,
    PipeTransform,
} from '@angular/core';
import {
    DomSanitizer,
    SafeHtml,
} from '@angular/platform-browser';

/**
 * Custom pipe to prevent Angular sanitizer edit given HTML
 *
 * @param {string} html  source string
 *
 * @returns {SafeHtml} intact HTML
 *
 * @example <div [innerHTML]="anyHtml | safeHtml">
 */

@Pipe({
    name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {}

    public transform(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
