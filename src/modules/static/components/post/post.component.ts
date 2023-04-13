import {
    Component,
    Inject,
    OnInit,
    Input,
    AfterViewInit,
    ViewContainerRef,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';
import {
    StateService,
    UIRouterGlobals,
} from '@uirouter/core';

import _get from 'lodash-es/get';

import {
    EventService,
    IPushMessageParams,
    NotificationEvents,
    ConfigService,
    AbstractComponent,
    ActionService,
    LogService,
} from 'wlc-engine/modules/core';
import {StaticService} from 'wlc-engine/modules/static/system/services/static/static.service';
import {TextDataModel} from 'wlc-engine/modules/static/system/models/textdata.model';
import {ISplitTexts} from 'wlc-engine/modules/static/system/interfaces/static.interface';
import {CuracaoRequirement} from 'wlc-engine/modules/app/system';

import * as Params from './post.params';

@Component({
    selector: '[wlc-post]',
    templateUrl: './post.component.html',
    styleUrls: ['./styles/post.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @ViewChild('wrp', {read: ViewContainerRef, static: true}) wrp: ViewContainerRef;
    /**
     * Parses HTML safely, but may break angular template syntax.
     *
     * Use it if you **really** have to.
     */
    @Input() public parseAsPlainHTML: boolean;
    /**
     * Add content via innerHTML
     */
    @Input() public withoutCompilation: boolean;
    /**
     * Remove inline styles in dynamic html
     */
    @Input() public shouldClearStyles: boolean;
    @Input() public useTitle: boolean = true;
    @Input() protected slug: string;
    @Input() protected inlineParams: Params.IPostCParams;

    public data: TextDataModel;
    public html: string;
    public defaultSlug: string = '';
    public generatedSlug: string = '';
    public isReady: boolean = false;
    public override $params: Params.IPostCParams;
    public isDownloadingFile: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.IPostCParams,
        protected staticService: StaticService,
        protected viewRef: ViewContainerRef,
        protected domSanitizer: DomSanitizer,
        cdr: ChangeDetectorRef,
        protected uiRouter: UIRouterGlobals,
        configService: ConfigService,
        protected stateService: StateService,
        protected logService: LogService,
        protected actionService: ActionService,
        protected translate: TranslateService,
        protected eventService: EventService,
        @Inject(CuracaoRequirement) protected isCuracaoWlc: boolean,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.parseAsPlainHTML ??= this.$params.parseAsPlainHTML;
        this.withoutCompilation ??= this.$params.withoutCompilation;
        this.shouldClearStyles ??= this.$params.shouldClearStyles;
        try {
            this.defaultSlug = this.slug || this.$params.slug || this.uiRouter.params.slug;
            this.generatedSlug = this.getGeneratedSlug();
            this.data = await this.getTextModel();
            this.html = this.domSanitizer
                .bypassSecurityTrustHtml(this.data.html)?.['changingThisBreaksApplicationSecurity'] ?? '';

            if (this.isShowDownloadButton()) {
                this.$params.downloadPdf.use = true;
            }

            if (this.useTitle) {
                this.params.setTitle?.(this.data.title);
            }
        } catch (error) {
            this.logService.sendLog({code: '5.0.0', data: error});
        } finally {
            this.isReady = true;
            this.cdr.markForCheck();
            if (_get(this.uiRouter.params, '#')) {
                setTimeout(() => {
                    this.actionService.scrollTo(`[name=${_get(this.uiRouter.params, '#').split('?')[0]}]`);
                }, 0);
            }
        }
    }

    public async downloadPdf(): Promise<void> {
        try {
            this.isDownloadingFile = true;
            const link = this.staticService.getLinkToPdf(this.defaultSlug);
            await this.staticService.downloadPdf(link, this.defaultSlug);
        } catch (error) {
            this.logService.sendLog({code: '5.2.0', data: error});
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Error'),
                    message: gettext('Error occurred while downloading the file'),
                    wlcElement: 'notification_download-pdf-error',
                },
            });
        } finally {
            this.isDownloadingFile = false;
            this.cdr.markForCheck();
        }
    }

    public ngAfterViewInit(): void {
        this.viewRef.remove();
    }

    protected async getTextModel(): Promise<TextDataModel> {
        let model: TextDataModel = await this.getData();

        if (!model) {
            if (this.translate.currentLang !== 'en') {
                model = await this.getData('en');
            }

            if (!model) {
                throw new Error('No data');
            }
        }

        if (this.configService.get<string[]>({name: '$static.normalizeInternalLinks'})) {
            return this.replaceLinkPaths(model);
        }

        return model;
    }

    protected getData(lang?: string): Promise<TextDataModel | null> {
        if (this.configService.get<string[]>({name: '$static.pages'}).includes(this.defaultSlug)) {
            return this.staticService.getPage(this.generatedSlug, lang);
        } else {
            return this.staticService.getPost(this.generatedSlug, lang);
        }
    }

    protected getGeneratedSlug(lang?: string): string {
        const splitSettings = this.configService.get<ISplitTexts>({name: '$static.splitStaticTexts'});
        if (splitSettings?.useByDefault || (splitSettings?.slugs ?? []).includes(this.defaultSlug)) {
            return `${this.defaultSlug}_${lang ?? this.translate.currentLang}`;
        } else {
            return this.defaultSlug;
        }
    }

    protected replaceLinkPaths(data: TextDataModel): TextDataModel {
        data.html = data.html.replace(/\/static-texts\//g, '/contacts/');
        return data;
    }

    protected isShowDownloadButton(): boolean {
        return this.configService.get<string>('appConfig.siteconfig.termsOfService')
            && (this.isCuracaoWlc || this.configService.get<boolean>({name: '$static.downloadPdf.forceShowButton'}))
            && this.configService.get<string[]>({name: '$static.downloadPdf.slugsAvailableForDownload'})
                .includes(this.defaultSlug);
    }
}
