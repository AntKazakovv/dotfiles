import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

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
        cdr: ChangeDetectorRef,
        configService: ConfigService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
