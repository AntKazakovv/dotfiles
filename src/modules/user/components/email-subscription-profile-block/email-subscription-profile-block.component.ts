import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';
import {
    BehaviorSubject,
    distinctUntilChanged,
    takeUntil,
    filter,
} from 'rxjs';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    LogService,
} from 'wlc-engine/modules/core';

import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';

import * as Params from './email-subscription-profile-block.params';

@Component({
    selector: '[wlc-email-subscription-profile-block]',
    templateUrl: './email-subscription-profile-block.component.html',
    styleUrls: ['./styles/email-subscription-profile-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EmailSubscriptionProfileBlockComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IEmailSubscriptionProfileBlockCParams;

    public override $params: Params.IEmailSubscriptionProfileBlockCParams;
    public subscribed$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public lockButton$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IEmailSubscriptionProfileBlockCParams,
        configService: ConfigService,
        protected userService: UserService,
        protected eventService: EventService,
        protected logService: LogService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'}).pipe(
            filter((profile) => !!profile),
            distinctUntilChanged((prev, curr) => prev.emailAgree === curr.emailAgree),
            takeUntil(this.$destroy),
        ).subscribe((profile) => {
            this.subscribed$.next(profile.emailAgree);
        });
    }

    public async subscriptionUpdate(status: boolean): Promise<void> {
        try {
            this.lockButton$.next(true);
            await this.userService.updateProfile({
                emailAgree: status,
            }, {updatePartial: true});
            this.subscribed$.next(status);
            this.lockButton$.next(false);
        } catch (error) {
            this.logService.sendLog({code: '24.0.0', data: error});
        }
    }
}
