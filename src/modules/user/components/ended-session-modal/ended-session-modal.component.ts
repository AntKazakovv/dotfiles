import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
} from 'wlc-engine/modules/core';

import * as Params from './ended-session-modal.params';

@Component({
    selector: '[wlc-ended-session-modal]',
    templateUrl: './ended-session-modal.component.html',
    styleUrls: ['./styles/ended-session-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EndedSessionModalComponent extends AbstractComponent implements OnInit {

    public override $params: Params.IEndedSessionModalParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IEndedSessionModalParams,
        configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IEndedSessionModalParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
    }
}
