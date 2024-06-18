import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisclaimerComponent extends AbstractComponent implements OnInit {
    public override $params: IDisclaimerCParams;
    public disclaimer: string;

    @Input() protected inlineParams: IDisclaimerCParams;

    constructor(
        @Inject('injectParams') protected params: IDisclaimerCParams,
        protected translateService: TranslateService,
    ) {
        super({injectParams: params, defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.createDisclaimer();

        this.translateService.onLangChange.pipe(takeUntil(this.$destroy)).subscribe(() => {
            this.createDisclaimer();
        });
    }

    protected createDisclaimer(): void {
        this.disclaimer = this.getTextFromConfig('appConfig.footerText');
    }

    protected getTextFromConfig(key: string): string {
        return this.configService.get<string>(`${key}.${this.translateService.currentLang}`)
            || this.configService.get<string>(`${key}.en`);
    }
}
