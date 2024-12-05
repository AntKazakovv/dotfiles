import _includes from 'lodash-es/includes';

/**
 * SanitizingHtmlSerializer serializes a DOM fragment, stripping out any unsafe elements and unsafe
 * attributes.
 */
export class SanitizingHtmlSerializer {

    private SAFE_URL_PATTERN = /^(?!javascript:)(?:[\d+.a-z-]+:|[^#&\/:?]*(?:[#\/?]|$))/i;
    private UNSAFE_TAGS = new Set([
        'script',
    ]);
    private URI_ATTRS = new Set([
        'background',
        'cite',
        'href',
        'itemtype',
        'longdesc',
        'poster',
        'src',
        'xlink:href',
    ]);
    /** Regular Expressions for parsing tags and attributes */
    private SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    /** ! to ~ is the ASCII range. */
    private NON_ALPHANUMERIC_REGEXP = /([^ !\#-~])/g;
    private buf: string[] = [];

    /**
     * Explicitly track if something was stripped, to avoid accidentally warning of sanitization just
     * because characters were re-encoded.
     */
    public sanitizedSomething: boolean;

    constructor() {
        this.sanitizedSomething = false;
        this.buf = [];
    }

    /**
     * Sanitize children element of current element
     *
     * @param el {HTMLElement} Parent element
     * @return {string} Html string
     */
    public sanitizeChildren(el: HTMLElement): string {
        let current: HTMLElement = el.firstChild as HTMLElement;
        let traverseContent: boolean = true;

        while (current) {
            if (this.skipTag(current.nodeName.toLowerCase())) {
                current = this.checkClobberedElement(current, current.nextSibling as HTMLElement);
                this.sanitizedSomething = true;
                continue;
            }

            if (current.nodeType === Node.ELEMENT_NODE) {
                traverseContent = this.startElement(current);
            } else if (current.nodeType === Node.TEXT_NODE) {
                this.sanitizeTextNodeChars(current.parentNode.nodeName.toLowerCase(), current.nodeValue);
            } else {
                // Strip non-element, non-text nodes.
                this.sanitizedSomething = true;
            }

            if (traverseContent && current.firstChild) {
                current = current.firstChild as HTMLElement;
                continue;
            }

            while (current) {
                if (current.nodeType === Node.ELEMENT_NODE) {
                    this.endElement(current);
                }
                let next: HTMLElement = this.checkClobberedElement(current, current.nextSibling as HTMLElement);
                if (next) {
                    current = next;
                    break;
                }
                current = this.checkClobberedElement(current, current.parentNode as HTMLElement);
            }
        }
        return this.buf.join('');
    }

    /**
     * Sanitizes an opening element tag (if valid) and returns whether the element's contents should
     * be traversed. Element content must always be traversed (even if the element itself is not
     * valid/safe), unless the element is one of `SKIP_TRAVERSING_CONTENT_IF_INVALID_ELEMENTS`.
     *
     * @param element The element to sanitize.
     * @return {boolean} True if the element's contents should be traversed.
     */
    private startElement(element: HTMLElement): boolean {
        const tagName: string = element.nodeName.toLowerCase();
        const elAttrs = element.attributes;

        this.buf.push('<');
        this.buf.push(tagName);

        for (let i = 0; i < elAttrs.length; i++) {
            const elAttr = elAttrs.item(i);
            const attrName = elAttr.name;
            const attrNameLower = attrName.toLowerCase();
            if (this.skipAttr(attrNameLower)) {
                this.sanitizedSomething = true;
                continue;
            }
            let value = elAttr.value;
            if (this.URI_ATTRS.has(attrNameLower)) {
                value = this.sanitizeUrl(value);
            }
            this.buf.push(' ', attrName, '="', this.encodeEntities(value), '"');
        }
        this.buf.push('>');
        return true;
    }

    /**
     * Add closing tag if needed
     *
     * @param element The element
     */
    private endElement(element: HTMLElement): void {
        const tagName = element.nodeName.toLowerCase();

        if (!_includes(['body', 'html', 'br'], tagName)) {
            this.buf.push(`</${tagName}>`);
        }
    }

    /**
     * Skip element attrs. Such attrs will be deleted from element.
     *
     * @param {string} attrName
     * @return {boolean} True if skip
     */
    private skipAttr(attrName: string): boolean {
        return attrName.indexOf('on') === 0;
    }

    /**
     * Skip tag. Such tags will be deleted from html.
     *
     * @param {string} tagName
     * @return {boolean} True if skip
     */
    private skipTag(tagName: string): boolean {
        return this.UNSAFE_TAGS.has(tagName);
    }

    private sanitizeTextNodeChars(tagName: string, chars: string): void {
        this.buf.push(tagName === 'style' ? chars : this.encodeEntities(chars));
    }

    private checkClobberedElement(node: HTMLElement, nextNode: HTMLElement): HTMLElement {
        if (nextNode &&
            (node.compareDocumentPosition(nextNode) &
                Node.DOCUMENT_POSITION_CONTAINED_BY) === Node.DOCUMENT_POSITION_CONTAINED_BY) {
            throw new Error(`Failed to sanitize html because the element is clobbered: ${node.outerHTML}`);
        }
        return nextNode;
    }

    /**
     * A pattern that recognizes URLs that are safe wrt. XSS in URL navigation
     * contexts.
     *
     * This regular expression matches a subset of URLs that will not cause script
     * execution if used in URL context within a HTML document. Specifically, this
     * regular expression matches if:
     * (1) Either a protocol that is not javascript:, and that has valid characters
     *     (alphanumeric or [+-.]).
     * (2) or no protocol.  A protocol must be followed by a colon. The below
     *     allows that by allowing colons only after one of the characters [/?#].
     *     A colon after a hash (#) must be in the fragment.
     *     Otherwise, a colon after a (?) must be in a query.
     *     Otherwise, a colon after a single solidus (/) must be in a path.
     *     Otherwise, a colon after a double solidus (//) must be in the authority
     *     (before port).
     *
     * The pattern disallows &, used in HTML entity declarations before
     * one of the characters in [/?#]. This disallows HTML entities used in the
     * protocol name, which should never happen, e.g. "h&#116;tp" for "http".
     * It also disallows HTML entities in the first path part of a relative path,
     * e.g. "foo&lt;bar/baz".  Our existing escaping functions should not produce
     * that. More importantly, it disallows masking of a colon,
     * e.g. "javascript&#58;...".
     *
     * This regular expression was taken from the Closure sanitization library.
     *
     * @param {string} url Unsafe url value
     * @return {string} Sanitized url value
     *
     */
    private sanitizeUrl(url: string): string {
        if (url.match(this.SAFE_URL_PATTERN)) {
            return url;
        }
        console.warn(`WARNING: sanitizing unsafe URL value ${url}`);
        return 'unsafe:' + url;
    }

    /**
     * Escapes all potentially dangerous characters, so that the
     * resulting string can be safely inserted into attribute or
     * element text.
     *
     * @param {string} value Some text
     * @return {string} Sanitized text
     */
    private encodeEntities(value: string): string {
        return value.replace(/&/g, '&amp;')
            .replace(this.SURROGATE_PAIR_REGEXP, (match) => {
                const hi = match.charCodeAt(0);
                const low = match.charCodeAt(1);
                return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
            })
            .replace(this.NON_ALPHANUMERIC_REGEXP, (match) => {
                return '&#' + match.charCodeAt(0) + ';';
            })
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}
