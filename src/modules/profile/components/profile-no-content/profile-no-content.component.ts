import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
} from 'wlc-engine/modules/core';

import * as Params from './profile-no-content.params';

@Component({
    selector: '[wlc-profile-no-content]',
    templateUrl: './profile-no-content.component.html',
    styleUrls: ['./styles/profile-no-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileNoContentComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IProfileNoContentCParams;

    public $params: Params.IProfileNoContentCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IProfileNoContentCParams,
        protected configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IProfileNoContentCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
