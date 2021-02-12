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
    public isPending: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAddProfileInfoCParams,
        protected configService: ConfigService,
        protected userService: UserService,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
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
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Profile updated successfully'),
                    message: gettext('Your profile has been updated successfully'),
                },
            });
        } else {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Profile update failed'),
                    message: result.errors,
                },
            });
        }

        this.isPending = false;
        this.cdr.markForCheck();
    }
}
