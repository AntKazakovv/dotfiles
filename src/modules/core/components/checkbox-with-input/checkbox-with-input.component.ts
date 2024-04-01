import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';
import {
    UntypedFormControl,
} from '@angular/forms';

import {takeUntil} from 'rxjs';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

import * as Params from './checkbox-with-input.params';

@Component({
    selector: '[wlc-checkbox-with-input]',
    templateUrl: './checkbox-with-input.component.html',
    styleUrls: ['./styles/checkbox-with-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CheckboxWithInputComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ICheckboxWithInputCParams;

    public override $params!: Params.ICheckboxWithInputCParams;
    public checkboxControl!: UntypedFormControl;
    public inputControl!: UntypedFormControl;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICheckboxWithInputCParams,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.checkboxControl = this.$params.checkboxParams.control = this.$params[this.$params.name[0]].control;
        this.inputControl = this.$params.inputParams.control = this.$params[this.$params.name[1]].control;
        this.checkboxControl.getRawValue() ? this.inputControl.enable() : this.inputControl.disable();

        this.checkboxControl.valueChanges.pipe(
            takeUntil(this.$destroy),
        ).subscribe((value) => {
            if (value) {
                this.inputControl.enable();
            } else {
                this.inputControl.disable();
            }
        });
    }

}
