import {
    Directive,
    EventEmitter,
    Inject,
    Optional,
    Output,
} from '@angular/core';
import {
    SrefStatus,
    UIRouterGlobals,
    UISrefStatus,
} from '@uirouter/angular';

import {LinkDirective} from './link.directive';

/**
 * @deprecated
 * Will be redundant with `@angular/router`
 */
@Directive({
    selector: '[wlc-link-active], [wlc-link-active-opt], [wlc-link-status]',
    exportAs: 'wlc-link-status',
})
export class LinkStatusDirective extends UISrefStatus {
    @Output('wlc-link-status') protected wLinkStatus: EventEmitter<SrefStatus> = this.uiSrefStatus;

    constructor(
        @Optional()
        @Inject(LinkDirective) _hostUiSref: LinkDirective,
        _globals: UIRouterGlobals,
    ) {
        super(_hostUiSref, _globals);
    }
}
