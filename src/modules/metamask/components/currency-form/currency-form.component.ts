import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {
    AbstractComponent,
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';

import * as Params from './currency-form.params';

@Component({
    selector: '[wlc-currency-form]',
    templateUrl: './currency-form.component.html',
    styleUrls: ['./styles/currency-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CurrencyFormComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ICurrencyFormCParams;
    public $params: Params.ICurrencyFormCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICurrencyFormCParams,
        protected configService: ConfigService,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    /**
     * Handle form-wrapper submit event
     * @param {FormGroup} form `FormGroup`
     */
    public formSubmit(form: FormGroup): void {
        this.eventService.emit({
            name: this.$params.submitEventName,
            data: form.getRawValue(),
        });
    }

}
