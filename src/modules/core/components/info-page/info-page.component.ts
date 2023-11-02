import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import {
    TransitionService,
    UIRouterGlobals,
} from '@uirouter/core';
import {
    IWrapperCParams,
    AbstractComponent,
    ConfigService,
    IAccordionCParams,
    ILayoutComponent,
} from 'wlc-engine/modules/core';
import {IPostCParams} from 'wlc-engine/modules/static/components';

import * as Params from './info-page.params';

import _cloneDeep from 'lodash-es/cloneDeep';
import _get from 'lodash-es/get';


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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPageComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IInfoPageCParams;
    public override $params: Params.IInfoPageCParams;
    public config: Params.IInfoPageConfig;
    public content: IWrapperCParams;

    constructor(
        @Inject('injectParams') protected params: Params.IInfoPageCParams,
        protected uiRouter: UIRouterGlobals,
        protected transition: TransitionService,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.config = Params.generateConfig(this.configService.get<boolean>('$base.contacts.separatedPage'));
        this.transition.onSuccess({}, () => {
            this.setChildParams();
            this.cdr.markForCheck();
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

            case 'faq':
                this.config.content.components = this.$params.useFaqAccordion
                    ? this.getAccordionPost() : this.getStaticPost();
                break;

            default:
                this.config.content.components = _get(
                    this.$params.customConfig, this.uiRouter.params.slug, this.getStaticPost());
        }
        this.content = _cloneDeep(this.config.content);
    }

    protected getStaticPost(): ILayoutComponent[] {
        return [{
            name: 'static.wlc-post',
            params: <IPostCParams>{
                slug: this.uiRouter.params.slug,
                parseAsPlainHTML: true,
                withoutCompilation: true,
                shouldClearStyles: true,
                wlcElement: 'section_static-text_' + this.uiRouter.params.slug,
                showTitle: true,
            },
        }];
    }

    protected getAccordionPost(): ILayoutComponent[] {
        return [{
            name: 'affiliates.wlc-faq',
            params: <IAccordionCParams>{
                class: 'wlc-faq',
                slug: this.uiRouter.params.slug,
            },
        }];
    }
}
