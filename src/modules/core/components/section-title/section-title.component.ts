import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    ElementRef,
} from '@angular/core';

import _isUndefined from 'lodash-es/isUndefined';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

import * as Params from './section-title.params';

/**
* If your project uses a new template, you need to specify components theme "wolf"
* in `04.modules.config.ts`
*
* `export const $modules = {
*      ...
*      core: {
*          components: {
*              'wlc-section-title': {
*                  theme: 'wolf',
*              },
*          },
*      },
*      ...
* };`
*/
@Component({
    selector: 'a[wlc-section-title], div[wlc-section-title]',
    templateUrl: './section-title.component.html',
    styleUrls: ['./styles/section-title.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SectionTitleComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ISectionTitleCParams;
    @Input() public text: string;
    @Input() public iconPath: string;
    @Input() public iconFallback: string;

    public override $params: Params.ISectionTitleCParams;
    public useTitleLink: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISectionTitleCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        private element: ElementRef,
    ) {
        super(
            {injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this, ['text', 'iconPath', 'iconFallback']));
        if (_isUndefined(this.$params.noUseArrowLinkIcon)) {
            this.$params.noUseArrowLinkIcon = this.$params.theme === 'wolf';
        }
        this.useTitleLink = this.element.nativeElement.tagName === 'A' && !this.$params.noUseArrowLinkIcon;
    }
}
