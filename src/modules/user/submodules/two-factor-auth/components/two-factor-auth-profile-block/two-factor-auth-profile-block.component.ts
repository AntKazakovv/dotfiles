import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {
    BehaviorSubject,
    distinctUntilChanged,
    filter,
    map,
    takeUntil,
} from 'rxjs';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    ModalService,
} from 'wlc-engine/modules/core';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {
    TwoFactorAuthService,
} from 'wlc-engine/modules/user/submodules/two-factor-auth/system/services/two-factor-auth/two-factor-auth.service';

import * as Params from './two-factor-auth-profile-block.params';

@Component({
    selector: '[wlc-two-factor-auth-profile-block]',
    templateUrl: './two-factor-auth-profile-block.component.html',
    styleUrls: ['./styles/two-factor-auth-profile-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoFactorAuthProfileBlockComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams: Params.ITwoFactorAuthProfileBlockCParams;
    public override $params: Params.ITwoFactorAuthProfileBlockCParams;
    public enabled2FAGoogle: boolean;
    public lockButton: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITwoFactorAuthProfileBlockCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
        protected userService: UserService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected twoFactorAuthService: TwoFactorAuthService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        await this.setStatus2FAGoogle();
        this.eventService.subscribe({
            name: 'ENABLE_2FA_GOOGLE',
        }, () => {
            this.setLockButton(true);
        }, this.$destroy);
        this.initSubscriber();
    }

    protected openModalEnable2FA(): void {
        this.twoFactorAuthService.openModalEnable();
    }

    protected openModalDisable2FA(): void {
        this.twoFactorAuthService.openModalDisable(() => this.setLockButton(true));
    }

    protected async setStatus2FAGoogle(): Promise<void> {
        const {enabled2FAGoogle} = await this.twoFactorAuthService.getUserInfo();
        this.enabled2FAGoogle = enabled2FAGoogle;
        this.cdr.markForCheck();
    }

    protected setLockButton(value: boolean): void {
        this.lockButton = value;
        this.cdr.markForCheck();
    }

    protected initSubscriber(): void {
        this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'}).pipe(
            filter((v) => !!v),
            map((v) => v.enabled2FAGoogle),
            distinctUntilChanged(),
            takeUntil(this.$destroy),
        ).subscribe((enabled2FAGoogle: boolean) => {
            this.enabled2FAGoogle = enabled2FAGoogle;
            this.setLockButton(false);
        });
    }
}
