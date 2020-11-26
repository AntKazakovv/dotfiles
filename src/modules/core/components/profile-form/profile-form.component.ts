import {
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import * as Params from './profile-form.params';

/**
 * Profile form component.
 *
 * @example
 *
 * {
 *     name: 'core.wlc-profile-form',
 * }
 *
 */
@Component({
    selector: '[wlc-profile-form]',
    templateUrl: './profile-form.component.html',
    styleUrls: ['./styles/profile-form.component.scss'],
})
export class ProfileFormComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IProfileFormCParams;
    public $params: Params.IProfileFormCParams;
    public config = Params.feedbackConfig;

    constructor(
        @Inject('injectParams') protected params: Params.IProfileFormCParams,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public ngSubmit(): void {
        // TODO: Add save profile when the service is ready
    }
}
