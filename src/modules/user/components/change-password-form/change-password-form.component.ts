import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';
import _each from 'lodash-es/each';
import _isArray from 'lodash-es/isArray';
import _isEmpty from 'lodash-es/isEmpty';
import _isObject from 'lodash-es/isObject';
import _isString from 'lodash-es/isString';
import _toString from 'lodash-es/toString';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {IPushMessageParams} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {NotificationEvents} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {UserHelper} from 'wlc-engine/modules/user/system/helpers/user.helper';

import * as Params from './change-password-form.params';

/**
 * Change-password form component.
 *
 * @example
 *
 * {
 *     name: 'user.wlc-change-password-form',
 * }
 *
 */
@Component({
    selector: '[wlc-change-password-form]',
    templateUrl: './change-password-form.component.html',
    styleUrls: ['./styles/change-password-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordFormComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams: Params.IChangePasswordFormCParams;
    public override $params: Params.IChangePasswordFormCParams;
    public errors$: BehaviorSubject<Record<string, string>> = new BehaviorSubject(null);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IChangePasswordFormCParams,
        protected userService: UserService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected elRef: ElementRef,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
        const {currentPassword, newPasswordRepeat} = form.value;

        try {
            form.disable();
            await this.userService.setNewPassword(currentPassword, newPasswordRepeat);

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Password changed successfully'),
                    message: gettext('Your password has been successfully changed'),
                    wlcElement: 'notification_password-update-success',
                },
            });

            if (this.modalService.getActiveModal('change-password')) {
                this.modalService.hideModal('change-password');
            }
            UserHelper.showInformationModal(
                this.modalService,
                gettext('Your password has been successfully changed'),
            );
            return true;
        } catch (error) {

            const messages: string[] = [];

            if (error.code === 400) {
                messages.push(error.errors[0]);
            } else if (!_isEmpty(error.errors) && (_isArray(error.errors) || _isObject(error.errors))) {
                _each(error.errors, (error: unknown): void => {
                    messages.push(_toString((error)));
                });
            } else if (_isString(error.errors)) {
                messages.push(error.errors);
            } else {
                messages.push('Password is invalid');
            }

            this.errors$.next({currentPassword: _toString(messages)});

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Failed to change password'),
                    message: messages,
                    wlcElement: 'notification_password-update-error',
                },
            });
            return false;
        } finally {
            form.enable();
        }
    }
}
