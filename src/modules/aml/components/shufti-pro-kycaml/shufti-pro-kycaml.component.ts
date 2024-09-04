import {TranslateService} from '@ngx-translate/core';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    SafeResourceUrl,
} from '@angular/platform-browser';

import {
    BehaviorSubject,
    timer,
} from 'rxjs';
import {
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    LogService,
    TLevel,
    IAlertCParams,
    DomSanitizerService,
} from 'wlc-engine/modules/core';
import {
    ShuftiProKycamlService,
} from 'wlc-engine/modules/aml/system/services/shufti-pro-kycaml/shufti-pro-kycaml.service';
import {IKycamlData} from 'wlc-engine/modules/aml/system/interfaces/kyc-aml.interface';
import {statusDesc} from 'wlc-engine/modules/aml/system/constants/kyc-aml.constants';

import * as Params from './shufti-pro-kycaml.params';

@Component({
    selector: '[wlc-shufti-pro-kycaml]',
    templateUrl: './shufti-pro-kycaml.component.html',
    styleUrls: ['./styles/shufti-pro-kycaml.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ShuftiProKycamlService,
    ],
})
export class ShuftiProKycamlComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @Input() protected inlineParams: Params.IShuftiProKycamlCParams;
    @ViewChild('sumsubwebsdk') protected sumsubContainer: ElementRef<HTMLDivElement>;

    public override $params: Params.IShuftiProKycamlCParams;
    public data: IKycamlData;
    public url: SafeResourceUrl;
    public ready: boolean = false;
    public showBtn: boolean = false;
    public error: boolean = false;
    public verify$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public statusText!: string;
    public secure: boolean = false;
    public statusLevel!: TLevel;
    public alertParams!: IAlertCParams;

    constructor(
        @Inject('injectParams') protected params: Params.IShuftiProKycamlCParams,
        protected shuftiProKycamlService: ShuftiProKycamlService,
        protected domSanitizerService: DomSanitizerService,
        protected translateService: TranslateService,
        protected logService: LogService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.alertParams = this.$params.alertParams;
        this.statusLevel = this.$params.alertParams.level;
    }

    public async ngAfterViewInit(): Promise<void> {
        try {
            this.data = await this.shuftiProKycamlService.getKycamlData();
            this.statusHandler(this.data.status);
            await this.processData();
            this.setReady();
        } catch (error) {
            this.error = true;
            this.setReady();
            this.statusText = statusDesc['uncommitted'];
            this.logService.sendLog({
                code: '25.0.0',
                data: error,
                level: 'error',
                from: {
                    component: 'ShuftiProKycamlComponent',
                    method: 'ngAfterViewInit',
                },
            });
        }
    }

    public async requestSession(): Promise<void> {

        this.data = await this.shuftiProKycamlService.createData();

        if (this.data) {
            this.verify$.next(true);
            await this.processData();
            this.showBtn = false;
            this.cdr.markForCheck();
        } else {
            this.error = true;
        }
    }

    protected setReady(): void {
        this.ready = true;
        this.cdr.markForCheck();
    }

    protected async processData(): Promise<void> {

        if (!this.data?.service) {
            return;
        }

        switch (this.data.service) {
            case 'SumSub':
                await this.initSamSub();
                break;
            case 'ShuftiPro':
            default:
                this.url = this.domSanitizerService.bypassSecurityTrustResourceUrl(this.data.url);
                break;
        }
    }

    /**
     * https://developers.sumsub.com/web-sdk/#frontend-integration-general
     */
    protected async initSamSub(): Promise<void> {

        try {
            const snsWebSdk = await import ('@sumsub/websdk');

            let instance = snsWebSdk.default.init(
                this.data.url,
                async () => {
                    return (await this.shuftiProKycamlService.createData())?.url;
                },
            ).withConf({
                lang: this.translateService.currentLang,
                uiConf: {
                    scrollIntoView: false,
                },
            }).withOptions({
                addViewportTag: false,
                adaptIframeHeight: true,
            }).build();

            timer(0).pipe(takeUntil(this.$destroy)).subscribe(() => {
                instance.launch(this.sumsubContainer.nativeElement);
            });

        } catch (error) {
            throw {
                error,
                data: 'Error creating iFrame',
            };
        }
    }

    protected statusHandler(status: string | null): void {

        this.statusText = status ? statusDesc[status] : statusDesc['uncommitted'];

        switch (status) {

            case null:
            case 'retry':
            case 'deleted':
                this.showBtn = true;
                break;

            case 'failed':
                this.addModifiers('failed');
                break;

            case 'uncommitted':
                this.verify$.next(true);
                break;

            case 'completed':
                this.secure = true;
                this.statusLevel = 'success';
                this.cdr.markForCheck();
                break;

        }
    }
}
