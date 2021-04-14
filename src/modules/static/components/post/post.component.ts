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
import {DomSanitizer} from '@angular/platform-browser';
import {StateService, UIRouterGlobals} from '@uirouter/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {StaticService, TextDataModel} from 'wlc-engine/modules/static';
import {
    ConfigService,
    LogService,
    ActionService,
} from 'wlc-engine/modules/core';

import * as PostParams from './post.params';

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
    @Input() protected slug: string;
    public data: TextDataModel;
    public html: string;
    public isReady: boolean = false;
    public $params: PostParams.IPostCParams;

    constructor(
        @Inject('injectParams') protected params: PostParams.IPostCParams,
        protected staticService: StaticService,
        protected viewRef: ViewContainerRef,
        protected domSanitizer: DomSanitizer,
        protected cdr: ChangeDetectorRef,
        protected uiRouter: UIRouterGlobals,
        protected configService: ConfigService,
        protected stateService: StateService,
        protected logService: LogService,
        protected actionService: ActionService,
    ) {
        super({injectParams: params, defaultParams: PostParams.defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.parseAsPlainHTML ??= this.$params.parseAsPlainHTML;

        try {
            const slug = this.slug || this.params.slug || this.uiRouter.params.slug;

            let data: TextDataModel;
            if (this.configService.get<string[]>({name: '$static.pages'}).includes(slug)) {
                data = await this.staticService.getPage(slug);
            } else {
                data = await this.staticService.getPost(slug);
            }

            this.html = this.domSanitizer.bypassSecurityTrustHtml(data.html)?.['changingThisBreaksApplicationSecurity'];

            this.params.setTitle?.(data.title);
        } catch (error) {
            // TODO: add log service in static service metods
            this.logService.sendLog({code: '12.0.0', data: error});
            this.stateService.go('app.error', {
                locale: this.configService.get('currentLanguage'),
            });
            console.error(error);
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

    public ngAfterViewInit() {
        this.viewRef.remove();
    }
}
