import {
    Directive,
    ElementRef,
    Renderer2,
} from '@angular/core';
import {AnchorUISref} from '@uirouter/angular';

/**
 * @deprecated
 * Will be redundant with `@angular/router`
 */
@Directive({
    selector: 'a[wlc-link]',
})
export class LinkAnchorDirective extends AnchorUISref {

    constructor(
        _el: ElementRef,
        _renderer: Renderer2,
    ) {
        super(_el, _renderer);
    }
}
