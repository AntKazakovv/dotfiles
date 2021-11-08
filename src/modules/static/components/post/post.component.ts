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

import {StaticService} from 'wlc-engine/modules/static/system/services/static/static.service';
import {TextDataModel} from 'wlc-engine/modules/static/system/models/textdata.model';

import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ActionService} from 'wlc-engine/modules/core/system/services/action/action.service';
import {ISplitTexts} from 'wlc-engine/modules/static/system/interfaces/static.interface';

import * as Params from './post.params';

import _get from 'lodash-es/get';

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
    public isReady: boolean = false;
    public $params: Params.IPostCParams;

    constructor(
        @Inject('injectParams') protected params: Params.IPostCParams,
        protected staticService: StaticService,
        protected viewRef: ViewContainerRef,
        protected domSanitizer: DomSanitizer,
        protected cdr: ChangeDetectorRef,
        protected uiRouter: UIRouterGlobals,
        protected configService: ConfigService,
        protected stateService: StateService,
        protected logService: LogService,
        protected actionService: ActionService,
        protected translate: TranslateService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.parseAsPlainHTML ??= this.$params.parseAsPlainHTML;
        this.withoutCompilation ??= this.$params.withoutCompilation;
        this.shouldClearStyles ??= this.$params.shouldClearStyles;
        try {
            let slug: string = this.slug || this.$params.slug || this.uiRouter.params.slug;
            let data: TextDataModel;

            if (this.configService.get<string[]>({name: '$static.pages'}).includes(slug)) {
                const splitSettings = this.configService.get<ISplitTexts>({name: '$static.splitStaticTexts'});
                if (splitSettings?.useByDefault || _get(splitSettings, 'slugs', []).includes(slug)) {
                    slug = `${slug}_${this.translate.currentLang}`;
                }
                data = await this.staticService.getPage(slug);
            } else {
                data = await this.staticService.getPost(slug);
            }

            if (this.configService.get<string[]>({name: '$static.normalizeInternalLinks'})) {
                data = this.replaceLinkPaths(data);
            }

            this.data = data;
            this.html = this.domSanitizer.bypassSecurityTrustHtml(data.html)?.['changingThisBreaksApplicationSecurity'];

            if (this.useTitle) {
                this.params.setTitle?.(data.title);
            }
        } catch (error) {
            // TODO: add log service in static service methods
            this.logService.sendLog({code: '12.0.0', data: error});
            if (this.uiRouter.params.slug) {
                this.stateService.go('app.error', {
                    locale: this.configService.get('currentLanguage'),
                });
            }
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

    public ngAfterViewInit(): void {
        this.viewRef.remove();
    }

    protected replaceLinkPaths(data: TextDataModel): TextDataModel {
        data.html = data.html.replace(/\/static-texts\//g, '/contacts/');
        return data;
    }
}
