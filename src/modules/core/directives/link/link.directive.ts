import {
    Directive,
    Inject,
    Input,
    Optional,
} from '@angular/core';
import {
    ParentUIViewInject,
    UIRouter,
    UISref,
    UIView,
} from '@uirouter/angular';

import {LinkAnchorDirective} from './link-anchor.directive';
import {
    TLink,
    TLinkStateOptions,
} from './link.interfaces';

/**
 * Facade for `UiSref` (future `RouterLink`)
 * When applied to an element in template makes that element a link
 * that initiates navigation to a route.

 * Static route link:
 * ```html
 * <a wlc-link="app.home">Home</a> // static string
 * <a [wlc-link]="$params.stateName">Home</a> // string from params
 * ```
 * Dynamic route link
 * ```html
 * <a [wlc-link]="['app.catalog', {category: 'popular'}]">Popular</a>
 * <a [wlc-link]="[$params.stateName, $params.stateParams]">Popular</a>
 * ```
 *
 * Route link with options
 * ```html
 * <a wlc-link='app.home' [wlc-link-options]="{skipLocationChange: true}">Home</a>
 * ```
 */
@Directive({
    selector: '[wlc-link]',
})
export class LinkDirective extends UISref {
    /**
     * Static route link:
     * ```html
     * <a wlc-link="app.home">Home</a>
     * <a [wlc-link]="[$params.stateName]">Home</a>
     * ```
     * Dynamic route link
     * ```html
     * <a [wlc-link]="['app.catalog', {category: 'popular'}]">Popular</a>
     * ```
     */
    @Input('wlc-link') public set wlcLink(params: TLink) {
        if (typeof params === 'string') {
            this.uiSref = params;
        } else if (Array.isArray(params)) {
            const [state, stateParams] = params;

            this.uiSref = state;

            if (stateParams) {
                this.uiParams = stateParams;
            }
        }
    }

    /**
     * Route link with options
     * ```html
     * <a wlc-link='app.home' [wlc-link-options]="{skipLocationChange: true}">Home</a>
     * ```
     */
    @Input('wlc-link-options') public set wlcLinkOptions(params: TLinkStateOptions) {
        if (params) {
            this.uiOptions = {
                location: !params.skipLocationChange,
                reload: params.replaceUrl ?? false,
                inherit: params.inherit ?? true,
            };
        }
    }

    constructor(
        _router: UIRouter,
        @Optional() @Inject(LinkAnchorDirective) _anchorUIsref: LinkAnchorDirective,
        @Optional() @Inject(UIView.PARENT_INJECT) _parent: ParentUIViewInject,
    ) {
        super(_router, _anchorUIsref, _parent);
    }
}
