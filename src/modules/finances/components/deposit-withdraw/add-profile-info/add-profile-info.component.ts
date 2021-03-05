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
    EventService,
    ModalService,
    IPushMessageParams,
    NotificationEvents,
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
    protected isPending: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAddProfileInfoCParams,
        protected configService: ConfigService,
        protected userService: UserService,
        protected modalService: ModalService,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public async onSubmit(form: FormGroup): Promise<void> {
        if (this.isPending) {
            return;
        }

        this.isPending = true;
        this.modalService.showModal('dataIsProcessing');

        const result = await this.userService.updateProfile(form.value, true);

        if (result === true) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Profile updated successfully'),
                    message: gettext('Your profile has been updated successfully'),
                    wlcElement: 'notification_profile-update-success',
                },
            });

            this.modalService.closeAllModals();
        } else {

            const messages = ['Profile save failed'];
            if (result.errors) {
                _each(result.errors, (error) => {
                    messages.push(error);
                });
            }

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Profile update failed'),
                    message: messages,
                    wlcElement: 'notification_profile-update-error',
                },
            });

            this.modalService.closeModal('data-is-processing');
        }

        this.isPending = false;
        this.cdr.markForCheck();
    }
}
