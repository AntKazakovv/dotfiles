import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import {
    GamblingBanService,
} from 'wlc-engine/modules/restrictions/gambling-ban/system/services/gambling-ban/gambling-ban.service';
import {ICheckboxCParams} from 'wlc-engine/modules/core/components/checkbox/checkbox.params';
import * as Params from './gambling-ban-modal.params';
import {
    AbstractComponent,
    ConfigService,
    EventService,
    NotificationEvents,
} from 'wlc-engine/modules/core';

@Component({
    selector: '[wlc-gambling-ban-modal]',
    templateUrl: './gambling-ban-modal.component.html',
    styleUrls: ['./styles/gambling-ban-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamblingBanModalComponent extends AbstractComponent implements OnInit {
    public checkboxConfig!: ICheckboxCParams;
    public $params!: Params.IGamblingBanModalParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGamblingBanModalParams,
        protected eventService: EventService,
        protected configService: ConfigService,
        protected gamblingBanService: GamblingBanService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public get isConfirmed(): boolean {
        return this.checkboxConfig?.control.value ?? false;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initCheckboxConfig();
    }

    public async confirm(): Promise<void> {
        if (this.isConfirmed) {
            await this.gamblingBanService.confirm();
        } else {
            this.setConfirmationError();
            this.notifyAboutFail();
        }
    }

    public signOut(): void {
        this.gamblingBanService.signOut();
    }

    protected initCheckboxConfig(): void {
        const {checkbox} = this.$params.confirmation;

        this.checkboxConfig = {
            ...checkbox,
            control: new FormControl(checkbox.common?.checkedDefault ?? false),
        };
    }

    protected setConfirmationError(): void {
        const {control} = this.checkboxConfig;

        if (!control.touched) {
            control.markAsTouched();
        }

        control.setErrors({notConfirmedGamblingBanRequirements: true});
    }

    protected notifyAboutFail(): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: this.$params.notifications.fail,
        });
    }
}
