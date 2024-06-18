import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ElementRef,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

import _isUndefined from 'lodash-es/isUndefined';
import _set from 'lodash-es/set';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

import * as Params from './section-title.params';

type SectionTitleParams = (keyof Params.ISectionTitleCParams)[];

@Component({
    selector: 'div[wlc-section-title], a[wlc-section-title]',
    templateUrl: './section-title.component.html',
    styleUrls: ['./styles/section-title.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitleComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() protected inlineParams: Params.ISectionTitleCParams;
    @Input() public text: string;
    @Input() public iconPath: string;
    @Input() public iconFallback: string;

    public override $params: Params.ISectionTitleCParams;
    public useTitleLink: boolean;
    public readonly sectionTitleParams: SectionTitleParams = ['text', 'iconPath', 'iconFallback'];

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISectionTitleCParams,
        private element: ElementRef,
    ) {
        super(
            {injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareCParams(this, this.sectionTitleParams));
        if (_isUndefined(this.$params.noUseArrowLinkIcon)) {
            this.$params.noUseArrowLinkIcon = this.$params.theme === 'wolf';
        }
        this.useTitleLink = this.element.nativeElement.tagName === 'A' && !this.$params.noUseArrowLinkIcon;
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        const params = this.sectionTitleParams;

        for (const param of params) {
            if (changes[param]?.currentValue && !changes[param]?.firstChange) {
                _set(this.$params, param, changes[param].currentValue);
            }
        }
    }
}
