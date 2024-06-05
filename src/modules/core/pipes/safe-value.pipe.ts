import {
    Pipe,
    PipeTransform,
} from '@angular/core';
import {
    DomSanitizer,
    SafeHtml,
    SafeResourceUrl,
    SafeScript,
    SafeStyle,
    SafeUrl,
} from '@angular/platform-browser';

type TSafeType = 'html' | 'style' | 'script' | 'url' | 'resourceUrl';
type TSafeValue = SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl;

/**
 * Custom pipe to prevent Angular sanitizer edit given value like HTML, Style, Script, URL or ResourceUrl
 *
 * @param {string} value source string
 *
 * @param {string} type string with html, style, script, url or resourceUrl
 *
 * @returns {TSafeValue} intact value
 *
 * @example <div [innerHTML]="anyHtml | safeValue:'html'">
 */

@Pipe({
    name: 'safeValue',
})
export class SafeValuePipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    public transform(value: string, type: TSafeType): TSafeValue {
        switch (type) {
            case 'html':
                return this.sanitizer.bypassSecurityTrustHtml(value);
            case 'style':
                return this.sanitizer.bypassSecurityTrustStyle(value);
            case 'script':
                return this.sanitizer.bypassSecurityTrustScript(value);
            case 'url':
                return this.sanitizer.bypassSecurityTrustUrl(value);
            case 'resourceUrl':
                return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            default:
                throw new Error('You have to define type of the value');
        }
    }
}
