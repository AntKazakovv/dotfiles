import {
    Component,
    OnInit,
    HostBinding,
    ChangeDetectionStrategy,
    Inject,
} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {TransitionOptions} from '@uirouter/core';
import {ConfigService, FilesService} from 'wlc-engine/modules/core';

import {
    get as _get,
    extend as _extend,
    keys as _keys,
} from 'lodash';

interface IParams {
    link: string;
    uiOptions?: TransitionOptions;
    disableLink?: boolean;
    customLogo?: string;
    image?: {
        name?: string;
        url?: string;
    };
}

@Component({
    selector: '[wlc-logo]',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent implements OnInit {
    @HostBinding('class') hostClass = 'wlc-logo';

    public params: IParams;
    public logoHtml: SafeHtml;

    protected defaultConfig: IParams = {
        link: 'app.home',
        uiOptions: {
            reload: true,
            inherit: true,
        },
        disableLink: false,
        image: {
            name: 'defaultLogo',
        },
    };

    constructor(
        @Inject('injectParams') protected componentParams: IParams,
        protected configService: ConfigService,
        protected filesService: FilesService,
        protected sanitizer: DomSanitizer,
    ) {
    }

    public ngOnInit(): void {
        this.params = _extend({}, this.defaultConfig, this.componentParams);
        this.params.image = _keys(this.componentParams.image).length
            ? this.componentParams.image
            : this.defaultConfig.image;

        if (this.params.disableLink) {
            this.params.link = '.';
            this.params.uiOptions.reload = false;
        }

        const htmlString = this.getLogoImageHtml();
        if (htmlString) {
            this.logoHtml = this.sanitizer.bypassSecurityTrustHtml(htmlString);
        }
    }

    protected getLogoImageHtml(): string {
        const customLogoName = _get(this.params, 'image.name');
        const customLogoUrl = _get(this.params, 'image.url');
        const customMainLogoName = _get(this.configService, 'appConfig.$base.customLogoName');

        if (customLogoUrl) {
            return `<img src="${customLogoUrl}">`;
        } else if (customLogoName) {
            return this.filesService.getSvgFile(customLogoName).htmlString;
        } else if (customMainLogoName) {
            return this.filesService.getSvgFile(customMainLogoName).htmlString;
        } else {
            return this.filesService.getSvgFile(this.params.image.name).htmlString;
        }
    }
}
