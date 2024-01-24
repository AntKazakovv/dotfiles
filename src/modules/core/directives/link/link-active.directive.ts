import {
    Directive,
    ElementRef,
    Inject,
    Input,
    Optional,
    Renderer2,
} from '@angular/core';
import {UISrefActive} from '@uirouter/angular';

import {LinkStatusDirective} from './link-status.directive';
import {TLinkActiveOpt} from './link.interfaces';

@Directive({
    selector: '[wlc-link-active], [wlc-link-active-opt]',
})
export class LinkActiveDirective extends UISrefActive {

    @Input('wlc-link-active') public set linkActive(activeClasses: string) {
        this._classNames = activeClasses;
        this.updateClasses();
    }

    @Input('wlc-link-active-opt') public set TLinkActiveOpt(opt: TLinkActiveOpt) {
        this._activeOpt = opt;
        this.updateClasses();
    }

    protected _classNames: string = 'active';
    protected _activeOpt: TLinkActiveOpt = {exact: false};

    constructor(
        @Optional() @Inject(LinkStatusDirective) uiSrefStatus: LinkStatusDirective,
        rnd: Renderer2,
        host: ElementRef,
    ) {
        super(uiSrefStatus, rnd, host);
    }

    protected updateClasses(): void {
        if (this._activeOpt.exact) {
            this.activeEq = this._classNames;
            this.active = '0'; /** temp fallback, will be redundant with @angular/router */
        } else {
            this.active = this._classNames;
            this.activeEq = '0'; /** temp fallback, will be redundant with @angular/router */
        }
    }
}
