import {
    Component,
    Inject,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import * as Params from './datepicker.params';
import {ConfigService} from 'wlc-engine/modules/core';
import {FormControl} from '@angular/forms';

/**
 * Component datepicker
 *
 * @example
 *
 * {
 *     name: 'core.wlc-datepicker',
 * }
 *
 */
@Component({
    selector: '[wlc-datepicker]',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./styles/datepicker.component.scss'],
})
export class DatepickerComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IDatepickerCParams;
    @ViewChild('mask') mask: ElementRef;
    public $params: Params.IDatepickerCParams;
    public control: FormControl;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDatepickerCParams,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.control = this.$params?.control;
    }

    public onDateChanged() {
        this.mask?.nativeElement?.mask.updateValue();
    }
}
