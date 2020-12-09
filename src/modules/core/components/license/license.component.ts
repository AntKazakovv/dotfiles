import {
    Component,
    Inject,
    OnInit,
    Input,
    ViewEncapsulation,
    AfterViewInit,
    ElementRef,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import * as LParams from './license.params';
export {IApgSealCParams} from './license.params';

@Component({
    selector: '[wlc-license]',
    templateUrl: './license.component.html',
    styleUrls: ['./styles/license.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LicenseComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @Input() protected inlineParams: LParams.IApgSealCParams;
    public $params: LParams.IApgSealCParams;

    constructor(
        @Inject('injectParams') protected injectParams: LParams.IApgSealCParams,
        protected configService: ConfigService,
        private elRef: ElementRef,
    ) {
        super({injectParams, defaultParams: LParams.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public ngAfterViewInit() {
        if (this.$params.apgSeal?.sealId && this.$params.apgSeal.sealDomain) {
            this.initApgSeal();
        }
    }

    protected initApgSeal(): void {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://${this.$params.apgSeal.sealId}.snippet.antillephone.com/apg-seal.js`;

        if (this.$params.apgSeal.sealDomain !== location.host) {
            script.onload = () => {
                this.replaceHost();
            };
        }

        document.querySelector('body').append(script);
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
