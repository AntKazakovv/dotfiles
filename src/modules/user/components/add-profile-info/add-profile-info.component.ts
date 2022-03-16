import {BehaviorSubject} from 'rxjs';
import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {StateService} from '@uirouter/core';

import _each from 'lodash-es/each';

import {
    ConfigService,
    EventService,
    ModalService,
    IPushMessageParams,
    NotificationEvents,
    IIndexing,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';

import {ProfileFormAbstract} from 'wlc-engine/modules/user/system/classes/profile-form.abstract';

import * as Params from './add-profile-info.params';

@Component({
    selector: '[wlc-add-profile-info]',
    templateUrl: './add-profile-info.component.html',
    styleUrls: ['./styles/add-profile-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AddProfileInfoComponent extends ProfileFormAbstract implements OnInit {
    @Input() protected inlineParams: Params.IAddProfileInfoCParams;

    public $params: Params.IAddProfileInfoCParams;
    public errors$: BehaviorSubject<IIndexing<string>> = new BehaviorSubject(null);
    protected isPending: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAddProfileInfoCParams,
        protected configService: ConfigService,
        protected userService: UserService,
        protected modalService: ModalService,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected stateService: StateService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams},
            eventService,
            configService,
        );
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public async onSubmit(form: FormGroup): Promise<void> {
        if (this.isPending) {
            return;
        }

        this.isPending = true;
        this.modalService.showModal('data-is-processing');

        const result = await this.userService.updateProfile(form.value, true);

        if (result === true) {
            this.modalService.closeAllModals();

            if (this.$params.redirect?.success) {
                this.stateService.go(this.$params.redirect.success.to, this.$params.redirect.success.params);
            }

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Profile updated successfully'),
                    message: gettext('Your profile has been updated successfully'),
                    wlcElement: 'notification_profile-update-success',
                },
            });
        } else {

            const messages = ['Profile save failed'];
            if (result.errors) {
                _each(result.errors, (error) => {
                    messages.push(error);
                });
                this.errors$.next(result.errors as IIndexing<string>);
            }

            this.modalService.hideModal('data-is-processing');

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Profile update failed'),
                    message: messages,
                    wlcElement: 'notification_profile-update-error',
                },
            });
        }

        this.isPending = false;
        this.cdr.markForCheck();
    }
}
