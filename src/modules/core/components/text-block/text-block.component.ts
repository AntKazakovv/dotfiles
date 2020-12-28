import {
    Component,
    Input,
    Inject,
    OnInit,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './text-block.params';

import {
    forEach as _forEach,
    get as _get,
    keys as _keys,
    isUndefined as _isUndefined,
} from 'lodash';

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
    @Input() public textBlockTitle: string;
    @Input() public textBlockSubtitle: string;
    @Input() public textBlockText: string;

    public $params: Params.ITextBlockCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ITextBlockCParams,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.prepareParams());
    }


    protected prepareParams(): Params.ITextBlockCParams {
        const inputProperties: string[] = ['textBlockTitle', 'textBlockSubtitle', 'textBlockText'];
        const inlineParams: Params.ITextBlockCParams = {
            common: {},
        };

        _forEach(inputProperties, key => {
            if (!_isUndefined(_get(this, key))) {
                inlineParams.common[key] = _get(this, key);
            }
        });

        return _keys(inlineParams.common).length ? inlineParams : null;
    }

}
