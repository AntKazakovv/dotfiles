import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
} from '@angular/core';
import * as Params from './logo.params';
import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

@Component({
    selector: '[wlc-logo]',
    templateUrl: './logo.component.html',
    styleUrls: ['./styles/logo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent extends AbstractComponent implements OnInit {
    public $params: Params.ILogoCParams;
    public logoImageSource: string;
    public logoName: boolean = true;

    constructor(
        @Inject('injectParams') protected componentParams: Params.ILogoCParams,
        protected configService: ConfigService,
    ) {
        super({
            injectParams: componentParams,
            defaultParams: Params.defaultParams,
        });
    }

    public ngOnInit(): void {
        super.ngOnInit();

        if (this.$params.disableLink) {
            this.$params.link = '.';
            this.$params.uiOptions.reload = false;
        }

        this.logoImageSource = this.getLogoImageSource();
    }

    protected getLogoImageSource(): string {
        const customLogoName = this.$params.image?.name;
        const customLogoUrl = this.$params.image?.url;
        const customMainConfigLogoName = this.configService.get<string>({name: '$base.customLogoName'});

        if (customLogoUrl) {
            this.logoName = false;
            return customLogoUrl;
        } else if (customLogoName) {
            return customLogoName;
        } else if (customMainConfigLogoName) {
            return customMainConfigLogoName;
        }
    }
}
