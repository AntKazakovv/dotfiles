import {
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AbstractComponent, ConfigService} from 'wlc-engine/modules/core';

import * as Params from './textarea.params';

import _kebabCase from 'lodash-es/kebabCase';

/**
 * Component textarea
 *
 * @example
 *
 * {
 *     name: 'core.wlc-textarea',
 * }
 *
 */
@Component({
    selector: '[wlc-textarea]',
    templateUrl: './textarea.component.html',
    styleUrls: ['./styles/textarea.component.scss'],
})
export class TextareaComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ITextareaCParams;
    public $params: Params.ITextareaCParams;
    public control: FormControl;
    public fieldWlcElement: string;

    constructor(
            @Inject('injectParams') protected injectParams: Params.ITextareaCParams,
            protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.control = this.$params?.control;
        this.fieldWlcElement = 'textarea_' + _kebabCase(this.$params.name);
    }

    public isFieldRequired(): boolean {
        return this.$params.validators?.includes('required');
    }
}
