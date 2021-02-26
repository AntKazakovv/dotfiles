import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {DateTime} from 'luxon';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService, SelectValuesService} from 'wlc-engine/modules/core';

import * as Params from './birthday-field.params';

@Component({
    selector: '[wlc-birth-field]',
    templateUrl: './birthday-field.component.html',
    styleUrls: ['./styles/birthday-field.component.scss'],
})
export class BirthdayFieldComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IBirthFieldCParams;
    public $params: Params.IBirthFieldCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBirthFieldCParams,
        protected configService: ConfigService,
        protected selectValues: SelectValuesService,
        protected cdr: ChangeDetectorRef,
    )
    {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.$params.birthMonth.control.valueChanges.subscribe((value) => {
            if (value) {
                this.selectValues.daysInMonth.next(DateTime.local(DateTime.local().year, +value).daysInMonth);
                this.cdr.detectChanges();
            }
        });
    }
}
