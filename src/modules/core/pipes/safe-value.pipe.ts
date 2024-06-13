import {
    Pipe,
    PipeTransform,
} from '@angular/core';
import {
    SafeHtml,
    SafeResourceUrl,
    SafeScript,
    SafeStyle,
    SafeUrl,
} from '@angular/platform-browser';

import {DomSanitizerService} from 'wlc-engine/modules/core/system/services/dom-sanitizer/dom-sanitizer.service';

type TSafeType = 'html' | 'style' | 'script' | 'url' | 'resourceUrl';
type TSafeValue = SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl;

/**
 * Custom pipe to prevent Angular domSanitizerService edit given value like HTML, Style, Script, URL or ResourceUrl
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

    constructor(private domSanitizerService: DomSanitizerService) { }

    public transform(value: string, type: TSafeType): TSafeValue {
        switch (type) {
            case 'html':
                return this.domSanitizerService.bypassSecurityTrustHtml(value);
            case 'style':
                return this.domSanitizerService.bypassSecurityTrustStyle(value);
            case 'script':
                return this.domSanitizerService.bypassSecurityTrustScript(value);
            case 'url':
                return this.domSanitizerService.bypassSecurityTrustUrl(value);
            case 'resourceUrl':
                return this.domSanitizerService.bypassSecurityTrustResourceUrl(value);
            default:
                throw new Error('You have to define type of the value');
        }
    }
}
