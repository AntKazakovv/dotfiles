import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';

import _cloneDeep from 'lodash-es/cloneDeep';
import _get from 'lodash-es/get';
import {
    filter,
    takeUntil,
} from 'rxjs';

import {
    IWrapperCParams,
    AbstractComponent,
    IAccordionCParams,
    ILayoutComponent,
    RouterService,
} from 'wlc-engine/modules/core';
import {IPostCParams} from 'wlc-engine/modules/static/components';
import {TLifecycleEvent} from 'wlc-engine/modules/core/system/services/router/types';

import * as Params from './info-page.params';

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
        protected routerService: RouterService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.config = Params.generateConfig(this.configService.get<boolean>('$base.contacts.separatedPage'));

        this.routerService.events$.pipe(
            filter((event: TLifecycleEvent) => event.name === 'onSuccess'),
            takeUntil(this.$destroy),
        ).subscribe(() => {
            this.setChildParams();
            this.cdr.markForCheck();
        });

        this.setChildParams();
    }

    protected setChildParams(): void {
        const slug = this.routerService.current.params.slug;
        switch (slug) {

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
                    this.$params.customConfig, slug, this.getStaticPost());
        }
        this.content = _cloneDeep(this.config.content);
    }

    protected getStaticPost(): ILayoutComponent[] {
        const slug = this.routerService.current.params.slug;
        return [{
            name: 'static.wlc-post',
            params: <IPostCParams>{
                slug: slug,
                parseAsPlainHTML: true,
                withoutCompilation: true,
                shouldClearStyles: true,
                wlcElement: 'section_static-text_' + slug,
                showTitle: true,
            },
        }];
    }

    protected getAccordionPost(): ILayoutComponent[] {
        return [{
            name: 'affiliates.wlc-faq',
            params: <IAccordionCParams>{
                class: 'wlc-faq',
                slug: this.routerService.current.params.slug,
            },
        }];
    }
}
