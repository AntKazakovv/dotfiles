import {
    ChangeDetectionStrategy,
    Component,
    Host,
    Inject,
    Injector,
    Input,
    OnInit,
    Optional,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    PasswordValidationListController,
} from 'wlc-engine/modules/core/components/password-validation-list/controller/password-validation-list.controller';

import * as Params from './password-validation-list.params';

@Component({
    selector: '[wlc-password-validation-list]',
    templateUrl: './password-validation-list.component.html',
    styleUrls: ['./styles/password-validation-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PasswordValidationListController],
})
export class PasswordValidationListComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IPasswordValidationListComponent;
    @Input() protected control: UntypedFormControl;

    public override $params: Params.IPasswordValidationListComponent;

    constructor(
        @Optional() @Host()
        @Inject('injectParams') protected injectParams: Params.IPasswordValidationListComponent,
        protected injector: Injector,
    ) {
        super(<IMixedParams<Params.IPasswordValidationListComponent>>{
            injectParams: injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (!this.control) {
            return;
        }

        this.injector.get(PasswordValidationListController)
            .setParams(this.$params)
            .registerRules(this.control);
    }
}
