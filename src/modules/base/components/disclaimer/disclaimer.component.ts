import {
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {defaultParams, IDisclaimerParams} from './disclaimer.params';

@Component({
    selector: '[wlc-disclaimer]',
    templateUrl: './disclaimer.component.html',
    styleUrls: ['./styles/disclaimer.component.scss'],
})
export class DisclaimerComponent extends AbstractComponent implements OnInit {
    public $params: IDisclaimerParams;
    public disclaimer: string;

    @Input() protected inlineParams: IDisclaimerParams;

    constructor(
        @Inject('injectParams') protected params: IDisclaimerParams,
        protected configService: ConfigService,
    ) {
        super({injectParams: params, defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.getDisclaimer();
    }

    public getDisclaimer() {
        const lang = this.configService.get<string>('appConfig.language') || 'en';
        this.disclaimer = this.configService.get<string>(`appConfig.footerText[${lang}]`);
    }
}
