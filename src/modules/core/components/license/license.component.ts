import {
    Component,
    Inject,
    OnInit,
    Input,
    ViewEncapsulation,
    ElementRef,
    ChangeDetectorRef,
} from '@angular/core';
import {
    DomSanitizer,
    SafeResourceUrl,
} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';

import * as Params from './license.params';

@Component({
    selector: '[wlc-license]',
    templateUrl: './license.component.html',
    styleUrls: ['./styles/license.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LicenseComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILicenseCParams;
    public $params: Params.ILicenseCParams;
    public licenseType: Params.LicenseType;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILicenseCParams,
        @Inject(DOCUMENT) protected document: HTMLDocument,
        protected cdr: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
        private elRef: ElementRef,
        configService: ConfigService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        },
        configService,
        );
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        if (this.$params.apgSeal?.sealId && this.$params.apgSeal.sealDomain) {
            this.licenseType = 'apg';
            this.initApgSeal();
        } else if (this.$params.mga?.companyId) {
            this.licenseType = 'mga';
        } else if (this.$params.curacao?.code || this.$params.curacao?.url) {
            this.licenseType = 'curacao';
            this.$params.curacao.url  = this.$params.curacao.url ||
                    `https://licensing.gaming-curacao.com/validator/?lh=${this.$params.curacao.code}&template=seal`;
            this.addModifiers('curacao');
        }
        this.cdr.markForCheck();
    }

    public safeUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    protected initApgSeal(): void {
        let script = this.document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://${this.$params.apgSeal.sealId}.snippet.antillephone.com/apg-seal.js`;

        if (this.$params.apgSeal.sealDomain !== location.host) {
            script.onload = () => {
                this.replaceHost();
            };
        }

        this.document.querySelector('body').append(script);
    }

    protected replaceHost(): void {
        this.replaceAttr('a', 'href');
        this.replaceAttr('img', 'src');
    }

    protected replaceAttr(el: string, attr: string): void {
        const item = this.elRef.nativeElement.querySelector(`#apg-seal-container ${el}`);
        item.setAttribute(attr, item.getAttribute(attr).replace(location.host, this.$params.apgSeal.sealDomain));
    }
}
