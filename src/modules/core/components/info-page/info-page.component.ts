import {
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';
import {UIRouterGlobals} from '@uirouter/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
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
})
export class InfoPageComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IInfoPageCParams;
    public $params: Params.IInfoPageCParams;
    public config: Params.IInfoPageConfig;

    constructor(
        @Inject('injectParams') protected params: Params.IInfoPageCParams,
        private uiRouter: UIRouterGlobals,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.config = this.$params.config;

        switch (this.uiRouter.params.slug) {

            case 'feedback':
                this.config.content.components = [{
                    name: 'core.wlc-feedback-form',
                }];
                break;

            default:
                this.config.content.components = [{
                    name: 'static.wlc-post',
                    params: {
                        slug: this.uiRouter.params.slug,
                    },
                }];
        }
    }
}
