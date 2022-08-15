import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {
    TransitionService,
    UIRouterGlobals,
} from '@uirouter/core';
import {
    IWrapperCParams,
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {IPostCParams} from 'wlc-engine/modules/static/components';

import * as Params from './info-page.params';

import _cloneDeep from 'lodash-es/cloneDeep';


/**
 * Outputs disclaimer text
 *
 * @example
 *
 * {
 *     name: 'core.wlc-info-page',
 * }
 *
 */
@Component({
    selector: '[wlc-info-page]',
    templateUrl: './info-page.component.html',
    styleUrls: ['./styles/info-page.component.scss'],
})
export class InfoPageComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IInfoPageCParams;
    public $params: Params.IInfoPageCParams;
    public config: Params.IInfoPageConfig;
    public content: IWrapperCParams;

    protected get postComponentParams(): IPostCParams {
        return {
            slug: this.uiRouter.params.slug,
            parseAsPlainHTML: true,
            withoutCompilation: true,
            shouldClearStyles: true,
            wlcElement: 'section_static-text_' + this.uiRouter.params.slug,
            showTitle: true,
            useDownloadButton: this.configService.get<string[]>('$base.postWithDownloadPDF')
                ?.includes(this.uiRouter.params.slug),
        };
    };

    constructor(
        @Inject('injectParams') protected params: Params.IInfoPageCParams,
        private uiRouter: UIRouterGlobals,
        private transition: TransitionService,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.config = this.$params.config;
        this.transition.onSuccess({}, () => {
            this.setChildParams();
            this.cdr.detectChanges();
        });

        this.setChildParams();
    }

    protected setChildParams(): void {
        switch (this.uiRouter.params.slug) {

            case 'feedback':
                this.config.content.components = [{
                    name: 'core.wlc-feedback-form',
                    params: {
                        wlcElement: 'form_contacts',
                    },
                }];
                break;

            default:
                this.config.content.components = [{
                    name: 'static.wlc-post',
                    params: this.postComponentParams,
                }];
        }
        this.content = _cloneDeep(this.config.content);
    }
}
