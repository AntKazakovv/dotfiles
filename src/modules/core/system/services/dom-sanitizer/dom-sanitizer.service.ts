import {
    Injectable,
    SecurityContext,
} from '@angular/core';
import {
    DomSanitizer,
    SafeValue,
    SafeHtml,
    SafeStyle,
    SafeScript,
    SafeUrl,
    SafeResourceUrl,
} from '@angular/platform-browser';

import _isString from 'lodash-es/isString';

import {SanitizingHtmlSerializer} from './classes/sanitizing-html-serializer.class';

@Injectable()
export class DomSanitizerService {

    constructor(
        private domSanitizer: DomSanitizer,
    ) {}

    public sanitizeHtml(value: string): string {
        return this.sanitize(SecurityContext.HTML, value);
    }

    public sanitizeStyle(value: string): string {
        return this.sanitize(SecurityContext.STYLE, value);
    }

    public sanitizeScript(value: string): string {
        return this.sanitize(SecurityContext.SCRIPT, value);
    }

    public sanitizeUrl(value: string): string {
        return this.sanitize(SecurityContext.URL, value);
    }

    public sanitizeResourceUrl(value: string): string {
        return this.sanitize(SecurityContext.RESOURCE_URL, value);
    }

    public bypassSecurityTrustHtml(value: string): SafeHtml {
        return this.domSanitizer.bypassSecurityTrustHtml(value);
    }

    public bypassSecurityTrustStyle(value: string): SafeStyle {
        return this.domSanitizer.bypassSecurityTrustStyle(value);
    }

    public bypassSecurityTrustScript(value: string): SafeScript {
        return this.domSanitizer.bypassSecurityTrustScript(value);
    }

    public bypassSecurityTrustUrl(value: string): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustUrl(value);
    }

    public bypassSecurityTrustResourceUrl(value: string): SafeResourceUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
    }

    private sanitize(context: SecurityContext, value: SafeValue | string | null): string {
        if (context === SecurityContext.HTML && _isString(value)) {
            return this.sanitizeHtmlVal(value);
        }
        return this.domSanitizer.sanitize(context, value);
    };

    private sanitizeHtmlVal(unsafeHtmlInput: string): string {
        let inertBodyElement: HTMLElement = null;
        try {
            let unsafeHtml = unsafeHtmlInput || '';
            inertBodyElement = this.getInertBodyElement(unsafeHtml);
            // mXSS protection. Repeatedly parse the document to make sure it stabilizes, so that a browser
            // trying to auto-correct incorrect HTML cannot cause formerly inert HTML to become dangerous.
            let mXSSAttempts = 5;
            let parsedHtml = unsafeHtml;
            do {
                if (mXSSAttempts === 0) {
                    throw new Error('Failed to sanitize html because the input is unstable');
                }
                mXSSAttempts--;
                unsafeHtml = parsedHtml;
                parsedHtml = inertBodyElement.innerHTML;
                inertBodyElement = this.getInertBodyElement(unsafeHtml);
            } while (unsafeHtml !== parsedHtml);
            const sanitizer = new SanitizingHtmlSerializer();
            const safeHtml = sanitizer.sanitizeChildren(inertBodyElement);
            if (sanitizer.sanitizedSomething) {
                console.warn('WARNING: sanitizing HTML stripped some content, see https://g.co/ng/security#xss');
            }
            return safeHtml;
        } finally {
            // In case anything goes wrong, clear out inertElement to reset the entire DOM structure.
            if (inertBodyElement) {
                const parent: HTMLElement = inertBodyElement;
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }
            }
        }
    }

    private getInertBodyElement(html: string): HTMLElement | null {
        // We add these extra elements to ensure that the rest of the content is parsed as expected
        // e.g. leading whitespace is maintained and tags like `<meta>` do not get hoisted to the
        // `<head>` tag. Note that the `<body>` tag is closed implicitly to prevent unclosed tags
        // in `html` from consuming the otherwise explicit `</body>` tag.
        html = '<body><remove></remove>' + html;
        try {
            const body: HTMLElement = new DOMParser()
                .parseFromString(html, 'text/html')
                .body;
            body.removeChild(body.firstChild);
            return body;
        } catch {
            return null;
        }
    }
}

