import {
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import * as Params from 'wlc-engine/modules/core/components/textarea/textarea.params';
import {ConfigService} from 'wlc-engine/modules/core';

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

    constructor(
            @Inject('injectParams') protected injectParams: Params.ITextareaCParams,
            protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.control = this.$params?.control;
    }
}
