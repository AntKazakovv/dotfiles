import {TranslateService} from '@ngx-translate/core';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    DomSanitizer,
    SafeResourceUrl,
} from '@angular/platform-browser';

import {
    BehaviorSubject,
    timer,
} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    map,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    LogService,
    TUserValidationLevel,
} from 'wlc-engine/modules/core';
import {
    ShuftiProKycamlService,
    IKycamlData,
} from 'wlc-engine/modules/aml/system/services/shufti-pro-kycaml/shufti-pro-kycaml.service';
import {UserInfo} from 'wlc-engine/modules/user';

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
    @ViewChild('sumsubwebsdk') protected sumsubContainer: ElementRef<HTMLDivElement>;

    public data: IKycamlData;
    public url: SafeResourceUrl;
    public get ready(): boolean {
        return this._ready && !!this.validationLevel;
    };
    public validationLevel: TUserValidationLevel;
    public error: boolean = false;

    protected _ready: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IShuftiProKycamlCParams,
        protected shuftiProKycamlService: ShuftiProKycamlService,
        protected sanitizer: DomSanitizer,
        protected translate: TranslateService,
        protected logService: LogService,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.injectParams);

        this.initSubscriber();
    }

    public async ngAfterViewInit(): Promise<void> {
        try {
            this.data = await this.shuftiProKycamlService.getKycamlData();
            await this.processData();
            this.setReady();
        } catch (error) {
            this.error = true;
            this.setReady();
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

    protected setReady(): void {
        this._ready = true;
        this.cdr.markForCheck();
    }

    protected initSubscriber(): void {
        this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'}).pipe(
            filter((v) => !!v),
            map((v) => v.validationLevel),
            distinctUntilChanged(),
            takeUntil(this.$destroy),
        ).subscribe((validationLevel) => {
            this.validationLevel = validationLevel;
            this.cdr.markForCheck();
        });
    }

    protected async processData(): Promise<void> {

        switch (this.data.service) {
            case 'SumSub':
                await this.initSamSub();
                break;
            case 'ShuftiPro':
            default:
                this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);
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
                lang: this.translate.currentLang,
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

}
