import {Component, Inject, Input, OnInit} from '@angular/core';
import * as Params from './checkbox.params';
import {FormControl} from '@angular/forms';
import {ConfigService} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/classes';

@Component({
    selector: '[wlc-checkbox]',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./styles/checkbox.component.scss'],
})
export class CheckboxComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ICheckboxCParams;
    public $params: Params.ICheckboxCParams;
    public control: FormControl;

    constructor(
        @Inject('injectParams') protected injectParams: any,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.control = this.$params?.control;
    }
}
