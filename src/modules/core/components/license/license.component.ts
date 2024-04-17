import {
    Component,
    Inject,
    OnInit,
    Input,
    ViewEncapsulation,
    ElementRef,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ActionService} from 'wlc-engine/modules/core';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

import * as Params from './license.params';

import _isString from 'lodash-es/isString';

@Component({
    selector: '[wlc-license]',
    templateUrl: './license.component.html',
    styleUrls: ['./styles/license.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILicenseCParams;
    public override $params: Params.ILicenseCParams;
    public licenseType: Params.LicenseType;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILicenseCParams,
        @Inject(DOCUMENT) protected document: Document,
        cdr: ChangeDetectorRef,
        private elRef: ElementRef,
        configService: ConfigService,
        private logService: LogService,
        private actionService: ActionService,
    ) {
        super(
            {
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
            cdr,
        );
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.apgSeal?.sealId && this.$params.apgSeal.sealDomain) {
            this.licenseType = 'apg';
        }
        this.initLicense();
        this.cdr.markForCheck();
    }

    protected async initLicense(): Promise<void> {
        await this.actionService.userMove;

        if (this.licenseType === 'apg') {
            this.initApgSeal();
        } else if (this.$params.mga?.companyId) {
            this.licenseType = 'mga';
        } else if (this.$params.curacao?.code || this.$params.curacao?.url) {
            this.licenseType = 'curacao';
            this.$params.curacao.url  = this.$params.curacao.url ||
                    `https://licensing.gaming-curacao.com/validator/?lh=${this.$params.curacao.code}&template=seal`;
            this.addModifiers('curacao');
        } else if (this.$params.curacao?.icon) {
            this.licenseType = 'curacao-icon';
            this.addModifiers('curacao-icon');
            this.$params.curacao.icon = _isString(this.$params.curacao.icon)
                ? this.$params.curacao.icon : GlobalHelper.gstaticUrl + '/wlc/icons/curacao-egaming-logo.png';

            if (this.$params.curacao?.pdf) {
                this.$params.curacao.pdf = _isString(this.$params.curacao.pdf)
                    ? this.$params.curacao.pdf : '/static/curacao_license.pdf';
            }
        }
    }

    protected initApgSeal(): void {
        let script = this.document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://${this.$params.apgSeal.sealId}.snippet.antillephone.com/apg-seal.js`;

        if (this.$params.apgSeal.sealDomain !== location.host) {
            script.onload = (): void => {
                this.replaceHost();
                this.checkLicenseValue();
            };
            script.onerror = (): void => {
                this.logService.sendLog({code: '4.0.4'});
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

    protected checkLicenseValue(): void {
        const licenseTag = this.document.getElementById('apg-seal-container');
        const licenseImgSrc = licenseTag?.querySelector('img')?.src;

        if (licenseImgSrc?.includes('invalid')) {
            this.logService.sendLog({code: '4.0.5'});
        }
    }
}
