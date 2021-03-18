import {
    Component,
    Input,
    Inject,
    OnInit,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService, GlobalHelper} from 'wlc-engine/modules/core';

import * as Params from './text-block.params';

import {
    each as _each,
    get as _get,
    keys as _keys,
    isUndefined as _isUndefined,
} from 'lodash-es';


/**
 * text-block component. Use for header of component.
 *
 * @example
 *
 * {
 *     name: 'core.wlc-text-block',
 * }
 *
 */

@Component({
    selector: '[wlc-text-block]',
    templateUrl: './text-block.component.html',
    styleUrls: ['./styles/text-block.component.scss'],
})
export class TextBlockComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.ITextBlockCParams;
    @Input() public textBlockTitle: string | string[];
    @Input() public textBlockSubtitle: string | string[];
    @Input() public textBlockText: string | string[];

    public $params: Params.ITextBlockCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ITextBlockCParams,
        protected configService: ConfigService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this,
            ['textBlockTitle', 'textBlockSubtitle', 'textBlockText', 'dynamicText']));
    }

    public checkType(text: string | string[]): boolean {
        return typeof text === 'string';
    };

    public getDynamicText(): string {
        const text = this.configService.get<string>(this.$params.common.dynamicText.param);

        return text || this.$params.common.dynamicText.textDefault;
    }
}
