import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    ChangeDetectorRef,
    Optional,
} from '@angular/core';

import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core/system/services';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ColorThemeValues} from 'wlc-engine/modules/core/constants';

import * as Params from './logo.params';

@Component({
    selector: '[wlc-logo]',
    templateUrl: './logo.component.html',
    styleUrls: ['./styles/logo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent extends AbstractComponent implements OnInit {
    public override $params: Params.ILogoCParams;
    public logoImageSource: string;
    public logoName: boolean = true;
    public isAffiliate: boolean = false;
    public siteLink: string = '';

    constructor(
        @Optional()
        @Inject('injectParams') protected componentParams: Params.ILogoCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
        protected eventService: EventService,
    ) {
        super({
            injectParams: componentParams,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        if (this.$params.disableLink) {
            this.$params.link = '.';
            this.$params.uiOptions.reload = false;
        }

        this.logoImageSource = this.getLogoImageSource();
        this.isAffiliate = this.configService.get('$base.app.type') === 'aff';
        if (this.isAffiliate) {
            this.siteLink = this.configService.get<string>('currentLanguage');
        }
        this.changeLogoOnToggleColorSiteTheme();
    }

    protected getLogoImageSource(): string {
        const isUsedAltTheme: boolean = !!this.configService.get<string>(ColorThemeValues.configName);
        const customLogoName = this.$params.image?.name;
        const customLogoUrl = (isUsedAltTheme && this.$params.image?.urlForAltImg)
            ? this.$params.image?.urlForAltImg
            : this.$params.image?.url;
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

    protected changeLogoOnToggleColorSiteTheme(): void {
        if (this.configService.get<boolean>('$base.colorThemeSwitching.use') && this.$params.image?.urlForAltImg) {
            this.eventService.subscribe<boolean>(
                {name: ColorThemeValues.changeEvent},
                () => {
                    this.logoImageSource = this.getLogoImageSource();
                    this.cdr.markForCheck();
                },
                this.$destroy,
            );
        }
    }
}
