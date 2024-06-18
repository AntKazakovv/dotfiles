import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';

import * as Params from './footer.params';

@Component({
    selector: '[wlc-footer]',
    templateUrl: './footer.component.html',
    styleUrls: ['./styles/footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IFooterCParams;
    public override $params: Params.IFooterCParams;

    constructor(
        @Inject('injectParams') protected params: Params.IFooterCParams,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
