import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services';
import * as Params from './profile-form.params';

import {
    each as _each,
    cloneDeep as _cloneDeep,
} from 'lodash';

/**
 * Profile form component.
 *
 * @example
 *
 * {
 *     name: 'user.wlc-profile-form',
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
    public config = Params.profileForm;
    public userProfile = this.user.userProfile$;

    constructor(
        @Inject('injectParams') protected params: Params.IProfileFormCParams,
        protected user: UserService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public async ngSubmit(form: FormGroup): Promise<boolean> {
        const result = await this.user.updateProfile(form.value, false);

        if (result === true) {
            this.modalService.showModal({
                id: 'profile-update',
                modifier: 'info',
                modalTitle: gettext('Profile update'),
                modalMessage: [gettext('Profile update succsess')],
            });
            return true;
        } else {
            const messages = ['Profile save failed'];
            if (result.errors) {
                _each(result.errors, (error) => {
                    messages.push(error);
                });
            }
            this.modalService.showError({
                modalMessage: messages,
            });
            return false;
        }
    }
}
