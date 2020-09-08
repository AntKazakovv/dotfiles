import {
    Component,
    OnInit,
    HostBinding,
    ChangeDetectionStrategy,
    Inject,
} from '@angular/core';
import {TransitionOptions} from '@uirouter/core';
import {ConfigService} from 'wlc-engine/modules/core';

import {
    get as _get,
    extend as _extend,
} from 'lodash';

interface IParams {
    link: string;
    uiOptions?: TransitionOptions;
    disableLink?: boolean;
    customLogo?: string;
}

@Component({
    selector: '[wlc-logo]',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent implements OnInit {
    @HostBinding('class') hostClass = 'wlc-logo';

    public params: IParams;
    public customLogo: string;

    protected defaultConfig: IParams = {
        link: 'app.home',
        uiOptions: {
            reload: true,
            inherit: true,
        },
        disableLink: false,
    };

    constructor(
        @Inject('params') protected componentParams: IParams,
        protected config: ConfigService,
    ) {}

    ngOnInit(): void {
        this.params = _extend({}, this.defaultConfig, this.componentParams);

        this.customLogo = _get(
            this.params,
            'customLogo',
            _get(this.config, 'appConfig.$base.customLogo')
        );

        if (this.params.disableLink) {
            this.params.link = '.';
            this.params.uiOptions.reload = false;
        }
    }
}
