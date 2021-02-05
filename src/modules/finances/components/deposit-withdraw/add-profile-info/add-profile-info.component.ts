import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {
    AbstractComponent,
    ConfigService,
    ModalService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';

import * as Params from './add-profile-info.params';

import {
    each as _each,
} from 'lodash';

@Component({
    selector: '[wlc-add-profile-info]',
    templateUrl: './add-profile-info.component.html',
    styleUrls: ['./styles/add-profile-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AddProfileInfoComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IAddProfileInfoCParams;

    public $params: Params.IAddProfileInfoCParams;
    public isPending: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAddProfileInfoCParams,
        protected configService: ConfigService,
        protected userService: UserService,
        protected modalService: ModalService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public async onSubmit(form: FormGroup): Promise<void> {
        this.isPending = true;
        const result = await this.userService.updateProfile(form.value, true);

        if (result === true) {
            this.modalService.showModal({
                id: 'profile-update',
                modifier: 'info',
                modalTitle: gettext('Profile update'),
                modalMessage: [gettext('Profile update success')],
                dismissAll: true,
            });
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
        }

        this.isPending = false;
        this.cdr.markForCheck();
    }
}
