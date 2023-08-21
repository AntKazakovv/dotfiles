import {
    Directive,
    Inject,
    Input,
    Optional,
} from '@angular/core';
import {
    AnchorUISref,
    ParentUIViewInject,
    UIRouter,
    UISref,
    UIView,
} from '@uirouter/angular';

@Directive({
    selector: 'a[wlc-link]',
})
export class LinkDirective extends UISref {

    @Input('wlc-link') public set link(state: string) {
        this.uiSref = state;
    }

    constructor(
        protected router: UIRouter,
        @Optional()
        protected anchorUIsref: AnchorUISref,
        @Optional()
        @Inject(UIView.PARENT_INJECT)
        protected parent: ParentUIViewInject,
    ) {
        super(router, anchorUIsref, parent);
    }

}
