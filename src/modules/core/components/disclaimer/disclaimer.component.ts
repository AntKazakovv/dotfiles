import {
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {defaultParams, IDisclaimerCParams} from './disclaimer.params';


/**
 * Outputs disclaimer text
 *
 * @example
 *
 * {
 *     name: 'promo.wlc-disclaimer',
 * }
 *
 */
@Component({
    selector: '[wlc-disclaimer]',
    templateUrl: './disclaimer.component.html',
    styleUrls: ['./styles/disclaimer.component.scss'],
})
export class DisclaimerComponent extends AbstractComponent implements OnInit {
    public $params: IDisclaimerCParams;
    public disclaimer: string;

    @Input() protected inlineParams: IDisclaimerCParams;

    constructor(
        @Inject('injectParams') protected params: IDisclaimerCParams,
        protected configService: ConfigService,
        protected translate: TranslateService,
    ) {
        super({injectParams: params, defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.getDisclaimer();

        this.translate.onLangChange.pipe(takeUntil(this.$destroy)).subscribe((v) => {
            this.getDisclaimer();
        });
    }

    public getDisclaimer() {
        this.disclaimer = this.configService.get<string>(`appConfig.footerText[${this.translate.currentLang}]`) ||
            this.configService.get<string>('appConfig.footerText[en]');
    }
}
